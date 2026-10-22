import { useState } from "react";
import { pokemon } from "../data/pokedex-data.json";
import Header from "../components/Header";
import FiltersRow from "../components/FiltersRow";
import DisplayList from "../components/DisplayList";
import PokemonCard from "../components/PokemonCard";

export default function PokemonHomePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const pokemons = pokemon;

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

  return (
    <>
      <Header />
      <section id="center">
        <FiltersRow
          search={search}
          setSearch={setSearch}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </section>
      {filteredPokemons.length > 0 ? (
        <DisplayList itens={filteredPokemons} Element={PokemonCard} />
      ) : (
        <span className="flex justify-center items-center">Não encontrado</span>
      )}
    </>
  );
}
