package com.pokedex.config;

import com.pokedex.model.Badge;
import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonType;
import com.pokedex.model.Stats;
import com.pokedex.model.Trainer;
import com.pokedex.model.TypeRef;
import com.pokedex.repository.BadgeRepository;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.TrainerRepository;
import com.pokedex.repository.TypeRepository;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final PokemonRepository pokemonRepository;
    private final TypeRepository typeRepository;
    private final TrainerRepository trainerRepository;
    private final BadgeRepository badgeRepository;
    private final Resource script;
    private final boolean enabled;

    public DatabaseSeeder(PokemonRepository pokemonRepository,
                          TypeRepository typeRepository,
                          TrainerRepository trainerRepository,
                          BadgeRepository badgeRepository,
                          @Value("${app.seed.script}") Resource script,
                          @Value("${app.seed.enabled:true}") boolean enabled) {
        this.pokemonRepository = pokemonRepository;
        this.typeRepository = typeRepository;
        this.trainerRepository = trainerRepository;
        this.badgeRepository = badgeRepository;
        this.script = script;
        this.enabled = enabled;
    }

    @Override
    public void run(String... args) throws IOException {
        if (!enabled) {
            return;
        }
        try {
            seed();
        } catch (DataAccessException ex) {
            log.error("Não foi possível acessar o MongoDB. Verifique MONGODB_URI (usuário, senha e hosts), "
                    + "se o seu IP está liberado em Network Access no Atlas e se a internet está ativa. "
                    + "Causa: {}", rootMessage(ex));
            throw ex;
        }
    }

    private static String rootMessage(Throwable ex) {
        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage();
    }

    private void seed() throws IOException {
        boolean needsTypes = typeRepository.count() == 0;
        boolean needsPokemons = pokemonRepository.count() == 0;
        boolean needsTrainers = trainerRepository.count() == 0;
        boolean needsBadges = badgeRepository.count() == 0;
        if (!needsTypes && !needsPokemons && !needsTrainers && !needsBadges) {
            log.info("Banco já populado; seed ignorado.");
            return;
        }

        Map<String, List<List<String>>> tables = SqlScriptParser.parse(readScript());

        Map<Integer, String> typeNames = new TreeMap<>();
        for (List<String> row : tables.getOrDefault("types", List.of())) {
            typeNames.put(Integer.parseInt(row.get(0)), row.get(1));
        }

        if (needsTypes) {
            typeRepository.saveAll(typeNames.entrySet().stream()
                    .map(e -> new PokemonType(e.getKey(), e.getValue())).toList());
            log.info("{} tipos importados.", typeNames.size());
        }
        if (needsPokemons) {
            importPokemons(tables, typeNames);
        }
        if (needsTrainers) {
            importTrainers(tables);
        }
        if (needsBadges) {
            importBadges(tables);
        }
    }

    private void importPokemons(Map<String, List<List<String>>> tables, Map<Integer, String> typeNames) {
        Map<Integer, List<TypeRef>> typesByPokemon = new TreeMap<>();
        for (List<String> row : tables.getOrDefault("rel_pokemon_type", List.of())) {
            int pokemonId = Integer.parseInt(row.get(0));
            int typeId = Integer.parseInt(row.get(1));
            typesByPokemon.computeIfAbsent(pokemonId, k -> new ArrayList<>())
                    .add(new TypeRef(typeId, typeNames.get(typeId)));
        }

        List<Pokemon> pokemons = new ArrayList<>();
        for (List<String> row : tables.getOrDefault("pokemon", List.of())) {
            Pokemon pokemon = new Pokemon();
            pokemon.setId(Integer.parseInt(row.get(0)));
            pokemon.setName(row.get(1));
            pokemon.setStats(new Stats(
                    Integer.parseInt(row.get(2)), Integer.parseInt(row.get(3)),
                    Integer.parseInt(row.get(4)), Integer.parseInt(row.get(5)),
                    Integer.parseInt(row.get(6)), Integer.parseInt(row.get(7))));
            pokemon.setTypes(typesByPokemon.getOrDefault(pokemon.getId(), List.of()));
            pokemons.add(pokemon);
        }
        pokemons.sort(Comparator.comparing(Pokemon::getId));
        pokemonRepository.saveAll(pokemons);
        log.info("{} Pokémon importados.", pokemons.size());
    }

    private void importTrainers(Map<String, List<List<String>>> tables) {
        Map<Integer, List<Integer>> teams = new TreeMap<>();
        for (List<String> row : tables.getOrDefault("rel_trainer_pokemon", List.of())) {
            teams.computeIfAbsent(Integer.parseInt(row.get(0)), k -> new ArrayList<>())
                    .add(Integer.parseInt(row.get(1)));
        }

        Map<Integer, List<Integer>> badgesByTrainer = new TreeMap<>();
        for (List<String> row : tables.getOrDefault("rel_trainer_badge", List.of())) {
            badgesByTrainer.computeIfAbsent(Integer.parseInt(row.get(0)), k -> new ArrayList<>())
                    .add(Integer.parseInt(row.get(1)));
        }

        List<Trainer> trainers = new ArrayList<>();
        for (List<String> row : tables.getOrDefault("trainers", List.of())) {
            int id = Integer.parseInt(row.get(0));
            int badgeCount = Integer.parseInt(row.get(2));
            List<Integer> badgeIds = badgesByTrainer.getOrDefault(id, legacyBadgeIds(badgeCount));
            trainers.add(new Trainer(id, row.get(1), badgeCount, badgeIds,
                    teams.getOrDefault(id, List.of())));
        }
        trainerRepository.saveAll(trainers);
        log.info("{} treinadores importados.", trainers.size());
    }

    private static List<Integer> legacyBadgeIds(int count) {
        return java.util.stream.IntStream.rangeClosed(1, Math.min(Math.max(count, 0), 8))
                .boxed().toList();
    }

    private void importBadges(Map<String, List<List<String>>> tables) {
        List<Badge> badges = tables.getOrDefault("badges", List.of()).stream()
                .map(row -> new Badge(Integer.parseInt(row.get(0)), row.get(1), row.get(2), row.get(3), row.get(4)))
                .toList();
        badgeRepository.saveAll(badges);
        log.info("{} insígnias importadas.", badges.size());
    }

    private String readScript() throws IOException {
        try (InputStream in = script.getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
