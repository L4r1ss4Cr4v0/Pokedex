package com.pokedex.controller;

import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonImage;
import com.pokedex.service.PokemonImageService;
import java.time.Duration;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pokemons/{id}/image/{variant}")
public class PokemonImageController {
    private final PokemonImageService service;

    public PokemonImageController(PokemonImageService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<byte[]> get(@PathVariable Integer id, @PathVariable String variant) {
        PokemonImage image = service.get(id, variant);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(image.getData());
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Pokemon upload(@PathVariable Integer id, @PathVariable String variant,
                          @RequestPart("file") MultipartFile file) {
        return service.save(id, variant, file);
    }

    @DeleteMapping
    public Pokemon delete(@PathVariable Integer id, @PathVariable String variant) {
        return service.delete(id, variant);
    }
}
