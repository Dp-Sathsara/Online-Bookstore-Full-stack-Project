package com.bookstore.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SalesReportDTO {
    private double totalRevenue;
    private int totalOrders;
    private int totalItemsSold;
    private double averageOrderValue;
    private Map<String, Integer> ordersByStatus;
    private Map<String, Double> revenueByStatus;
}



