package com.booktracker.controller;

import com.booktracker.model.User;
import com.booktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // POST /api/auth/signup
    // body: { "username": "...", "email": "...", "password": "..." }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        if (username == null || username.isBlank()
                || email == null || email.isBlank()
                || password == null || password.isBlank()) {
            return error(HttpStatus.BAD_REQUEST, "Username, email and password are all required.");
        }

        if (userRepository.existsByUsername(username)) {
            return error(HttpStatus.CONFLICT, "That username is already taken.");
        }

        if (userRepository.existsByEmail(email)) {
            return error(HttpStatus.CONFLICT, "That email is already registered.");
        }

        User user = new User(username, email, passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(toSafeUser(user));
    }

    // POST /api/auth/login
    // body: { "username": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return error(HttpStatus.BAD_REQUEST, "Username and password are required.");
        }

        Optional<User> found = userRepository.findByUsername(username);

        if (found.isEmpty() || !passwordEncoder.matches(password, found.get().getPassword())) {
            return error(HttpStatus.UNAUTHORIZED, "Incorrect username or password.");
        }

        return ResponseEntity.ok(toSafeUser(found.get()));
    }

    // Never send the password hash back to the browser.
    private Map<String, Object> toSafeUser(User user) {
        Map<String, Object> safe = new HashMap<>();
        safe.put("id", user.getId());
        safe.put("username", user.getUsername());
        safe.put("email", user.getEmail());
        return safe;
    }

    private ResponseEntity<?> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
