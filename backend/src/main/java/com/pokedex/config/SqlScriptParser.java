package com.pokedex.config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class SqlScriptParser {
    private static final Pattern INSERT = Pattern.compile(
            "INSERT\\s+INTO\\s+`?(\\w+)`?\\s*\\([^)]*\\)\\s*VALUES\\s*(.*?);",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    private static final Pattern TUPLE = Pattern.compile("\\(((?:'(?:[^']|'')*'|[^()'])*)\\)");

    private SqlScriptParser() {
    }

    public static Map<String, List<List<String>>> parse(String script) {
        Map<String, List<List<String>>> tables = new LinkedHashMap<>();
        Matcher insert = INSERT.matcher(script);
        while (insert.find()) {
            List<List<String>> rows = tables.computeIfAbsent(
                    insert.group(1).toLowerCase(), k -> new ArrayList<>());
            Matcher tuple = TUPLE.matcher(insert.group(2));
            while (tuple.find()) {
                rows.add(splitValues(tuple.group(1)));
            }
        }
        return tables;
    }

    private static List<String> splitValues(String raw) {
        List<String> values = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean quoted = false;
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            if (c == '\'') {
                if (quoted && i + 1 < raw.length() && raw.charAt(i + 1) == '\'') {
                    current.append('\'');
                    i++;
                } else {
                    quoted = !quoted;
                }
            } else if (c == ',' && !quoted) {
                values.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        values.add(current.toString().trim());
        return values;
    }
}
