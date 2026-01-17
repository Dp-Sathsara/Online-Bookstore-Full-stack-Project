package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String review_id;
    private String book_id;
    private String userId;
    private String userName;
    private int rating; // 1 to 5
    private String reviewText;
    private LocalDateTime createdAt;
    private boolean isDeleted; // Soft delete flag

    public Review() {
        this.createdAt = LocalDateTime.now();
        this.isDeleted = false;
    }
}



