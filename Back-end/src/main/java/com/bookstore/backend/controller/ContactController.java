package com.bookstore.backend.controller;

import com.bookstore.backend.model.Contact;
import com.bookstore.backend.dto.ContactRequest;
import com.bookstore.backend.dto.ContactReplyRequest;
import com.bookstore.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody ContactRequest request) {
        Contact createdContact = contactService.createContact(request);
        return ResponseEntity.ok(createdContact);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(contactService.getContactsByStatus(status));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getPendingContacts() {
        return ResponseEntity.ok(contactService.getPendingContacts());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contact> getContactById(@PathVariable String id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contact> replyToContact(
            @PathVariable String id,
            @Valid @RequestBody ContactReplyRequest request,
            @RequestParam String adminName) {
        try {
            Contact repliedContact = contactService.replyToContact(id, request, adminName);
            return ResponseEntity.ok(repliedContact);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contact> closeContact(@PathVariable String id) {
        try {
            Contact closedContact = contactService.closeContact(id);
            return ResponseEntity.ok(closedContact);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> searchContacts(@RequestParam String keyword) {
        return ResponseEntity.ok(contactService.searchContacts(keyword));
    }
}
