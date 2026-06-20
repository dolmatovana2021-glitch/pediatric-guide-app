import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  checkupPeriods,
  doctorsForGender,
  CHECKUP_SOURCE,
} from "@/components/shared/checkupData";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";

export function CheckupSection() {
  const profile = useChildProfile();
  const [openId, setOpenId] = useState<string | null>(null);

  const age = calcAge(profile.birthDate);
  const ageMonths = age ? age.years * 12 + age.months : null;

  const currentId = useMemo(() => {
    if (ageMonths === null) return null;
    let best: string | null = null;
    for (const p of checkupPeriods) {
      if (p.ageMonths <= ageMonths) best = p.id;
    }
    return best;
  }, [ageMonths]);

  const nextId = useMemo(() => {
    if (ageMonths === null) return null;
    const next = checkupPeriods.find((p) => p.ageMonths > ageMonths);
    return next ? next.id : null;
  }, [ageMonths]);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🩺"
        title="Профилактические осмотры"
        subtitle="График осмотров и исследований по приказу Минздрава № 211н от 14.04.2025"
      />

      <div className="bg-gradient-to-br from-sky-50 to-mint-50 border border-sky-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
          </span>
          <p className="font-bold text-foreground text-sm">
            {profile.name ? `Осмотры: ${profile.name}` : "График осмотров"}
          </p>
          {age && (
            <span className="ml-auto text-[11px] font-semibold bg-white text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
              {age.label}
            </span>
          )}
        </div>
        {ageMonths === null ? (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Укажите дату рождения в профиле — мы подсветим осмотр, который актуален сейчас.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Текущий и ближайший по возрасту осмотры выделены. Нажмите на период, чтобы увидеть врачей и исследования.
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        {checkupPeriods.map((p) => {
          const open = openId === p.id;
          const isCurrent = p.id === currentId;
          const isNext = p.id === nextId;
          const doctors = doctorsForGender(p, profile.gender);
          return (
            <div
              key={p.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
                isCurrent
                  ? "border-sky-300 ring-1 ring-sky-100"
                  : isNext
                    ? "border-amber-200"
                    : "border-border"
              }`}
            >
              <button
                onClick={() => setOpenId(open ? null : p.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border text-sm font-bold ${
                    isCurrent
                      ? "bg-sky-100 text-sky-700 border-sky-200"
                      : "bg-mint-50 text-foreground border-mint-200"
                  }`}
                >
                  {p.no}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm leading-tight">{p.age}</p>
                    {isCurrent && (
                      <span className="text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full">
                        Сейчас
                      </span>
                    )}
                    {isNext && (
                      <span className="text-[9px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
                        Ближайший
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {doctors.length} {doctors.length === 1 ? "специалист" : "специалистов"}
                    {p.studies.length > 0 ? ` · ${p.studies.length} исследований` : ""}
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
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Врачи-специалисты
                    </p>
                    <div className="space-y-1.5">
                      {doctors.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-mint-50 border border-mint-200 rounded-xl px-3 py-2"
                        >
                          <Icon name="Stethoscope" size={15} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground leading-snug">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {p.studies.length > 0 ? (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Лабораторные и инструментальные исследования
                      </p>
                      <div className="space-y-1.5">
                        {p.studies.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2"
                          >
                            <Icon name="FlaskConical" size={15} className="text-sky-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-foreground leading-snug">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground px-1">
                      Лабораторные и инструментальные исследования не предусмотрены для этого возраста.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mt-5 px-1">
        {CHECKUP_SOURCE} Точный объём осмотра определяет врач.
      </p>
    </SectionWrapper>
  );
}
