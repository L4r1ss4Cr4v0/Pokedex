package com.pokedex;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.pokedex.config.SecurityConfig;
import com.pokedex.controller.AuthController;
import com.pokedex.dto.TokenResponse;
import com.pokedex.dto.UserResponse;
import com.pokedex.exception.GlobalExceptionHandler;
import com.pokedex.model.AppUser;
import com.pokedex.service.AuthService;
import com.pokedex.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(AuthController.class)
@Import({GlobalExceptionHandler.class, SecurityConfig.class})
class AuthControllerTest {
    private static final String REGISTER_BODY =
            "{\"name\":\"Ana Souza\",\"username\":\"ana\",\"password\":\"segredo1\"}";
    private static final String LOGIN_BODY = "{\"username\":\"ana\",\"password\":\"segredo1\"}";

    @Autowired
    MockMvc mvc;

    @MockBean
    UserService userService;

    @MockBean
    AuthService authService;

    @MockBean
    JwtDecoder jwtDecoder;

    private static AppUser ana() {
        AppUser user = new AppUser();
        user.setUsername("ana");
        user.setName("Ana Souza");
        user.setPasswordHash("hash-que-nao-pode-vazar");
        user.setRole("USER");
        return user;
    }

    @Test
    void registerIsPublicAndNeverReturnsPassword() throws Exception {
        when(userService.register(any())).thenReturn(ana());

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(REGISTER_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("ana"))
                .andExpect(jsonPath("$.name").value("Ana Souza"))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void registerRejectsInvalidData() throws Exception {
        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"username\":\"a b\",\"password\":\"123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.username").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void registerReturnsConflictWhenUsernameIsTaken() throws Exception {
        when(userService.register(any())).thenThrow(
                new ResponseStatusException(HttpStatus.CONFLICT, "Este nome de usuário já está em uso"));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(REGISTER_BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Este nome de usuário já está em uso"));
    }

    @Test
    void loginIsPublicAndReturnsToken() throws Exception {
        when(authService.login(any())).thenReturn(new TokenResponse(
                "token.jwt.aqui", "Bearer", 7200, new UserResponse("ana", "Ana Souza", "USER")));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(LOGIN_BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("token.jwt.aqui"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.name").value("Ana Souza"));
    }

    @Test
    void loginReturnsUnauthorizedForWrongCredentials() throws Exception {
        when(authService.login(any())).thenThrow(
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(LOGIN_BODY))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Usuário ou senha inválidos"));
    }

    @Test
    void loginRejectsBlankFields() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.username").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void meRequiresToken() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsTokenOwner() throws Exception {
        when(userService.findByUsername("ana")).thenReturn(ana());

        mvc.perform(get("/api/auth/me").with(jwt().jwt(token -> token.subject("ana"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("ana"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }
}
