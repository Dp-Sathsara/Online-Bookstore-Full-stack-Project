package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "articles")
public class Article {

    @Id
    private String articleId;
    private String title;
    private String content;
    private String summary;
    private String author;
    private String category;
    private String imageUrl;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    public Article() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.published = false;
    }

    public void markAsPublished() {
        this.published = true;
        this.publishedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsDraft() {
        this.published = false;
        this.publishedAt = null;
        this.updatedAt = LocalDateTime.now();
    }
}
