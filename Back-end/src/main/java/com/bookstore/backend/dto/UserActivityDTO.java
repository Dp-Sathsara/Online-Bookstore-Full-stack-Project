package com.bookstore.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserActivityDTO {
    private String userId;
    private String userName;
    private String email;
    private LocalDateTime registrationDate;
    private int totalOrders;
    private double totalSpent;
    private LocalDateTime lastOrderDate;
}



