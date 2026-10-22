import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import PokemonHomePage from "./pages/PokemonHomePage";
import TrainersPage from "./pages/TreinersPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokemonHomePage />} />
      <Route path="/trainers" element={<TrainersPage />} />
      <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
    </Routes>
  );
}

export default App;
