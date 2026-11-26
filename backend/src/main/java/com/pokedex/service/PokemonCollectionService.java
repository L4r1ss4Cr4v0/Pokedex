package com.pokedex.service;

import com.pokedex.dto.PokemonCollectionRequest;
import com.pokedex.dto.PokemonCollectionResponse;
import com.pokedex.model.AppUser;
import com.pokedex.model.Pokemon;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.UserRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PokemonCollectionService {
    private final UserRepository userRepository;
    private final PokemonRepository pokemonRepository;

    public PokemonCollectionService(UserRepository userRepository, PokemonRepository pokemonRepository) {
        this.userRepository = userRepository;
        this.pokemonRepository = pokemonRepository;
    }

    public PokemonCollectionResponse get(String username) {
        return PokemonCollectionResponse.from(findUser(username));
    }

    public PokemonCollectionResponse update(String username, PokemonCollectionRequest request) {
        AppUser user = findUser(username);
        List<Integer> favorites = uniqueIds(request.favoritePokemonIds(), "favoritos");
        List<Integer> team = uniqueIds(request.teamPokemonIds(), "equipe");

        if (team.size() > 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A equipe pode ter no máximo 6 Pokémon");
        }

        Set<Integer> requestedIds = new HashSet<>(favorites);
        requestedIds.addAll(team);
        Set<Integer> existingIds = new HashSet<>();
        for (Pokemon pokemon : pokemonRepository.findAllById(requestedIds)) {
            existingIds.add(pokemon.getId());
        }
        if (existingIds.size() != requestedIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A coleção contém um Pokémon inexistente");
        }

        user.setFavoritePokemonIds(favorites);
        user.setTeamPokemonIds(team);
        return PokemonCollectionResponse.from(userRepository.save(user));
    }

    private AppUser findUser(String username) {
        return userRepository.findByUsername(UserService.normalize(username))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private static List<Integer> uniqueIds(List<Integer> ids, String label) {
        if (ids == null || ids.stream().anyMatch(id -> id == null || id <= 0)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IDs inválidos em " + label);
        }
        List<Integer> uniqueIds = new ArrayList<>(new LinkedHashSet<>(ids));
        if (uniqueIds.size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não repita Pokémon em " + label);
        }
        return List.copyOf(uniqueIds);
    }
}
