package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Review;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.ReviewRepository;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookService bookService;

    // CREATE REVIEW
    public Review createReview(String userId, String bookId, int rating, String reviewText) {
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check if book exists
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isEmpty()) {
            throw new RuntimeException("Book not found");
        }

        // Check if user exists
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Check if user already reviewed this book
        Optional<Review> existingReview = reviewRepository.findByBook_idAndUserId(bookId, userId);
        if (existingReview.isPresent() && !existingReview.get().isDeleted()) {
            throw new IllegalArgumentException("You have already reviewed this book");
        }

        // Create new review
        Review review = new Review();
        review.setBook_id(bookId);
        review.setUserId(userId);
        review.setUserName(userOptional.get().getName());
        review.setRating(rating);
        review.setReviewText(reviewText);

        Review savedReview = reviewRepository.save(review);

        // Recalculate book's average rating
        updateBookRating(bookId);

        return savedReview;
    }

    // GET REVIEWS BY BOOK
    public List<Review> getReviewsByBook(String bookId) {
        return reviewRepository.findByBook_idAndIsDeletedFalse(bookId);
    }

    // GET REVIEW BY ID
    public Optional<Review> getReviewById(String reviewId) {
        return reviewRepository.findById(reviewId);
    }

    // UPDATE REVIEW (only by owner)
    @Transactional
    public Review updateReview(String reviewId, String userId, int rating, String reviewText) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOptional.get();

        // Check if user owns the review
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }

        if (review.isDeleted()) {
            throw new RuntimeException("Cannot update deleted review");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        review.setRating(rating);
        review.setReviewText(reviewText);

        Review updatedReview = reviewRepository.save(review);

        // Recalculate book's average rating
        updateBookRating(review.getBook_id());

        return updatedReview;
    }

    // DELETE REVIEW (soft delete - admin or owner)
    @Transactional
    public void deleteReview(String reviewId, String userId, boolean isAdmin) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOptional.get();

        // Check if user owns the review or is admin
        if (!review.getUserId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        // Soft delete
        review.setDeleted(true);
        reviewRepository.save(review);

        // Recalculate book's average rating
        updateBookRating(review.getBook_id());
    }

    // GET ALL REVIEWS (for admin)
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByIsDeletedFalse();
    }

    // UPDATE BOOK'S AVERAGE RATING
    private void updateBookRating(String bookId) {
        List<Review> reviews = reviewRepository.findByBook_idAndIsDeletedFalse(bookId);

        if (reviews.isEmpty()) {
            // No reviews, set rating to null
            Optional<Book> bookOptional = bookRepository.findById(bookId);
            if (bookOptional.isPresent()) {
                Book book = bookOptional.get();
                book.setRating(null);
                bookRepository.save(book);
            }
            return;
        }

        // Calculate average rating
        double sum = 0;
        for (Review review : reviews) {
            sum += review.getRating();
        }
        double averageRating = sum / reviews.size();

        // Update book's rating
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            book.setRating(averageRating);
            bookRepository.save(book);
        }
    }
}
