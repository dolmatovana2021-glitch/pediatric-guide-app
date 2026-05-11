import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  Section,
  DOCTOR_BEAR,
  dailyTips,
  SectionWrapper,
} from "@/components/shared/SectionShared";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";

export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const profile = useChildProfile();
  const age = calcAge(profile.birthDate);
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const [tipIndex, setTipIndex] = useState(dayOfYear % dailyTips.length);
  const [tipKey, setTipKey] = useState(0);
  const tipOfDay = dailyTips[tipIndex];
  const nextTip = () => {
    setTipIndex((tipIndex + 1) % dailyTips.length);
    setTipKey((k) => k + 1);
  };

  const quickCards: { id: Section; emoji: string; label: string; color: string }[] = [
    { id: "firstaid", emoji: "🚑", label: "Первая помощь", color: "bg-red-50 border-red-200 hover:border-red-300" },
    { id: "emergency", emoji: "🆘", label: "Неотложка", color: "bg-rose-50 border-rose-200 hover:border-rose-300" },
    { id: "redflags", emoji: "🚩", label: "Красные флаги", color: "bg-pink-50 border-pink-200 hover:border-pink-300" },
    { id: "contacts", emoji: "👩‍⚕️", label: "Врачи", color: "bg-teal-50 border-teal-200 hover:border-teal-300" },
  ];

  const profileFilled = profile.name || profile.birthDate || profile.weight;

  return (
    <SectionWrapper>
      <div className="blob-bg rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="font-caveat text-primary text-lg font-semibold mb-1">Привет, родитель! 👋</p>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
              МалышДок —<br />ваш педиатрический<br />помощник
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Первая помощь, болезни и неотложные ситуации — всё под рукой
            </p>
          </div>
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <img src={DOCTOR_BEAR} alt="Доктор" className="w-full h-full object-cover" />
          </div>
        </div>
        <button
          onClick={() => setSection("emergency")}
          className="mt-4 w-full bg-red-500 text-white rounded-2xl py-3 px-4 flex items-center justify-between font-semibold text-sm shadow-md active:scale-95 transition-transform"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🆘</span>
            Неотложная помощь!
          </span>
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      <button
        onClick={() => setSection("profile")}
        className={`w-full mb-5 rounded-2xl p-4 border flex items-center gap-3 active:scale-[0.98] transition-transform ${
          profileFilled
            ? "bg-mint-50 border-mint-200"
            : "bg-white border-dashed border-mint-300"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white border border-mint-200 flex items-center justify-center text-2xl flex-shrink-0">
          {profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
        </div>
        <div className="flex-1 min-w-0 text-left">
          {profileFilled ? (
            <>
              <p className="font-bold text-foreground text-sm truncate">
                {profile.name || "Малыш"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {age ? age.label : ""}
                {age && profile.weight ? " · " : ""}
                {profile.weight ? `${profile.weight} кг` : ""}
                {!age && !profile.weight ? "Профиль" : ""}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-foreground text-sm">Заполнить профиль</p>
              <p className="text-[11px] text-muted-foreground">
                Имя, возраст и вес — для точного расчёта дозы
              </p>
            </>
          )}
        </div>
        <Icon name="ChevronRight" size={18} className="text-muted-foreground flex-shrink-0" />
      </button>

      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Разделы</h3>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {quickCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSection(card.id)}
            className={`${card.color} border rounded-2xl p-3 text-center card-hover flex flex-col items-center gap-1.5`}
          >
            <span className="text-2xl">{card.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{card.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-caveat text-primary text-base font-semibold">💡 Совет дня</p>
          <span
            key={`tag-${tipKey}`}
            className="text-[10px] font-semibold bg-mint-100 text-primary px-2 py-0.5 rounded-full animate-scale-in"
          >
            {tipOfDay.emoji} {tipOfDay.topic}
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground font-medium">
            {tipIndex + 1}/{dailyTips.length}
          </span>
        </div>
        <p
          key={`text-${tipKey}`}
          className="text-sm text-foreground leading-relaxed mb-3 animate-fade-in"
        >
          {tipOfDay.text}
        </p>
        <button
          onClick={nextTip}
          className="w-full bg-white border border-mint-200 text-primary rounded-xl py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform group"
        >
          Следующий совет
          <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </SectionWrapper>
  );
}