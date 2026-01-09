package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "categories")
public class Category {

    @Id
    private String category_id;
    private String name;
    private LocalDateTime createdAt;

    public Category() {
        this.createdAt = LocalDateTime.now();
    }
}