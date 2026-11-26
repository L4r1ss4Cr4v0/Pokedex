import { describe, expect, it } from "vitest";
import { customImageUrl } from "./api";
import {
  getPokemonImageUrl,
  KANTO_LIMIT,
  PLACEHOLDER_IMAGE,
} from "./pokemonImage";

describe("getPokemonImageUrl", () => {
  it("uses the official image for a Kanto Pokémon", () => {
    expect(getPokemonImageUrl({ id: 25 })).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png",
    );
  });

  it("uses the custom image and its version when available", () => {
    expect(getPokemonImageUrl({ id: 152, imageVersion: 3 })).toBe(
      customImageUrl(152, "normal", 3),
    );
  });

  it("uses the official retro image for Kanto Pokémon", () => {
    expect(getPokemonImageUrl({ id: 1 }, true)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/1.png",
    );
  });

  it("prefers a custom retro image and falls back to the normal image", () => {
    expect(
      getPokemonImageUrl(
        { id: KANTO_LIMIT + 1, imageVersion: 2, retroImageVersion: 4 },
        true,
      ),
    ).toBe(customImageUrl(KANTO_LIMIT + 1, "retro", 4));

    expect(
      getPokemonImageUrl(
        { id: KANTO_LIMIT + 1, imageVersion: 2 },
        true,
      ),
    ).toBe(customImageUrl(KANTO_LIMIT + 1, "normal", 2));
  });

  it("shows a placeholder for a new Pokémon without an uploaded image", () => {
    expect(getPokemonImageUrl({ id: KANTO_LIMIT + 1 })).toBe(
      PLACEHOLDER_IMAGE,
    );
    expect(getPokemonImageUrl({ id: KANTO_LIMIT + 1 }, true)).toBe(
      PLACEHOLDER_IMAGE,
    );
  });
});
