package com.pokedex;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.pokedex.dto.LoginRequest;
import com.pokedex.dto.TokenResponse;
import com.pokedex.dto.UserResponse;
import com.pokedex.model.AppUser;
import com.pokedex.repository.UserRepository;
import com.pokedex.service.AuthService;
import com.pokedex.service.TokenService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class AuthServiceTest {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final UserRepository repository = mock(UserRepository.class);
    private final TokenService tokenService = mock(TokenService.class);
    private AuthService service;
    private AppUser ana;

    @BeforeEach
    void setUp() {
        service = new AuthService(repository, encoder, tokenService);

        ana = new AppUser();
        ana.setUsername("ana");
        ana.setName("Ana Souza");
        ana.setRole("USER");
        ana.setPasswordHash(encoder.encode("segredo1"));
    }

    @Test
    void validCredentialsIssueToken() {
        TokenResponse expected = new TokenResponse("t", "Bearer", 60, new UserResponse("ana", "Ana Souza", "USER"));
        when(repository.findByUsername("ana")).thenReturn(Optional.of(ana));
        when(tokenService.issue(ana)).thenReturn(expected);

        assertEquals(expected, service.login(new LoginRequest(" Ana ", "segredo1")));
    }

    @Test
    void wrongPasswordIsUnauthorized() {
        when(repository.findByUsername("ana")).thenReturn(Optional.of(ana));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("ana", "errada")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        verifyNoInteractions(tokenService);
    }

    @Test
    void unknownUserGetsTheSameError() {
        when(repository.findByUsername("fantasma")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("fantasma", "qualquer")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("Usuário ou senha inválidos", ex.getReason());
        verify(repository).findByUsername("fantasma");
        verifyNoInteractions(tokenService);
    }
}
