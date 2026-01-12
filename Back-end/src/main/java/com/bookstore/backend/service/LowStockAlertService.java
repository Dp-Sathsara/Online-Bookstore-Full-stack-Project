package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class LowStockAlertService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private InventoryService inventoryService;

    private static final int LOW_STOCK_THRESHOLD = 5;
    private final ConcurrentMap<String, Boolean> alertCache = new ConcurrentHashMap<>();

    // Check for low stock every hour
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void checkLowStockAlerts() {
        List<Book> lowStockBooks = inventoryService.getLowStockBooks();

        for (Book book : lowStockBooks) {
            String bookId = book.getBook_id();
            boolean wasAlerted = alertCache.getOrDefault(bookId, false);

            if (!wasAlerted) {
                sendLowStockAlert(book);
                alertCache.put(bookId, true);
            }
        }

        // Clear alerts for books that are no longer low stock
        clearResolvedAlerts(lowStockBooks);
    }

    public List<Book> getLowStockBooks() {
        return inventoryService.getLowStockBooks();
    }

    public List<Book> getCriticalLowStockBooks() {
        return inventoryService.getAllBooks().stream()
                .filter(book -> book.getStockQuantity() > 0 && book.getStockQuantity() <= 2)
                .collect(java.util.stream.Collectors.toList());
    }

    public boolean isBookLowStock(String bookId) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null)
            return false;

        return book.getStockQuantity() > 0 && book.getStockQuantity() <= LOW_STOCK_THRESHOLD;
    }

    public void acknowledgeAlert(String bookId) {
        alertCache.put(bookId, true);
    }

    public void resetAlert(String bookId) {
        alertCache.remove(bookId);
    }

    private void sendLowStockAlert(Book book) {
        // This could be extended to send emails, notifications, etc.
        // For now, we'll just log the alert
        System.out.println("LOW STOCK ALERT: Book '" + book.getTitle() +
                "' by " + book.getAuthor() +
                " has only " + book.getStockQuantity() + " units remaining.");
    }

    private void clearResolvedAlerts(List<Book> currentLowStockBooks) {
        List<String> currentLowStockIds = currentLowStockBooks.stream()
                .map(Book::getBook_id)
                .collect(java.util.stream.Collectors.toList());

        alertCache.entrySet().removeIf(entry -> !currentLowStockIds.contains(entry.getKey()));
    }

    public LowStockReport generateLowStockReport() {
        List<Book> lowStockBooks = getLowStockBooks();
        List<Book> criticalLowStockBooks = getCriticalLowStockBooks();

        return new LowStockReport(lowStockBooks, criticalLowStockBooks, alertCache.size());
    }

    public static class LowStockReport {
        private List<Book> lowStockBooks;
        private List<Book> criticalLowStockBooks;
        private int activeAlerts;

        public LowStockReport(List<Book> lowStockBooks, List<Book> criticalLowStockBooks, int activeAlerts) {
            this.lowStockBooks = lowStockBooks;
            this.criticalLowStockBooks = criticalLowStockBooks;
            this.activeAlerts = activeAlerts;
        }

        // Getters
        public List<Book> getLowStockBooks() {
            return lowStockBooks;
        }

        public List<Book> getCriticalLowStockBooks() {
            return criticalLowStockBooks;
        }

        public int getActiveAlerts() {
            return activeAlerts;
        }
    }
}
