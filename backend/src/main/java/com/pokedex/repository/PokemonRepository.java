package com.pokedex.repository;

import com.pokedex.model.Pokemon;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
    Optional<Pokemon> findTopByOrderByIdDesc();

    Optional<Pokemon> findByNameIgnoreCase(String name);
}
