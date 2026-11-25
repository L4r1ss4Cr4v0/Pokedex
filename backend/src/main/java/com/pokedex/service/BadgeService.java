package com.pokedex.service;

import com.pokedex.dto.BadgeResponse;
import com.pokedex.model.Badge;
import com.pokedex.repository.BadgeRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BadgeService {
    private final BadgeRepository repository;

    public BadgeService(BadgeRepository repository) {
        this.repository = repository;
    }

    public List<BadgeResponse> findAll(String search) {
        Sort order = Sort.by("id");
        List<Badge> badges = search == null || search.isBlank()
                ? repository.findAll(order)
                : repository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrLeaderContainingIgnoreCaseOrCityContainingIgnoreCase(
                        search.trim(), search.trim(), search.trim(), search.trim(), order);
        return badges.stream().map(BadgeResponse::from).toList();
    }

    public BadgeResponse findById(Integer id) {
        return repository.findById(id).map(BadgeResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Insígnia não encontrada: " + id));
    }
}
