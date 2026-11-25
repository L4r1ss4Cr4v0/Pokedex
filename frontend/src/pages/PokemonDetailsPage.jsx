import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPokemon, deletePokemon } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import BackButton from "../components/BackButton";
import { useRetroMode } from "../hooks/useRetroMode";
import { getPokemonImageUrl } from "../services/pokemonImage";
import { colorTypes } from "../constants/colorTypes";
import StatsBar from "../components/StatsBar";

import "../css/StatsBar.css";
import "../css/PokemonDetails.css";
import "../css/PokemonForm.css";

export default function PokemonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const isRetro = useRetroMode();

  const [result, setResult] = useState({ id: null, pokemon: null, error: "" });
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;

    getPokemon(id)
      .then((pokemon) => active && setResult({ id, pokemon, error: "" }))
      .catch(
        (err) =>
          active && setResult({ id, pokemon: null, error: err.message }),
      );

    return () => {
      active = false;
    };
  }, [id]);

  const loading = result.id !== id;
  const pokemon = result.pokemon;
  const error = deleteError || result.error;

  async function handleDelete() {
    if (!window.confirm(`Excluir ${pokemon.name} da Pokédex?`)) return;

    try {
      await deletePokemon(pokemon.id);
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  if (loading) {
    return (
      <section id="center">
        <p className="status-message">Carregando...</p>
      </section>
    );
  }

  if (!pokemon) {
    return (
      <section id="center">
        <h2>Pokémon não encontrado</h2>
        {error && <p className="status-message status-error">{error}</p>}
        <BackButton to="/" label="Voltar para a Pokédex" />
      </section>
    );
  }

  const url = getPokemonImageUrl(pokemon, isRetro);

  const pokemonColor =
    colorTypes[pokemon.types[0]?.id]?.color || "#6b8f78";

  return (
    <section id="center">
      <BackButton />

      <article
        className="pokemon-card"
        style={{ "--pokemon-color": pokemonColor }}
      >
        <div className="header-card">
          <span className="number">#{pokemon.id}</span>
        </div>

        <img
          src={url}
          alt={pokemon.name}
          className={isRetro ? "retro-sprite" : ""}
        />

        <div className="main-info-card">
          <h2 className="title">{pokemon.name}</h2>
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

        <StatsBar stats={pokemon.stats} />

        {error && <p className="status-message status-error">{error}</p>}

        {isLoggedIn && (
          <div className="actions-row">
            <Link
              to={`/pokemon/${pokemon.id}/edit`}
              className="btn btn-primary"
            >
              ✏️ Editar
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              🗑️ Excluir
            </button>
          </div>
        )}
      </article>
    </section>
  );
}
