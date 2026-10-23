
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Header.css";

function Header() {
  const [lightMode, setLightMode] = useState(
    () => localStorage.getItem("pokedex-theme") === "light"
  );

  useEffect(() => {
    document.body.classList.toggle("light-mode", lightMode);

    localStorage.setItem(
      "pokedex-theme",
      lightMode ? "light" : "dark"
    );
  }, [lightMode]);

  function toggleTheme() {
    setLightMode((prev) => !prev);
  }

  return (
    <header className="header">
      <div className="header-container">

        <div className="header-logo">
          <img
            src="/imgs/pokebola.png"
            alt="Pokébola"
            className="logo-img"
          />

          <div className="logo-text">
            <h2>Pokédex</h2>
            <p>Explore o universo Pokémon</p>
          </div>
        </div>

        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Pokédex
          </NavLink>

          <NavLink
            to="/trainers"
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Treinadores
          </NavLink>
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            lightMode
              ? "Ativar modo escuro"
              : "Ativar modo claro"
          }
        >
          {lightMode ? "🌙 Modo escuro" : "☀️ Modo claro"}
        </button>

        <div className="header-status">
          <span className="status-dot"></span>
          KANTO · 151
        </div>

      </div>
    </header>
  );
}

export default Header;
