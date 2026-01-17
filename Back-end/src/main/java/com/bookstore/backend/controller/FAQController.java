package com.bookstore.backend.controller;

import com.bookstore.backend.model.FAQ;
import com.bookstore.backend.dto.FAQRequest;
import com.bookstore.backend.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FAQController {

    private final FAQService faqService;

    @GetMapping
    public ResponseEntity<List<FAQ>> getAllActiveFAQs() {
        return ResponseEntity.ok(faqService.getAllActiveFAQs());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FAQ>> getAllFAQs() {
        return ResponseEntity.ok(faqService.getAllFAQs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FAQ> getFAQById(@PathVariable String id) {
        return faqService.getFAQById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FAQ>> getFAQsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(faqService.getFAQsByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(faqService.getCategories());
    }

    @GetMapping("/search")
    public ResponseEntity<List<FAQ>> searchFAQs(@RequestParam String keyword) {
        return ResponseEntity.ok(faqService.searchFAQs(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> createFAQ(@Valid @RequestBody FAQRequest request) {
        FAQ createdFAQ = faqService.createFAQ(request);
        return ResponseEntity.ok(createdFAQ);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> updateFAQ(@PathVariable String id, @Valid @RequestBody FAQRequest request) {
        try {
            FAQ updatedFAQ = faqService.updateFAQ(id, request);
            return ResponseEntity.ok(updatedFAQ);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFAQ(@PathVariable String id) {
        try {
            faqService.deleteFAQ(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> activateFAQ(@PathVariable String id) {
        try {
            FAQ activatedFAQ = faqService.activateFAQ(id);
            return ResponseEntity.ok(activatedFAQ);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> deactivateFAQ(@PathVariable String id) {
        try {
            FAQ deactivatedFAQ = faqService.deactivateFAQ(id);
            return ResponseEntity.ok(deactivatedFAQ);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FAQ>> searchAllFAQs(@RequestParam String keyword) {
        return ResponseEntity.ok(faqService.searchAllFAQs(keyword));
    }
}
