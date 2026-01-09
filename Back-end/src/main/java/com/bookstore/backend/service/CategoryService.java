package com.bookstore.backend.service;

import com.bookstore.backend.model.Category;
import com.bookstore.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // CREATE / SAVE
    public Category save(Category category) {

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty.");
        }
        return categoryRepository.save(category);
    }

    // READ ALL
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    // READ ONE
    public Optional<Category> findById(String id) {
        return categoryRepository.findById(id);
    }

    // UPDATE
    public Category update(String id, Category categoryDetails) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);

        if (categoryOptional.isPresent()) {
            Category existingCategory = categoryOptional.get();

            // Apply business logic validation before update
            if (categoryDetails.getName() == null || categoryDetails.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Category name cannot be empty.");
            }

            existingCategory.setName(categoryDetails.getName());

            return categoryRepository.save(existingCategory);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    // DELETE
    public void delete(String id) {
        categoryRepository.deleteById(id);
    }
}