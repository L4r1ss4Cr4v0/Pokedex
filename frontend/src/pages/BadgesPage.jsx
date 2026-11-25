import { useEffect, useState } from "react";
import { getBadges } from "../services/api";
import "../css/Badges.css";

const TYPE_COLORS = {
  Rock: "#a98a5b",
  Water: "#4b9bd8",
  Electric: "#e5b92e",
  Grass: "#54a66b",
  Poison: "#a86ac1",
  Psychic: "#dc6484",
  Fire: "#e57c43",
  Ground: "#c39b57",
};

export default function BadgesPage() {
  const [search, setSearch] = useState("");
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      getBadges(search)
        .then((data) => active && setBadges(data))
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false));
    }, 220);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <main className="badges-page">
      <section className="badges-heading">
        <span className="badges-eyebrow">LIGA POKÉMON · REGIÃO DE KANTO</span>
        <h1>Insígnias de Kanto</h1>
        <p>Conheça as insígnias conquistadas nos ginásios da região.</p>
      </section>

      <label className="badge-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por insígnia, tipo, líder ou cidade..."
          aria-label="Buscar insígnias"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca">
            ×
          </button>
        )}
      </label>

      <div className="badges-results" aria-live="polite">
        {loading && <p className="status-message">Carregando insígnias...</p>}
        {error && <p className="status-message status-error">{error}</p>}
        {!loading && !error && badges.length === 0 && (
          <p className="badges-empty">Nenhuma insígnia encontrada para “{search}”.</p>
        )}
        {!loading && !error && badges.length > 0 && (
          <>
            <p className="badges-count">{badges.length} {badges.length === 1 ? "insígnia" : "insígnias"}</p>
            <div className="badges-grid">
              {badges.map((badge) => {
                const accent = TYPE_COLORS[badge.type] ?? "#ed3155";
                return (
                  <article className="badge-card" key={badge.id} style={{ "--badge-accent": accent }}>
                    <div className="badge-card-header">
                      <span className="badge-order">INSÍGNIA {String(badge.id).padStart(2, "0")}</span>
                    </div>
                    <div className="badge-medallion" aria-hidden="true">
                      <span>{String(badge.id).padStart(2, "0")}</span>
                    </div>
                    <div className="badge-card-info">
                      <h2>{badge.name}</h2>
                      <span className="badge-type">{badge.type}</span>
                      <dl className="badge-facts">
                        <div><dt>Líder</dt><dd>{badge.leader}</dd></div>
                        <div><dt>Cidade</dt><dd>{badge.city}</dd></div>
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
