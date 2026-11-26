import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

import PokemonCard from "./PokemonCard";

const bulbasaur = {
  id: 1,
  name: "Bulbasaur",
  types: [
    { id: 12, name: "Grass" },
    { id: 4, name: "Poison" },
  ],
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
  },
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  navigateMock.mockReset();
});

describe("PokemonCard", () => {
  it("shows the Pokémon identity, types, and stats", () => {
    render(<PokemonCard data={bulbasaur} />);

    expect(screen.getByText("#001")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Bulbasaur" })).toBeTruthy();
    expect(screen.getByText("Grass")).toBeTruthy();
    expect(screen.getByText("Poison")).toBeTruthy();
    expect(screen.getAllByText("65")).toHaveLength(2);
  });

  it("toggles the favorite and team through their callbacks", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    const onToggleTeam = vi.fn();
    render(
      <PokemonCard
        data={bulbasaur}
        isFavorite
        onToggleFavorite={onToggleFavorite}
        onToggleTeam={onToggleTeam}
      />,
    );

    const favorite = screen.getByRole("button", {
      name: "Remover dos favoritos Bulbasaur",
    });
    expect(favorite.getAttribute("aria-pressed")).toBe("true");
    await user.click(favorite);
    await user.click(screen.getByRole("button", { name: "Adicionar à equipe" }));

    expect(onToggleFavorite).toHaveBeenCalledWith(1);
    expect(onToggleTeam).toHaveBeenCalledWith(1);
  });

  it("disables favorite and team controls when an action is pending", () => {
    render(
      <PokemonCard
        data={bulbasaur}
        onToggleFavorite={vi.fn()}
        onToggleTeam={vi.fn()}
        actionDisabled
      />,
    );

    expect(
      screen.getByRole("button", { name: "Favoritar Bulbasaur" }).hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Adicionar à equipe" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("opens the details route and switches to the retro sprite", async () => {
    const user = userEvent.setup();
    render(<PokemonCard data={bulbasaur} />);

    await user.click(screen.getByRole("button", { name: "Ver detalhes de Bulbasaur" }));
    expect(navigateMock).toHaveBeenCalledWith("/pokemon/1");

    const image = screen.getByRole("img", { name: "Bulbasaur" });
    act(() => {
      fireEvent(
        window,
        new CustomEvent("pokedex-theme-change", {
          detail: { theme: "retro" },
        }),
      );
    });

    expect(image.className).toContain("retro-sprite");
    expect(image.getAttribute("src")).toContain("generation-i/red-blue");
  });
});
