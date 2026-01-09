package com.bookstore.backend.controller;

import com.bookstore.backend.model.Order;
import com.bookstore.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. PLACE ORDER
    // POST: http://localhost:8081/api/orders
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        try {
            Order newOrder = orderService.placeOrder(order);
            return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 2.
    // GET: http://localhost:8081/api/orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    // 3. READ ORDER HISTORY BY USER
    // GET: http://localhost:8081/api/orders/history/{user_id}
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable String userId) {
        List<Order> orders = orderService.findByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orders);
    }

    // 4. UPDATE ORDER STATUS (Admin only)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String id,
            @RequestBody com.bookstore.backend.dto.OrderStatusUpdateRequest request) throws IllegalArgumentException {
        try {
            Order updatedOrder = orderService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 5. GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}