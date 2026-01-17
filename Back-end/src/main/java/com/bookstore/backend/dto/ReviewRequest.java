package com.bookstore.backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private int rating; // 1 to 5
    private String reviewText;
}



