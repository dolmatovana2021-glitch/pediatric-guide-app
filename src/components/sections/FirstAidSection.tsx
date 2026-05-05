import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  firstAidItems,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

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
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                <div className="space-y-2">
                  {item.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                {"dosing" in item && item.dosing && (
                  <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💊</span>
                      <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                        {item.dosing.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.dosing.note}
                    </p>

                    {item.dosing.drugs.map((drug, k) => (
                      <div key={k} className="bg-white border border-rose-100 rounded-xl overflow-hidden">
                        <div className="px-3 py-2 bg-rose-50 border-b border-rose-100">
                          <p className="text-sm font-bold text-foreground">{drug.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {drug.dose} · {drug.interval} · {drug.maxPerDay}
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-rose-50/40 text-muted-foreground">
                                <th className="text-left font-semibold px-2.5 py-1.5">Вес</th>
                                <th className="text-left font-semibold px-2.5 py-1.5">Сироп</th>
                                <th className="text-left font-semibold px-2.5 py-1.5">Доза</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drug.rows.map((row, r) => (
                                <tr key={r} className="border-t border-rose-50">
                                  <td className="px-2.5 py-1.5 font-semibold text-foreground">{row.weight}</td>
                                  <td className="px-2.5 py-1.5 text-foreground">{row.suspension}</td>
                                  <td className="px-2.5 py-1.5 text-muted-foreground">{row.mg}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                      <p className="text-[11px] font-bold text-amber-700 mb-1">⚠️ Важно</p>
                      <ul className="space-y-1">
                        {item.dosing.warnings.map((w, wi) => (
                          <li key={wi} className="flex items-start gap-1.5 text-[11px] text-foreground leading-relaxed">
                            <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}