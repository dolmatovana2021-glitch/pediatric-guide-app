import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  listIllnessEntries,
  addIllnessEntry,
  removeIllnessEntry,
  getActiveChildId,
  listChildren,
  listIllnessCases,
  removeIllnessCase,
  reopenIllnessCase,
  type IllnessCase,
  type IllnessEntry,
} from "@/components/shared/childProfile";
import {
  ActiveCaseCard,
  StartCaseForm,
  caseRange,
  caseTitle,
} from "@/components/sections/IllnessCaseCard";
import { IllnessStats } from "@/components/sections/IllnessStats";

const EVENT_NAME = "malyshdok:childProfile:update";

const SYMPTOMS = [
  "Кашель",
  "Насморк",
  "Боль в горле",
  "Рвота",
  "Понос",
  "Сыпь",
  "Вялость",
  "Плохой аппетит",
  "Боль в животе",
  "Боль в ухе",
];

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function tempTone(t: number | null): string {
  if (t === null) return "text-muted-foreground";
  if (t >= 39) return "text-rose-600";
  if (t >= 38) return "text-orange-600";
  if (t >= 37.1) return "text-amber-600";
  return "text-emerald-600";
}

function fmtDateTime(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EntryCard({ e, onRemove }: { e: IllnessEntry; onRemove: () => void }) {
  return (
    <div
      className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">
            {fmtDateTime(e.datetime)}
          </p>
          {e.temperature !== null && (
            <p className={`text-lg font-bold leading-tight ${tempTone(e.temperature)}`}>
              {e.temperature.toFixed(1)} °C
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
          aria-label="Удалить запись"
        >
          <Icon name="X" size={15} />
        </button>
      </div>

      {e.symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {e.symptoms.map((s) => (
            <span
              key={s}
              className="text-[11px] bg-mint-50 border border-mint-200 text-foreground rounded-full px-2.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {e.medication && (
        <p className="text-[12px] text-foreground mt-2 flex items-start gap-1.5">
          <Icon name="Pill" size={13} className="text-primary flex-shrink-0 mt-0.5" />
          {e.medication}
        </p>
      )}

      {e.note && (
        <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
          {e.note}
        </p>
      )}
    </div>
  );
}

export function IllnessDiarySection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [allEntries, setAllEntries] = useState<IllnessEntry[]>([]);
  const [cases, setCases] = useState<IllnessCase[]>([]);
  const [open, setOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [datetime, setDatetime] = useState(localNow());
  const [temperature, setTemperature] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [medication, setMedication] = useState("");
  const [note, setNote] = useState("");

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setAllEntries(id ? listIllnessEntries(id) : []);
    setCases(id ? listIllnessCases(id) : []);
  };

  const activeCase = useMemo(() => [...cases].reverse().find((c) => !c.endedAt) ?? null, [cases]);
  const entries = useMemo(
    () => (activeCase ? allEntries.filter((e) => e.caseId === activeCase.id) : []),
    [allEntries, activeCase],
  );
  const pastCases = useMemo(() => cases.filter((c) => c.endedAt).reverse(), [cases]);
  const looseEntries = useMemo(
    () => allEntries.filter((e) => !e.caseId || !cases.some((c) => c.id === e.caseId)),
    [allEntries, cases],
  );

  useEffect(() => {
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const chartData = useMemo(
    () =>
      entries
        .filter((e) => e.temperature !== null)
        .map((e) => ({
          time: new Date(e.datetime).getTime(),
          temp: e.temperature as number,
        })),
    [entries],
  );

  const lastTemp = chartData.length ? chartData[chartData.length - 1].temp : null;
  const maxTemp = chartData.length ? Math.max(...chartData.map((d) => d.temp)) : null;

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const save = () => {
    const t = temperature ? parseFloat(temperature.replace(",", ".")) : null;
    if (!datetime) return;
    if (t === null && symptoms.length === 0 && !medication.trim() && !note.trim()) return;
    addIllnessEntry(childId, {
      datetime,
      temperature: t !== null && !isNaN(t) ? t : null,
      symptoms,
      medication: medication.trim(),
      note: note.trim(),
    });
    setTemperature("");
    setSymptoms([]);
    setMedication("");
    setNote("");
    setDatetime(localNow());
    setOpen(false);
  };

  const canSave =
    Boolean(datetime) &&
    (Boolean(temperature) || symptoms.length > 0 || Boolean(medication.trim()) || Boolean(note.trim()));

  return (
    <SectionWrapper>
      <SectionTitle
        bear="thermometer"
        emoji="🤒"
        title="Дневник болезни"
        subtitle="Температура, симптомы и лекарства с датой и временем"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — записи привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          {activeCase ? (
            <>
              <ActiveCaseCard childId={childId} current={activeCase} />
              {chartData.length > 0 && (
                <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-[11px] text-muted-foreground">Последняя</p>
                      <p className={`text-xl font-bold ${tempTone(lastTemp)}`}>
                        {lastTemp?.toFixed(1)} °C
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-muted-foreground">Максимальная</p>
                      <p className={`text-xl font-bold ${tempTone(maxTemp)}`}>
                        {maxTemp?.toFixed(1)} °C
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-muted-foreground">Записей</p>
                      <p className="text-xl font-bold text-foreground">{entries.length}</p>
                    </div>
                  </div>

                  <div className="h-[210px] -ml-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="time"
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) =>
                            new Date(v).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                            })
                          }
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          domain={[35, 41]}
                          ticks={[35, 36, 37, 38, 39, 40, 41]}
                          width={30}
                        />
                        <Tooltip
                          formatter={(v: number) => [`${Number(v).toFixed(1)} °C`, "Температура"]}
                          labelFormatter={(l) => fmtDateTime(new Date(Number(l)).toISOString())}
                          contentStyle={{ fontSize: 12, borderRadius: 12 }}
                        />
                        <ReferenceLine y={37} stroke="#fcd34d" strokeDasharray="4 4" />
                        <ReferenceLine y={38} stroke="#fb923c" strokeDasharray="4 4" />
                        <ReferenceLine y={39} stroke="#f87171" strokeDasharray="4 4" />
                        <Line
                          dataKey="temp"
                          stroke="#e11d48"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#e11d48" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-amber-300 rounded" /> 37 °C
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-orange-400 rounded" /> 38 °C
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-red-400 rounded" /> 39 °C
                    </span>
                  </div>
                </div>
              )}

              {open ? (
                <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mb-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Дата и время
                    </label>
                    <input
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      className="block w-full box-border appearance-none h-[42px] px-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Температура, °C
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="34"
                      max="43"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="37.5"
                      className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                      Симптомы
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SYMPTOMS.map((s) => {
                        const active = symptoms.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleSymptom(s)}
                            className={`text-[12px] rounded-full px-3 py-1.5 border font-medium transition-colors ${
                              active
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-mint-50 text-foreground border-mint-200"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Лекарство и доза
                    </label>
                    <input
                      type="text"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      placeholder="Например: Парацетамол 120 мг"
                      className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Заметка
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Как ребёнок себя чувствует"
                      className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={save}
                      disabled={!canSave}
                      className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      Сохранить запись
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 bg-card border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDatetime(localNow());
                    setOpen(true);
                  }}
                  className="w-full bg-primary text-primary-foreground rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
                >
                  <Icon name="Plus" size={16} />
                  Добавить запись
                </button>
              )}

              {entries.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-3xl p-8 text-center">
                  <Icon name="NotebookPen" fallback="FileText" size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-[13px] text-muted-foreground leading-snug">
                    Записей пока нет. Отмечайте температуру, симптомы и лекарства — потом будет
                    удобно показать динамику врачу.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Записи этой болезни ({entries.length})
                  </p>
                  {[...entries].reverse().map((e) => (
                    <EntryCard key={e.id} e={e} onRemove={() => removeIllnessEntry(childId, e.id)} />
                  ))}
                </div>
              )}
            </>
          ) : starting ? (
            <StartCaseForm
              childId={childId}
              onCancel={() => setStarting(false)}
              onStarted={() => {
                setStarting(false);
                setDatetime(localNow());
                setOpen(true);
              }}
            />
          ) : (
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm mb-4 text-center">
              <div className="text-4xl mb-2">😊</div>
              <p className="font-bold text-foreground text-[15px]">Малыш здоров</p>
              <p className="text-[12px] text-muted-foreground leading-snug mt-1 mb-4">
                Когда заболеет — начните новый случай. На главном экране появится кнопка быстрой
                записи температуры, а после выздоровления она скроется.
              </p>
              <button
                onClick={() => setStarting(true)}
                className="w-full bg-rose-500 text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <Icon name="Plus" size={16} />
                Добавить новый случай болезни
              </button>
            </div>
          )}

          {cases.length > 0 && <IllnessStats cases={cases} entries={allEntries} />}

          {pastCases.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground px-1">
                Прошлые болезни ({pastCases.length})
              </p>
              {pastCases.map((c) => {
                const items = allEntries.filter((e) => e.caseId === c.id);
                const temps = items.map((e) => e.temperature).filter((t): t is number => t !== null);
                const max = temps.length ? Math.max(...temps) : null;
                const isOpen = expanded === c.id;
                return (
                  <div key={c.id} className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpanded(isOpen ? null : c.id)}
                      className="w-full flex items-center gap-3 p-3.5 text-left"
                    >
                      <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">🩹</span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-sm text-foreground truncate">{caseTitle(c)}</span>
                        <span className="block text-[11px] text-muted-foreground truncate">
                          {caseRange(c)}
                          {max !== null && <> · макс. <span className={`font-semibold ${tempTone(max)}`}>{max.toFixed(1)} °C</span></>}
                        </span>
                      </span>
                      <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0" />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 space-y-2">
                        {items.length === 0 ? (
                          <p className="text-[12px] text-muted-foreground">Записей нет</p>
                        ) : (
                          [...items].reverse().map((e) => (
                            <EntryCard key={e.id} e={e} onRemove={() => removeIllnessEntry(childId, e.id)} />
                          ))
                        )}
                        <div className="flex gap-2 pt-1">
                          {!activeCase && (
                            <button
                              onClick={() => reopenIllnessCase(childId, c.id)}
                              className="flex-1 text-[12px] font-semibold text-foreground bg-muted rounded-xl py-2 active:scale-95 transition-transform"
                            >
                              Снова болеет
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm("Удалить этот случай вместе со всеми записями?")) {
                                items.forEach((e) => removeIllnessEntry(childId, e.id));
                                removeIllnessCase(childId, c.id);
                              }
                            }}
                            className="flex-1 text-[12px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl py-2 active:scale-95 transition-transform"
                          >
                            Удалить случай
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {looseEntries.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground px-1">
                Ранние записи ({looseEntries.length})
              </p>
              {[...looseEntries].reverse().map((e) => (
                <EntryCard key={e.id} e={e} onRemove={() => removeIllnessEntry(childId, e.id)} />
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-snug mt-4">
            Дневник помогает точнее рассказать врачу о течении болезни. Он не заменяет
            осмотр специалиста.
          </p>
        </>
      )}
    </SectionWrapper>
  );
}

export default IllnessDiarySection;
