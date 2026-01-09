package com.bookstore.backend.repository;

import com.bookstore.backend.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    @Query("{ 'genre': ?0, 'book_id': { $ne: ?1 } }")
    List<Book> findByGenreAndNotId(String genre, String excludeId);

    @Query("{ 'author': ?0, 'book_id': { $ne: ?1 } }")
    List<Book> findByAuthorAndNotId(String author, String excludeId);

    @Query("{ 'publishedDate': { $gte: ?0 } }")
    List<Book> findByPublishedDateAfter(java.time.LocalDate date);

    @Query("{ 'rating': { $gte: 4.0 } }")
    List<Book> findByHighRating();

    @Query("{}")
    List<Book> findAll();
}