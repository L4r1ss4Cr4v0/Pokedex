package com.pokedex.service;

import com.pokedex.dto.RegisterRequest;
import com.pokedex.model.AppUser;
import com.pokedex.repository.UserRepository;
import java.time.Instant;
import java.util.Locale;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser register(RegisterRequest request) {
        return create(request.username(), request.name(), request.password(), ROLE_USER);
    }

    public AppUser create(String username, String name, String rawPassword, String role) {
        String normalized = normalize(username);
        if (repository.existsByUsername(normalized)) {
            throw usernameTaken();
        }

        AppUser user = new AppUser();
        user.setUsername(normalized);
        user.setName(name.trim());
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setCreatedAt(Instant.now());

        try {
            return repository.save(user);
        } catch (DuplicateKeyException ex) {
            throw usernameTaken();
        }
    }

    public boolean exists(String username) {
        return repository.existsByUsername(normalize(username));
    }

    public AppUser findByUsername(String username) {
        return repository.findByUsername(normalize(username))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public static String normalize(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }

    private ResponseStatusException usernameTaken() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Este nome de usuário já está em uso");
    }
}
