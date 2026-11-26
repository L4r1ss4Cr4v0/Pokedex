import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import PokemonHomePage from "./pages/PokemonHomePage";
import TrainersPage from "./pages/TreinersPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";
import PokemonFormPage from "./pages/PokemonFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BadgesPage from "./pages/BadgesPage";
import TeamPage from "./pages/TeamPage";
import RequireAuth from "./components/RequireAuth";
import { PokemonCollectionProvider } from "./contexts/PokemonCollectionContext";

import Header from "./components/Header"; 
import "./css/PokemonDetails.css";
import "./css/LightModeContrast.css";


function App() {
  return (
    <PokemonCollectionProvider>
      <Header />
      <Routes>
        <Route path="/" element={<PokemonHomePage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/pokemon/new"
          element={
            <RequireAuth>
              <PokemonFormPage />
            </RequireAuth>
          }
        />
        <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
        <Route
          path="/pokemon/:id/edit"
          element={
            <RequireAuth>
              <PokemonFormPage />
            </RequireAuth>
          }
        />
      </Routes>
    </PokemonCollectionProvider>
    
  );
}

export default App;
