import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  tbTests,
  tbSchedule,
  tbContraindications,
  tbWithVaccines,
  tbPositiveSteps,
  tbRefusal,
  TB_SOURCE,
  type TbScaleItem,
} from "@/components/shared/tbTestsData";
import { TbTracker } from "@/components/sections/TbTracker";

const scaleTone: Record<TbScaleItem["tone"], string> = {
  ok: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warn: "bg-amber-50 border-amber-200 text-amber-800",
  bad: "bg-red-50 border-red-200 text-red-800",
};

function InfoList({ items, icon, iconClass }: { items: string[]; icon: string; iconClass: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
          <Icon name={icon} size={14} className={`${iconClass} flex-shrink-0 mt-0.5`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">{title}</p>
      {children}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  className,
  children,
}: {
  icon: string;
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-2xl p-3.5 ${className}`}>
      <p className="flex items-center gap-2 font-bold text-sm text-foreground mb-2">
        <Icon name={icon} size={16} />
        {title}
      </p>
      {children}
    </div>
  );
}

export function TbDiagnostics() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div id="tb-diagnostics" className="mt-7 scroll-mt-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-11 h-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-[22px] flex-shrink-0">
          🔬
        </span>
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-foreground leading-tight">Туберкулинодиагностика</h2>
          <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
            Проба Манту, Диаскинтест и анализы крови на туберкулёз
          </p>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
        <Icon name="Info" size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sky-900 leading-relaxed">
          Это <b>не прививки</b>, а проверки: они показывают, встречался ли организм ребёнка с возбудителем туберкулёза.
          Ежегодная проверка помогает вовремя заметить инфекцию — до того, как появятся симптомы.
        </p>
      </div>

      <TbTracker />

      <div className="bg-card border border-border rounded-2xl p-3.5 mb-3">
        <p className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
          <Icon name="CalendarCheck" size={16} className="text-primary" />
          Когда проверяться
        </p>
        <div className="space-y-1.5">
          {tbSchedule.map((s) => (
            <div key={s.age} className="flex items-center gap-2 bg-muted/60 rounded-xl px-2.5 py-2">
              <span className="text-[11px] font-semibold text-foreground w-[104px] flex-shrink-0">{s.age}</span>
              <span className="text-[12px] font-semibold text-primary flex-1">{s.test}</span>
              <span className="text-[11px] text-muted-foreground text-right">{s.freq}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 mb-3">
        {tbTests.map((t) => {
          const open = openId === t.id;
          return (
            <div key={t.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenId(open ? null : t.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div className={`${t.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                  <Icon name={t.icon} fallback="Microscope" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.kind}</p>
                </div>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="px-3.5 pb-4 space-y-3.5 border-t border-border pt-3">
                  <Block title="Кому и когда">
                    <p className="text-[12px] text-foreground leading-snug">{t.who}</p>
                  </Block>
                  <Block title="Что это">
                    <p className="text-[12px] text-foreground leading-snug">{t.what}</p>
                  </Block>
                  <Block title="Как проходит">
                    <InfoList items={t.how} icon="ChevronRight" iconClass="text-primary" />
                  </Block>
                  {t.scale && (
                    <Block title="Как читать результат">
                      <div className="space-y-1.5">
                        {t.scale.map((s) => (
                          <div key={s.label} className={`border rounded-xl px-2.5 py-1.5 ${scaleTone[s.tone]}`}>
                            <p className="text-[12px] font-bold leading-tight">{s.label}</p>
                            <p className="text-[11px] leading-snug mt-0.5">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </Block>
                  )}
                  {t.care && (
                    <Block title="Уход за местом укола">
                      <InfoList items={t.care} icon="Hand" iconClass="text-sky-500" />
                    </Block>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    <Block title="Плюсы">
                      <InfoList items={t.pros} icon="CircleCheck" iconClass="text-emerald-500" />
                    </Block>
                    <Block title="Минусы">
                      <InfoList items={t.cons} icon="CircleMinus" iconClass="text-amber-500" />
                    </Block>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2.5">
        <InfoCard icon="Syringe" title="Пробы и прививки" className="bg-card border-border">
          <InfoList items={tbWithVaccines} icon="ChevronRight" iconClass="text-primary" />
        </InfoCard>
        <InfoCard icon="Ban" title="Когда пробу откладывают" className="bg-amber-50 border-amber-200">
          <InfoList items={tbContraindications} icon="Dot" iconClass="text-amber-600" />
        </InfoCard>
        <InfoCard icon="CircleAlert" title="Если результат положительный" className="bg-rose-50 border-rose-200">
          <InfoList items={tbPositiveSteps} icon="ChevronRight" iconClass="text-rose-500" />
        </InfoCard>
        <InfoCard icon="FileText" title="Если отказываетесь от проб" className="bg-card border-border">
          <p className="text-[12px] text-foreground leading-snug">{tbRefusal}</p>
        </InfoCard>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mt-3 px-1">
        {TB_SOURCE} Решение о методе проверки принимает педиатр или фтизиатр.
      </p>
    </div>
  );
}

export default TbDiagnostics;
