
import { useParams, Link } from "react-router-dom";
import { pokemon as data } from "../data/pokedex-data.json";
import { colorTypes } from "../constants/colorTypes";
import StatsBar from "../components/StatsBar";

import "../css/StatsBar.css";
import "../css/PokemonDetails.css";

export default function PokemonDetailsPage() {
  const { id } = useParams();

  const pokemon = data.find((p) => p.id === Number(id));

  if (!pokemon) {
    return (
      <section id="center">
        <h2>Pokémon não encontrado</h2>
        <Link to="/">Voltar para a Pokédex</Link>
      </section>
    );
  }

  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`;

  const pokemonColor =
    colorTypes[pokemon.types[0]?.id]?.color || "#6b8f78";

  return (
    <section id="center">
      <Link to="/">Voltar</Link>

      <article
        className="pokemon-card"
        style={{ "--pokemon-color": pokemonColor }}
      >
        <div className="header-card">
          <span className="number">#{pokemon.id}</span>
        </div>

        <img src={url} alt={pokemon.name} />

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
      </article>
    </section>
  );
}
