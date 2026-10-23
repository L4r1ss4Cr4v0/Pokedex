import { trainers } from "../data/pokedex-data.json";
import TrainerCard from "../components/TrainerCard";

export default function TrainersPage() {
  const columns = [[], [], []];

  trainers.forEach((trainer, index) => {
    columns[index % 3].push(trainer);
  });

  return (
    <section className="trainers-grid">
      {columns.map((column, index) => (
        <div className="trainers-column" key={index}>
          {column.map((trainer) => (
            <TrainerCard key={trainer.id} data={trainer} />
          ))}
        </div>
      ))}
    </section>
  );
}