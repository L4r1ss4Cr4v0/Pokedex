package com.pokedex.service;

import com.pokedex.dto.TokenResponse;
import com.pokedex.dto.UserResponse;
import com.pokedex.model.AppUser;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final JwtEncoder encoder;
    private final Duration lifetime;

    public TokenService(JwtEncoder encoder,
                        @Value("${app.jwt.expiration-minutes:120}") long expirationMinutes) {
        this.encoder = encoder;
        this.lifetime = Duration.ofMinutes(expirationMinutes);
    }

    public TokenResponse issue(AppUser user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("pokedex-api")
                .issuedAt(now)
                .expiresAt(now.plus(lifetime))
                .subject(user.getUsername())
                .claim("name", user.getName())
                .claim("roles", List.of(user.getRole()))
                .build();

        String token = encoder.encode(
                JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
                .getTokenValue();

        return new TokenResponse(token, "Bearer", lifetime.toSeconds(), UserResponse.from(user));
    }
}
