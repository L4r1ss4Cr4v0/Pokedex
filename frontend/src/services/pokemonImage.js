import { customImageUrl } from "./api";

const SPRITES =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const PLACEHOLDER_IMAGE = "/imgs/pokebola.png";

export const KANTO_LIMIT = 151;

export function getPokemonImageUrl(pokemon, retro = false) {
  const { id, imageVersion, retroImageVersion } = pokemon;
  const isKanto = id <= KANTO_LIMIT;

  if (retro) {
    if (retroImageVersion) return customImageUrl(id, "retro", retroImageVersion);
    if (isKanto) {
      return `${SPRITES}/versions/generation-i/red-blue/transparent/${id}.png`;
    }
    if (imageVersion) return customImageUrl(id, "normal", imageVersion);
    return PLACEHOLDER_IMAGE;
  }

  if (imageVersion) return customImageUrl(id, "normal", imageVersion);
  if (isKanto) return `${SPRITES}/other/home/${id}.png`;
  return PLACEHOLDER_IMAGE;
}
