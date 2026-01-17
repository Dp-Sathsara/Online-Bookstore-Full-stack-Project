package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "faqs")
public class FAQ {

    @Id
    private String faqId;
    private String question;
    private String answer;
    private String category;
    private int sortOrder;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FAQ() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.active = true;
        this.sortOrder = 0;
    }

    public void markAsActive() {
        this.active = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsInactive() {
        this.active = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
