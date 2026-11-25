package com.pokedex.repository;

import com.pokedex.model.Badge;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BadgeRepository extends MongoRepository<Badge, Integer> {
    List<Badge> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrLeaderContainingIgnoreCaseOrCityContainingIgnoreCase(
            String name, String type, String leader, String city, Sort sort);
}
