package com.pokedex.controller;

import com.pokedex.dto.PokemonCollectionRequest;
import com.pokedex.dto.PokemonCollectionResponse;
import com.pokedex.service.PokemonCollectionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me/pokemon-collection")
public class PokemonCollectionController {
    private final PokemonCollectionService service;

    public PokemonCollectionController(PokemonCollectionService service) {
        this.service = service;
    }

    @GetMapping
    public PokemonCollectionResponse get(Authentication authentication) {
        return service.get(authentication.getName());
    }

    @PutMapping
    public PokemonCollectionResponse update(Authentication authentication,
                                            @Valid @RequestBody PokemonCollectionRequest request) {
        return service.update(authentication.getName(), request);
    }
}
