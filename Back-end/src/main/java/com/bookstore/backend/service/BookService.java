package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // CREATE / SAVE
    public Book save(Book book) {
        if (book.getPrice() <= 0) {
            throw new IllegalArgumentException("Book price must be greater than zero.");
        }
        return bookRepository.save(book);
    }

    // READ ALL
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // READ ONE
    public Optional<Book> findById(String id) {
        return bookRepository.findById(id);
    }

    // UPDATE
    public Book update(String id, Book bookDetails) {
        Optional<Book> bookOptional = bookRepository.findById(id);

        if (bookOptional.isPresent()) {
            Book existingBook = bookOptional.get();

            // Update all fields, allowing for null values to preserve existing data
            if (bookDetails.getTitle() != null)
                existingBook.setTitle(bookDetails.getTitle());
            if (bookDetails.getAuthor() != null)
                existingBook.setAuthor(bookDetails.getAuthor());
            if (bookDetails.getPrice() > 0)
                existingBook.setPrice(bookDetails.getPrice());
            if (bookDetails.getStockQuantity() >= 0)
                existingBook.setStockQuantity(bookDetails.getStockQuantity());
            if (bookDetails.getDescription() != null)
                existingBook.setDescription(bookDetails.getDescription());
            if (bookDetails.getGenre() != null)
                existingBook.setGenre(bookDetails.getGenre());
            if (bookDetails.getPublisher() != null)
                existingBook.setPublisher(bookDetails.getPublisher());
            if (bookDetails.getLanguage() != null)
                existingBook.setLanguage(bookDetails.getLanguage());
            if (bookDetails.getCoverImageUrl() != null)
                existingBook.setCoverImageUrl(bookDetails.getCoverImageUrl());
            if (bookDetails.getPublishedDate() != null)
                existingBook.setPublishedDate(bookDetails.getPublishedDate());
            if (bookDetails.getRating() != null)
                existingBook.setRating(bookDetails.getRating());

            return bookRepository.save(existingBook); // Save the updated data
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }

    // DELETE
    public void delete(String id) {
        bookRepository.deleteById(id);
    }

    // RECOMMENDATION METHODS

    // Get similar books based on genre and author
    public List<Book> getSimilarBooks(String bookId, int limit) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return Collections.emptyList();
        }

        Book book = bookOpt.get();

        // Get books by same genre (excluding current book)
        List<Book> sameGenreBooks = bookRepository.findByGenreAndNotId(book.getGenre(), bookId);

        // Get books by same author (excluding current book)
        List<Book> sameAuthorBooks = bookRepository.findByAuthorAndNotId(book.getAuthor(), bookId);

        // Combine and remove duplicates
        List<Book> similarBooks = sameGenreBooks;
        for (Book authorBook : sameAuthorBooks) {
            if (!similarBooks.stream().anyMatch(b -> b.getBook_id().equals(authorBook.getBook_id()))) {
                similarBooks.add(authorBook);
            }
        }

        // Sort by rating (highest first) and limit
        return similarBooks.stream()
                .sorted((b1, b2) -> Double.compare(b2.getRating() != null ? b2.getRating() : 0,
                        b1.getRating() != null ? b1.getRating() : 0))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Get trending books (highly rated)
    public List<Book> getTrendingBooks(int limit) {
        return bookRepository.findByHighRating().stream()
                .sorted((b1, b2) -> Double.compare(b2.getRating() != null ? b2.getRating() : 0,
                        b1.getRating() != null ? b1.getRating() : 0))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Get new arrivals (recently published)
    public List<Book> getNewArrivals(int limit) {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        return bookRepository.findByPublishedDateAfter(threeMonthsAgo).stream()
                .sorted((b1, b2) -> b2.getPublishedDate().compareTo(b1.getPublishedDate()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}