package com.pokedex;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.pokedex.config.SecurityConfig;
import com.pokedex.controller.PokemonImageController;
import com.pokedex.exception.GlobalExceptionHandler;
import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonImage;
import com.pokedex.service.PokemonImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PokemonImageController.class)
@Import({GlobalExceptionHandler.class, SecurityConfig.class})
class PokemonImageControllerTest {
    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3};

    @Autowired
    MockMvc mvc;

    @MockBean
    PokemonImageService service;

    @MockBean
    JwtDecoder jwtDecoder;

    private static MockMultipartFile file() {
        return new MockMultipartFile("file", "sprite.png", "image/png", PNG);
    }

    @Test
    void getIsPublicAndServesBytesWithTheStoredType() throws Exception {
        PokemonImage image = new PokemonImage();
        image.setContentType("image/png");
        image.setData(PNG);
        when(service.get(152, "retro")).thenReturn(image);

        mvc.perform(get("/api/pokemons/152/image/retro"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("image/png"))
                .andExpect(content().bytes(PNG))
                .andExpect(header().string("Cache-Control", org.hamcrest.Matchers.containsString("immutable")));
    }

    @Test
    void uploadRequiresAToken() throws Exception {
        mvc.perform(multipart(HttpMethod.PUT, "/api/pokemons/152/image/retro").file(file()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadWorksWithAToken() throws Exception {
        Pokemon updated = new Pokemon();
        updated.setId(152);
        updated.setRetroImageVersion(99L);
        when(service.save(eq(152), eq("retro"), any())).thenReturn(updated);

        mvc.perform(multipart(HttpMethod.PUT, "/api/pokemons/152/image/retro").file(file()).with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(152))
                .andExpect(jsonPath("$.retroImageVersion").value(99));
    }

    @Test
    void deleteRequiresAToken() throws Exception {
        mvc.perform(delete("/api/pokemons/152/image/normal")).andExpect(status().isUnauthorized());
    }
}
