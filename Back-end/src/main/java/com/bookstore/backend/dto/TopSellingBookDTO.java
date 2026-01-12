package com.bookstore.backend.dto;

import lombok.Data;

@Data
public class TopSellingBookDTO {
    private String bookId;
    private String title;
    private String author;
    private int totalQuantitySold;
    private double totalRevenue;
    private double price;
}



