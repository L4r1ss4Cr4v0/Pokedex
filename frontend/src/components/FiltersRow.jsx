import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function FiltersRow({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  types,
}) {
  const { isLoggedIn } = useAuth();

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
      {isLoggedIn && (
        <Link to="/pokemon/new" className="btn btn-primary">
          + Novo Pokémon
        </Link>
      )}
    </section>
  );
}
