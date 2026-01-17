package com.bookstore.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageRequest {

    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message must be less than 2000 characters")
    private String content;

    private String senderName; // Optional for admin, auto-filled for user
}
