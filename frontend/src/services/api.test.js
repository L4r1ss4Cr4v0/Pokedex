import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getBadges,
  getPokemons,
  subscribeAuth,
} from "./api";

describe("API client", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("trims and encodes the badge search query", async () => {
    fetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => [{ id: 1, name: "Rocha" }],
    });

    await expect(getBadges("  água & pedra  ")).resolves.toEqual([
      { id: 1, name: "Rocha" },
    ]);
    expect(fetch.mock.calls[0][0]).toContain(
      "/badges?search=%C3%A1gua+%26+pedra",
    );
  });

  it("sends the saved token with authenticated requests", async () => {
    sessionStorage.setItem("pokedex-token", "token-de-teste");
    sessionStorage.setItem(
      "pokedex-token-exp",
      String(Date.now() + 60_000),
    );
    fetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => [{ id: 1, name: "Bulbasaur" }],
    });

    await expect(getPokemons()).resolves.toEqual([
      { id: 1, name: "Bulbasaur" },
    ]);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer token-de-teste",
    );
  });

  it("clears an expired session and notifies auth subscribers on 401", async () => {
    sessionStorage.setItem("pokedex-token", "token-vencido");
    sessionStorage.setItem(
      "pokedex-token-exp",
      String(Date.now() + 60_000),
    );
    fetch.mockResolvedValue({
      status: 401,
      ok: false,
      json: async () => ({ message: "Token inválido" }),
    });
    const onAuthChange = vi.fn();
    const unsubscribe = subscribeAuth(onAuthChange);

    await expect(getPokemons()).rejects.toThrow(
      "Sessão expirada. Faça login novamente.",
    );

    expect(sessionStorage.getItem("pokedex-token")).toBeNull();
    expect(onAuthChange).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it("returns a readable error when the API cannot be reached", async () => {
    fetch.mockRejectedValue(new TypeError("Falha de rede"));

    await expect(getPokemons()).rejects.toThrow(
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
    );
  });
});
