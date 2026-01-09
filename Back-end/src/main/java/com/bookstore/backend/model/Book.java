package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "books")
public class Book {

    @Id
    private String book_id;
    private String title;
    private String author;
    private double price;
    private String description;
    private String genre;
    private String publisher;
    private String language;
    private int stockQuantity;
    private String stockStatus; // "IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"
    private String coverImageUrl;
    private LocalDate publishedDate;
    private Double rating; // Average rating (0.0 to 5.0)
}