package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "carts")
public class Cart {

    @Id
    private String cart_id;
    private String userId;
    private List<CartItem> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Cart() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @Data
    public static class CartItem {
        private String bookId;
        private String title;
        private String author;
        private double price;
        private int quantity;
        private String coverImageUrl;
    }
}
