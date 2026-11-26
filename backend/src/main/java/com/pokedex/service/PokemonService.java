package com.pokedex.service;

import com.pokedex.model.Pokemon;
import com.pokedex.model.Trainer;
import com.pokedex.model.TypeRef;
import com.pokedex.repository.PokemonImageRepository;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.TypeRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PokemonService {
    private final PokemonRepository pokemonRepository;
    private final PokemonImageRepository imageRepository;
    private final TypeRepository typeRepository;
    private final MongoTemplate mongoTemplate;

    public PokemonService(PokemonRepository pokemonRepository,
                          PokemonImageRepository imageRepository,
                          TypeRepository typeRepository,
                          MongoTemplate mongoTemplate) {
        this.pokemonRepository = pokemonRepository;
        this.imageRepository = imageRepository;
        this.typeRepository = typeRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Pokemon> findAll(String name, Integer typeId) {
        Query query = new Query().with(Sort.by("id"));
        if (name != null && !name.isBlank()) {
            query.addCriteria(Criteria.where("name").regex(Pattern.quote(name.trim()), "i"));
        }
        if (typeId != null) {
            query.addCriteria(Criteria.where("types.id").is(typeId));
        }
        return mongoTemplate.find(query, Pokemon.class);
    }

    public Pokemon findById(Integer id) {
        return pokemonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pokémon não encontrado: " + id));
    }

    public Pokemon create(Pokemon pokemon) {
        pokemon.setName(pokemon.getName().trim());
        pokemon.setTypes(resolveTypes(pokemon.getTypes()));
        pokemon.setImageVersion(null);
        pokemon.setRetroImageVersion(null);

        if (pokemon.getId() == null) {
            pokemon.setId(nextId());
        } else if (pokemonRepository.existsById(pokemon.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Já existe um Pokémon com o id " + pokemon.getId());
        }
        ensureUniqueName(pokemon);
        return pokemonRepository.save(pokemon);
    }

    public Pokemon update(Integer id, Pokemon pokemon) {
        Pokemon existing = findById(id);
        pokemon.setId(id);
        pokemon.setImageVersion(existing.getImageVersion());
        pokemon.setRetroImageVersion(existing.getRetroImageVersion());
        pokemon.setName(pokemon.getName().trim());
        pokemon.setTypes(resolveTypes(pokemon.getTypes()));
        ensureUniqueName(pokemon);
        return pokemonRepository.save(pokemon);
    }

    public void delete(Integer id) {
        findById(id);
        pokemonRepository.deleteById(id);
        imageRepository.deleteByPokemonId(id);
        mongoTemplate.updateMulti(
                new Query(Criteria.where("pokemonIds").is(id)),
                new Update().pull("pokemonIds", id),
                Trainer.class);
        mongoTemplate.updateMulti(
                new Query(new Criteria().orOperator(
                        Criteria.where("favoritePokemonIds").is(id),
                        Criteria.where("teamPokemonIds").is(id))),
                new Update().pull("favoritePokemonIds", id).pull("teamPokemonIds", id),
                "users");
    }

    private int nextId() {
        return pokemonRepository.findTopByOrderByIdDesc()
                .map(p -> p.getId() + 1)
                .orElse(1);
    }

    private void ensureUniqueName(Pokemon pokemon) {
        pokemonRepository.findByNameIgnoreCase(pokemon.getName())
                .filter(existing -> !existing.getId().equals(pokemon.getId()))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "Já existe um Pokémon chamado " + existing.getName());
                });
    }

    private List<TypeRef> resolveTypes(List<TypeRef> requested) {
        Map<Integer, TypeRef> resolved = new LinkedHashMap<>();
        for (TypeRef ref : requested) {
            var type = typeRepository.findById(ref.id())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Tipo inexistente: " + ref.id()));
            resolved.put(type.getId(), new TypeRef(type.getId(), type.getName()));
        }
        return List.copyOf(resolved.values());
    }
}
