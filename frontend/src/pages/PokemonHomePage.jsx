import { useEffect, useState } from "react";
import { getPokemons, getTypes } from "../services/api";
import FiltersRow from "../components/FiltersRow";
import DisplayList from "../components/DisplayList";
import PokemonCard from "../components/PokemonCard";
import { usePokemonCollection } from "../contexts/PokemonCollectionContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../css/PokemonForm.css";

export default function PokemonHomePage() {
  const collection = usePokemonCollection();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPokemons(), getTypes()])
      .then(([pokemonList, typeList]) => {
        setPokemons(pokemonList);
        setTypes(typeList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      search.length === 0 ||
      String(pokemon.id) === search ||
      pokemon.name.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      selectedType === "" ||
      pokemon.types.some((type) => String(type.id) === selectedType);

    return matchesSearch && matchesType;
  });

  function handleFavorite(pokemonId) {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    collection.toggleFavorite(pokemonId);
  }

  const FavoritePokemonCard = ({ data }) => (
    <PokemonCard
      data={data}
      isFavorite={collection.isFavorite(data.id)}
      onToggleFavorite={handleFavorite}
      actionDisabled={collection.saving || collection.loading}
    />
  );

  return (
    <>
      <section id="center">
        <FiltersRow
          search={search}
          setSearch={setSearch}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          types={types}
        />
      </section>

      {loading && <p className="status-message">Carregando Pokémon...</p>}
      {error && <p className="status-message status-error">{error}</p>}
      {collection.error && (
        <p className="status-message status-error" role="alert">{collection.error}</p>
      )}

      {!loading &&
        !error &&
        (filteredPokemons.length > 0 ? (
          <DisplayList itens={filteredPokemons} Element={FavoritePokemonCard} />
        ) : (
          <span className="flex justify-center items-center">
            Não encontrado
          </span>
        ))}
    </>
  );
}
