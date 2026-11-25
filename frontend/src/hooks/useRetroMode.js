import { useSyncExternalStore } from "react";

const THEME_EVENT = "pokedex-theme-change";

function subscribe(callback) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

const isRetro = () => localStorage.getItem("pokedex-theme") === "retro";

export function useRetroMode() {
  return useSyncExternalStore(subscribe, isRetro);
}
