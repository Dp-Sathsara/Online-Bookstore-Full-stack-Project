package com.bookstore.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ConversationRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject must be less than 200 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must be less than 2000 characters")
    private String message;
}
