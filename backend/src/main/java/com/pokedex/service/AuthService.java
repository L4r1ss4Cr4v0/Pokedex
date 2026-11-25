package com.pokedex.service;

import com.pokedex.dto.LoginRequest;
import com.pokedex.dto.TokenResponse;
import com.pokedex.model.AppUser;
import com.pokedex.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    private final String dummyHash;

    public AuthService(UserRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.dummyHash = passwordEncoder.encode("senha-inexistente");
    }

    public TokenResponse login(LoginRequest request) {
        AppUser user = repository.findByUsername(UserService.normalize(request.username())).orElse(null);

        String hash = user != null ? user.getPasswordHash() : dummyHash;
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);

        if (user == null || !passwordMatches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos");
        }
        return tokenService.issue(user);
    }
}
