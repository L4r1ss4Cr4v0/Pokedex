package com.pokedex.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class AppUser {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String name;
    private String passwordHash;
    private String role;
    private Instant createdAt;
    private List<Integer> favoritePokemonIds = new ArrayList<>();
    private List<Integer> teamPokemonIds = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<Integer> getFavoritePokemonIds() {
        return favoritePokemonIds;
    }

    public void setFavoritePokemonIds(List<Integer> favoritePokemonIds) {
        this.favoritePokemonIds = favoritePokemonIds;
    }

    public List<Integer> getTeamPokemonIds() {
        return teamPokemonIds;
    }

    public void setTeamPokemonIds(List<Integer> teamPokemonIds) {
        this.teamPokemonIds = teamPokemonIds;
    }
}
