package com.bookstore.backend.service;

import com.bookstore.backend.model.User;

import com.bookstore.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

import java.util.List;

import java.util.Optional;

@Service

public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired

    private UserRepository userRepository;

    @Autowired

    private PasswordEncoder passwordEncoder;

    // 1. REGISTRATION

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new IllegalArgumentException("Email already in use.");

        }

        // HASH THE PASSWORD BEFORE SAVING (Bcrypt)

        String hashedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(hashedPassword);

        try {

            User savedUser = userRepository.save(user);

            if (savedUser.getUser_id() == null || savedUser.getUser_id().isEmpty()) {

                logger.error("CRITICAL: User saved but ID is null! MongoDB may not be persisting data.");

                throw new RuntimeException("User ID was not generated. MongoDB save may have failed.");

            }

            // Verify the user can be retrieved

            Optional<User> verifyUser = userRepository.findById(savedUser.getUser_id());

            if (verifyUser.isEmpty()) {

                logger.error("CRITICAL: User saved but cannot be retrieved! Data may not be persisted.");

                throw new RuntimeException("User was saved but cannot be retrieved from database.");

            }

            return savedUser;

        } catch (Exception e) {

            logger.error("Failed to save user to database: {}", e.getMessage(), e);

            logger.error("Exception type: {}", e.getClass().getName());

            if (e.getCause() != null) {

                logger.error("Caused by: {}", e.getCause().getMessage());

            }

            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);

        }

    }

    // 7. LOGIN

    public Optional<User> authenticate(String email, String password) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            // Compare the plain-text password with the stored hashed password

            if (passwordEncoder.matches(password, user.getPassword())) {

                return Optional.of(user);

            }

        }

        return Optional.empty();

    }

    // 2. READ ALL

    public List<User> findAll() {

        return userRepository.findAll();

    }

    // 3. READ ONE

    public Optional<User> findById(String id) {

        return userRepository.findById(id);

    }

    // 4. FIND BY EMAIL

    public Optional<User> findByEmail(String email) {

        return userRepository.findByEmail(email);

    }

    // 5. UPDATE

    public User update(String id, User userDetails) {

        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {

            User existingUser = userOptional.get();

            existingUser.setName(userDetails.getName());

            existingUser.setAddress(userDetails.getAddress());

            existingUser.setPhoneNumber(userDetails.getPhoneNumber());

            return userRepository.save(existingUser);

        } else {

            throw new RuntimeException("User not found with id: " + id);

        }

    }

    // 7. UPDATE ROLE (Admin only - for changing user roles)

    public User updateRole(String id, String role) {

        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {

            User existingUser = userOptional.get();

            existingUser.setRole(role);

            return userRepository.save(existingUser);

        } else {

            throw new RuntimeException("User not found with id: " + id);

        }

    }

    // 6. DELETE

    public void delete(String id) {

        userRepository.deleteById(id);

    }

    // 8. CHANGE PASSWORD

    public void changePassword(String userId, String currentPassword, String newPassword) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {

            throw new RuntimeException("User not found");

        }

        User user = userOptional.get();

        // Verify current password

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {

            throw new IllegalArgumentException("Current password is incorrect");

        }

        // Validate new password

        if (newPassword == null || newPassword.isEmpty() || newPassword.length() < 6) {

            throw new IllegalArgumentException("New password must be at least 6 characters long");

        }

        // Hash and save new password

        String hashedNewPassword = passwordEncoder.encode(newPassword);

        user.setPassword(hashedNewPassword);

        userRepository.save(user);

    }

}