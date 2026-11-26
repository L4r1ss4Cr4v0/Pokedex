import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRetroMode } from "../hooks/useRetroMode";
import { usePokemonCollection } from "../contexts/PokemonCollectionContext";
import { getPokemons } from "../services/api";
import { getPokemonImageUrl } from "../services/pokemonImage";
import { colorTypes } from "../constants/colorTypes";
import "../css/Team.css";

export default function TeamPage() {
  const { isLoggedIn } = useAuth();
  const isRetro = useRetroMode();
  const navigate = useNavigate();
  const collection = usePokemonCollection();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;
    getPokemons()
      .then((items) => active && setPokemons(items))
      .catch((error) => active && setPageError(error.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const pokemonById = useMemo(
    () => new Map(pokemons.map((pokemon) => [pokemon.id, pokemon])),
    [pokemons],
  );
  const team = collection.teamPokemonIds
    .map((id) => pokemonById.get(id))
    .filter(Boolean);
  const favorites = collection.favoritePokemonIds
    .map((id) => pokemonById.get(id))
    .filter(Boolean);

  if (!isLoggedIn) {
    return (
      <main className="team-page">
        <section className="team-login-card">
          <h1>Monte sua equipe Pokémon</h1>
          <p>Entre na sua conta para salvar seus favoritos e montar uma equipe de até seis Pokémon.</p>
          <Link className="team-primary-link" to="/login">Entrar</Link>
          <Link className="team-secondary-link" to="/register">Criar conta</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="team-page">
      <header className="team-heading">
        <div>
          <p className="team-eyebrow">SUA JORNADA EM KANTO</p>
          <h1>Minha equipe</h1>
          <p>Escolha até seis Pokémon favoritos e organize a ordem da sua equipe.</p>
        </div>
        <div className="team-count" aria-label={`${team.length} de 6 Pokémon na equipe`}>
          <strong>{team.length}</strong><span>/ 6 Pokémon</span>
        </div>
      </header>

      {(pageError || collection.error) && (
        <p className="team-error" role="alert">{pageError || collection.error}</p>
      )}
      {(loading || collection.loading) && <p className="team-message">Carregando sua equipe...</p>}

      {!loading && !collection.loading && (
        <>
          <section className="team-section">
            <div className="team-section-heading">
              <div><h2>Equipe ativa</h2><p>A ordem pode ser alterada a qualquer momento.</p></div>
            </div>
            {team.length === 0 ? (
              <div className="team-empty">
                <span aria-hidden="true">◉</span>
                <h3>Sua equipe ainda está vazia</h3>
                <p>Favorite alguns Pokémon abaixo e adicione seus escolhidos à equipe.</p>
              </div>
            ) : (
              <ol className="team-roster">
                {team.map((pokemon, index) => (
                  <li className="team-roster-item" key={pokemon.id}>
                    <span className="team-position">{String(index + 1).padStart(2, "0")}</span>
                    <article
                      className="team-member-card"
                      style={{ "--team-accent": colorTypes[pokemon.types[0]?.id]?.color || "#79baff" }}
                    >
                      <img
                        className={isRetro ? "team-member-image retro-sprite" : "team-member-image"}
                        src={getPokemonImageUrl(pokemon, isRetro)}
                        alt={pokemon.name}
                      />
                      <div className="team-member-info">
                        <span className="team-member-number">POKÉMON #{String(pokemon.id).padStart(3, "0")}</span>
                        <h3>{pokemon.name}</h3>
                        <div className="team-member-types">
                          {pokemon.types.map((type) => (
                            <span key={type.id} style={{ "--type-color": colorTypes[type.id]?.color || "#718096" }}>
                              {type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="team-member-actions">
                        <div className="team-order-controls" aria-label={`Organizar ${pokemon.name}`}>
                          <button type="button" onClick={() => collection.moveTeamPokemon(pokemon.id, -1)} disabled={index === 0 || collection.saving} aria-label={`Mover ${pokemon.name} para cima`} title="Mover para cima">↑</button>
                          <button type="button" onClick={() => collection.moveTeamPokemon(pokemon.id, 1)} disabled={index === team.length - 1 || collection.saving} aria-label={`Mover ${pokemon.name} para baixo`} title="Mover para baixo">↓</button>
                        </div>
                        <Link className="team-detail-link" to={`/pokemon/${pokemon.id}`}>Detalhes</Link>
                        <button className="team-remove-button" type="button" onClick={() => collection.toggleTeam(pokemon.id)} disabled={collection.saving}>Remover</button>
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="team-section favorites-section">
            <div className="team-section-heading">
              <div><h2>Seus favoritos</h2><p>Escolha até seis para levar com você.</p></div>
              <span>{favorites.length} favorito{favorites.length === 1 ? "" : "s"}</span>
            </div>
            {favorites.length === 0 ? (
              <div className="team-empty compact">
                <h3>Você ainda não favoritou nenhum Pokémon</h3>
                <p>Explore a Pokédex e toque na estrela para guardar seus favoritos.</p>
                <button className="team-primary-link" type="button" onClick={() => navigate("/")}>Explorar Pokédex</button>
              </div>
            ) : (
              <div className="team-favorites-grid">
                {favorites.map((pokemon) => (
                  <article
                    className="team-favorite-card"
                    key={pokemon.id}
                    style={{ "--team-accent": colorTypes[pokemon.types[0]?.id]?.color || "#79baff" }}
                  >
                    <img
                      className={isRetro ? "team-favorite-image retro-sprite" : "team-favorite-image"}
                      src={getPokemonImageUrl(pokemon, isRetro)}
                      alt=""
                    />
                    <div className="team-favorite-info">
                      <span className="team-favorite-number">#{String(pokemon.id).padStart(3, "0")}</span>
                      <Link className="team-favorite-name" to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
                      <div className="team-favorite-types">
                        {pokemon.types.map((type) => (
                          <span key={type.id} style={{ "--type-color": colorTypes[type.id]?.color || "#718096" }}>{type.name}</span>
                        ))}
                      </div>
                      <div className="team-favorite-actions">
                        {collection.isInTeam(pokemon.id) ? (
                          <span className="team-in-team-label">✓ Na equipe</span>
                        ) : (
                          <button
                            className="team-add-button"
                            type="button"
                            onClick={() => collection.toggleTeam(pokemon.id)}
                            disabled={collection.saving || team.length >= 6}
                            title={team.length >= 6 ? "Sua equipe já tem seis Pokémon" : undefined}
                          >
                            {team.length >= 6 ? "Equipe cheia" : "+ Adicionar à equipe"}
                          </button>
                        )}
                        <button
                          className="team-unfavorite-button"
                          type="button"
                          onClick={() => collection.toggleFavorite(pokemon.id)}
                          disabled={collection.saving}
                          aria-label={`Remover ${pokemon.name} dos favoritos`}
                          title="Remover dos favoritos"
                        >
                          ★
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
