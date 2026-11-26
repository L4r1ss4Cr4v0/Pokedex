package com.pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trainers")
public class Trainer {
    @Id
    private Integer id;
    private String name;
    private Integer badges;
    private List<Integer> badgeIds;
    private List<Integer> pokemonIds;

    public Trainer() {
    }

    public Trainer(Integer id, String name, Integer badges, List<Integer> badgeIds, List<Integer> pokemonIds) {
        this.id = id;
        this.name = name;
        this.badges = badges;
        this.badgeIds = badgeIds;
        this.pokemonIds = pokemonIds;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBadges() {
        return badges;
    }

    public void setBadges(Integer badges) {
        this.badges = badges;
    }

    public List<Integer> getBadgeIds() {
        return badgeIds;
    }

    public void setBadgeIds(List<Integer> badgeIds) {
        this.badgeIds = badgeIds;
    }

    public List<Integer> getPokemonIds() {
        return pokemonIds;
    }

    public void setPokemonIds(List<Integer> pokemonIds) {
        this.pokemonIds = pokemonIds;
    }
}
