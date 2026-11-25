
const attributes = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defesa" },
  { key: "specialAttack", label: "Ataque especial" },
  { key: "specialDefense", label: "Defesa especial" },
  { key: "speed", label: "Velocidade" },
];

export default function StatsBar({ stats }) {
  const total = attributes.reduce(
    (sum, attribute) => sum + stats[attribute.key],
    0
  );

  return (
    <section className="details-stats-section">
      <div className="details-stats-heading">
        <h2>Atributos base</h2>
        <span>TOTAL {total}</span>
      </div>

      <div className="details-stats-list">
        {attributes.map((attribute) => {
          const value = stats[attribute.key];

          return (
            <div className="details-stat-row" key={attribute.key}>
              <span className="details-stat-name">
                {attribute.label}
              </span>

              <span className="details-stat-number">
                {value}
              </span>

              <div className="details-stat-track">
                <div
                  className={`details-stat-progress ${
                    value >= 60 ? "high" : "low"
                  }`}
                  style={{
                    width: `${Math.min(value, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="details-stats-caption">
        Valores base da espécie. Barras em escala de 0 a 100.
      </p>
    </section>
  );
}
