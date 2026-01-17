package com.bookstore.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ContactReplyRequest {

    @NotBlank(message = "Reply message is required")
    private String adminReply;
}
