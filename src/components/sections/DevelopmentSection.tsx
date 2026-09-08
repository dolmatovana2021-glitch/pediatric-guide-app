import { useState } from "react";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { PsychdevSection } from "@/components/sections/PsychdevSection";
import { FeedingSection } from "@/components/sections/FeedingSection";
import { NewbornSection } from "@/components/sections/NewbornSection";
import { PreschoolSection } from "@/components/sections/PreschoolSection";
import { TeethSection } from "@/components/sections/TeethSection";
import { SleepSection } from "@/components/sections/SleepSection";
import { FeedingLogSection } from "@/components/sections/FeedingLogSection";

type Tab = "newborn" | "psychdev" | "preschool" | "feeding" | "teeth" | "sleep" | "feedlog";

const tabs: { id: Tab; emoji: string; label: string }[] = [
  { id: "newborn", emoji: "👶", label: "Новорождённый" },
  { id: "psychdev", emoji: "🧠", label: "Нервно-психическое" },
  { id: "preschool", emoji: "🎒", label: "Дошкольник 3–7" },
  { id: "feeding", emoji: "🥣", label: "Прикорм" },
  { id: "feedlog", emoji: "🍼", label: "Кормление" },
  { id: "sleep", emoji: "😴", label: "Сон" },
  { id: "teeth", emoji: "🦷", label: "Зубная формула" },
];

export function DevelopmentSection() {
  const [tab, setTab] = useState<Tab>("newborn");

  const render = () => {
    switch (tab) {
      case "newborn":
        return <NewbornSection />;
      case "psychdev":
        return <PsychdevSection />;
      case "preschool":
        return <PreschoolSection />;
      case "feeding":
        return <FeedingSection />;
      case "feedlog":
        return <FeedingLogSection />;
      case "sleep":
        return <SleepSection />;
      case "teeth":
        return <TeethSection />;
    }
  };

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🌱"
        title="Развитие"
        subtitle="От новорождённого до школы: развитие, питание, сон и зубы"
      />

      <div className="-mx-4 px-4 mb-5 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 w-max">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-2xl py-2.5 px-3.5 text-[13px] font-semibold border whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border"
                }`}
              >
                <span className="text-base">{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {render()}
    </SectionWrapper>
  );
}

export default DevelopmentSection;