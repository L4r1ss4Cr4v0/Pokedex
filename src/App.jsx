import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import PokemonHomePage from "./pages/PokemonHomePage";
import TrainersPage from "./pages/TreinersPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";

import Header from "./components/Header"; 
import "./css/PokemonDetails.css";


function App() {
  return (
    <>

      <Header />

      <Routes>
        <Route path="/" element={<PokemonHomePage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
      </Routes>
    </>
    
  );
}

export default App;
