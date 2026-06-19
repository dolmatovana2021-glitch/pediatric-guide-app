import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { vaccineRows, VACCINE_SOURCE } from "@/components/shared/vaccineData";
import {
  useVaccineStatuses,
  type DoseStatus,
} from "@/components/shared/vaccineStatus";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";

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

  const age = calcAge(profile.birthDate);
  const ageMonths = age ? age.years * 12 + age.months : null;

  const isDue = (doseAgeMonths: number, status: DoseStatus): boolean => {
    if (ageMonths === null) return false;
    if (status === "done") return false;
    return ageMonths >= doseAgeMonths;
  };

  const allDoses = useMemo(
    () => vaccineRows.flatMap((r) => r.doses.map((d) => ({ id: d.id, ageMonths: d.ageMonths }))),
    []
  );
  const counts = useMemo(() => {
    let done = 0;
    let planned = 0;
    let due = 0;
    for (const d of allDoses) {
      const s = statuses[d.id];
      if (s === "done") done += 1;
      else if (s === "planned") planned += 1;
      if (isDue(d.ageMonths, s || "none")) due += 1;
    }
    return { done, planned, due, total: allDoses.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses, allDoses, ageMonths]);

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
          {age && (
            <span className="ml-auto text-[11px] font-semibold bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
              {age.label}
            </span>
          )}
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

      {ageMonths === null ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="Info" size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Укажите дату рождения в профиле — и приложение подсветит прививки, которые уже пора делать по возрасту.
          </p>
        </div>
      ) : counts.due > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="BellRing" size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 leading-relaxed">
            По возрасту уже пора сделать <b>{counts.due}</b> прививок. Они отмечены значком «Пора» — обсудите их с педиатром.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="CircleCheck" size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            Все прививки по текущему возрасту отмечены. Так держать!
          </p>
        </div>
      )}

      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1.5 mb-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Выполнено
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Запланировано
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Пора по возрасту
        </span>
      </div>

      <div className="space-y-2.5">
        {vaccineRows.map((row) => {
          const doneInRow = row.doses.filter((d) => statuses[d.id] === "done").length;
          const dueInRow = row.doses.filter((d) => isDue(d.ageMonths, statuses[d.id] || "none")).length;
          const open = openId === row.id;
          return (
            <div
              key={row.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
                dueInRow > 0 ? "border-red-200 ring-1 ring-red-100" : "border-border"
              }`}
            >
              <button
                onClick={() => setOpenId(open ? null : row.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div className={`${row.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                  <Icon name={row.icon} fallback="Syringe" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm leading-tight">{row.disease}</p>
                    {dueInRow > 0 && (
                      <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Пора {dueInRow}
                      </span>
                    )}
                  </div>
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
                    const due = isDue(dose.ageMonths, status);
                    return (
                      <button
                        key={dose.id}
                        onClick={() => toggle(dose.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors active:scale-[0.98] ${
                          due ? "bg-red-50 border-red-300 text-red-700" : st.chip
                        }`}
                      >
                        <Icon name={due ? "BellRing" : st.icon} fallback="Circle" size={20} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{dose.label}</span>
                            <span className="text-[11px] font-medium bg-black/5 text-foreground/70 px-1.5 py-0.5 rounded-md">
                              {dose.age}
                            </span>
                            {due && (
                              <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                Пора
                              </span>
                            )}
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
