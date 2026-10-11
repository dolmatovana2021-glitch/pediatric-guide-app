import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import { Bear } from "@/components/shared/Bear";

type HomeHeroProps = {
  name?: string;
  details?: string;
  age?: string;
  weight?: string;
  height?: string;
  blood?: string;
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
  height,
  blood,
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
        className="relative bg-transparent text-left flex items-center gap-2 pl-1 pr-0 py-1 active:scale-[0.97] transition-transform"
      >
        <span className="flex-1 min-w-0">
          {profileFilled ? (
            <>
              <span className="flex items-center gap-0.5 font-bold text-foreground text-[15px] leading-tight">
                <span className="truncate">{name || "Малыш"}</span>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground flex-shrink-0" />
              </span>
              {age && (
                <span className="block text-[11px] text-foreground/80 leading-snug mt-1">{age}</span>
              )}
              {(weight || height) && (
                <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5 whitespace-nowrap">
                  {[weight, height].filter(Boolean).join(" · ")}
                </span>
              )}
              {blood && (
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-600 leading-none">
                  <Icon name="Droplet" size={11} />
                  {blood}
                </span>
              )}
              {!age && !weight && !height && !blood && (
                <span className="block text-[11px] text-muted-foreground leading-snug mt-1">{details || "Профиль"}</span>
              )}
            </>
          ) : (
            <>
              <span className="block font-bold text-foreground text-[14px] leading-tight">
                Заполнить
                <br />
                профиль
              </span>
              <span className="block text-[11px] text-muted-foreground leading-snug mt-1">Для расчёта дозы</span>
            </>
          )}
        </span>
        <span
          className={`w-[72px] h-[72px] rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center bg-card shadow-sm ${
            profileFilled ? "" : "border-2 border-dashed border-peach-300"
          }`}
        >
          {emoji}
        </span>
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
