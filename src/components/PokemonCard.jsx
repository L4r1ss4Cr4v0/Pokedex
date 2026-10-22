import { colorTypes } from "../constants/colorTypes";

export default function PokemonCard({ data }) {
  const pokemon = data;

  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`;

  return (
    <article className="pokemon-card">
      <div className="header-card">
        <span className="number">#{pokemon.id}</span>
      </div>
      <img src={url} alt={pokemon.name} />
      <div className="main-info-card">
        <h2 className="title">{pokemon.name}</h2>
        <button
          className="link-btn"
          onClick={() => (window.location.href = `/pokemon/${pokemon.id}`)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-square-arrow-out-up-right preview-icon"
          >
            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
            <path d="m21 3-9 9" />
            <path d="M15 3h6v6" />
          </svg>
        </button>
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
  );
}
