package com.pokedex;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.pokedex.config.SecurityConfig;
import com.pokedex.controller.PokemonController;
import com.pokedex.exception.GlobalExceptionHandler;
import com.pokedex.model.Pokemon;
import com.pokedex.service.PokemonService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PokemonController.class)
@Import({GlobalExceptionHandler.class, SecurityConfig.class})
class PokemonControllerValidationTest {
    private static final String VALID_BODY = """
            {"name":"Teste","stats":{"hp":10,"attack":10,"defense":10,
             "specialAttack":10,"specialDefense":10,"speed":10},
             "types":[{"id":1}]}""";

    @Autowired
    MockMvc mvc;

    @MockBean
    PokemonService service;

    @MockBean
    JwtDecoder jwtDecoder;

    @Test
    void readsArePublic() throws Exception {
        when(service.findAll(any(), any())).thenReturn(List.of());

        mvc.perform(get("/api/pokemons")).andExpect(status().isOk());
    }

    @Test
    void writesRequireAToken() throws Exception {
        mvc.perform(post("/api/pokemons")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/pokemons/1")).andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsInvalidToken() throws Exception {
        when(jwtDecoder.decode("token-invalido")).thenThrow(new BadJwtException("assinatura inválida"));

        mvc.perform(post("/api/pokemons")
                        .header("Authorization", "Bearer token-invalido")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsInvalidBody() throws Exception {
        mvc.perform(post("/api/pokemons")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"types\":[]}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.stats").exists())
                .andExpect(jsonPath("$.errors.types").exists());
    }

    @Test
    void createsValidPokemonWhenAuthenticated() throws Exception {
        Pokemon saved = new Pokemon();
        saved.setId(152);
        when(service.create(any())).thenReturn(saved);

        mvc.perform(post("/api/pokemons")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(152));
    }
}
