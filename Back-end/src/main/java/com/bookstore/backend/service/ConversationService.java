package com.bookstore.backend.service;

import com.bookstore.backend.model.Conversation;
import com.bookstore.backend.dto.ConversationRequest;
import com.bookstore.backend.dto.MessageRequest;
import com.bookstore.backend.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public Conversation createConversation(ConversationRequest request) {
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setUserEmail(request.getEmail());
        conversation.setUserName(request.getName());
        conversation.setSubject(request.getSubject());

        Conversation.Message initialMessage = new Conversation.Message(
                "USER",
                request.getName(),
                request.getMessage());
        initialMessage.setMessageId(UUID.randomUUID().toString());

        conversation.setMessages(List.of(initialMessage));

        return conversationRepository.save(conversation);
    }

    public Conversation addMessage(String conversationId, MessageRequest request, String sender) {
        Conversation conversation = getConversationById(conversationId);

        Conversation.Message newMessage = new Conversation.Message(
                sender,
                request.getSenderName() != null ? request.getSenderName() : conversation.getUserName(),
                request.getContent());
        newMessage.setMessageId(UUID.randomUUID().toString());

        conversation.addMessage(newMessage);

        return conversationRepository.save(conversation);
    }

    public Conversation getConversationById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }

    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public List<Conversation> getConversationsByStatus(String status) {
        return conversationRepository.findByStatusOrderByLastMessageAtDesc(status);
    }

    public List<Conversation> getActiveConversations() {
        return conversationRepository.findActiveConversations();
    }

    public List<Conversation> getConversationsWithUnreadUserMessages() {
        return conversationRepository.findConversationsWithUnreadUserMessages();
    }

    public List<Conversation> getConversationsWithUnreadAdminMessages() {
        return conversationRepository.findConversationsWithUnreadAdminMessages();
    }

    public List<Conversation> getUserConversations(String userEmail) {
        return conversationRepository.findByUserEmailOrderByLastMessageAtDesc(userEmail);
    }

    public List<Conversation> getUserActiveConversations(String userEmail) {
        return conversationRepository.findActiveConversationsByUser(userEmail);
    }

    public Conversation closeConversation(String conversationId) {
        Conversation conversation = getConversationById(conversationId);
        conversation.markAsClosed();
        return conversationRepository.save(conversation);
    }

    public Conversation reopenConversation(String conversationId) {
        Conversation conversation = getConversationById(conversationId);
        conversation.markAsActive();
        return conversationRepository.save(conversation);
    }

    public void deleteConversation(String conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new RuntimeException("Conversation not found");
        }
        conversationRepository.deleteById(conversationId);
    }

    public List<Conversation> searchConversations(String keyword) {
        return conversationRepository.findByMessageContentContaining(keyword);
    }

    public Conversation markMessagesAsRead(String conversationId, String sender) {
        Conversation conversation = getConversationById(conversationId);

        conversation.getMessages().stream()
                .filter(message -> !message.getSender().equals(sender))
                .forEach(Conversation.Message::markAsRead);

        return conversationRepository.save(conversation);
    }

    public boolean isParticipant(String conversationId, String userEmail) {
        try {
            Conversation conversation = getConversationById(conversationId);
            return conversation.getUserEmail().equals(userEmail);
        } catch (RuntimeException e) {
            return false;
        }
    }
}
