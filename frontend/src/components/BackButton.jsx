import { useLocation, useNavigate } from "react-router-dom";
import "../css/BackButton.css";

export default function BackButton({ to, fallback = "/", label = "Voltar" }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick() {
    if (to) {
      navigate(to);
    } else if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button type="button" className="back-button" onClick={handleClick}>
      <span className="back-arrow" aria-hidden="true">←</span>
      {label}
    </button>
  );
}
