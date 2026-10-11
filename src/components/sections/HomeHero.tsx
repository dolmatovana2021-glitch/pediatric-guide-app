import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import { Bear } from "@/components/shared/Bear";

type HomeHeroProps = {
  name?: string;
  details?: string;
  age?: string;
  weight?: string;
  emoji: ReactNode;
  profileFilled: boolean;
  onEmergency: () => void;
  onProfile: () => void;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

export function HomeHero({
  name,
  details,
  age,
  weight,
  emoji,
  profileFilled,
  onEmergency,
  onProfile,
}: HomeHeroProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="col-span-2 relative overflow-hidden rounded-[28px] bg-primary p-5 text-white">
        <div className="absolute -right-6 -bottom-10 w-44 h-44 rounded-full bg-white/10" />
        <Bear
          pose="main"
          nightAware
          className="absolute right-1 -bottom-1 w-[132px] h-[132px]"
        />
        <p className="text-[13px] text-white/80 font-medium">{greeting()}!</p>
        <h1 className="text-[24px] font-bold leading-tight mt-1 max-w-[60%]">
          Здоровье малыша — под рукой
        </h1>
        <p className="text-[12px] text-white/80 mt-2 max-w-[58%] leading-snug">
          Первая помощь, прививки и развитие в одном месте
        </p>
      </div>

      <button
        onClick={onProfile}
        className={`relative rounded-3xl py-3 pl-2.5 pr-2 text-left border flex items-center gap-2 active:scale-[0.97] transition-transform ${
          profileFilled
            ? "bg-peach-50 border-peach-200"
            : "bg-card border-dashed border-peach-300"
        }`}
      >
        <span
          className={`w-[58px] h-[58px] rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center bg-card border-2 ${
            profileFilled ? "border-peach-200" : "border-dashed border-peach-300"
          }`}
        >
          {emoji}
        </span>
        <span className="flex-1 min-w-0">
          {profileFilled ? (
            <span className="block font-bold text-foreground text-[13px] leading-tight pr-3 truncate">
              {name || "Малыш"}
            </span>
          ) : (
            <span className="block font-bold text-foreground text-[13px] leading-tight pr-3">
              Заполнить
              <br />
              профиль
            </span>
          )}
          {profileFilled ? (
            age || weight ? (
              <>
                {age && <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5 whitespace-nowrap">{age}</span>}
                {weight && <span className="block text-[11px] text-muted-foreground leading-snug whitespace-nowrap">{weight}</span>}
              </>
            ) : (
              <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5">{details || "Профиль"}</span>
            )
          ) : (
            <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5">Для расчёта<br />дозы</span>
          )}
        </span>
        <Icon name="ChevronRight" size={14} className="absolute top-3 right-2 text-muted-foreground" />
      </button>

      <button
        onClick={onEmergency}
        className="rounded-3xl bg-red-500 p-4 text-left text-white shadow-md shadow-red-500/20 active:scale-[0.97] transition-transform"
      >
        <div className="flex items-start justify-between">
          <Icon name="Siren" size={24} />
          <Icon name="ChevronRight" size={16} className="text-white/80" />
        </div>
        <p className="font-bold text-sm mt-2">Неотложка</p>
        <p className="text-[11px] text-white/85">Что делать сейчас</p>
      </button>
    </div>
  );
}

export default HomeHero;
