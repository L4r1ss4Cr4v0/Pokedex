
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colorTypes } from "../constants/colorTypes";
import { getPokemonImageUrl } from "../services/pokemonImage";
import "../css/PokemonCard.css";

export default function PokemonCard({
  data,
  isFavorite = false,
  onToggleFavorite,
  isInTeam = false,
  onToggleTeam,
  actionDisabled = false,
  teamActionDisabled = false,
}) {
  const pokemon = data;
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("pokedex-theme") || "dark"
  );

  useEffect(() => {
    function handleThemeChange(event) {
      setTheme(event.detail.theme);
    }

    window.addEventListener(
      "pokedex-theme-change",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "pokedex-theme-change",
        handleThemeChange
      );
    };
  }, []);

  const isRetro = theme === "retro";

  return (
    <article
      className="pokemon-card"
      style={{
        "--pokemon-color":
          colorTypes[pokemon.types[0]?.id]?.color || "#6b8f78",
      }}
    >
      <div className="header-card">
        <span className="number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        {onToggleFavorite && (
          <button
            type="button"
            className={`favorite-toggle${isFavorite ? " is-favorite" : ""}`}
            onClick={() => onToggleFavorite(pokemon.id)}
            disabled={actionDisabled}
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? "Remover dos favoritos" : "Favoritar"} ${pokemon.name}`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        )}
      </div>

      <img
        src={getPokemonImageUrl(pokemon, isRetro)}
        alt={pokemon.name}
        className={isRetro ? "retro-sprite" : ""}
      />

      <div className="main-info-card">
        <h2 className="title">{pokemon.name}</h2>

        {onToggleTeam && (
          <button
            type="button"
            className={`team-toggle${isInTeam ? " is-in-team" : ""}`}
            onClick={() => onToggleTeam(pokemon.id)}
            disabled={actionDisabled || teamActionDisabled}
          >
            {isInTeam ? "Remover da equipe" : "Adicionar à equipe"}
          </button>
        )}

        <button
          type="button"
          className="link-btn"
          onClick={() => navigate(`/pokemon/${pokemon.id}`)}
          aria-label={`Ver detalhes de ${pokemon.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-square-arrow-out-up-right preview-icon"
          >
            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
            <path d="m21 3-9 9" />
            <path d="M15 3h6v6" />
          </svg>
        </button>
      </div>

      <div className="tags-list">
        {pokemon.types.map((tag) => (
          <span
            key={tag.id}
            className="tag"
            style={{
              backgroundColor:
                colorTypes[tag.id]?.color || "#6b8f78",
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="grid-atributtes">
        <span className="atribute-title">HP</span>
        <span className="atribute-title">Ataque</span>
        <span className="atribute-title">Defesa</span>

        <span>{pokemon.stats.hp}</span>
        <span>{pokemon.stats.attack}</span>
        <span>{pokemon.stats.defense}</span>

        <span className="atribute-title">Ataque especial</span>
        <span className="atribute-title">Defesa especial</span>
        <span className="atribute-title">Velocidade</span>

        <span>{pokemon.stats.specialAttack}</span>
        <span>{pokemon.stats.specialDefense}</span>
        <span>{pokemon.stats.speed}</span>
      </div>
    </article>
  );
}
