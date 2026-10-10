import Icon from "@/components/ui/icon";
import { Bear } from "@/components/shared/Bear";

type HomeHeroProps = {
  name?: string;
  details?: string;
  emoji: string;
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
        className={`rounded-3xl p-4 text-left border active:scale-[0.97] transition-transform ${
          profileFilled
            ? "bg-peach-50 border-peach-200"
            : "bg-card border-dashed border-peach-300"
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="text-2xl">{emoji}</span>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </div>
        <p className="font-bold text-foreground text-sm mt-2 truncate">
          {profileFilled ? name || "Малыш" : "Заполнить профиль"}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {profileFilled ? details || "Профиль" : "Для расчёта дозы"}
        </p>
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
