package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {

    @Id
    private String order_id;
    private String userId;
    private List<OrderItem> items; // inner class eken enne me object eka
    private double totalAmount;
    private String status; // e.g., "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
    private LocalDateTime orderDate;
    private String paymentId; // Reference to payment
    private String shippingAddress;
    private String phoneNumber;

    public Order() {
        this.orderDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Inner class to represent items purchased in an order
    @Data
    public static class OrderItem {
        private String book_id;
        private String title;
        private double price;
        private int quantity;
    }
}