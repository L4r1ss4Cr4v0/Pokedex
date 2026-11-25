import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createPokemon,
  customImageUrl,
  deletePokemonImage,
  getPokemon,
  getTypes,
  updatePokemon,
  uploadPokemonImage,
} from "../services/api";
import { KANTO_LIMIT } from "../services/pokemonImage";
import { colorTypes } from "../constants/colorTypes";
import BackButton from "../components/BackButton";
import ImagePicker from "../components/ImagePicker";
import StatField from "../components/StatField";
import "../css/PokemonForm.css";
import "../css/PokemonEditor.css";

const STAT_FIELDS = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defesa" },
  { key: "specialAttack", label: "Ataque especial" },
  { key: "specialDefense", label: "Defesa especial" },
  { key: "speed", label: "Velocidade" },
];

const EMPTY_STATS = Object.fromEntries(STAT_FIELDS.map((f) => [f.key, "50"]));

const IMAGE_LABELS = { normal: "Imagem normal", retro: "Imagem do modo retrô" };
const DEFAULT_ACCENT = "#ed3155";

export default function PokemonFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [stats, setStats] = useState(EMPTY_STATS);
  const [typeIds, setTypeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(location.state?.warning ?? "");

  const [variant, setVariant] = useState("normal");
  const [files, setFiles] = useState({ normal: null, retro: null });
  const [versions, setVersions] = useState({ normal: null, retro: null });
  const [removals, setRemovals] = useState({ normal: false, retro: false });

  useEffect(() => {
    const requests = [getTypes()];
    if (isEditing) requests.push(getPokemon(id));

    Promise.all(requests)
      .then(([typeList, pokemon]) => {
        setTypes(typeList);
        if (pokemon) {
          setName(pokemon.name);
          setStats(
            Object.fromEntries(
              STAT_FIELDS.map((f) => [f.key, String(pokemon.stats[f.key])]),
            ),
          );
          setTypeIds(pokemon.types.map((t) => t.id));
          setVersions({
            normal: pokemon.imageVersion ?? null,
            retro: pokemon.retroImageVersion ?? null,
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function toggleType(typeId) {
    setTypeIds((current) => {
      if (current.includes(typeId)) {
        return current.filter((t) => t !== typeId);
      }
      return current.length >= 2 ? current : [...current, typeId];
    });
  }

  const setFile = (key) => (file) =>
    setFiles((current) => ({ ...current, [key]: file }));

  const setRemoval = (key) => (value) =>
    setRemovals((current) => ({ ...current, [key]: value }));

  const existingUrl = (key) =>
    versions[key] ? customImageUrl(id, key, versions[key]) : null;

  const hasImage = (key) =>
    Boolean(files[key] || (versions[key] && !removals[key]));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const statValues = STAT_FIELDS.map((f) => Number(stats[f.key]));
    if (statValues.some((value) => !Number.isInteger(value) || value < 1 || value > 255)) {
      setError("Preencha todos os atributos com números inteiros de 1 a 255.");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      stats: Object.fromEntries(
        STAT_FIELDS.map((f, index) => [f.key, statValues[index]]),
      ),
      types: typeIds.map((typeId) => ({ id: typeId })),
    };

    let saved;
    try {
      saved = isEditing
        ? await updatePokemon(id, payload)
        : await createPokemon(payload);
    } catch (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    const failures = [];
    for (const key of ["normal", "retro"]) {
      try {
        if (files[key]) {
          await uploadPokemonImage(saved.id, key, files[key]);
        } else if (removals[key]) {
          await deletePokemonImage(saved.id, key);
        }
      } catch (err) {
        failures.push(`${IMAGE_LABELS[key]}: ${err.message}`);
      }
    }

    if (failures.length === 0) {
      navigate(`/pokemon/${saved.id}`, { replace: true });
      return;
    }

    const message = `O Pokémon foi salvo, mas houve problema com a imagem (${failures.join(" | ")}). Escolha a imagem de novo e salve.`;
    if (isEditing) {
      setError(message);
      setSaving(false);
    } else {
      navigate(`/pokemon/${saved.id}/edit`, {
        replace: true,
        state: { warning: message },
      });
    }
  }

  if (loading) {
    return (
      <section id="center">
        <p className="status-message">Carregando...</p>
      </section>
    );
  }

  const isKanto = isEditing && Number(id) <= KANTO_LIMIT;
  const backPath = isEditing ? `/pokemon/${id}` : "/";
  const accent = colorTypes[typeIds[0]]?.color ?? DEFAULT_ACCENT;

  return (
    <section id="center" className="editor-page">
      <BackButton to={backPath} />

      <form
        className="pokemon-editor"
        onSubmit={handleSubmit}
        style={{ "--editor-accent": accent }}
      >
        <header className="editor-title">
          <h2>{isEditing ? `Editar Pokémon #${id}` : "Novo Pokémon"}</h2>
          <p>
            {isEditing
              ? "Altere os dados, os tipos, os atributos e as imagens."
              : "Escolha a imagem, o nome, os tipos e os atributos do seu Pokémon."}
          </p>
        </header>

        <div className="editor-grid">
          <aside className="editor-card editor-media">
            <h3>Imagem</h3>

            {["normal", "retro"].map((key) => (
              <div key={key} hidden={variant !== key}>
                <ImagePicker
                  label={IMAGE_LABELS[key]}
                  file={files[key]}
                  onChange={setFile(key)}
                  existingUrl={existingUrl(key)}
                  removeExisting={removals[key]}
                  onRemoveExistingChange={setRemoval(key)}
                  pixelArt={key === "retro"}
                />
              </div>
            ))}

            <div className="variant-toggle" role="group" aria-label="Qual imagem editar">
              <button
                type="button"
                className={variant === "normal" ? "active" : ""}
                aria-pressed={variant === "normal"}
                onClick={() => setVariant("normal")}
              >
                🖼️ Imagem normal
                {hasImage("normal") && <span className="variant-dot" title="Imagem enviada" />}
              </button>
              <button
                type="button"
                className={variant === "retro" ? "active" : ""}
                aria-pressed={variant === "retro"}
                onClick={() => setVariant("retro")}
              >
                🎮 Modo retrô
                {hasImage("retro") && <span className="variant-dot" title="Imagem enviada" />}
              </button>
            </div>

            {variant === "normal" ? (
              <p className="editor-hint">
                PNG, JPG, GIF ou WebP de até 2 MB. Prefira imagem quadrada com
                fundo transparente (PNG).{" "}
                {isKanto
                  ? "Sem uma imagem enviada, é usada a imagem oficial."
                  : "Sem uma imagem enviada, aparece a Pokébola."}
              </p>
            ) : (
              <div className="pixel-guide">
                <p>
                  <strong>Envie uma imagem pixelada, no estilo antigo da
                  franquia</strong> (Pokémon Red/Blue no Game Boy). Ela aparece
                  quando o usuário ativa o modo <em>Volta no Tempo</em>.
                </p>
                <ul>
                  <li>
                    Sprite <strong>pequeno e quadrado</strong>, como 56×56 ou
                    96×96 px (no máximo 256×256 px).
                  </li>
                  <li>
                    <strong>PNG com fundo transparente</strong>. Evite JPG, que
                    borra os pixels.
                  </li>
                  <li>
                    Pixels bem visíveis, <strong>sem suavização</strong>{" "}
                    (anti-aliasing) e com poucas cores, como os 4 tons do Game
                    Boy.
                  </li>
                  <li>
                    Dica: desenhe em um editor de pixel art (por exemplo Piskel
                    ou Aseprite) e exporte sem redimensionar com suavização.
                  </li>
                </ul>
                <p>
                  {isKanto
                    ? "Sem uma imagem retrô, o modo retrô usa o sprite original do jogo."
                    : "Sem uma imagem retrô, o modo retrô mostra a imagem normal (que não é pixelada)."}
                </p>
              </div>
            )}
          </aside>

          <div className="editor-main">
            <section className="editor-card">
              <h3>Nome</h3>
              <input
                type="text"
                className="editor-input"
                value={name}
                maxLength={50}
                placeholder="Ex.: Pikachu"
                aria-label="Nome do Pokémon"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </section>

            <section className="editor-card">
              <div className="editor-card-head">
                <h3>Tipos</h3>
                <span className="editor-counter">{typeIds.length}/2 escolhidos</span>
              </div>

              <div className="type-chips">
                {types.map((type) => {
                  const selected = typeIds.includes(type.id);
                  const color = colorTypes[type.id]?.color ?? "#6b8f78";

                  return (
                    <button
                      key={type.id}
                      type="button"
                      className={`type-chip ${selected ? "selected" : ""}`}
                      style={{ "--type-color": color }}
                      aria-pressed={selected}
                      disabled={!selected && typeIds.length >= 2}
                      onClick={() => toggleType(type.id)}
                    >
                      <span className="type-chip-dot" aria-hidden="true" />
                      <span className="type-chip-name">{type.name}</span>
                      {selected && (
                        <span className="type-chip-check" aria-hidden="true">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="editor-card">
              <div className="editor-card-head">
                <h3>Habilidades</h3>
                <span className="editor-counter">1 a 255</span>
              </div>

              <div className="stat-grid">
                {STAT_FIELDS.map((field) => (
                  <StatField
                    key={field.key}
                    label={field.label}
                    value={stats[field.key]}
                    accent={accent}
                    onChange={(value) =>
                      setStats((current) => ({ ...current, [field.key]: value }))
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        {error && (
          <p className="editor-error" role="alert">
            {error}
          </p>
        )}

        <div className="editor-actions">
          <Link to={backPath} className="editor-cancel">
            Cancelar
          </Link>
          <button
            type="submit"
            className="editor-save"
            disabled={saving || typeIds.length === 0}
          >
            {saving ? "Salvando..." : "Salvar Pokémon"}
          </button>
        </div>
        {typeIds.length === 0 && (
          <p className="editor-hint editor-center">Escolha ao menos um tipo para salvar.</p>
        )}
      </form>
    </section>
  );
}
