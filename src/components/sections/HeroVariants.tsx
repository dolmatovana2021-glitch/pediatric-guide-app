import Icon from "@/components/ui/icon";
import { DOCTOR_BEAR } from "@/components/shared/SectionShared";

export type HeroProps = {
  name?: string;
  ageLabel?: string;
  onEmergency: () => void;
  onProfile?: () => void;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

export function HeroGreeting({ name, ageLabel, onEmergency }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-mint-100 via-card to-peach-100 border border-mint-200 p-5">
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-mint-200/60 blur-2xl" />
      <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full bg-peach-200/60 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">{greeting()} 👋</p>
          <h1 className="text-[26px] font-bold text-foreground leading-tight mt-1">
            {name ? <>{name}, мы рядом</> : <>Мы рядом с малышом</>}
          </h1>
          {ageLabel && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-[12px] font-semibold text-mint-600 bg-card/80 border border-mint-200 rounded-full px-2.5 py-1">
              <Icon name="Cake" size={13} />
              {ageLabel}
            </span>
          )}
        </div>
        <img
          src={DOCTOR_BEAR}
          alt="Доктор"
          className="w-24 h-24 rounded-3xl object-cover shadow-lg rotate-3 flex-shrink-0"
        />
      </div>

      <button
        onClick={onEmergency}
        className="relative mt-5 w-full bg-red-500 text-white rounded-2xl py-3 px-4 flex items-center gap-3 font-semibold text-sm shadow-md shadow-red-500/20 active:scale-[0.98] transition-transform"
      >
        <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon name="Siren" size={17} />
        </span>
        Неотложная помощь
        <Icon name="ChevronRight" size={18} className="ml-auto" />
      </button>
    </div>
  );
}

export function HeroBento({ name, ageLabel, onEmergency, onProfile }: HeroProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 relative overflow-hidden rounded-[28px] bg-primary p-5 text-white">
        <div className="absolute right-0 bottom-0 w-36 h-36 rounded-tl-[60px] bg-white/10" />
        <img
          src={DOCTOR_BEAR}
          alt="Доктор"
          className="absolute right-3 bottom-3 w-24 h-24 rounded-3xl object-cover shadow-xl"
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
        className="rounded-3xl bg-peach-50 border border-peach-200 p-4 text-left active:scale-[0.97] transition-transform"
      >
        <span className="text-2xl">🧒</span>
        <p className="font-bold text-foreground text-sm mt-2 truncate">{name || "Малыш"}</p>
        <p className="text-[11px] text-muted-foreground truncate">{ageLabel || "Заполнить профиль"}</p>
      </button>

      <button
        onClick={onEmergency}
        className="rounded-3xl bg-red-500 p-4 text-left text-white shadow-md shadow-red-500/20 active:scale-[0.97] transition-transform"
      >
        <Icon name="Siren" size={24} />
        <p className="font-bold text-sm mt-2">Неотложка</p>
        <p className="text-[11px] text-white/85">Что делать сейчас</p>
      </button>
    </div>
  );
}

export function HeroSoft({ name, ageLabel, onEmergency }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-card border border-border shadow-sm">
      <div className="h-28 bg-[radial-gradient(circle_at_20%_30%,theme(colors.mint.200),transparent_55%),radial-gradient(circle_at_80%_20%,theme(colors.peach.200),transparent_55%),radial-gradient(circle_at_60%_100%,theme(colors.rose.100),transparent_60%)]" />
      <img
        src={DOCTOR_BEAR}
        alt="Доктор"
        className="absolute left-5 top-14 w-24 h-24 rounded-full object-cover border-4 border-card shadow-lg"
      />
      <div className="px-5 pt-14 pb-5">
        <p className="font-caveat text-primary text-xl font-bold leading-none">МалышДок рядом</p>
        <h1 className="text-[22px] font-bold text-foreground leading-tight mt-1.5">
          {`${greeting()}, родители!`}
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">
          {name && ageLabel ? `${name} · ${ageLabel} · спокойные ответы на тревожные вопросы` : "Спокойные ответы на тревожные вопросы"}
        </p>
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

export function HeroWave({ name, ageLabel, onEmergency }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-100 to-mint-50 border border-sky-200 pt-5 px-5 pb-4">
      <div className="absolute top-4 right-6 text-xl opacity-70">☁️</div>
      <div className="absolute top-12 right-24 text-sm opacity-60">⭐</div>
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 bg-card/70 rounded-full px-2.5 py-1">
          <Icon name="ShieldCheck" size={12} />
          Педиатрический помощник
        </span>
        <h1 className="text-[26px] font-bold text-foreground leading-[1.15] mt-3">
          Забота о здоровье
          <br />
          <span className="text-primary">без лишней тревоги</span>
        </h1>
        {(name || ageLabel) && (
          <p className="text-[12px] text-muted-foreground mt-1.5">
            {[name, ageLabel].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <div className="relative flex items-end justify-between mt-3">
        <button
          onClick={onEmergency}
          className="mb-1 bg-red-500 text-white rounded-2xl py-3 px-4 flex items-center gap-2 font-semibold text-sm shadow-md shadow-red-500/20 active:scale-[0.97] transition-transform"
        >
          <Icon name="Siren" size={17} />
          Неотложная помощь
        </button>
        <img
          src={DOCTOR_BEAR}
          alt="Доктор"
          className="w-28 h-28 object-cover rounded-t-[48px] rounded-b-2xl -mb-4"
        />
      </div>
    </div>
  );
}
