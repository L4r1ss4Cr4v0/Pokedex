import { useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

export default function ImagePicker({
  label,
  file,
  onChange,
  existingUrl,
  removeExisting,
  onRemoveExistingChange,
  pixelArt = false,
}) {
  const [preview, setPreview] = useState(null);
  const [problem, setProblem] = useState("");

  function handleSelect(event) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setProblem("Formato não suportado. Use PNG, JPG, GIF ou WebP.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setProblem("A imagem deve ter no máximo 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setProblem("Não foi possível ler esse arquivo.");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setProblem("Esse arquivo não é uma imagem válida.");
      image.onload = () => {
        setPreview({
          url: reader.result,
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
        setProblem("");
        onChange(selected);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(selected);
  }

  function handleClear() {
    setPreview(null);
    setProblem("");
    onChange(null);
  }

  const warnings = [];
  if (pixelArt && file && preview) {
    if (preview.width > 256 || preview.height > 256) {
      warnings.push(
        `Essa imagem tem ${preview.width}×${preview.height} px. Sprites retrô são pequenos (até 256×256 px); uma imagem grande e suave não vai parecer pixelada.`,
      );
    }
    if (preview.width !== preview.height) {
      warnings.push("A imagem não é quadrada: ela pode ficar deslocada no card.");
    }
    if (file.type === "image/jpeg") {
      warnings.push("JPG borra os pixels. Prefira PNG, de preferência com fundo transparente.");
    }
  }

  const showingExisting = !file && existingUrl && !removeExisting;
  const shownUrl = file ? preview?.url : showingExisting ? existingUrl : null;

  return (
    <fieldset className="image-picker">
      <legend className="sr-only">{label}</legend>

      <div className="image-picker-body">
        <div className={`image-picker-preview ${pixelArt ? "pixelated" : ""}`}>
          {shownUrl ? (
            <img src={shownUrl} alt={`Pré-visualização: ${label}`} />
          ) : (
            <span className="image-picker-empty">
              <span aria-hidden="true" className="image-picker-empty-icon">🖼️</span>
              {removeExisting ? "Será removida ao salvar" : "Nenhuma imagem enviada"}
            </span>
          )}
        </div>

        <div className="image-picker-actions">
          <label className="btn">
            {file || existingUrl ? "Trocar imagem" : "Escolher imagem"}
            <input
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleSelect}
              hidden
            />
          </label>

          {file && (
            <button type="button" className="btn" onClick={handleClear}>
              Cancelar escolha
            </button>
          )}

          {!file && existingUrl && (
            <label className="image-picker-remove">
              <input
                type="checkbox"
                checked={removeExisting}
                onChange={(e) => onRemoveExistingChange(e.target.checked)}
              />
              Remover a imagem atual ao salvar
            </label>
          )}

          {file && (
            <small className="form-hint">
              {file.name} · {Math.max(1, Math.round(file.size / 1024))} KB
            </small>
          )}
        </div>
      </div>

      {problem && <p className="status-message status-error">{problem}</p>}
      {warnings.map((warning) => (
        <p key={warning} className="image-picker-warning">
          ⚠️ {warning}
        </p>
      ))}
    </fieldset>
  );
}
