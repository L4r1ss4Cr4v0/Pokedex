package com.pokedex.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres")
        String name,

        @NotBlank(message = "O usuário é obrigatório")
        @Size(min = 3, max = 30, message = "O usuário deve ter entre 3 e 30 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._-]+$",
                message = "O usuário só pode ter letras, números, ponto, hífen e sublinhado")
        String username,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres")
        String password) {
}
