import Icon from "@/components/ui/icon";
import type { Section } from "@/components/shared/sectionTypes";

type Item = { id: Section; icon: string; label: string };

const leftItems: Item[] = [
  { id: "home", icon: "House", label: "Главная" },
  { id: "vaccination", icon: "Syringe", label: "Прививки" },
];

const rightItems: Item[] = [
  { id: "checkup", icon: "Stethoscope", label: "Осмотры" },
  { id: "profile", icon: "Baby", label: "Профиль" },
];

type Props = {
  section: Section;
  setSection: (s: Section) => void;
  badges: Partial<Record<Section, boolean>>;
};

function NavButton({
  item,
  active,
  badge,
  onClick,
}: {
  item: Item;
  active: boolean;
  badge?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className="flex-1 flex flex-col items-center gap-1 py-1.5 active:scale-95 transition-transform"
    >
      <span
        className={`relative w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${
          active ? "bg-mint-100 text-primary" : "text-muted-foreground"
        }`}
      >
        <Icon name={item.icon} size={20} strokeWidth={active ? 2.4 : 2} />
        {badge && (
          <span className="absolute top-0.5 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />
        )}
      </span>
      <span
        className={`text-[10px] leading-none ${
          active ? "font-bold text-primary" : "font-medium text-muted-foreground"
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}

export function BottomNav({ section, setSection, badges }: Props) {
  const sosActive = section === "emergency";

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 z-30"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="relative flex items-end bg-card/95 backdrop-blur-md border border-border rounded-[28px] shadow-lg shadow-black/5 px-1.5 pt-1.5 pb-2">
        {leftItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={section === item.id}
            badge={badges[item.id]}
            onClick={() => setSection(item.id)}
          />
        ))}

        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => setSection("emergency")}
            aria-label="Неотложная помощь"
            aria-current={sosActive ? "page" : undefined}
            className={`-mt-7 w-14 h-14 rounded-[20px] bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 border-4 border-background active:scale-95 transition-transform ${
              sosActive ? "ring-2 ring-red-300" : ""
            }`}
          >
            <Icon name="Siren" size={24} />
          </button>
          <span
            className={`text-[10px] leading-none mt-1.5 ${
              sosActive ? "font-bold text-red-600" : "font-semibold text-red-500"
            }`}
          >
            SOS
          </span>
        </div>

        {rightItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={section === item.id}
            badge={badges[item.id]}
            onClick={() => setSection(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
