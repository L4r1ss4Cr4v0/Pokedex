import { useEffect, useState } from "react";
import { getPokemons, getTrainers } from "../services/api";
import TrainerCard from "../components/TrainerCard";
import BackButton from "../components/BackButton";
import "../css/PokemonForm.css";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getTrainers(), getPokemons()])
      .then(([trainerList, pokemonList]) => {
        setTrainers(trainerList);
        setPokemons(pokemonList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-message">Carregando treinadores...</p>;
  if (error) return <p className="status-message status-error">{error}</p>;

  const columns = [[], [], []];

  trainers.forEach((trainer, index) => {
    columns[index % 3].push(trainer);
  });

  return (
    <>
      <div className="back-row">
        <BackButton to="/" />
      </div>

      <section className="trainers-grid">
        {columns.map((column, index) => (
          <div className="trainers-column" key={index}>
            {column.map((trainer) => (
              <TrainerCard key={trainer.id} data={trainer} pokemons={pokemons} />
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
