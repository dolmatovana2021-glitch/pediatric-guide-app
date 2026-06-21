import { useState } from "react";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { PsychdevSection } from "@/components/sections/PsychdevSection";
import { FeedingSection } from "@/components/sections/FeedingSection";

type Tab = "psychdev" | "feeding";

const tabs: { id: Tab; emoji: string; label: string }[] = [
  { id: "psychdev", emoji: "🧠", label: "Нервно-психическое" },
  { id: "feeding", emoji: "🥣", label: "Прикорм" },
];

export function DevelopmentSection() {
  const [tab, setTab] = useState<Tab>("psychdev");

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🌱"
        title="Развитие ребёнка 0–3 года"
        subtitle="Нервно-психическое развитие и организация прикорма"
      />

      <div className="flex gap-2 mb-5">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-2.5 px-2 text-[13px] font-semibold border transition-colors ${
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

      {tab === "psychdev" ? <PsychdevSection /> : <FeedingSection />}
    </SectionWrapper>
  );
}

export default DevelopmentSection;
