package com.bookstore.backend.controller;

import com.bookstore.backend.model.Review;
import com.bookstore.backend.service.ReviewService;
import com.bookstore.backend.util.JwtUtil;
import com.bookstore.backend.dto.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        try {
            String token = authHeader.substring(7);
            return jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.extractClaim(token, claims -> claims.get("role", String.class));
            return "ADMIN".equals(role);
        } catch (Exception e) {
            return false;
        }
    }

    // 1. CREATE REVIEW
    @PostMapping("/book/{bookId}")
    public ResponseEntity<?> createReview(
            @PathVariable String bookId,
            @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        String userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Authentication required"));
        }

        try {
            Review review = reviewService.createReview(userId, bookId, request.getRating(), request.getReviewText());
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 2. GET REVIEWS BY BOOK
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> getReviewsByBook(@PathVariable String bookId) {
        List<Review> reviews = reviewService.getReviewsByBook(bookId);
        return ResponseEntity.ok(reviews);
    }

    // 3. GET REVIEW BY ID
    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable String reviewId) {
        Optional<Review> review = reviewService.getReviewById(reviewId);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. UPDATE REVIEW
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable String reviewId,
            @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        String userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Authentication required"));
        }

        try {
            Review review = reviewService.updateReview(reviewId, userId, request.getRating(), request.getReviewText());
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 5. DELETE REVIEW
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable String reviewId,
            @RequestHeader("Authorization") String authHeader) {
        
        String userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Authentication required"));
        }

        boolean isAdmin = isAdmin(authHeader);

        try {
            reviewService.deleteReview(reviewId, userId, isAdmin);
            return ResponseEntity.ok(java.util.Map.of("message", "Review deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 6. GET ALL REVIEWS (Admin only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllReviews(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "Access denied. Admin only."));
        }

        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
}



