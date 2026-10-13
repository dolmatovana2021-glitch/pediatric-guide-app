import { useEffect, useState } from "react";

const MODE_KEY = "malyshdok:themeMode";
const EVENT = "malyshdok:themeMode:update";

export const NIGHT_FROM = 21;
export const NIGHT_TO = 7;

export type ThemeMode = "night" | "";

export function isNightNow(d = new Date()): boolean {
  const h = d.getHours();
  return h >= NIGHT_FROM || h < NIGHT_TO;
}

export function getThemeMode(): ThemeMode {
  try {
    return localStorage.getItem(MODE_KEY) === "night" ? "night" : "";
  } catch {
    return "";
  }
}

export function setThemeMode(mode: ThemeMode) {
  try {
    if (mode) localStorage.setItem(MODE_KEY, mode);
    else localStorage.removeItem(MODE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useThemeMode(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("");
  useEffect(() => {
    const refresh = () => setMode(getThemeMode());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return mode;
}
