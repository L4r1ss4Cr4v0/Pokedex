const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const TOKEN_KEY = "pokedex-token";
const USER_KEY = "pokedex-user";
const EXPIRES_KEY = "pokedex-token-exp";
const AUTH_EVENT = "pokedex-auth-change";

export function getAuthToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY));

  if (!token || (expiresAt && Date.now() >= expiresAt)) return null;
  return token;
}

export function getAuthName() {
  return getAuthToken() ? sessionStorage.getItem(USER_KEY) : null;
}

export function subscribeAuth(callback) {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export async function login(username, password) {
  const session = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    skipAuth: true,
  });

  sessionStorage.setItem(TOKEN_KEY, session.accessToken);
  sessionStorage.setItem(USER_KEY, session.user?.name ?? username);
  sessionStorage.setItem(
    EXPIRES_KEY,
    String(Date.now() + session.expiresIn * 1000),
  );
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function register({ name, username, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, username, password }),
    skipAuth: true,
  });
}

async function request(path, { skipAuth = false, ...options } = {}) {
  const token = skipAuth ? null : getAuthToken();
  const headers =
    options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
    );
  }

  if (response.status === 401 && !skipAuth) {
    logout();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const details = body?.errors ? Object.values(body.errors).join(" ") : "";
    throw new Error(
      [body?.message, details].filter(Boolean).join(": ") ||
        `Erro ${response.status} ao acessar a API.`,
    );
  }

  return body;
}

export const getPokemons = () => request("/pokemons");
export const getPokemon = (id) => request(`/pokemons/${id}`);
export const getTypes = () => request("/types");
export const getTrainers = () => request("/trainers");
export const getBadges = (search = "") => {
  const query = search.trim()
    ? `?${new URLSearchParams({ search: search.trim() })}`
    : "";
  return request(`/badges${query}`);
};
export const getBadge = (id) => request(`/badges/${id}`);

export const createPokemon = (pokemon) =>
  request("/pokemons", { method: "POST", body: JSON.stringify(pokemon) });

export const updatePokemon = (id, pokemon) =>
  request(`/pokemons/${id}`, { method: "PUT", body: JSON.stringify(pokemon) });

export const deletePokemon = (id) =>
  request(`/pokemons/${id}`, { method: "DELETE" });

export function customImageUrl(id, variant, version) {
  return `${API_URL}/pokemons/${id}/image/${variant}?v=${version}`;
}

export function uploadPokemonImage(id, variant, file) {
  const body = new FormData();
  body.append("file", file);
  return request(`/pokemons/${id}/image/${variant}`, { method: "PUT", body });
}

export const deletePokemonImage = (id, variant) =>
  request(`/pokemons/${id}/image/${variant}`, { method: "DELETE" });
