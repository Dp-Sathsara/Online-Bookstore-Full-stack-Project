package com.bookstore.backend.repository;

import com.bookstore.backend.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {

    List<Contact> findByStatusOrderByCreatedAtDesc(String status);

    List<Contact> findAllByOrderByCreatedAtDesc();

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Contact> findByNameContaining(String name);

    @Query("{ 'email': { $regex: ?0, $options: 'i' } }")
    List<Contact> findByEmailContaining(String email);

    @Query("{ 'subject': { $regex: ?0, $options: 'i' } }")
    List<Contact> findBySubjectContaining(String subject);

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }, { 'subject': { $regex: ?0, $options: 'i' } }, { 'message': { $regex: ?0, $options: 'i' } } ] }")
    List<Contact> searchByKeyword(String keyword);
}
