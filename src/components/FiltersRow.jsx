import data from "../data/pokedex-data.json";

export default function FiltersRow({
  search,
  setSearch,
  selectedType,
  setSelectedType,
}) {
  const types = data.types;

  return (
    <section className="filters-row">
      <select
        name="types"
        id="types"
        className=""
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">Todos os tipos</option>
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="search"
        placeholder="Pesquisar Pokémon..."
        onChange={(e) => setSearch(e.target.value)}
        className=""
        value={search}
      />
    </section>
  );
}
