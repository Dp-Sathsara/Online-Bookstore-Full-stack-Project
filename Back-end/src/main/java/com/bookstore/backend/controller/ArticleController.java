package com.bookstore.backend.controller;

import com.bookstore.backend.model.Article;
import com.bookstore.backend.dto.ArticleRequest;
import com.bookstore.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<Article>> getAllPublishedArticles() {
        return ResponseEntity.ok(articleService.getAllPublishedArticles());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable String id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Article>> getArticlesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(articleService.getArticlesByCategory(category));
    }

    @GetMapping("/author/{author}")
    public ResponseEntity<List<Article>> getArticlesByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(articleService.getArticlesByAuthor(author));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Article>> searchArticles(@RequestParam String keyword) {
        return ResponseEntity.ok(articleService.searchArticles(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> createArticle(@Valid @RequestBody ArticleRequest request) {
        String author = "Admin";
        Article createdArticle = articleService.createArticle(request, author);
        return ResponseEntity.ok(createdArticle);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> updateArticle(@PathVariable String id, @Valid @RequestBody ArticleRequest request) {
        try {
            Article updatedArticle = articleService.updateArticle(id, request);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable String id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> publishArticle(@PathVariable String id) {
        try {
            Article publishedArticle = articleService.publishArticle(id);
            return ResponseEntity.ok(publishedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> unpublishArticle(@PathVariable String id) {
        try {
            Article unpublishedArticle = articleService.unpublishArticle(id);
            return ResponseEntity.ok(unpublishedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
