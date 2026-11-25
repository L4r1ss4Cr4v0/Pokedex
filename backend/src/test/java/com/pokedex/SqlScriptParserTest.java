package com.pokedex;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.pokedex.config.SqlScriptParser;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class SqlScriptParserTest {
    @Test
    void parsesAllTablesFromScript() throws IOException {
        String sql = new String(new ClassPathResource("Script_Pokedex.sql")
                .getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        Map<String, List<List<String>>> tables = SqlScriptParser.parse(sql);

        assertEquals(151, tables.get("pokemon").size());
        assertEquals(18, tables.get("types").size());
        assertEquals(12, tables.get("trainers").size());
        assertEquals(List.of("25", "Pikachu", "35", "55", "30", "50", "40", "90"),
                tables.get("pokemon").get(24));
        assertEquals(List.of("4", "Lt. Surge", "3"), tables.get("trainers").get(3));
        assertEquals("Farfetch'd", tables.get("pokemon").get(82).get(1));
    }
}
