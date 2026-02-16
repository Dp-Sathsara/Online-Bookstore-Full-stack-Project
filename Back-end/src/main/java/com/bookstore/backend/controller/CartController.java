package com.bookstore.backend.controller;

import com.bookstore.backend.model.Cart;
import com.bookstore.backend.service.CartService;
import com.bookstore.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization token required");
        }
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        return userId;
    }

    // Get user's cart
    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving cart: " + e.getMessage()));
        }
    }

    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> request) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            String bookId = (String) request.get("bookId");
            Integer quantity = (Integer) request.getOrDefault("quantity", 1);

            if (bookId == null || bookId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Book ID is required"));
            }

            if (quantity <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Quantity must be greater than 0"));
            }

            Cart cart = cartService.addToCart(userId, bookId, quantity);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error adding to cart: " + e.getMessage()));
        }
    }

    // Update cart item quantity
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> request) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            String bookId = (String) request.get("bookId");
            Integer quantity = (Integer) request.get("quantity");

            if (bookId == null || bookId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Book ID is required"));
            }

            if (quantity == null || quantity < 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Quantity must be 0 or greater"));
            }

            Cart cart = cartService.updateCartItemQuantity(userId, bookId, quantity);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating cart: " + e.getMessage()));
        }
    }

    // Remove item from cart
    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<?> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String bookId) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            Cart cart = cartService.removeFromCart(userId, bookId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error removing from cart: " + e.getMessage()));
        }
    }

    // Clear cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            Cart cart = cartService.clearCart(userId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error clearing cart: " + e.getMessage()));
        }
    }

    // Get cart total
    @GetMapping("/total")
    public ResponseEntity<?> getCartTotal(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            double total = cartService.getCartTotal(userId);
            return ResponseEntity.ok(Map.of("total", total));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error calculating cart total: " + e.getMessage()));
        }
    }

    // Delete cart completely (for logout cleanup)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCart(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            cartService.deleteCartByUserId(userId);
            return ResponseEntity.ok(Map.of("message", "Cart deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting cart: " + e.getMessage()));
        }
    }
}
