package com.pokedex.dto;

import com.pokedex.model.Badge;

public record BadgeResponse(Integer id, String name, String type, String leader, String city) {
    public static BadgeResponse from(Badge badge) {
        return new BadgeResponse(badge.getId(), badge.getName(), badge.getType(), badge.getLeader(), badge.getCity());
    }
}
