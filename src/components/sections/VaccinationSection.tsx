import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { vaccineRows, VACCINE_SOURCE } from "@/components/shared/vaccineData";
import {
  useVaccineStatuses,
  type DoseStatus,
} from "@/components/shared/vaccineStatus";
import { useChildProfile } from "@/components/shared/childProfile";

const statusStyle: Record<
  DoseStatus,
  { chip: string; icon: string; label: string; dot: string }
> = {
  none: {
    chip: "bg-white border-border text-muted-foreground",
    icon: "Circle",
    label: "Не отмечено",
    dot: "bg-muted-foreground/40",
  },
  planned: {
    chip: "bg-amber-50 border-amber-300 text-amber-700",
    icon: "Clock",
    label: "Запланировано",
    dot: "bg-amber-400",
  },
  done: {
    chip: "bg-emerald-50 border-emerald-300 text-emerald-700",
    icon: "CircleCheck",
    label: "Выполнено",
    dot: "bg-emerald-500",
  },
};

export function VaccinationSection() {
  const { statuses, toggle } = useVaccineStatuses();
  const profile = useChildProfile();
  const [openId, setOpenId] = useState<string | null>(null);

  const allDoses = useMemo(
    () => vaccineRows.flatMap((r) => r.doses.map((d) => d.id)),
    []
  );
  const counts = useMemo(() => {
    let done = 0;
    let planned = 0;
    for (const id of allDoses) {
      const s = statuses[id];
      if (s === "done") done += 1;
      else if (s === "planned") planned += 1;
    }
    return { done, planned, total: allDoses.length };
  }, [statuses, allDoses]);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="💉"
        title="Вакцинация"
        subtitle="Календарь прививок 2026 — отмечайте выполненные и запланированные"
      />

      <div className="bg-gradient-to-br from-teal-50 to-mint-50 border border-teal-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}</span>
          <p className="font-bold text-foreground text-sm">
            {profile.name ? `Прививки: ${profile.name}` : "Прививочный лист"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-2.5 text-center border border-emerald-100">
            <p className="text-xl font-bold text-emerald-600">{counts.done}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Выполнено</p>
          </div>
          <div className="bg-white rounded-xl p-2.5 text-center border border-amber-100">
            <p className="text-xl font-bold text-amber-600">{counts.planned}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Запланировано</p>
          </div>
          <div className="bg-white rounded-xl p-2.5 text-center border border-border">
            <p className="text-xl font-bold text-foreground">{counts.total}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Всего доз</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Выполнено
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Запланировано
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" /> Нажмите, чтобы отметить
        </span>
      </div>

      <div className="space-y-2.5">
        {vaccineRows.map((row) => {
          const doneInRow = row.doses.filter((d) => statuses[d.id] === "done").length;
          const open = openId === row.id;
          return (
            <div
              key={row.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenId(open ? null : row.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div className={`${row.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                  <Icon name={row.icon} fallback="Syringe" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight">{row.disease}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {doneInRow > 0 ? `${doneInRow} из ${row.doses.length} выполнено` : `${row.doses.length} прививок в курсе`}
                  </p>
                </div>
                <Icon
                  name={open ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  className="text-muted-foreground flex-shrink-0"
                />
              </button>

              {open && (
                <div className="px-3.5 pb-3.5 space-y-2 animate-fade-in">
                  {row.doses.map((dose) => {
                    const status: DoseStatus = statuses[dose.id] || "none";
                    const st = statusStyle[status];
                    return (
                      <button
                        key={dose.id}
                        onClick={() => toggle(dose.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors active:scale-[0.98] ${st.chip}`}
                      >
                        <Icon name={st.icon} fallback="Circle" size={20} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{dose.label}</span>
                            <span className="text-[11px] font-medium bg-black/5 text-foreground/70 px-1.5 py-0.5 rounded-md">
                              {dose.age}
                            </span>
                          </div>
                          {dose.note && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{dose.note}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold whitespace-nowrap">{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mt-5 px-1">
        {VACCINE_SOURCE} Точный график и препараты определяет ваш педиатр.
      </p>
    </SectionWrapper>
  );
}
