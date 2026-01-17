package com.bookstore.backend.service;

import com.bookstore.backend.dto.PaymentRequest;
import com.bookstore.backend.dto.PaymentResponse;
import com.bookstore.backend.model.Payment;
import com.bookstore.backend.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentResponse createPaymentIntent(PaymentRequest paymentRequest) {
        try {
            // Create PaymentIntent with Stripe
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (paymentRequest.getAmount() * 100)) // Convert to cents
                    .setCurrency(paymentRequest.getCurrency().toLowerCase())
                    .addPaymentMethodType("card")
                    .putMetadata("orderId", paymentRequest.getOrderId())
                    .putMetadata("userId", paymentRequest.getUserId())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record to database
            Payment payment = new Payment();
            payment.setOrderId(paymentRequest.getOrderId());
            payment.setUserId(paymentRequest.getUserId());
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setStripePaymentIntentId(paymentIntent.getId());
            payment.setStripeClientSecret(paymentIntent.getClientSecret());
            payment.setStatus("PROCESSING");

            payment = paymentRepository.save(payment);

            return PaymentResponse.success(payment.getPayment_id(), paymentIntent.getClientSecret());

        } catch (StripeException e) {
            return PaymentResponse.failure("Failed to create payment intent: " + e.getMessage());
        }
    }

    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Optional<Payment> getPaymentByStripePaymentIntentId(String stripePaymentIntentId) {
        return paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId);
    }

    public boolean confirmPayment(String stripePaymentIntentId) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                PaymentIntent paymentIntent = PaymentIntent.retrieve(stripePaymentIntentId);

                if ("succeeded".equals(paymentIntent.getStatus())) {
                    payment.setStatus("COMPLETED");
                    payment.setCompletedAt(LocalDateTime.now());
                    paymentRepository.save(payment);
                    return true;
                } else {
                    payment.setStatus("FAILED");
                    payment.setFailureReason("Payment not succeeded: " + paymentIntent.getStatus());
                    paymentRepository.save(payment);
                    return false;
                }
            }
            return false;
        } catch (StripeException e) {
            return false;
        }
    }

    public boolean refundPayment(String paymentId) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();

                if ("COMPLETED".equals(payment.getStatus())) {
                    // Create refund with Stripe
                    PaymentIntent paymentIntent = PaymentIntent.retrieve(payment.getStripePaymentIntentId());

                    // For simplicity, we'll mark as refunded in our system
                    // In production, you would create an actual refund with Stripe API
                    payment.setStatus("REFUNDED");
                    paymentRepository.save(payment);
                    return true;
                }
            }
            return false;
        } catch (StripeException e) {
            return false;
        }
    }
}
