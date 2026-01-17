package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String conversationId;
    private String userEmail;
    private String userName;
    private String subject;
    private String status; // "ACTIVE", "CLOSED"
    private List<Message> messages;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private String lastMessageBy;

    public Conversation() {
        this.createdAt = LocalDateTime.now();
        this.lastMessageAt = LocalDateTime.now();
        this.status = "ACTIVE";
        this.messages = new ArrayList<>();
    }

    public void addMessage(Message message) {
        this.messages.add(message);
        this.lastMessageAt = message.getCreatedAt();
        this.lastMessageBy = message.getSender();
    }

    public void markAsClosed() {
        this.status = "CLOSED";
    }

    public void markAsActive() {
        this.status = "ACTIVE";
    }

    @Data
    public static class Message {
        private String messageId;
        private String sender; // "USER" or "ADMIN"
        private String senderName;
        private String content;
        private LocalDateTime createdAt;
        private Boolean read;

        public Message() {
            this.createdAt = LocalDateTime.now();
            this.read = false;
        }

        public Message(String sender, String senderName, String content) {
            this();
            this.sender = sender;
            this.senderName = senderName;
            this.content = content;
        }

        public void markAsRead() {
            this.read = true;
        }
    }
}
