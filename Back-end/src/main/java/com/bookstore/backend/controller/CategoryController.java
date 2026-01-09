package com.bookstore.backend.controller;

import com.bookstore.backend.model.Category;
import com.bookstore.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 1. CREATE
    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        try {
            Category newCategory = categoryService.save(category);
            return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 2. READ ALL
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }

    // 3. READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category categoryDetails) {
        try {
            Category updatedCategory = categoryService.update(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) { // <-- CATCH SPECIFIC (validation) FIRST
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) { // <-- CATCH GENERAL (not found) SECOND
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}