
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPokemonImageUrl } from "../services/pokemonImage";
import "../css/TrainerCard.css";

export default function TrainerCard({ data, pokemons, badges = [] }) {
  const [expanded, setExpanded] = useState(false);

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

  const trainer = data;
  const isRetro = theme === "retro";
  const badgeIds = trainer.badgeIds ?? Array.from(
    { length: Math.min(Math.max(Number(trainer.badges) || 0, 0), badges.length) },
    (_, index) => index + 1,
  );
  const trainerBadges = badgeIds
    .map((id) => badges.find((badge) => Number(badge.id) === Number(id)))
    .filter(Boolean);

  const trainerImages = {
    "Team Rocket": "teamrocket.png",
    "Lt. Surge": "ltsurge.png",
    Gary: "blue.png",
  };

  const imageFile =
    trainerImages[trainer.name] ||
    `${trainer.name.toLowerCase()}.png`;

  const url =
    `https://play.pokemonshowdown.com/sprites/trainers/${imageFile}`;

  const trainerPokemons = trainer.pokemonIds
    .map((id) => pokemons.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <article
      className={`trainer-card ${expanded ? "expanded" : ""}`}
    >
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
          {badgeIds.length} {badgeIds.length === 1 ? "insígnia" : "insígnias"} ·{" "}
          {trainer.pokemonIds.length} Pokémon
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
          <section className="trainer-badges">
            <h3>Insígnias conquistadas <span>{trainerBadges.length}</span></h3>
            {trainerBadges.length > 0 ? (
              <div className="trainer-badge-list">
                {trainerBadges.map((badge) => (
                  <div className="trainer-badge-item" key={badge.id}>
                    <span className={`trainer-badge-mark badge-type-${badge.type.toLowerCase()}`} aria-hidden="true">
                      {String(badge.id).padStart(2, "0")}
                    </span>
                    <span className="trainer-badge-info">
                      <strong>{badge.name}</strong>
                      <small>{badge.leader} · {badge.city}</small>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="trainer-no-badges">Nenhuma insígnia registrada.</p>
            )}
          </section>

          <h3>Equipe Pokémon</h3>

          <div className="trainer-pokemon-grid">
            {trainerPokemons.map((p) => (
              <Link
                key={p.id}
                to={`/pokemon/${p.id}`}
                className="trainer-pokemon-item"
              >
                <img
                  src={getPokemonImageUrl(p, isRetro)}
                  alt={p.name}
                  loading="lazy"
                  className={
                    isRetro ? "retro-team-sprite" : ""
                  }
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
