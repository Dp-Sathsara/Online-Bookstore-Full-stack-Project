package com.bookstore.backend.dto;

import lombok.Data;

@Data
public class MonthlyRevenueDTO {
    private String month;
    private int year;
    private double revenue;
    private int orderCount;
    private int itemsSold;
}



