package com.bookstore.backend.config;

import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Check if admin user already exists
            if (userRepository.findByEmail("admin@bookstore.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@bookstore.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setRole("ADMIN");
                admin.setCreatedAt(LocalDateTime.now());
                
                User savedAdmin = userRepository.save(admin);
                
                // Verify the user was saved
                if (savedAdmin.getUser_id() == null) {
                    logger.error("Admin user save returned null ID - data may not have been persisted!");
                }
                
                System.out.println("=========================================");
                System.out.println("Admin user created successfully!");
                System.out.println("Email: admin@bookstore.com");
                System.out.println("Password: admin123");
                System.out.println("=========================================");
            }
        } catch (Exception e) {
            logger.error("DataInitializer: Error creating admin user", e);
            System.err.println("ERROR: Failed to create admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

