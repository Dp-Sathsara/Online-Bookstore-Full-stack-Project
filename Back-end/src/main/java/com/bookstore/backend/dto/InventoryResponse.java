package com.bookstore.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class InventoryResponse {
    private List<BookInventoryItem> books;
    private InventorySummary summary;

    @Data
    public static class BookInventoryItem {
        private String bookId;
        private String title;
        private String author;
        private int stockQuantity;
        private String stockStatus;
        private double price;
    }

    @Data
    public static class InventorySummary {
        private long totalBooks;
        private long inStockCount;
        private long outOfStockCount;
        private long lowStockCount;
    }
}
