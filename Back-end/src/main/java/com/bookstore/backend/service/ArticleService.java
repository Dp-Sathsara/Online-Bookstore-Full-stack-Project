package com.bookstore.backend.service;

import com.bookstore.backend.model.Article;
import com.bookstore.backend.dto.ArticleRequest;
import com.bookstore.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticleService {

    private final ArticleRepository articleRepository;

    public List<Article> getAllPublishedArticles() {
        return articleRepository.findByPublishedTrueOrderByPublishedAtDesc();
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Article> getArticleById(String id) {
        return articleRepository.findById(id);
    }

    public List<Article> getArticlesByCategory(String category) {
        return articleRepository.findByCategoryAndPublishedTrueOrderByPublishedAtDesc(category);
    }

    public List<Article> getArticlesByAuthor(String author) {
        return articleRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    public List<Article> searchArticles(String keyword) {
        return articleRepository.searchByKeyword(keyword);
    }

    public Article createArticle(ArticleRequest request, String author) {
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setSummary(request.getSummary());
        article.setCategory(request.getCategory());
        article.setImageUrl(request.getImageUrl());
        article.setAuthor(author);

        if (request.isPublished()) {
            article.markAsPublished();
        }

        return articleRepository.save(article);
    }

    public Article updateArticle(String id, ArticleRequest request) {
        Optional<Article> existingArticleOpt = articleRepository.findById(id);
        if (existingArticleOpt.isEmpty()) {
            throw new RuntimeException("Article not found");
        }

        Article article = existingArticleOpt.get();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setSummary(request.getSummary());
        article.setCategory(request.getCategory());
        article.setImageUrl(request.getImageUrl());
        article.setUpdatedAt(LocalDateTime.now());

        if (request.isPublished() && !article.isPublished()) {
            article.markAsPublished();
        } else if (!request.isPublished() && article.isPublished()) {
            article.markAsDraft();
        }

        return articleRepository.save(article);
    }

    public void deleteArticle(String id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found");
        }
        articleRepository.deleteById(id);
    }

    public Article publishArticle(String id) {
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            throw new RuntimeException("Article not found");
        }

        Article article = articleOpt.get();
        article.markAsPublished();
        return articleRepository.save(article);
    }

    public Article unpublishArticle(String id) {
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            throw new RuntimeException("Article not found");
        }

        Article article = articleOpt.get();
        article.markAsDraft();
        return articleRepository.save(article);
    }
}
