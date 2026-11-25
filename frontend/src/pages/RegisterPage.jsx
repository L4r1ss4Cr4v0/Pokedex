import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import BackButton from "../components/BackButton";
import PasswordInput from "../components/PasswordInput";
import "../css/PokemonForm.css";
import "../css/Auth.css";

const USERNAME_PATTERN = /^[A-Za-z0-9._-]+$/;

export default function RegisterPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  function validate() {
    if (!USERNAME_PATTERN.test(username)) {
      return "O usuário só pode ter letras, números, ponto, hífen e sublinhado.";
    }
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (password !== confirmation) {
      return "As senhas não conferem.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await register({ name: name.trim(), username: username.trim(), password });
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <section id="center" className="auth-page">
      <BackButton to="/login" />

      <div className="auth-card">
        <img src="/imgs/pokebola.png" alt="" className="auth-logo" />
        <h2>Criar conta</h2>
        <p className="auth-subtitle">
          Comece a montar a sua Pokédex.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Nome</span>
            <input
              type="text"
              value={name}
              maxLength={80}
              autoComplete="name"
              placeholder="Como quer ser chamado"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Usuário</span>
            <input
              type="text"
              value={username}
              minLength={3}
              maxLength={30}
              autoComplete="username"
              placeholder="seu.usuario"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <small className="auth-hint">
              3 a 30 caracteres: letras, números, ponto, hífen e sublinhado.
            </small>
          </label>

          <label className="auth-field">
            <span>Senha</span>
            <PasswordInput
              value={password}
              minLength={6}
              maxLength={72}
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Confirmar senha</span>
            <PasswordInput
              value={confirmation}
              autoComplete="new-password"
              placeholder="Repita a senha"
              required
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <div className="auth-switch">
          <span>Já tem conta?</span>
          <Link to="/login" state={location.state} className="auth-switch-link">
            Entrar
          </Link>
        </div>
      </div>
    </section>
  );
}
