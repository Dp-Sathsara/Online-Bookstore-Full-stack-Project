package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {

    @Id
    private String payment_id;
    private String orderId;
    private String userId;
    private double amount;
    private String currency;
    private String status; // "PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"
    private String paymentMethod; // "STRIPE", "PAYPAL", etc.
    private String stripePaymentIntentId;
    private String stripeClientSecret;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String failureReason;

    public Payment() {
        this.createdAt = LocalDateTime.now();
        this.currency = "USD";
        this.status = "PENDING";
        this.paymentMethod = "STRIPE";
    }
}
