import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img
            src="/imgs/pokebola.png"
            alt="Pokebola"
            className="logo-img"
          ></img>
        </div>
        <div className="logo-text">
          <h2>Pokédex</h2>
        </div>
        <nav className="header-nav">
          <a href="/" className="nav-active">
            Pokedex
          </a>
          <a href="/trainers">Treinadores</a>
        </nav>

        <div className="header-status">
          <span className="status-dot"></span>
          KANTO . 151
        </div>
      </div>
    </header>
  );
}

export default Header;
