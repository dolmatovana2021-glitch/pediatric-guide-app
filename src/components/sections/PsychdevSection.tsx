import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  psychdevAges,
  psychdevPrinciples,
  psychdevLines,
  psychdevGroups,
  PSYCHDEV_DISCLAIMER,
  type PsychdevAge,
} from "@/components/shared/psychdevData";

const groupTone: Record<string, string> = {
  ahead: "bg-violet-50 border-violet-200 text-violet-800",
  ok: "bg-emerald-50 border-emerald-200 text-emerald-800",
  watch: "bg-amber-50 border-amber-200 text-amber-800",
  alert: "bg-rose-50 border-rose-200 text-rose-800",
};

function PrinciplesBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="text-2xl flex-shrink-0">📋</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm leading-tight">
            Как врачи оценивают развитие
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            Эпикризные сроки, линии развития и группы НПР
          </p>
        </div>
        <Icon
          name={open ? "ChevronUp" : "ChevronDown"}
          size={18}
          className="text-muted-foreground flex-shrink-0"
        />
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in">
          <div className="space-y-2">
            {psychdevPrinciples.map((p) => (
              <div key={p.title} className="bg-mint-50 border border-mint-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={p.icon} fallback="Info" size={15} className="text-primary" />
                  <span className="text-[13px] font-bold text-foreground">{p.title}</span>
                </div>
                <p className="text-[12px] text-foreground leading-snug">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name="ListChecks" size={15} className="text-sky-600" />
              <span className="text-[13px] font-bold text-sky-800">
                Линии (параметры) развития
              </span>
            </div>
            <ul className="space-y-1">
              {psychdevLines.map((l) => (
                <li key={l.code} className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 rounded px-1.5 py-0.5 flex-shrink-0 min-w-[34px] text-center">
                    {l.code}
                  </span>
                  <span className="text-[12px] text-foreground leading-snug">
                    <b className="font-semibold">{l.name}</b> — {l.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
              Группы развития
            </p>
            <div className="space-y-1.5">
              {psychdevGroups.map((g) => (
                <div key={g.group} className={`border rounded-xl p-2.5 ${groupTone[g.tone]}`}>
                  <p className="text-[12px] font-bold">{g.group}</p>
                  <p className="text-[11px] leading-snug opacity-90">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <Icon name="Info" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="text-[11px] text-amber-800 leading-snug">{PSYCHDEV_DISCLAIMER}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AgeDetails({ item }: { item: PsychdevAge }) {
  return (
    <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in">
      <div className="space-y-2.5">
        {item.domains.map((d) => (
          <div
            key={d.label}
            className="bg-mint-50 border border-mint-200 rounded-xl p-3"
          >
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
            Поводы показаться неврологу
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

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        <Icon name="Info" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-amber-800 leading-snug">{PSYCHDEV_DISCLAIMER}</span>
      </div>
    </div>
  );
}

export function PsychdevSection() {
  const [openId, setOpenId] = useState<string | null>(psychdevAges[0]?.id ?? null);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🧠"
        title="Нервно-психическое развитие"
        subtitle="Что умеет ребёнок в каждом возрасте и когда стоит обратиться к врачу"
      />

      <PrinciplesBlock />

      <div className="space-y-3">
        {psychdevAges.map((item) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenId(open ? null : item.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
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
                  name={open ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  className="text-muted-foreground flex-shrink-0"
                />
              </button>
              {open && <AgeDetails item={item} />}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

export default PsychdevSection;