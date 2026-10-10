import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  listIllnessEntries,
  addIllnessEntry,
  removeIllnessEntry,
  getActiveChildId,
  listChildren,
  listIllnessCases,
  type IllnessCase,
  type IllnessEntry,
} from "@/components/shared/childProfile";
import {
  ActiveCaseCard,
  StartCaseForm,
} from "@/components/sections/IllnessCaseCard";
import { IllnessStats } from "@/components/sections/IllnessStats";
import { EntryCard } from "@/components/sections/IllnessEntryCard";
import { IllnessTempChart } from "@/components/sections/IllnessTempChart";
import { IllnessEntryForm } from "@/components/sections/IllnessEntryForm";
import { PastIllnessCases } from "@/components/sections/PastIllnessCases";

const EVENT_NAME = "malyshdok:childProfile:update";

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
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
                <IllnessTempChart
                  chartData={chartData}
                  lastTemp={lastTemp}
                  maxTemp={maxTemp}
                  entriesCount={entries.length}
                />
              )}

              {open ? (
                <IllnessEntryForm
                  datetime={datetime}
                  setDatetime={setDatetime}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  symptoms={symptoms}
                  toggleSymptom={toggleSymptom}
                  medication={medication}
                  setMedication={setMedication}
                  note={note}
                  setNote={setNote}
                  canSave={canSave}
                  onSave={save}
                  onCancel={() => setOpen(false)}
                />
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
            <PastIllnessCases
              childId={childId}
              pastCases={pastCases}
              allEntries={allEntries}
              activeCase={activeCase}
              expanded={expanded}
              setExpanded={setExpanded}
            />
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
