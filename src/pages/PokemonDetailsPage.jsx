import { useParams } from "react-router-dom";
import { pokemon as data } from "../data/pokedex-data.json";
import { colorTypes } from "../constants/colorTypes";

export default function PokemonDetailsPage() {
  const { id } = useParams();
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

  const pokemon = data[id - 1];

  return (
    <>
      <section id="center">
        <a href="/">Voltar</a>
        <article className="pokemon-card">
          <div className="header-card">
            <span className="number">#{pokemon.id}</span>
          </div>

          <img src={url} alt={pokemon.name} />

          <div className="main-info-card">
            <h2 className="title">{pokemon.name}</h2>
          </div>

          <div className="tags-list">
            {pokemon.types.map((tag) => {
              return (
                <span
                  key={tag.id}
                  className={"tag"}
                  style={{ backgroundColor: colorTypes[tag.id].color }}
                >
                  {tag.name}
                </span>
              );
            })}
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
      </section>
    </>
  );
}
