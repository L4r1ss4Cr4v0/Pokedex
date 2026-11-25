package com.pokedex;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonImage;
import com.pokedex.repository.PokemonImageRepository;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.service.PokemonImageService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

class PokemonImageServiceTest {
    private static final byte[] PNG_HEADER = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};

    private final PokemonRepository pokemonRepository = mock(PokemonRepository.class);
    private final PokemonImageRepository imageRepository = mock(PokemonImageRepository.class);
    private final PokemonImageService service = new PokemonImageService(pokemonRepository, imageRepository);
    private Pokemon pokemon;

    @BeforeEach
    void setUp() {
        pokemon = new Pokemon();
        pokemon.setId(152);
        when(pokemonRepository.findById(152)).thenReturn(Optional.of(pokemon));
        when(pokemonRepository.save(any(Pokemon.class))).thenAnswer(call -> call.getArgument(0));
    }

    private static byte[] png(int totalSize) {
        byte[] data = new byte[totalSize];
        System.arraycopy(PNG_HEADER, 0, data, 0, PNG_HEADER.length);
        return data;
    }

    private static MockMultipartFile file(String name, String declaredType, byte[] content) {
        return new MockMultipartFile("file", name, declaredType, content);
    }

    @Test
    void savesPngAndBumpsTheCorrectVersion() {
        Pokemon saved = service.save(152, "retro", file("sprite.png", "image/png", png(64)));

        ArgumentCaptor<PokemonImage> captor = ArgumentCaptor.forClass(PokemonImage.class);
        verify(imageRepository).save(captor.capture());
        assertEquals("152:retro", captor.getValue().getId());
        assertEquals("image/png", captor.getValue().getContentType());
        assertEquals(64, captor.getValue().getData().length);

        assertNotNull(saved.getRetroImageVersion());
        assertNull(saved.getImageVersion());
    }

    @Test
    void normalVariantOnlyTouchesTheNormalVersion() {
        Pokemon saved = service.save(152, "normal", file("foto.png", "image/png", png(64)));

        assertNotNull(saved.getImageVersion());
        assertNull(saved.getRetroImageVersion());
    }

    @Test
    void detectsTypeByContentNotByDeclaredHeader() {
        byte[] jpeg = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0};

        service.save(152, "normal", file("foto.png", "image/png", jpeg));

        ArgumentCaptor<PokemonImage> captor = ArgumentCaptor.forClass(PokemonImage.class);
        verify(imageRepository).save(captor.capture());
        assertEquals("image/jpeg", captor.getValue().getContentType());
    }

    @Test
    void rejectsSvgEvenWhenItClaimsToBePng() {
        byte[] svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>".getBytes();

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.save(152, "normal", file("x.png", "image/png", svg)));

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ex.getStatusCode());
        verify(imageRepository, never()).save(any());
    }

    @Test
    void rejectsFilesOverTwoMegabytes() {
        byte[] big = png((int) PokemonImageService.MAX_BYTES + 1);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.save(152, "normal", file("grande.png", "image/png", big)));

        assertEquals(HttpStatus.PAYLOAD_TOO_LARGE, ex.getStatusCode());
        verify(imageRepository, never()).save(any());
    }

    @Test
    void acceptsAFileExactlyAtTheLimit() {
        byte[] atLimit = png((int) PokemonImageService.MAX_BYTES);

        service.save(152, "normal", file("limite.png", "image/png", atLimit));

        verify(imageRepository).save(any(PokemonImage.class));
    }

    @Test
    void rejectsEmptyFile() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.save(152, "normal", file("vazio.png", "image/png", new byte[0])));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void rejectsUnknownVariant() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.save(152, "sepia", file("a.png", "image/png", png(16))));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void rejectsUnknownPokemon() {
        when(pokemonRepository.findById(999)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.save(999, "normal", file("a.png", "image/png", png(16))));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deleteRemovesImageAndClearsVersion() {
        pokemon.setRetroImageVersion(123L);
        pokemon.setImageVersion(456L);

        Pokemon result = service.delete(152, "retro");

        verify(imageRepository).deleteById("152:retro");
        assertNull(result.getRetroImageVersion());
        assertEquals(456L, result.getImageVersion());
    }

    @Test
    void getFailsWhenThereIsNoImage() {
        when(imageRepository.findById("152:normal")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.get(152, "normal"));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertEquals("Imagem não encontrada", ex.getReason());
    }
}
