package com.pokedex;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.pokedex.config.JwtConfig;
import com.pokedex.dto.TokenResponse;
import com.pokedex.model.AppUser;
import com.pokedex.service.TokenService;
import java.time.Instant;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtException;

class TokenServiceTest {
    private static final String SECRET = "um-segredo-de-teste-com-mais-de-32-caracteres";

    private final JwtConfig config = new JwtConfig();
    private final SecretKey key = config.jwtSecretKey(SECRET);
    private final JwtDecoder decoder = config.jwtDecoder(key);

    private static AppUser ana() {
        AppUser user = new AppUser();
        user.setUsername("ana");
        user.setName("Ana Souza");
        user.setRole("USER");
        return user;
    }

    @Test
    void issuedTokenIsValidAndCarriesUserData() {
        TokenService service = new TokenService(config.jwtEncoder(key), 120);

        TokenResponse response = service.issue(ana());
        Jwt jwt = decoder.decode(response.accessToken());

        assertEquals("Bearer", response.tokenType());
        assertEquals(7200, response.expiresIn());
        assertEquals("ana", jwt.getSubject());
        assertEquals("Ana Souza", jwt.getClaimAsString("name"));
        assertEquals(java.util.List.of("USER"), jwt.getClaimAsStringList("roles"));
        assertTrue(jwt.getExpiresAt().isAfter(Instant.now()));
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        JwtConfig other = new JwtConfig();
        SecretKey otherKey = other.jwtSecretKey("outro-segredo-diferente-com-mais-de-32-caracteres");
        String forged = new TokenService(other.jwtEncoder(otherKey), 120).issue(ana()).accessToken();

        assertThrows(JwtException.class, () -> decoder.decode(forged));
    }

    @Test
    void expiredTokenIsRejected() {
        Instant issuedAt = Instant.now().minusSeconds(600);
        String expired = config.jwtEncoder(key).encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder()
                        .issuer("pokedex-api")
                        .issuedAt(issuedAt)
                        .expiresAt(issuedAt.plusSeconds(300))
                        .subject("ana")
                        .build()))
                .getTokenValue();

        assertThrows(JwtException.class, () -> decoder.decode(expired));
    }

    @Test
    void shortSecretIsRefused() {
        assertThrows(IllegalStateException.class, () -> config.jwtSecretKey("curto"));
    }
}
