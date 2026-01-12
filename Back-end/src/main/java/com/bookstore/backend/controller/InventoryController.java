package com.bookstore.backend.controller;

import com.bookstore.backend.dto.InventoryResponse;
import com.bookstore.backend.dto.StockUpdateRequest;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.service.InventoryService;
import com.bookstore.backend.service.LowStockAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private LowStockAlertService lowStockAlertService;

    // Get all inventory with summary
    @GetMapping
    public ResponseEntity<InventoryResponse> getAllInventory() {
        List<Book> books = inventoryService.getAllBooks();
        InventoryService.InventorySummary summary = inventoryService.getInventorySummary();

        InventoryResponse response = new InventoryResponse();
        response.setBooks(books.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));

        InventoryResponse.InventorySummary summaryDto = new InventoryResponse.InventorySummary();
        summaryDto.setTotalBooks(summary.getTotalBooks());
        summaryDto.setInStockCount(summary.getInStockCount());
        summaryDto.setOutOfStockCount(summary.getOutOfStockCount());
        summaryDto.setLowStockCount(summary.getLowStockCount());

        response.setSummary(summaryDto);

        return ResponseEntity.ok(response);
    }

    // Get low stock books
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse.BookInventoryItem>> getLowStockBooks() {
        List<Book> lowStockBooks = inventoryService.getLowStockBooks();
        return ResponseEntity.ok(lowStockBooks.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));
    }

    // Get out of stock books
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryResponse.BookInventoryItem>> getOutOfStockBooks() {
        List<Book> outOfStockBooks = inventoryService.getOutOfStockBooks();
        return ResponseEntity.ok(outOfStockBooks.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));
    }

    // Get in stock books
    @GetMapping("/in-stock")
    public ResponseEntity<List<InventoryResponse.BookInventoryItem>> getInStockBooks() {
        List<Book> inStockBooks = inventoryService.getInStockBooks();
        return ResponseEntity.ok(inStockBooks.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));
    }

    // Update stock quantity
    @PutMapping("/stock/{bookId}")
    public ResponseEntity<InventoryResponse.BookInventoryItem> updateStock(
            @PathVariable String bookId,
            @RequestBody StockUpdateRequest request) {

        Book updatedBook = inventoryService.updateStock(bookId, request.getStockQuantity());
        return ResponseEntity.ok(convertToInventoryItem(updatedBook));
    }

    // Update stock status
    @PutMapping("/status/{bookId}")
    public ResponseEntity<InventoryResponse.BookInventoryItem> updateStockStatus(
            @PathVariable String bookId,
            @RequestBody StockUpdateRequest request) {

        Book updatedBook = inventoryService.updateStockStatus(bookId, request.getStockStatus());
        return ResponseEntity.ok(convertToInventoryItem(updatedBook));
    }

    // Get inventory summary
    @GetMapping("/summary")
    public ResponseEntity<InventoryResponse.InventorySummary> getInventorySummary() {
        InventoryService.InventorySummary summary = inventoryService.getInventorySummary();

        InventoryResponse.InventorySummary summaryDto = new InventoryResponse.InventorySummary();
        summaryDto.setTotalBooks(summary.getTotalBooks());
        summaryDto.setInStockCount(summary.getInStockCount());
        summaryDto.setOutOfStockCount(summary.getOutOfStockCount());
        summaryDto.setLowStockCount(summary.getLowStockCount());

        return ResponseEntity.ok(summaryDto);
    }

    // Get low stock alerts
    @GetMapping("/alerts")
    public ResponseEntity<List<InventoryResponse.BookInventoryItem>> getLowStockAlerts() {
        List<Book> lowStockBooks = lowStockAlertService.getLowStockBooks();
        return ResponseEntity.ok(lowStockBooks.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));
    }

    // Get critical low stock alerts (2 or less items)
    @GetMapping("/alerts/critical")
    public ResponseEntity<List<InventoryResponse.BookInventoryItem>> getCriticalLowStockAlerts() {
        List<Book> criticalLowStockBooks = lowStockAlertService.getCriticalLowStockBooks();
        return ResponseEntity.ok(criticalLowStockBooks.stream()
                .map(this::convertToInventoryItem)
                .collect(Collectors.toList()));
    }

    // Get low stock report
    @GetMapping("/alerts/report")
    public ResponseEntity<LowStockAlertService.LowStockReport> getLowStockReport() {
        LowStockAlertService.LowStockReport report = lowStockAlertService.generateLowStockReport();
        return ResponseEntity.ok(report);
    }

    // Acknowledge low stock alert
    @PostMapping("/alerts/{bookId}/acknowledge")
    public ResponseEntity<Void> acknowledgeAlert(@PathVariable String bookId) {
        lowStockAlertService.acknowledgeAlert(bookId);
        return ResponseEntity.ok().build();
    }

    // Reset low stock alert
    @PostMapping("/alerts/{bookId}/reset")
    public ResponseEntity<Void> resetAlert(@PathVariable String bookId) {
        lowStockAlertService.resetAlert(bookId);
        return ResponseEntity.ok().build();
    }

    private InventoryResponse.BookInventoryItem convertToInventoryItem(Book book) {
        InventoryResponse.BookInventoryItem item = new InventoryResponse.BookInventoryItem();
        item.setBookId(book.getBook_id());
        item.setTitle(book.getTitle());
        item.setAuthor(book.getAuthor());
        item.setStockQuantity(book.getStockQuantity());
        item.setStockStatus(book.getStockStatus());
        item.setPrice(book.getPrice());
        return item;
    }
}
