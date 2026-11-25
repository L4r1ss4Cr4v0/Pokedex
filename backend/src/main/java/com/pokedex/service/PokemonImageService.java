package com.pokedex.service;

import com.pokedex.model.ImageVariant;
import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonImage;
import com.pokedex.repository.PokemonImageRepository;
import com.pokedex.repository.PokemonRepository;
import java.io.IOException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PokemonImageService {
    public static final long MAX_BYTES = 2L * 1024 * 1024;

    private final PokemonRepository pokemonRepository;
    private final PokemonImageRepository imageRepository;

    public PokemonImageService(PokemonRepository pokemonRepository, PokemonImageRepository imageRepository) {
        this.pokemonRepository = pokemonRepository;
        this.imageRepository = imageRepository;
    }

    public Pokemon save(Integer pokemonId, String variantName, MultipartFile file) {
        ImageVariant variant = ImageVariant.from(variantName);
        Pokemon pokemon = findPokemon(pokemonId);

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie um arquivo de imagem no campo 'file'");
        }
        if (file.getSize() > MAX_BYTES) {
            throw tooLarge();
        }

        byte[] data;
        try {
            data = file.getBytes();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não foi possível ler o arquivo enviado");
        }

        String contentType = detectContentType(data);
        if (contentType == null) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Formato não suportado: envie uma imagem PNG, JPG, GIF ou WebP");
        }

        PokemonImage image = new PokemonImage();
        image.setId(PokemonImage.idFor(pokemonId, variant.key()));
        image.setPokemonId(pokemonId);
        image.setVariant(variant.key());
        image.setContentType(contentType);
        image.setData(data);
        image.setUpdatedAt(Instant.now());
        imageRepository.save(image);

        setVersion(pokemon, variant, image.getUpdatedAt().toEpochMilli());
        return pokemonRepository.save(pokemon);
    }

    public PokemonImage get(Integer pokemonId, String variantName) {
        ImageVariant variant = ImageVariant.from(variantName);
        return imageRepository.findById(PokemonImage.idFor(pokemonId, variant.key()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada"));
    }

    public Pokemon delete(Integer pokemonId, String variantName) {
        ImageVariant variant = ImageVariant.from(variantName);
        Pokemon pokemon = findPokemon(pokemonId);

        imageRepository.deleteById(PokemonImage.idFor(pokemonId, variant.key()));
        setVersion(pokemon, variant, null);
        return pokemonRepository.save(pokemon);
    }

    private Pokemon findPokemon(Integer pokemonId) {
        return pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pokémon não encontrado: " + pokemonId));
    }

    private static void setVersion(Pokemon pokemon, ImageVariant variant, Long version) {
        if (variant == ImageVariant.RETRO) {
            pokemon.setRetroImageVersion(version);
        } else {
            pokemon.setImageVersion(version);
        }
    }

    private static ResponseStatusException tooLarge() {
        return new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "A imagem deve ter no máximo 2 MB");
    }

    static String detectContentType(byte[] d) {
        if (d.length >= 8 && (d[0] & 0xFF) == 0x89 && d[1] == 'P' && d[2] == 'N' && d[3] == 'G'
                && d[4] == 0x0D && d[5] == 0x0A && d[6] == 0x1A && d[7] == 0x0A) {
            return "image/png";
        }
        if (d.length >= 3 && (d[0] & 0xFF) == 0xFF && (d[1] & 0xFF) == 0xD8 && (d[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (d.length >= 6 && d[0] == 'G' && d[1] == 'I' && d[2] == 'F' && d[3] == '8'
                && (d[4] == '7' || d[4] == '9') && d[5] == 'a') {
            return "image/gif";
        }
        if (d.length >= 12 && d[0] == 'R' && d[1] == 'I' && d[2] == 'F' && d[3] == 'F'
                && d[8] == 'W' && d[9] == 'E' && d[10] == 'B' && d[11] == 'P') {
            return "image/webp";
        }
        return null;
    }
}
