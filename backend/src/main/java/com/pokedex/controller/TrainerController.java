package com.pokedex.controller;

import com.pokedex.model.Trainer;
import com.pokedex.repository.BadgeRepository;
import com.pokedex.repository.TrainerRepository;
import java.util.List;
import java.util.stream.IntStream;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    private final TrainerRepository repository;
    private final BadgeRepository badgeRepository;

    public TrainerController(TrainerRepository repository, BadgeRepository badgeRepository) {
        this.repository = repository;
        this.badgeRepository = badgeRepository;
    }

    @GetMapping
    public List<Trainer> list() {
        return repository.findAll(Sort.by("id")).stream().map(this::includeLegacyBadgeIds).toList();
    }

    @GetMapping("/{id}")
    public Trainer get(@PathVariable Integer id) {
        return repository.findById(id)
                .map(this::includeLegacyBadgeIds)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Treinador não encontrado: " + id));
    }

    private Trainer includeLegacyBadgeIds(Trainer trainer) {
        if (trainer.getBadgeIds() == null) {
            int badgeCount = Math.min(Math.max(trainer.getBadges() == null ? 0 : trainer.getBadges(), 0),
                    (int) badgeRepository.count());
            trainer.setBadgeIds(IntStream.rangeClosed(1, badgeCount).boxed().toList());
        }
        return trainer;
    }
}
