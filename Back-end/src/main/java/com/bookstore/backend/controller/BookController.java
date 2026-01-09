package com.bookstore.backend.controller;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // 1. CREATE
    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        try {
            Book newBook = bookService.save(book);
            return new ResponseEntity<>(newBook, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 2. READ ALL
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }

    // 3. READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book bookDetails) {
        try {
            Book updatedBook = bookService.update(id, bookDetails);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 6. RECOMMENDATION ENDPOINTS

    // Get similar books for a specific book
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<Book>> getSimilarBooks(@PathVariable String id,
            @RequestParam(defaultValue = "5") int limit) {
        List<Book> similarBooks = bookService.getSimilarBooks(id, limit);
        return ResponseEntity.ok(similarBooks);
    }

    // Get trending books
    @GetMapping("/trending")
    public ResponseEntity<List<Book>> getTrendingBooks(@RequestParam(defaultValue = "10") int limit) {
        List<Book> trendingBooks = bookService.getTrendingBooks(limit);
        return ResponseEntity.ok(trendingBooks);
    }

    // Get new arrivals
    @GetMapping("/new-arrivals")
    public ResponseEntity<List<Book>> getNewArrivals(@RequestParam(defaultValue = "10") int limit) {
        List<Book> newArrivals = bookService.getNewArrivals(limit);
        return ResponseEntity.ok(newArrivals);
    }
}