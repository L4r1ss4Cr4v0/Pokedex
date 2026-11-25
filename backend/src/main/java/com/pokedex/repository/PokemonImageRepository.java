package com.pokedex.repository;

import com.pokedex.model.PokemonImage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonImageRepository extends MongoRepository<PokemonImage, String> {
    void deleteByPokemonId(Integer pokemonId);
}
