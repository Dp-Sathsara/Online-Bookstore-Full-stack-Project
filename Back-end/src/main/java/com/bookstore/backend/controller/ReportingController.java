package com.bookstore.backend.controller;

import com.bookstore.backend.dto.*;
import com.bookstore.backend.service.ReportingService;
import com.bookstore.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportingController {

    @Autowired
    private ReportingService reportingService;

    @Autowired
    private JwtUtil jwtUtil;

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

    // 1. GET TOTAL SALES REPORT
    @GetMapping("/sales")
    public ResponseEntity<?> getTotalSalesReport(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "Access denied. Admin only."));
        }
        try {
            SalesReportDTO report = reportingService.getTotalSalesReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error generating sales report: " + e.getMessage()));
        }
    }

    // 2. GET TOP SELLING BOOKS
    @GetMapping("/top-books")
    public ResponseEntity<?> getTopSellingBooks(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "10") int limit) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "Access denied. Admin only."));
        }
        try {
            List<TopSellingBookDTO> topBooks = reportingService.getTopSellingBooks(limit);
            return ResponseEntity.ok(topBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error generating top books report: " + e.getMessage()));
        }
    }

    // 3. GET MONTHLY REVENUE STATS
    @GetMapping("/monthly-revenue")
    public ResponseEntity<?> getMonthlyRevenueStats(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "Access denied. Admin only."));
        }
        try {
            List<MonthlyRevenueDTO> monthlyStats = reportingService.getMonthlyRevenueStats();
            return ResponseEntity.ok(monthlyStats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error generating monthly revenue report: " + e.getMessage()));
        }
    }

    // 4. GET USER ACTIVITY LOGS
    @GetMapping("/user-activity")
    public ResponseEntity<?> getUserActivityLogs(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "Access denied. Admin only."));
        }
        try {
            List<UserActivityDTO> activityLogs = reportingService.getUserActivityLogs();
            return ResponseEntity.ok(activityLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error generating user activity report: " + e.getMessage()));
        }
    }
}



