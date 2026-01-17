package com.bookstore.backend.repository;

import com.bookstore.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    @Query("{ 'book_id': ?0, 'isDeleted': false }")
    List<Review> findByBook_idAndIsDeletedFalse(String book_id);
    
    List<Review> findByUserId(String userId);
    
    @Query("{ 'book_id': ?0, 'userId': ?1, 'isDeleted': false }")
    Optional<Review> findByBook_idAndUserId(String book_id, String userId);
    
    @Query("{ 'isDeleted': false }")
    List<Review> findAllByIsDeletedFalse();
}

