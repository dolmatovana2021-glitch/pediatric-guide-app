import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Icon from "@/components/ui/icon";
import { isNightNow, setThemeMode, useThemeMode, NIGHT_FROM, NIGHT_TO } from "@/components/shared/themeMode";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => {
        setThemeMode("");
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className="w-10 h-10 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center active:scale-95 transition-transform"
    >
      <Icon name={isDark ? "Sun" : "Moon"} size={17} className="text-foreground" />
    </button>
  );
}

const options = [
  { id: "light", icon: "Sun", label: "Светлая" },
  { id: "dark", icon: "Moon", label: "Тёмная" },
  { id: "system", icon: "Smartphone", label: "Как в телефоне" },
  { id: "night", icon: "MoonStar", label: "Тёмная вечером" },
] as const;

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const mode = useThemeMode();
  const current = mounted ? (mode === "night" ? "night" : theme ?? "system") : "system";

  return (
    <div>
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const active = current === o.id;
        return (
          <button
            key={o.id}
            onClick={() => {
              if (o.id === "night") {
                setThemeMode("night");
                setTheme(isNightNow() ? "dark" : "light");
              } else {
                setThemeMode("");
                setTheme(o.id);
              }
            }}
            aria-pressed={active}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-[12px] font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            <Icon name={o.icon} size={18} />
            {o.label}
          </button>
        );
      })}
    </div>
    {current === "night" && (
      <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
        <Icon name="Clock" size={13} className="flex-shrink-0" />
        Тёмная с {NIGHT_FROM}:00 до {String(NIGHT_TO).padStart(2, "0")}:00, днём — светлая
      </p>
    )}
    </div>
  );
}

export default ThemeToggle;
