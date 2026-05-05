import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  emergencyItems,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

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
