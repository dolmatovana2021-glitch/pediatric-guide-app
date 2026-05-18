import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  firstAidItems,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";
import { DoseCalculator } from "./DoseCalculator";

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

                    <DoseCalculator />

                    {"doseTable" in item.dosing && item.dosing.doseTable && (
                      <div className="bg-white border border-rose-100 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px] border-collapse min-w-[420px]">
                            <thead>
                              <tr>
                                <th className="bg-rose-50 border border-rose-100 px-2 py-2 text-left font-bold text-foreground align-top w-[60px]" rowSpan={4}>
                                  Вес ребёнка
                                </th>
                                <th className="bg-rose-50 border border-rose-100 px-2 py-2 text-left font-bold text-foreground" colSpan={2}>
                                  Ибупрофен
                                </th>
                                <th className="bg-rose-50 border border-rose-100 px-2 py-2 text-left font-bold text-foreground">
                                  Парацетамол
                                </th>
                              </tr>
                              <tr>
                                <td className="bg-rose-50/60 border border-rose-100 px-2 py-1.5 text-[10px] text-foreground align-top leading-tight" colSpan={2}>
                                  Разовая доза для детей от 3 мес. 10 мг/кг (но не более 600 мг за раз)
                                </td>
                                <td className="bg-rose-50/60 border border-rose-100 px-2 py-1.5 text-[10px] text-foreground align-top leading-tight">
                                  Разовая доза для детей от 4 мес. 10–15 мг/кг (но не более 1000 мг за раз)
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-rose-50/40 border border-rose-100 px-2 py-1.5 text-[10px] text-center font-semibold text-muted-foreground" colSpan={3}>
                                  Дозировка доступных в РФ препаратов
                                </td>
                              </tr>
                              <tr>
                                {item.dosing.doseTable.columns.map((col, ci) => (
                                  <td
                                    key={ci}
                                    className="bg-rose-50/40 border border-rose-100 px-2 py-1.5 text-[10px] text-muted-foreground align-top leading-tight"
                                  >
                                    {col.form}
                                  </td>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="bg-rose-50/30 border border-rose-100 px-2 py-1.5 text-[10px] text-center font-semibold text-muted-foreground" colSpan={4}>
                                  Разовая доза
                                </td>
                              </tr>
                              {item.dosing.doseTable.rows.map((row, r) => (
                                <tr key={r} className={r % 2 === 0 ? "bg-rose-50/20" : "bg-white"}>
                                  <td className="border border-rose-100 px-2 py-1.5 font-semibold text-foreground">{row.weight}</td>
                                  {row.cells.map((cell, ci) => (
                                    <td key={ci} className="border border-rose-100 px-2 py-1.5 text-foreground whitespace-nowrap">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

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

                    {"forbidden" in item.dosing && item.dosing.forbidden && (
                      <div className="bg-rose-50 border border-rose-300 rounded-xl p-3">
                        <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <span className="text-base">⛔</span> Никогда не давать
                        </p>
                        <ul className="space-y-2">
                          {item.dosing.forbidden.map((f, fi) => (
                            <li key={fi} className="bg-white border border-rose-200 rounded-lg px-2.5 py-2">
                              <p className="text-[12px] font-bold text-rose-700">{f.name}</p>
                              <p className="text-[11px] text-foreground leading-relaxed mt-0.5">{f.reason}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {"cooling" in item.dosing && item.dosing.cooling && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                          <span className="text-base">❄️</span> {item.dosing.cooling.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                          {item.dosing.cooling.note}
                        </p>
                        <ul className="space-y-2">
                          {item.dosing.cooling.items.map((c, ci) => (
                            <li key={ci} className="bg-white border border-blue-100 rounded-lg px-2.5 py-2">
                              <p className="text-[12px] font-bold text-blue-700">{c.when}</p>
                              <p className="text-[11px] text-foreground leading-relaxed mt-0.5">{c.what}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 bg-rose-100 border border-rose-300 rounded-lg px-2.5 py-2">
                          <p className="text-[11px] font-bold text-rose-700 flex items-start gap-1.5">
                            <span>⛔</span>
                            <span>{item.dosing.cooling.forbidden}</span>
                          </p>
                        </div>
                      </div>
                    )}
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