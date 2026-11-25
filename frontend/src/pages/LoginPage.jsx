import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import BackButton from "../components/BackButton";
import PasswordInput from "../components/PasswordInput";
import "../css/PokemonForm.css";
import "../css/Auth.css";

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <section id="center" className="auth-page">
      <BackButton to="/" />

      <div className="auth-card">
        <img src="/imgs/pokebola.png" alt="" className="auth-logo" />
        <h2>Bem-vindo, treinador!</h2>
        <p className="auth-subtitle">
          Entre para cadastrar, editar e excluir Pokémon.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Usuário</span>
            <input
              type="text"
              value={username}
              autoComplete="username"
              placeholder="seu.usuario"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Senha</span>
            <PasswordInput
              value={password}
              autoComplete="current-password"
              placeholder="Sua senha"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-switch">
          <span>Ainda não tem conta?</span>
          <Link to="/register" state={location.state} className="auth-switch-link">
            Cadastre-se
          </Link>
        </div>
      </div>
    </section>
  );
}
