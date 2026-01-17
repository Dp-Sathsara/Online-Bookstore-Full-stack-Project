package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "contacts")
public class Contact {

    @Id
    private String contactId;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String status; // "PENDING", "REPLIED", "CLOSED"
    private String adminReply;
    private LocalDateTime createdAt;
    private LocalDateTime repliedAt;
    private String repliedBy;

    public Contact() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public void markAsReplied(String adminName) {
        this.status = "REPLIED";
        this.repliedAt = LocalDateTime.now();
        this.repliedBy = adminName;
    }

    public void markAsClosed() {
        this.status = "CLOSED";
    }
}
