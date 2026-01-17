package com.bookstore.backend.controller;

import com.bookstore.backend.dto.PaymentRequest;
import com.bookstore.backend.dto.PaymentResponse;
import com.bookstore.backend.model.Payment;
import com.bookstore.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponse> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        PaymentResponse response = paymentService.createPaymentIntent(paymentRequest);

        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<Map<String, String>> confirmPayment(@RequestBody Map<String, String> request) {
        String stripePaymentIntentId = request.get("stripePaymentIntentId");

        boolean confirmed = paymentService.confirmPayment(stripePaymentIntentId);

        if (confirmed) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment confirmed successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Failed to confirm payment"));
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable String orderId) {
        Optional<Payment> payment = paymentService.getPaymentByOrderId(orderId);

        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<Map<String, String>> refundPayment(@PathVariable String paymentId) {
        boolean refunded = paymentService.refundPayment(paymentId);

        if (refunded) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment refunded successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Failed to refund payment"));
        }
    }
}
