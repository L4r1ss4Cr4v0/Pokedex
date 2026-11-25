package com.pokedex.controller;

import com.pokedex.model.Trainer;
import com.pokedex.repository.TrainerRepository;
import java.util.List;
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

    public TrainerController(TrainerRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Trainer> list() {
        return repository.findAll(Sort.by("id"));
    }

    @GetMapping("/{id}")
    public Trainer get(@PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Treinador não encontrado: " + id));
    }
}
