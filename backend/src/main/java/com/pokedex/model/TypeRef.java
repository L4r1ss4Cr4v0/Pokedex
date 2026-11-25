package com.pokedex.model;

import jakarta.validation.constraints.NotNull;

public record TypeRef(@NotNull Integer id, String name) {
}
