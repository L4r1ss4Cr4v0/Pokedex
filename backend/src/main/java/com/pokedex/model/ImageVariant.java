package com.pokedex.model;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public enum ImageVariant {
    NORMAL("normal"),
    RETRO("retro");

    private final String key;

    ImageVariant(String key) {
        this.key = key;
    }

    public String key() {
        return key;
    }

    public static ImageVariant from(String value) {
        for (ImageVariant variant : values()) {
            if (variant.key.equalsIgnoreCase(value)) {
                return variant;
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de imagem inválido: use 'normal' ou 'retro'");
    }
}
