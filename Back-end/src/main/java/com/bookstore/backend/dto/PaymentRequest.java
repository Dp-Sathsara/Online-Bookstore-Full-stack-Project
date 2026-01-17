package com.bookstore.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaymentRequest {
    private String orderId;
    private String userId;
    private double amount;
    private String currency;
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        private String book_id;
        private String title;
        private double price;
        private int quantity;
    }
}
