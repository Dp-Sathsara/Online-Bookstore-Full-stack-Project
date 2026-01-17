package com.bookstore.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class FAQRequest {

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Answer is required")
    private String answer;

    private String category;

    private int sortOrder;

    private boolean active;
}
