package com.bookstore.backend.service;

import com.bookstore.backend.model.Contact;
import com.bookstore.backend.dto.ContactRequest;
import com.bookstore.backend.dto.ContactReplyRequest;
import com.bookstore.backend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactService {

    private final ContactRepository contactRepository;

    public List<Contact> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Contact> getContactsByStatus(String status) {
        return contactRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Optional<Contact> getContactById(String id) {
        return contactRepository.findById(id);
    }

    public Contact createContact(ContactRequest request) {
        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());

        return contactRepository.save(contact);
    }

    public Contact replyToContact(String id, ContactReplyRequest request, String adminName) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isEmpty()) {
            throw new RuntimeException("Contact not found");
        }

        Contact contact = contactOpt.get();
        contact.setAdminReply(request.getAdminReply());
        contact.markAsReplied(adminName);

        return contactRepository.save(contact);
    }

    public Contact closeContact(String id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isEmpty()) {
            throw new RuntimeException("Contact not found");
        }

        Contact contact = contactOpt.get();
        contact.markAsClosed();

        return contactRepository.save(contact);
    }

    public void deleteContact(String id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(id);
    }

    public List<Contact> searchContacts(String keyword) {
        return contactRepository.searchByKeyword(keyword);
    }

    public List<Contact> getPendingContacts() {
        return contactRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }
}
