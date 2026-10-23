
import { useState } from "react";
import { Link } from "react-router-dom";
import { pokemon } from "../data/pokedex-data.json";
import "../css/TrainerCard.css";

export default function TrainerCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  const trainer = data;

  const trainerImages = {
    "Team Rocket": "teamrocket.png",
    "Lt. Surge": "ltsurge.png",
    "Gary": "blue.png",
  };

  const imageFile =
    trainerImages[trainer.name] ||
    `${trainer.name.toLowerCase()}.png`;

  const url =
    `https://play.pokemonshowdown.com/sprites/trainers/${imageFile}`;

  const trainerPokemons = trainer.pokemonIds
    .map((id) => pokemon.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <article className={`trainer-card ${expanded ? "expanded" : ""}`}>
      <button
        type="button"
        className="trainer-toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span className="trainer-number">
          #{trainer.id}
        </span>

        <img
          className="img-trainer"
          src={url}
          alt={trainer.name}
        />

        <h2 className="trainer-name">
          {trainer.name}
        </h2>

        <span className="trainer-summary">
          {trainer.badges} insígnias · {trainer.pokemonIds.length} Pokémon
        </span>

        <span className="trainer-expand-label">
          {expanded ? "Ocultar equipe" : "Ver equipe"}
          <span aria-hidden="true">
            {expanded ? "⌃" : "⌄"}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="trainer-details">
          <h3>Equipe Pokémon</h3>

          <div className="trainer-pokemon-grid">
            {trainerPokemons.map((p) => (
              <Link
                key={p.id}
                to={`/pokemon/${p.id}`}
                className="trainer-pokemon-item"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${p.id}.png`}
                  alt={p.name}
                  loading="lazy"
                />

                <span>{p.name}</span>
                <small>#{p.id}</small>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
