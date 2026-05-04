import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  Section,
  DOCTOR_BEAR,
  firstAidItems,
  emergencyItems,
  dailyTips,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

// HOME
export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const [tipIndex, setTipIndex] = useState(dayOfYear % dailyTips.length);
  const tipOfDay = dailyTips[tipIndex];
  const nextTip = () => setTipIndex((tipIndex + 1) % dailyTips.length);

  const quickCards: { id: Section; emoji: string; label: string; color: string }[] = [
    { id: "firstaid", emoji: "🚑", label: "Первая помощь", color: "bg-red-50 border-red-200 hover:border-red-300" },
    { id: "emergency", emoji: "🆘", label: "Неотложка", color: "bg-rose-50 border-rose-200 hover:border-rose-300" },
    { id: "diseases", emoji: "🌡️", label: "Болезни", color: "bg-orange-50 border-orange-200 hover:border-orange-300" },
    { id: "rashes", emoji: "🔬", label: "Сыпи", color: "bg-purple-50 border-purple-200 hover:border-purple-300" },
    { id: "contacts", emoji: "👩‍⚕️", label: "Врачи", color: "bg-teal-50 border-teal-200 hover:border-teal-300" },
  ];

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

      <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-caveat text-primary text-base font-semibold">💡 Совет дня</p>
          <span className="text-[10px] font-semibold bg-mint-100 text-primary px-2 py-0.5 rounded-full">
            {tipOfDay.emoji} {tipOfDay.topic}
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground font-medium">
            {tipIndex + 1}/{dailyTips.length}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-3">{tipOfDay.text}</p>
        <button
          onClick={nextTip}
          className="w-full bg-white border border-mint-200 text-primary rounded-xl py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Следующий совет
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
    </SectionWrapper>
  );
}

// FIRST AID
export function FirstAidSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SectionWrapper>
      <SectionTitle emoji="🚑" title="Первая помощь" subtitle="Нажмите на ситуацию, чтобы увидеть шаги" />
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex gap-2 items-center">
        <span className="text-xl">📞</span>
        <p className="text-xs text-red-700 font-medium">При угрозе жизни звоните <strong className="text-base">103</strong> или <strong className="text-base">112</strong></p>
      </div>
      <div className="space-y-3">
        {firstAidItems.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon name={item.icon} fallback="AlertCircle" size={20} />
                </div>
                <span className="font-semibold text-foreground">{item.title}</span>
              </div>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in">
                {item.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// EMERGENCY
export function EmergencySection() {
  const [open, setOpen] = useState<number | null>(null);

  const urgencyBadge = (urgency: string) => {
    if (urgency.includes("Немедленно")) return "bg-red-500 text-white";
    if (urgency.includes("Вызвать")) return "bg-orange-400 text-white";
    return "bg-amber-400 text-white";
  };

  return (
    <SectionWrapper>
      <SectionTitle emoji="🆘" title="Неотложная помощь" subtitle="Опасные ситуации — что делать прямо сейчас" />

      <div className="grid grid-cols-2 gap-2 mb-5">
        <a href="tel:103" className="bg-red-500 text-white rounded-2xl p-3 text-center active:scale-95 transition-transform block">
          <p className="text-2xl font-bold">103</p>
          <p className="text-xs opacity-90">Скорая помощь</p>
        </a>
        <a href="tel:112" className="bg-red-700 text-white rounded-2xl p-3 text-center active:scale-95 transition-transform block">
          <p className="text-2xl font-bold">112</p>
          <p className="text-xs opacity-90">Единый номер</p>
        </a>
      </div>

      <div className="space-y-3">
        {emergencyItems.map((item, i) => (
          <div key={i} className={`bg-white border ${item.color.includes("red") ? "border-red-200" : item.color.includes("orange") ? "border-orange-200" : "border-amber-200"} rounded-2xl overflow-hidden shadow-sm`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                <Icon name={item.icon} fallback="AlertCircle" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${urgencyBadge(item.urgency)} inline-block mb-1`}>
                  {item.urgency}
                </span>
                <p className="font-semibold text-foreground text-sm leading-tight">{item.title}</p>
              </div>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 animate-fade-in space-y-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Признаки</p>
                  <ul className="space-y-1">
                    {item.signs.map((sign, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-1">Что делать</p>
                  <p className="text-sm text-foreground leading-relaxed">{item.action}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}