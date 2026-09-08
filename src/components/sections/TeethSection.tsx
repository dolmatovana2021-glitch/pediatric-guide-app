import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionShared";
import {
  getActiveChildId,
  listChildren,
  loadChildProfile,
  getTeeth,
  setToothDate,
  calcAge,
} from "@/components/shared/childProfile";
import {
  teethOf,
  teethByKind,
  toothState,
  stateMeta,
  expectedCount,
  rangeLabel,
  TOTAL_TEETH,
  TOTAL_PERMANENT_TEETH,
  type Tooth,
  type Jaw,
  type ToothKind,
} from "@/components/shared/teethData";

const EVENT_NAME = "malyshdok:childProfile:update";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU");
}

function ToothShape({
  tooth,
  erupted,
  ageMonths,
  onClick,
}: {
  tooth: Tooth;
  erupted: boolean;
  ageMonths: number | null;
  onClick: () => void;
}) {
  const state = toothState(tooth, erupted, ageMonths);
  const meta = stateMeta[state];
  const perm = tooth.kind === "permanent";
  const isMolar = perm ? tooth.order >= 5 : tooth.order >= 3;
  const scale = perm ? 0.56 : 1;

  return (
    <button
      onClick={onClick}
      title={`${tooth.group} · ${rangeLabel(tooth)}`}
      className="relative flex-shrink-0 active:scale-90 transition-transform"
      aria-label={`${tooth.group}, ${meta.label}`}
    >
      <svg
        width={Math.round((isMolar ? 34 : 27) * scale)}
        height={Math.round(34 * scale)}
        viewBox="0 0 30 34"
      >
        <path
          d={
            isMolar
              ? "M2 11c0-5 4-8 13-8s13 3 13 8c0 5-1 7-2.5 12-1 3.5-2 6-4 6s-2-4-4.5-4-2.5 4-4.5 4-3-2.5-4-6C3 18 2 16 2 11z"
              : "M6 9c0-4 3-6 9-6s9 2 9 6c0 6-1.5 9-3 14-1 3.5-2.5 5-3.5 5s-1.5-2-2.5-2-1.5 2-2.5 2-2.5-1.5-3.5-5C7.5 18 6 15 6 9z"
          }
          fill={meta.fill}
          stroke={meta.stroke}
          strokeWidth={erupted ? 2.2 : 1.6}
          strokeLinejoin="round"
        />
        {erupted && (
          <path
            d="M10 16l3.5 3.5L20 13"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {state === "due" && (
          <circle cx="15" cy="17" r="2.6" fill="#f59e0b" />
        )}
        {state === "late" && (
          <circle cx="15" cy="17" r="2.6" fill="#f43f5e" />
        )}
      </svg>
    </button>
  );
}

function JawRow({
  jaw,
  teeth,
  ageMonths,
  kind,
  onPick,
}: {
  jaw: Jaw;
  teeth: Record<string, string>;
  ageMonths: number | null;
  kind: ToothKind;
  onPick: (t: Tooth) => void;
}) {
  const right = teethOf(jaw, "right", kind);
  const left = teethOf(jaw, "left", kind);
  const ordered = [...right].reverse().concat(left);

  return (
    <div className="flex items-end justify-center gap-0.5">
      {ordered.map((t, i) => (
        <div key={t.id} className={i === right.length ? "ml-2" : ""}>
          <ToothShape
            tooth={t}
            erupted={Boolean(teeth[t.id])}
            ageMonths={ageMonths}
            onClick={() => onPick(t)}
          />
        </div>
      ))}
    </div>
  );
}

export function TeethSection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [teeth, setTeeth] = useState<Record<string, string>>({});
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [ageLabel, setAgeLabel] = useState("");
  const [picked, setPicked] = useState<Tooth | null>(null);
  const [dateInput, setDateInput] = useState(today());
  const [kind, setKind] = useState<ToothKind>("primary");

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setTeeth(id ? getTeeth(id) : {});
    const profile = loadChildProfile();
    const age = calcAge(profile.birthDate);
    setAgeMonths(age ? age.years * 12 + age.months : null);
    setAgeLabel(age ? age.label : "");
  };

  useEffect(() => {
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const currentTeeth = useMemo(() => teethByKind(kind), [kind]);
  const total = kind === "primary" ? TOTAL_TEETH : TOTAL_PERMANENT_TEETH;

  const eruptedCount = Object.keys(teeth).filter((k) =>
    currentTeeth.some((t) => t.id === k),
  ).length;

  const expected = ageMonths !== null ? expectedCount(ageMonths, kind) : null;

  const lateTeeth = useMemo(
    () =>
      ageMonths === null
        ? []
        : currentTeeth.filter(
            (t) => !teeth[t.id] && toothState(t, false, ageMonths) === "late",
          ),
    [teeth, ageMonths, currentTeeth],
  );

  const dueTeeth = useMemo(
    () =>
      ageMonths === null
        ? []
        : currentTeeth.filter(
            (t) => !teeth[t.id] && toothState(t, false, ageMonths) === "due",
          ),
    [teeth, ageMonths, currentTeeth],
  );

  const verdict = (() => {
    if (ageMonths === null)
      return {
        text: "Укажите дату рождения в профиле, чтобы сверить сроки с нормами.",
        tone: "bg-mint-50 border-mint-200",
        icon: "Info",
        iconTone: "text-primary",
      };
    if (lateTeeth.length > 0)
      return {
        text: `${lateTeeth.length} ${lateTeeth.length === 1 ? "зуб задерживается" : "зубов задерживаются"} более чем на полгода от верхней границы нормы. Стоит показать ребёнка стоматологу или педиатру.`,
        tone: "bg-rose-50 border-rose-200",
        icon: "TriangleAlert",
        iconTone: "text-rose-600",
      };
    if (dueTeeth.length > 0)
      return {
        text: `Сейчас по возрасту могут прорезаться ${dueTeeth.length} ${dueTeeth.length === 1 ? "зуб" : "зубов"}. Небольшие отклонения от сроков — вариант нормы.`,
        tone: "bg-amber-50 border-amber-200",
        icon: "Clock",
        iconTone: "text-amber-600",
      };
    if (kind === "permanent" && eruptedCount === 0)
      return {
        text: "Постоянные зубы обычно начинают прорезаться с 6 лет: первыми выходят моляры и нижние центральные резцы. Отмечайте их по мере смены молочных.",
        tone: "bg-mint-50 border-mint-200",
        icon: "Info",
        iconTone: "text-primary",
      };
    return {
      text:
        kind === "permanent"
          ? "Смена зубов идёт по возрастным нормам. Сроки индивидуальны, сдвиг на полгода–год встречается часто."
          : "Всё идёт по возрастным нормам. Сроки прорезывания индивидуальны, сдвиг на 2–3 месяца — это нормально.",
      tone: "bg-emerald-50 border-emerald-200",
      icon: "CircleCheck",
      iconTone: "text-emerald-600",
    };
  })();

  const openPicker = (t: Tooth) => {
    setPicked(t);
    setDateInput(teeth[t.id] || today());
  };

  const confirmTooth = () => {
    if (!picked) return;
    setToothDate(childId, picked.id, dateInput);
    setPicked(null);
  };

  const clearTooth = () => {
    if (!picked) return;
    setToothDate(childId, picked.id, null);
    setPicked(null);
  };

  const history = useMemo(
    () =>
      currentTeeth
        .filter((t) => teeth[t.id])
        .map((t) => ({ tooth: t, date: teeth[t.id] }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [teeth, currentTeeth],
  );

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🦷"
        title="Зубная формула"
        subtitle="Отмечайте молочные и коренные зубы на схеме и следите за сроками"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — отметки привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["primary", "permanent"] as ToothKind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors ${
                  kind === k
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border"
                }`}
              >
                {k === "primary" ? "Молочные" : "Коренные"}
              </button>
            ))}
          </div>

          <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground">Прорезалось</p>
                <p className="text-xl font-bold text-foreground">
                  {eruptedCount}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    из {total}
                  </span>
                </p>
              </div>
              {expected !== null && (
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground">Ожидается к возрасту</p>
                  <p className="text-xl font-bold text-foreground">~{expected}</p>
                </div>
              )}
              {ageLabel && (
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground">Возраст</p>
                  <p className="text-[13px] font-semibold text-foreground leading-tight">
                    {ageLabel}
                  </p>
                </div>
              )}
            </div>

            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(eruptedCount / total) * 100}%` }}
              />
            </div>

            <p className="text-[11px] font-semibold text-muted-foreground text-center mb-1">
              Верхняя челюсть
            </p>
            <JawRow jaw="upper" teeth={teeth} ageMonths={ageMonths} kind={kind} onPick={openPicker} />

            <div className="border-t border-dashed border-border my-3" />

            <JawRow jaw="lower" teeth={teeth} ageMonths={ageMonths} kind={kind} onPick={openPicker} />
            <p className="text-[11px] font-semibold text-muted-foreground text-center mt-1">
              Нижняя челюсть
            </p>

            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-teal-600 bg-white" />
                прорезался
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                пора
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                задерживается
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                ещё рано
              </span>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Нажмите на зуб, чтобы отметить дату
            </p>
          </div>

          <div className={`border rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 ${verdict.tone}`}>
            <Icon
              name={verdict.icon}
              fallback="Info"
              size={16}
              className={`${verdict.iconTone} flex-shrink-0 mt-0.5`}
            />
            <p className="text-[12px] text-foreground leading-snug">{verdict.text}</p>
          </div>

          {history.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                История прорезывания ({history.length})
              </p>
              <div className="space-y-1.5">
                {history.map(({ tooth, date }) => (
                    <div
                      key={tooth.id}
                      className="bg-white border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm"
                    >
                      <span className="text-base">🦷</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground leading-tight">
                          {tooth.shortName}
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            · {tooth.jaw === "upper" ? "верх" : "низ"},{" "}
                            {tooth.side === "left" ? "слева" : "справа"}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {fmtDate(date)} · норма {rangeLabel(tooth)}
                        </p>
                      </div>
                      <button
                        onClick={() => setToothDate(childId, tooth.id, null)}
                        className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
                        aria-label="Убрать отметку"
                      >
                        <Icon name="X" size={15} />
                      </button>
                    </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-snug">
            Сроки прорезывания индивидуальны: отклонение на 2–3 месяца встречается часто и
            обычно не требует лечения. Раздел носит справочный характер и не заменяет осмотр
            врача.
          </p>
        </>
      )}

      {picked && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setPicked(null)}
        >
          <div
            className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-foreground text-sm">{picked.group}</p>
            <p className="text-[11px] text-muted-foreground mb-3">
              {picked.jaw === "upper" ? "Верхняя" : "Нижняя"} челюсть,{" "}
              {picked.side === "left" ? "слева" : "справа"} · норма {rangeLabel(picked)}
            </p>

            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Дата прорезывания
            </label>
            <input
              type="date"
              value={dateInput}
              max={today()}
              onChange={(e) => setDateInput(e.target.value)}
              className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <div className="flex gap-2">
              <button
                onClick={confirmTooth}
                className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm active:scale-95 transition-transform"
              >
                Отметить
              </button>
              {teeth[picked.id] && (
                <button
                  onClick={clearTooth}
                  className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
                >
                  Убрать
                </button>
              )}
              <button
                onClick={() => setPicked(null)}
                className="px-4 bg-white border border-border text-muted-foreground rounded-xl py-2.5 font-semibold text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export default TeethSection;