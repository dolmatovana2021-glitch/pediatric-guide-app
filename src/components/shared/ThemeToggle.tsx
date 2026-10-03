import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Icon from "@/components/ui/icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
] as const;

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? "system" : "system";

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => {
        const active = current === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setTheme(o.id)}
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
  );
}

export default ThemeToggle;
