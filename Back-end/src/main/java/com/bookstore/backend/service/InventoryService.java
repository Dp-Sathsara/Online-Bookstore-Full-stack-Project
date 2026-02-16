package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private BookRepository bookRepository;

    private static final int LOW_STOCK_THRESHOLD = 5;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book updateStock(String bookId, int newQuantity) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setStockQuantity(newQuantity);
        book.setStockStatus(determineStockStatus(newQuantity));

        return bookRepository.save(book);
    }

    public Book updateStockStatus(String bookId, String status) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setStockStatus(status);

        // Auto-set quantity to 0 if out of stock
        if ("OUT_OF_STOCK".equals(status)) {
            book.setStockQuantity(0);
        }

        return bookRepository.save(book);
    }

    public List<Book> getLowStockBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> book.getStockQuantity() > 0 && book.getStockQuantity() <= LOW_STOCK_THRESHOLD)
                .collect(Collectors.toList());
    }

    public List<Book> getOutOfStockBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> book.getStockQuantity() <= 0 || "OUT_OF_STOCK".equals(book.getStockStatus()))
                .collect(Collectors.toList());
    }

    public List<Book> getInStockBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> book.getStockQuantity() > 0 && !"OUT_OF_STOCK".equals(book.getStockStatus()))
                .collect(Collectors.toList());
    }

    public InventorySummary getInventorySummary() {
        List<Book> allBooks = bookRepository.findAll();

        long totalBooks = allBooks.size();
        long inStockCount = allBooks.stream()
                .filter(book -> book.getStockQuantity() > 0 && !"OUT_OF_STOCK".equals(book.getStockStatus()))
                .count();
        long outOfStockCount = allBooks.stream()
                .filter(book -> book.getStockQuantity() <= 0 || "OUT_OF_STOCK".equals(book.getStockStatus()))
                .count();
        long lowStockCount = allBooks.stream()
                .filter(book -> book.getStockQuantity() > 0 && book.getStockQuantity() <= LOW_STOCK_THRESHOLD)
                .count();

        return new InventorySummary(totalBooks, inStockCount, outOfStockCount, lowStockCount);
    }

    public Book updateThreshold(String bookId, int minThreshold, int maxThreshold) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Store the threshold values in the book entity
        book.setMinThreshold(minThreshold);
        book.setMaxThreshold(maxThreshold);

        return bookRepository.save(book);
    }

    public Book createInventoryItem(Map<String, Object> inventoryRequest) {
        Book newBook = new Book();
        newBook.setBook_id((String) inventoryRequest.get("bookId"));
        newBook.setTitle((String) inventoryRequest.get("title"));
        newBook.setAuthor((String) inventoryRequest.get("author"));
        newBook.setStockQuantity((Integer) inventoryRequest.getOrDefault("currentStock", 0));
        newBook.setPrice(((Number) inventoryRequest.getOrDefault("price", 0.0)).doubleValue());
        
        // Set stock status based on quantity
        newBook.setStockStatus(determineStockStatus(newBook.getStockQuantity()));

        return bookRepository.save(newBook);
    }

    public void deleteInventoryItem(String bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new RuntimeException("Inventory item not found");
        }
        bookRepository.deleteById(bookId);
    }

    private String determineStockStatus(int quantity) {
        if (quantity <= 0) {
            return "OUT_OF_STOCK";
        } else if (quantity <= LOW_STOCK_THRESHOLD) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }

    public static class InventorySummary {
        private long totalBooks;
        private long inStockCount;
        private long outOfStockCount;
        private long lowStockCount;

        public InventorySummary(long totalBooks, long inStockCount, long outOfStockCount, long lowStockCount) {
            this.totalBooks = totalBooks;
            this.inStockCount = inStockCount;
            this.outOfStockCount = outOfStockCount;
            this.lowStockCount = lowStockCount;
        }

        // Getters
        public long getTotalBooks() {
            return totalBooks;
        }

        public long getInStockCount() {
            return inStockCount;
        }

        public long getOutOfStockCount() {
            return outOfStockCount;
        }

        public long getLowStockCount() {
            return lowStockCount;
        }
    }
}
