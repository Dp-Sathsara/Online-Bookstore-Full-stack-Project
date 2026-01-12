package com.bookstore.backend.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private int stockQuantity;
    private String stockStatus; // Optional: "IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"
}
