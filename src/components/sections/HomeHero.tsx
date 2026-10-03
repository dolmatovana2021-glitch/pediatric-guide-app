import Icon from "@/components/ui/icon";
import { DOCTOR_BEAR } from "@/components/shared/SectionShared";

type HomeHeroProps = {
  name?: string;
  ageLabel?: string;
  onEmergency: () => void;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

export function HomeHero({ name, ageLabel, onEmergency }: HomeHeroProps) {
  const subtitle =
    name && ageLabel
      ? `${name} · ${ageLabel} · спокойные ответы на тревожные вопросы`
      : "Спокойные ответы на тревожные вопросы";

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-card border border-border shadow-sm mb-5">
      <div className="h-28 bg-[radial-gradient(circle_at_20%_30%,theme(colors.mint.200),transparent_55%),radial-gradient(circle_at_80%_20%,theme(colors.peach.200),transparent_55%),radial-gradient(circle_at_60%_100%,theme(colors.rose.100),transparent_60%)]" />
      <img
        src={DOCTOR_BEAR}
        alt="Доктор"
        className="absolute left-5 top-14 w-24 h-24 rounded-full object-cover border-4 border-card shadow-lg"
      />
      <div className="px-5 pt-14 pb-5">
        <p className="font-caveat text-primary text-xl font-bold leading-none">МалышДок рядом</p>
        <h1 className="text-[22px] font-bold text-foreground leading-tight mt-1.5">
          {greeting()}, родители!
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">{subtitle}</p>
        <button
          onClick={onEmergency}
          className="mt-4 inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-full py-2 pl-2 pr-4 font-semibold text-[13px] active:scale-[0.97] transition-transform"
        >
          <span className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center">
            <Icon name="Siren" size={14} />
          </span>
          Неотложная помощь
        </button>
      </div>
    </div>
  );
}

export default HomeHero;
