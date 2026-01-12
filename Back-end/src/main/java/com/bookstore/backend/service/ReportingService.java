package com.bookstore.backend.service;

import com.bookstore.backend.dto.*;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.Order.OrderItem;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public SalesReportDTO getTotalSalesReport() {
        List<Order> allOrders = orderRepository.findAll();
        
        SalesReportDTO report = new SalesReportDTO();
        
        double totalRevenue = 0;
        int totalItemsSold = 0;
        Map<String, Integer> ordersByStatus = new HashMap<>();
        Map<String, Double> revenueByStatus = new HashMap<>();
        
        for (Order order : allOrders) {
            totalRevenue += order.getTotalAmount();
            
            // Count items sold
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    totalItemsSold += item.getQuantity();
                }
            }
            
            // Count orders by status
            String status = order.getStatus();
            ordersByStatus.put(status, ordersByStatus.getOrDefault(status, 0) + 1);
            revenueByStatus.put(status, revenueByStatus.getOrDefault(status, 0.0) + order.getTotalAmount());
        }
        
        report.setTotalRevenue(totalRevenue);
        report.setTotalOrders(allOrders.size());
        report.setTotalItemsSold(totalItemsSold);
        report.setAverageOrderValue(allOrders.isEmpty() ? 0 : totalRevenue / allOrders.size());
        report.setOrdersByStatus(ordersByStatus);
        report.setRevenueByStatus(revenueByStatus);
        
        return report;
    }

    public List<TopSellingBookDTO> getTopSellingBooks(int limit) {
        List<Order> allOrders = orderRepository.findAll();
        
        // Map to aggregate book sales: bookId -> {quantity, revenue, bookInfo}
        Map<String, BookSalesData> bookSalesMap = new HashMap<>();
        
        for (Order order : allOrders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    String bookId = item.getBook_id();
                    BookSalesData data = bookSalesMap.getOrDefault(bookId, new BookSalesData());
                    data.quantity += item.getQuantity();
                    data.revenue += item.getPrice() * item.getQuantity();
                    data.title = item.getTitle();
                    data.price = item.getPrice();
                    bookSalesMap.put(bookId, data);
                }
            }
        }
        
        // Convert to DTOs and sort by quantity sold
        List<TopSellingBookDTO> topBooks = bookSalesMap.entrySet().stream()
                .map(entry -> {
                    TopSellingBookDTO dto = new TopSellingBookDTO();
                    dto.setBookId(entry.getKey());
                    dto.setTitle(entry.getValue().title);
                    dto.setTotalQuantitySold(entry.getValue().quantity);
                    dto.setTotalRevenue(entry.getValue().revenue);
                    dto.setPrice(entry.getValue().price);
                    
                    // Fetch author from book repository
                    Optional<Book> bookOptional = bookRepository.findById(entry.getKey());
                    if (bookOptional.isPresent()) {
                        dto.setAuthor(bookOptional.get().getAuthor());
                    }
                    
                    return dto;
                })
                .sorted((a, b) -> Integer.compare(b.getTotalQuantitySold(), a.getTotalQuantitySold()))
                .limit(limit)
                .collect(Collectors.toList());
        
        return topBooks;
    }

    public List<MonthlyRevenueDTO> getMonthlyRevenueStats() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Group orders by year-month
        Map<String, MonthlyData> monthlyDataMap = new HashMap<>();
        
        for (Order order : allOrders) {
            LocalDateTime orderDate = order.getOrderDate();
            if (orderDate != null) {
                String monthKey = orderDate.getYear() + "-" + String.format("%02d", orderDate.getMonthValue());
                
                MonthlyData data = monthlyDataMap.getOrDefault(monthKey, new MonthlyData());
                data.revenue += order.getTotalAmount();
                data.orderCount++;
                
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        data.itemsSold += item.getQuantity();
                    }
                }
                
                data.year = orderDate.getYear();
                data.month = orderDate.getMonth();
                
                monthlyDataMap.put(monthKey, data);
            }
        }
        
        // Convert to DTOs and sort by date (most recent first)
        List<MonthlyRevenueDTO> monthlyStats = monthlyDataMap.entrySet().stream()
                .map(entry -> {
                    MonthlyRevenueDTO dto = new MonthlyRevenueDTO();
                    MonthlyData data = entry.getValue();
                    dto.setMonth(data.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH));
                    dto.setYear(data.year);
                    dto.setRevenue(data.revenue);
                    dto.setOrderCount(data.orderCount);
                    dto.setItemsSold(data.itemsSold);
                    return dto;
                })
                .sorted((a, b) -> {
                    int yearCompare = Integer.compare(b.getYear(), a.getYear());
                    if (yearCompare != 0) return yearCompare;
                    // Compare by month value
                    Month monthA = Month.valueOf(a.getMonth().toUpperCase());
                    Month monthB = Month.valueOf(b.getMonth().toUpperCase());
                    return Integer.compare(monthB.getValue(), monthA.getValue());
                })
                .collect(Collectors.toList());
        
        return monthlyStats;
    }

    public List<UserActivityDTO> getUserActivityLogs() {
        List<User> allUsers = userRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();
        
        // Group orders by userId
        Map<String, UserOrderData> userOrderMap = new HashMap<>();
        
        for (Order order : allOrders) {
            String userId = order.getUserId();
            UserOrderData data = userOrderMap.getOrDefault(userId, new UserOrderData());
            data.totalOrders++;
            data.totalSpent += order.getTotalAmount();
            
            if (order.getOrderDate() != null) {
                if (data.lastOrderDate == null || order.getOrderDate().isAfter(data.lastOrderDate)) {
                    data.lastOrderDate = order.getOrderDate();
                }
            }
            
            userOrderMap.put(userId, data);
        }
        
        // Convert to DTOs
        List<UserActivityDTO> activityLogs = new ArrayList<>();
        
        for (User user : allUsers) {
            UserActivityDTO dto = new UserActivityDTO();
            dto.setUserId(user.getUser_id());
            dto.setUserName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRegistrationDate(user.getCreatedAt());
            
            UserOrderData orderData = userOrderMap.getOrDefault(user.getUser_id(), new UserOrderData());
            dto.setTotalOrders(orderData.totalOrders);
            dto.setTotalSpent(orderData.totalSpent);
            dto.setLastOrderDate(orderData.lastOrderDate);
            
            activityLogs.add(dto);
        }
        
        // Sort by total orders (most active first)
        activityLogs.sort((a, b) -> Integer.compare(b.getTotalOrders(), a.getTotalOrders()));
        
        return activityLogs;
    }

    // Helper classes for internal data aggregation
    private static class BookSalesData {
        int quantity = 0;
        double revenue = 0;
        String title = "";
        double price = 0;
    }

    private static class MonthlyData {
        double revenue = 0;
        int orderCount = 0;
        int itemsSold = 0;
        int year;
        Month month;
    }

    private static class UserOrderData {
        int totalOrders = 0;
        double totalSpent = 0;
        LocalDateTime lastOrderDate;
    }
}

