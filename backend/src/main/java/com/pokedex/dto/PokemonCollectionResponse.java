package com.pokedex.dto;

import com.pokedex.model.AppUser;
import java.util.List;

public record PokemonCollectionResponse(List<Integer> favoritePokemonIds, List<Integer> teamPokemonIds) {
    public static PokemonCollectionResponse from(AppUser user) {
        List<Integer> favorites = user.getFavoritePokemonIds() == null
                ? List.of() : List.copyOf(user.getFavoritePokemonIds());
        List<Integer> team = user.getTeamPokemonIds() == null
                ? List.of() : List.copyOf(user.getTeamPokemonIds());
        return new PokemonCollectionResponse(favorites, team);
    }
}
