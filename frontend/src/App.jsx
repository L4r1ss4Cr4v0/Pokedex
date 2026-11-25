import { Route, Routes } from "react-router-dom";
import "./css/App.css";
import PokemonHomePage from "./pages/PokemonHomePage";
import TrainersPage from "./pages/TreinersPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";
import PokemonFormPage from "./pages/PokemonFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/RequireAuth";

import Header from "./components/Header"; 
import "./css/PokemonDetails.css";


function App() {
  return (
    <>

      <Header />

      <Routes>
        <Route path="/" element={<PokemonHomePage />} />
        <Route path="/trainers" element={<TrainersPage />} />
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
    </>
    
  );
}

export default App;
