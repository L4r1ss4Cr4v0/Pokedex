package com.pokedex.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PokemonCollectionRequest(
        @NotNull List<@NotNull @Positive Integer> favoritePokemonIds,
        @NotNull @Size(max = 6) List<@NotNull @Positive Integer> teamPokemonIds) {
}
