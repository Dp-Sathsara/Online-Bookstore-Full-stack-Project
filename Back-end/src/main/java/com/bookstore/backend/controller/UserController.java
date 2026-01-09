package com.bookstore.backend.controller;

import com.bookstore.backend.dto.LoginResponse;

import com.bookstore.backend.dto.RoleUpdateRequest;

import com.bookstore.backend.dto.PasswordChangeRequest;

import com.bookstore.backend.model.User;

import com.bookstore.backend.service.UserService;

import com.bookstore.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

import java.util.List;

import java.util.Optional;

@RestController

@RequestMapping("/api/users")

public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired

    private UserService userService;

    @Autowired

    private JwtUtil jwtUtil;

    // 1. REGISTRATION

    @PostMapping("/register")

    public ResponseEntity<?> registerUser(@RequestBody User user) {

        try {

            User newUser = userService.registerUser(user);

            // Verify the user was actually saved with an ID

            if (newUser.getUser_id() == null || newUser.getUser_id().isEmpty()) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                        .body(java.util.Map.of("message",

                                "User registration failed: User ID was not generated. Check MongoDB connection."));

            }

            // Verify the user can be retrieved from database

            if (!userService.findByEmail(newUser.getEmail()).isPresent()) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                        .body(java.util.Map.of("message",

                                "User registration failed: User was not persisted to database."));

            }

            return new ResponseEntity<>(newUser, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)

                    .body(java.util.Map.of("message", e.getMessage())); // 409 Conflict (Email Exists)

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of("message", "Registration failed: " + e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of("message", "Unexpected error during registration: " + e.getMessage()));

        }

    }

    // 6. LOGIN

    @PostMapping("/login")

    public ResponseEntity<?> loginUser(@RequestBody User userDetails) {

        String email = userDetails.getEmail();

        String password = userDetails.getPassword();

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)

                    .body(java.util.Map.of("message", "Email and password are required"));

        }

        Optional<User> userOptional = userService.authenticate(email, password);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            String token = jwtUtil.generateToken(user.getEmail(), user.getUser_id(), user.getRole()); // token delivery

            LoginResponse loginResponse = new LoginResponse(

                    token,

                    user.getUser_id(),

                    user.getEmail(),

                    user.getName(),

                    user.getRole());

            return ResponseEntity.ok(loginResponse);

        } else {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                    .body(java.util.Map.of("message", "Invalid email or password"));

        }

    }

    // 2. READ ALL (ADMIN ONLY)

    @GetMapping

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<User> getAllUsers() {

        return userService.findAll();

    }

    // 3. READ ONE

    @GetMapping("/{id}")

    public ResponseEntity<User> getUserById(@PathVariable String id) {

        return userService.findById(id)

                .map(ResponseEntity::ok)

                .orElse(ResponseEntity.notFound().build());

    }

    // 4. UPDATE

    @PutMapping("/{id}")

    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody User userDetails) {

        try {

            User updatedUser = userService.update(id, userDetails);

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();

        }

    }

    // 5. DELETE (ADMIN ONLY)

    @DeleteMapping("/{id}")

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {

        userService.delete(id);

        return ResponseEntity.noContent().build();

    }

    // 6. UPDATE ROLE

    @PutMapping("/{id}/role")

    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestBody RoleUpdateRequest request) {

        try {

            User updatedUser = userService.updateRole(id, request.getRole());

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();

        }

    }

    // 7. CREATE ADMIN USER (Manual admin creation endpoint)

    @PostMapping("/create-admin")

    public ResponseEntity<String> createAdminUser() {

        try {

            if (userService.findByEmail("admin@bookstore.com").isPresent()) {

                return ResponseEntity.status(HttpStatus.CONFLICT)

                        .body("Admin user already exists with email: admin@bookstore.com");

            }

            User admin = new User();

            admin.setName("Admin User");

            admin.setEmail("admin@bookstore.com");

            admin.setPassword("admin123");

            admin.setRole("ADMIN");

            User savedAdmin = userService.registerUser(admin);

            // Verify the user was saved

            if (savedAdmin.getUser_id() != null) {

                return ResponseEntity.status(HttpStatus.CREATED)

                        .body("Admin user created successfully!\nEmail: admin@bookstore.com\nPassword: admin123\nUser ID: "

                                + savedAdmin.getUser_id());

            } else {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                        .body("Admin user creation failed: User ID is null. Check MongoDB connection.");

            }

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body("Failed to create admin user: " + e.getMessage() + "\nStack trace: "

                            + java.util.Arrays.toString(e.getStackTrace()));

        }

    }

    // 8. TEST MONGODB CONNECTION (Debug endpoint)

    @GetMapping("/test-db")

    public ResponseEntity<?> testDatabase() {

        try {

            long userCount = userService.findAll().size();

            return ResponseEntity.ok(java.util.Map.of(

                    "status", "connected",

                    "database", "bookstore_db",

                    "userCount", userCount,

                    "message", "MongoDB connection is working"));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of(

                            "status", "error",

                            "message", "MongoDB connection failed: " + e.getMessage()));

        }

    }

    // 9. GET CURRENT USER PROFILE

    @GetMapping("/me")

    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {

        try {

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                        .body(java.util.Map.of("message", "Authorization token required"));

            }

            String token = authHeader.substring(7);

            String userId = jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));

            if (userId == null) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                        .body(java.util.Map.of("message", "Invalid token"));

            }

            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isPresent()) {

                User user = userOptional.get();

                // Don't send password

                user.setPassword(null);

                return ResponseEntity.ok(user);

            } else {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)

                        .body(java.util.Map.of("message", "User not found"));

            }

        } catch (Exception e) {

            logger.error("Error getting current user: {}", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of("message", "Error retrieving user profile"));

        }

    }

    // 10. CHANGE PASSWORD

    @PutMapping("/{id}/change-password")

    public ResponseEntity<?> changePassword(

            @PathVariable String id,

            @RequestBody PasswordChangeRequest request,

            @RequestHeader("Authorization") String authHeader) {

        try {

            // Verify the user is changing their own password or is admin

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                        .body(java.util.Map.of("message", "Authorization token required"));

            }

            String token = authHeader.substring(7);

            String currentUserId = jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));

            String role = jwtUtil.extractClaim(token, claims -> claims.get("role", String.class));

            // Only allow users to change their own password, or admins to change any

            // password

            if (!id.equals(currentUserId) && !"ADMIN".equals(role)) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN)

                        .body(java.util.Map.of("message", "You can only change your own password"));

            }

            userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());

            return ResponseEntity.ok(java.util.Map.of("message", "Password changed successfully"));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)

                    .body(java.util.Map.of("message", e.getMessage()));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)

                    .body(java.util.Map.of("message", e.getMessage()));

        } catch (Exception e) {

            logger.error("Error changing password: {}", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of("message", "Error changing password"));

        }

    }

    // 11. TEST MONGODB WRITE (Debug endpoint to test direct write)

    @PostMapping("/test-write")

    public ResponseEntity<?> testMongoWrite() {

        try {

            // Create a test user

            User testUser = new User();

            testUser.setName("Test User");

            testUser.setEmail("test@test.com");

            testUser.setPassword("test123");

            testUser.setRole("USER");

            User saved = userService.registerUser(testUser);

            if (saved.getUser_id() != null) {

                // Try to retrieve it

                var retrieved = userService.findByEmail("test@test.com");

                if (retrieved.isPresent()) {

                    // Delete the test user

                    userService.delete(saved.getUser_id());

                    return ResponseEntity.ok(java.util.Map.of(

                            "status", "success",

                            "message", "MongoDB write and read test passed!",

                            "userId", saved.getUser_id()));

                } else {

                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                            .body(java.util.Map.of(

                                    "status", "error",

                                    "message", "User was saved but cannot be retrieved!"));

                }

            } else {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                        .body(java.util.Map.of(

                                "status", "error",

                                "message", "User was saved but ID is null!"));

            }

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                    .body(java.util.Map.of(

                            "status", "error",

                            "message", "MongoDB write test failed: " + e.getMessage(),

                            "exception", e.getClass().getName()));

        }

    }

}