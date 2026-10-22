import DisplayList from "../components/DisplayList";
import FiltersRow from "../components/FiltersRow";
import Header from "../components/Header";
import TrainerCard from "../components/TrainerCard";
import { trainers } from "../data/pokedex-data.json";

export default function TrainersPage() {
  return (
    <>
      <Header />
      <DisplayList itens={trainers} Element={TrainerCard} />
    </>
  );
}
