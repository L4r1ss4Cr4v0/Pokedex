import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAuthToken, getPokemonCollection, updatePokemonCollection } from "../services/api";

const EMPTY_COLLECTION = { favoritePokemonIds: [], teamPokemonIds: [] };
const PokemonCollectionContext = createContext(null);

export function PokemonCollectionProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const authKey = getAuthToken();
  const [collection, setCollection] = useState(EMPTY_COLLECTION);
  const [loadedAuthKey, setLoadedAuthKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!isLoggedIn || !authKey) {
      return () => {
        active = false;
      };
    }

    getPokemonCollection()
      .then((saved) => {
        if (active) {
          setError("");
          setCollection({
            favoritePokemonIds: saved.favoritePokemonIds ?? [],
            teamPokemonIds: saved.teamPokemonIds ?? [],
          });
          setLoadedAuthKey(authKey);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setLoadedAuthKey(authKey);
        }
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, authKey]);

  async function saveCollection(nextCollection, previousCollection = collection) {
    if (!isLoggedIn) return false;
    setSaving(true);
    setError("");
    setCollection(nextCollection);

    try {
      const saved = await updatePokemonCollection(nextCollection);
      setCollection({
        favoritePokemonIds: saved.favoritePokemonIds ?? [],
        teamPokemonIds: saved.teamPokemonIds ?? [],
      });
      return true;
    } catch (requestError) {
      setCollection(previousCollection);
      setError(requestError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  function toggleFavorite(pokemonId) {
    const favoritePokemonIds = collection.favoritePokemonIds.includes(pokemonId)
      ? collection.favoritePokemonIds.filter((id) => id !== pokemonId)
      : [...collection.favoritePokemonIds, pokemonId];
    return saveCollection({ ...collection, favoritePokemonIds }, collection);
  }

  function toggleTeam(pokemonId) {
    const alreadyInTeam = collection.teamPokemonIds.includes(pokemonId);
    if (!alreadyInTeam && collection.teamPokemonIds.length >= 6) {
      setError("Sua equipe já tem 6 Pokémon. Remova um antes de adicionar outro.");
      return Promise.resolve(false);
    }

    const teamPokemonIds = alreadyInTeam
      ? collection.teamPokemonIds.filter((id) => id !== pokemonId)
      : [...collection.teamPokemonIds, pokemonId];
    return saveCollection({ ...collection, teamPokemonIds }, collection);
  }

  function moveTeamPokemon(pokemonId, offset) {
    const currentIndex = collection.teamPokemonIds.indexOf(pokemonId);
    const targetIndex = currentIndex + offset;
    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= collection.teamPokemonIds.length
    ) {
      return Promise.resolve(false);
    }

    const teamPokemonIds = [...collection.teamPokemonIds];
    [teamPokemonIds[currentIndex], teamPokemonIds[targetIndex]] = [
      teamPokemonIds[targetIndex],
      teamPokemonIds[currentIndex],
    ];
    return saveCollection({ ...collection, teamPokemonIds }, collection);
  }

  const isCollectionLoaded = isLoggedIn && authKey === loadedAuthKey;
  const currentCollection = isCollectionLoaded ? collection : EMPTY_COLLECTION;
  const value = {
    favoritePokemonIds: currentCollection.favoritePokemonIds,
    teamPokemonIds: currentCollection.teamPokemonIds,
    loading: isLoggedIn && !isCollectionLoaded,
    saving,
    error,
    clearError: () => setError(""),
    isFavorite: (pokemonId) => currentCollection.favoritePokemonIds.includes(pokemonId),
    isInTeam: (pokemonId) => currentCollection.teamPokemonIds.includes(pokemonId),
    toggleFavorite,
    toggleTeam,
    moveTeamPokemon,
  };

  return (
    <PokemonCollectionContext.Provider value={value}>
      {children}
    </PokemonCollectionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePokemonCollection() {
  const value = useContext(PokemonCollectionContext);
  if (!value) {
    throw new Error("usePokemonCollection deve ser usado dentro de PokemonCollectionProvider");
  }
  return value;
}
