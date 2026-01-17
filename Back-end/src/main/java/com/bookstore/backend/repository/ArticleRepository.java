package com.bookstore.backend.repository;

import com.bookstore.backend.model.Article;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends MongoRepository<Article, String> {

    List<Article> findByPublishedTrueOrderByPublishedAtDesc();

    List<Article> findByCategoryAndPublishedTrueOrderByPublishedAtDesc(String category);

    List<Article> findByAuthorOrderByCreatedAtDesc(String author);

    @Query("{ 'title': { $regex: ?0, $options: 'i' }, 'published': true }")
    List<Article> findByTitleContainingAndPublishedTrue(String title);

    @Query("{ 'published': true, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } }, { 'summary': { $regex: ?0, $options: 'i' } } ] }")
    List<Article> searchByKeyword(String keyword);

    List<Article> findAllByOrderByCreatedAtDesc();
}
