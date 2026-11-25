package com.pokedex.dto;

import com.pokedex.model.AppUser;

public record UserResponse(String username, String name, String role) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getUsername(), user.getName(), user.getRole());
    }
}
