package com.bookstore.backend.repository;

import com.bookstore.backend.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByUserEmailOrderByLastMessageAtDesc(String userEmail);

    List<Conversation> findByStatusOrderByLastMessageAtDesc(String status);

    List<Conversation> findByStatusAndLastMessageByOrderByLastMessageAtDesc(String status, String lastMessageBy);

    @Query("{ 'messages.sender': ?0 }")
    List<Conversation> findByMessagesSender(String sender);

    @Query("{ 'messages.content': { $regex: ?0, $options: 'i' } }")
    List<Conversation> findByMessageContentContaining(String keyword);

    @Query("{ 'userEmail': ?0, 'status': { $ne: 'CLOSED' } }")
    List<Conversation> findActiveConversationsByUser(String userEmail);

    @Query("{ 'status': { $ne: 'CLOSED' } }")
    List<Conversation> findActiveConversations();

    @Query("{ 'messages': { $elemMatch: { 'sender': 'USER', 'read': false } } }")
    List<Conversation> findConversationsWithUnreadUserMessages();

    @Query("{ 'messages': { $elemMatch: { 'sender': 'ADMIN', 'read': false } } }")
    List<Conversation> findConversationsWithUnreadAdminMessages();
}
