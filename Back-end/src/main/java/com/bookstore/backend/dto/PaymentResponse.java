package com.bookstore.backend.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private String paymentId;
    private String clientSecret;
    private String status;
    private String message;
    private String stripePaymentIntentId;

    public PaymentResponse(String paymentId, String clientSecret, String status) {
        this.paymentId = paymentId;
        this.clientSecret = clientSecret;
        this.status = status;
    }

    public static PaymentResponse success(String paymentId, String clientSecret) {
        return new PaymentResponse(paymentId, clientSecret, "SUCCESS");
    }

    public static PaymentResponse failure(String message) {
        PaymentResponse response = new PaymentResponse(null, null, "FAILED");
        response.setMessage(message);
        return response;
    }
}
