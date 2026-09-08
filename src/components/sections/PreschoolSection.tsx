import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  preschoolAges,
  schoolReadiness,
  PRESCHOOL_DISCLAIMER,
} from "@/components/shared/preschoolData";
import { type PsychdevAge } from "@/components/shared/psychdevData";

type Tab = "ages" | "school";

function AgeDetails({ item }: { item: PsychdevAge }) {
  return (
    <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in">
      <div className="space-y-2.5">
        {item.domains.map((d) => (
          <div key={d.label} className="bg-mint-50 border border-mint-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name={d.icon} fallback="Sparkles" size={15} className="text-primary" />
              <span className="text-[13px] font-bold text-foreground">{d.label}</span>
              {d.code && (
                <span className="ml-auto text-[10px] font-bold text-primary bg-mint-100 rounded px-1.5 py-0.5">
                  {d.code}
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {d.skills.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon name="Check" size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[12px] text-foreground leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="TriangleAlert" size={15} className="text-rose-600" />
          <span className="text-[13px] font-bold text-rose-700">
            Поводы обратиться к специалисту
          </span>
        </div>
        <ul className="space-y-1">
          {item.redFlags.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" />
              <span className="text-[12px] text-rose-900 leading-snug">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PreschoolSection() {
  const [tab, setTab] = useState<Tab>("ages");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openBlock, setOpenBlock] = useState<number | null>(0);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🎒"
        title="Дошкольник 3–7 лет"
        subtitle="Возрастные нормы, речь и подготовка к школе"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("ages")}
          className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors ${
            tab === "ages"
              ? "bg-primary text-white border-primary"
              : "bg-white text-foreground border-border"
          }`}
        >
          Нормы по возрасту
        </button>
        <button
          onClick={() => setTab("school")}
          className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors ${
            tab === "school"
              ? "bg-primary text-white border-primary"
              : "bg-white text-foreground border-border"
          }`}
        >
          Готовность к школе
        </button>
      </div>

      {tab === "ages" ? (
        <div className="space-y-2.5">
          {preschoolAges.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-3 p-3.5 text-left active:scale-[0.99] transition-transform"
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {item.age}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {item.summary}
                    </p>
                  </div>
                  <Icon
                    name={isOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </button>
                {isOpen && <AgeDetails item={item} />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {schoolReadiness.map((block, i) => {
            const isOpen = openBlock === i;
            return (
              <div
                key={block.title}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenBlock(isOpen ? null : i)}
                  className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${block.color}`}
                  >
                    <Icon name={block.icon} fallback="GraduationCap" size={18} />
                  </div>
                  <p className="flex-1 text-left font-semibold text-foreground text-sm">
                    {block.title}
                  </p>
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className={`text-muted-foreground flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 animate-fade-in">
                    {block.intro && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                        {block.intro}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-[13px] text-foreground leading-snug"
                        >
                          <Icon name="Dot" size={18} className="text-primary flex-shrink-0 -ml-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-4">
        <Icon name="Info" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-amber-800 leading-snug">{PRESCHOOL_DISCLAIMER}</span>
      </div>
    </SectionWrapper>
  );
}

export default PreschoolSection;
