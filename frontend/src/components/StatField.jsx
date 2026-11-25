import { useId } from "react";

const STAT_MIN = 1;
const STAT_MAX = 255;

export default function StatField({ label, value, onChange, accent }) {
  const inputId = useId();
  const numeric = Number(value) || 0;
  const percent = Math.min(
    100,
    Math.max(0, ((numeric - STAT_MIN) / (STAT_MAX - STAT_MIN)) * 100),
  );

  function handleText(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
    onChange(digits === "" ? "" : String(Math.min(STAT_MAX, Number(digits))));
  }

  function handleBlur() {
    if (!value || Number(value) < STAT_MIN) onChange(String(STAT_MIN));
  }

  return (
    <div
      className="stat-field"
      style={{ "--stat-pct": `${percent}%`, "--stat-accent": accent }}
    >
      <div className="stat-top">
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          className="stat-number"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={handleText}
          onBlur={handleBlur}
        />
      </div>

      <input
        className="stat-slider"
        type="range"
        min={STAT_MIN}
        max={STAT_MAX}
        value={Math.max(STAT_MIN, numeric)}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`${label} (controle deslizante)`}
      />
    </div>
  );
}
