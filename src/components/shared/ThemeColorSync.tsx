import { useEffect } from "react";
import { useTheme } from "next-themes";

const LIGHT = "#f9f8f5";
const DARK = "#13161c";

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (!resolvedTheme) return;
    const color = resolvedTheme === "dark" ? DARK : LIGHT;
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.removeAttribute("media");
      m.setAttribute("content", color);
    });
    document
      .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
      ?.setAttribute("content", resolvedTheme === "dark" ? "black-translucent" : "default");
    document.documentElement.style.colorScheme = resolvedTheme === "dark" ? "dark" : "light";
  }, [resolvedTheme]);
  return null;
}

export default ThemeColorSync;
