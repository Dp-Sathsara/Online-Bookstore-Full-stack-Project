package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.Order.OrderItem;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository; // Needed to check price and stock

    @Autowired
    private UserRepository userRepository; // Needed to validate user ID

    public Order placeOrder(Order order) {

        // 1. Validate User ID
        if (!userRepository.existsById(order.getUserId())) {
            throw new IllegalArgumentException("User ID is invalid or user does not exist.");
        }

        double calculatedTotal = 0;

        for (OrderItem item : order.getItems()) {
            Optional<Book> bookOptional = bookRepository.findById(item.getBook_id());

            if (bookOptional.isEmpty()) {
                throw new IllegalArgumentException("Book with ID " + item.getBook_id() + " not found.");
            }

            Book book = bookOptional.get();

            item.setPrice(book.getPrice());

            // 4. Stock Check
            if (book.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for book: " + book.getTitle() +
                                ". Available: " + book.getStockQuantity());
            }

            // 5. Update Stock
            book.setStockQuantity(book.getStockQuantity() - item.getQuantity());
            bookRepository.save(book);

            // 6. Calculate Total
            calculatedTotal += item.getPrice() * item.getQuantity();
        }

        // 7. Finalize Order and Save
        order.setTotalAmount(calculatedTotal);

        // Order status and date are set in the Order model constructor
        return orderRepository.save(order);
    }

    // 2. READ ALL
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    // 3. READ BY USER ID
    public List<Order> findByUserId(String user_id) {
        return orderRepository.findByUserId(user_id);
    }

    // 4. READ ONE
    public Optional<Order> findById(String id) {
        return orderRepository.findById(id);
    }

    // 5. UPDATE ORDER STATUS
    public Order updateStatus(String id, String status) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isEmpty()) {
            throw new RuntimeException("Order not found with id: " + id);
        }

        // Validate status
        String[] validStatuses = { "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED" };
        boolean isValid = false;
        for (String validStatus : validStatuses) {
            if (validStatus.equals(status)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new IllegalArgumentException(
                    "Invalid status. Must be one of: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED");
        }

        Order order = orderOptional.get();
        order.setStatus(status);
        return orderRepository.save(order);
    }
}