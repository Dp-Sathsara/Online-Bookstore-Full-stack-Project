package com.bookstore.backend.controller;

import com.bookstore.backend.model.Conversation;
import com.bookstore.backend.dto.ConversationRequest;
import com.bookstore.backend.dto.MessageRequest;
import com.bookstore.backend.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping
    public ResponseEntity<Conversation> createConversation(@Valid @RequestBody ConversationRequest request) {
        Conversation createdConversation = conversationService.createConversation(request);
        return ResponseEntity.ok(createdConversation);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Conversation>> getAllConversations() {
        return ResponseEntity.ok(conversationService.getAllConversations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conversation> getConversationById(@PathVariable String id) {
        try {
            Conversation conversation = conversationService.getConversationById(id);
            return ResponseEntity.ok(conversation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Conversation>> getConversationsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(conversationService.getConversationsByStatus(status));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Conversation>> getActiveConversations() {
        return ResponseEntity.ok(conversationService.getActiveConversations());
    }

    @GetMapping("/unread/user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Conversation>> getConversationsWithUnreadUserMessages() {
        return ResponseEntity.ok(conversationService.getConversationsWithUnreadUserMessages());
    }

    @GetMapping("/unread/admin")
    public ResponseEntity<List<Conversation>> getConversationsWithUnreadAdminMessages() {
        return ResponseEntity.ok(conversationService.getConversationsWithUnreadAdminMessages());
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Conversation>> getUserConversations(@PathVariable String userEmail) {
        return ResponseEntity.ok(conversationService.getUserConversations(userEmail));
    }

    @GetMapping("/user/{userEmail}/active")
    public ResponseEntity<List<Conversation>> getUserActiveConversations(@PathVariable String userEmail) {
        return ResponseEntity.ok(conversationService.getUserActiveConversations(userEmail));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<Conversation> addMessage(
            @PathVariable String id,
            @Valid @RequestBody MessageRequest request,
            @RequestParam String sender) {
        try {
            Conversation updatedConversation = conversationService.addMessage(id, request, sender);
            return ResponseEntity.ok(updatedConversation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Conversation> markMessagesAsRead(
            @PathVariable String id,
            @RequestParam String sender) {
        try {
            Conversation updatedConversation = conversationService.markMessagesAsRead(id, sender);
            return ResponseEntity.ok(updatedConversation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Conversation> closeConversation(@PathVariable String id) {
        try {
            Conversation closedConversation = conversationService.closeConversation(id);
            return ResponseEntity.ok(closedConversation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/reopen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Conversation> reopenConversation(@PathVariable String id) {
        try {
            Conversation reopenedConversation = conversationService.reopenConversation(id);
            return ResponseEntity.ok(reopenedConversation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteConversation(@PathVariable String id) {
        try {
            conversationService.deleteConversation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Conversation>> searchConversations(@RequestParam String keyword) {
        return ResponseEntity.ok(conversationService.searchConversations(keyword));
    }
}
