package com.bookstore.backend.service;

import com.bookstore.backend.model.Cart;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.CartRepository;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    public Cart getCartByUserId(String userId) {
        Optional<Cart> cartOptional = cartRepository.findByUserId(userId);
        if (cartOptional.isPresent()) {
            return cartOptional.get();
        } else {
            // Create new cart for user
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        }
    }

    public Cart addToCart(String userId, String bookId, int quantity) {
        // Validate book exists and has sufficient stock
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (!bookOptional.isPresent()) {
            throw new IllegalArgumentException("Book not found");
        }

        Book book = bookOptional.get();
        if (book.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStockQuantity());
        }

        Cart cart = getCartByUserId(userId);
        
        // Check if item already exists in cart
        Optional<Cart.CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getBookId().equals(bookId))
            .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity
            Cart.CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (newQuantity > book.getStockQuantity()) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStockQuantity());
            }
            item.setQuantity(newQuantity);
        } else {
            // Add new item
            Cart.CartItem newItem = new Cart.CartItem();
            newItem.setBookId(bookId);
            newItem.setTitle(book.getTitle());
            newItem.setAuthor(book.getAuthor());
            newItem.setPrice(book.getPrice());
            newItem.setQuantity(quantity);
            newItem.setCoverImageUrl(book.getCoverImageUrl());
            cart.getItems().add(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart updateCartItemQuantity(String userId, String bookId, int quantity) {
        if (quantity <= 0) {
            return removeFromCart(userId, bookId);
        }

        Cart cart = getCartByUserId(userId);
        
        // Find and update the item
        Optional<Cart.CartItem> itemOptional = cart.getItems().stream()
            .filter(item -> item.getBookId().equals(bookId))
            .findFirst();

        if (!itemOptional.isPresent()) {
            throw new IllegalArgumentException("Item not found in cart");
        }

        // Validate stock
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            if (quantity > book.getStockQuantity()) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStockQuantity());
            }
        }

        Cart.CartItem item = itemOptional.get();
        item.setQuantity(quantity);
        cart.setUpdatedAt(LocalDateTime.now());
        
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String bookId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getBookId().equals(bookId));
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {
        // Delete the entire cart document from database
        cartRepository.deleteByUserId(userId);
        
        // Return a new empty cart for consistency
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setItems(new ArrayList<>());
        return newCart;
    }

    public void deleteCartByUserId(String userId) {
        cartRepository.deleteByUserId(userId);
    }

    public double getCartTotal(String userId) {
        Cart cart = getCartByUserId(userId);
        return cart.getItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }
}
