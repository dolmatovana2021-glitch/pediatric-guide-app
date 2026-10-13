import { useEffect } from "react";
import { useTheme } from "next-themes";
import { isNightNow, useThemeMode } from "@/components/shared/themeMode";

export function NightThemeScheduler() {
  const mode = useThemeMode();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (mode !== "night") return;
    const apply = () => {
      const want = isNightNow() ? "dark" : "light";
      if (theme !== want) setTheme(want);
    };
    apply();
    const id = window.setInterval(apply, 60_000);
    const onVisible = () => document.visibilityState === "visible" && apply();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", apply);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", apply);
    };
  }, [mode, theme, setTheme]);

  return null;
}

export default NightThemeScheduler;
