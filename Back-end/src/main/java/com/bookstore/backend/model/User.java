package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String user_id;
    private String name;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private String role;
    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.role = "USER";
    }
}