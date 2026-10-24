
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Header.css";
import "../css/RetroMode.css";

function Header() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("pokedex-theme");

    return ["dark", "light", "retro"].includes(saved)
      ? saved
      : "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    document.body.classList.toggle("retro-mode", theme === "retro");

    localStorage.setItem("pokedex-theme", theme);

    window.dispatchEvent(
      new CustomEvent("pokedex-theme-change", {
        detail: { theme },
      })
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  }

  function toggleRetro() {
    setTheme((current) =>
      current === "retro" ? "dark" : "retro"
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          
<img
  src={
    theme === "retro"
      ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
      : "/imgs/pokebola.png"
  }
  alt="Pokébola"
  className="logo-img"
/>


          <div className="logo-text">
            <h2>
              {theme === "retro" ? "POKÉDEX '96" : "Pokédex"}
            </h2>
            <p>
              {theme === "retro"
                ? "KANTO - GAME BOY"
                : "Explore o universo Pokémon"}
            </p>
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

        <div className="theme-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Ativar modo escuro"
                : "Ativar modo claro"
            }
          >
            {theme === "light"
              ? "🌙 Modo escuro"
              : "☀️ Modo claro"}
          </button>

          <button
            type="button"
            className="theme-toggle retro-toggle"
            onClick={toggleRetro}
            aria-pressed={theme === "retro"}
          >
            {theme === "retro"
              ? "↩ Sair do passado"
              : "🎮 Volta no Tempo"}
          </button>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          KANTO · 151
        </div>
      </div>
    </header>
  );
}

export default Header;
