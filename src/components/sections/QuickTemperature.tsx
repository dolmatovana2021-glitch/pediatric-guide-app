import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  addIllnessEntry,
  getActiveIllnessCase,
  listIllnessEntries,
  removeIllnessEntry,
  setActiveChildId,
  useChildren,
  type IllnessEntry,
} from "@/components/shared/childProfile";
import type { Section } from "@/components/shared/sectionTypes";
import { caseDay, caseTitle } from "@/components/sections/IllnessCaseCard";

const MIN = 34;
const MAX = 43;
const DEFAULT_TEMP = 37.0;
const PRESETS = [36.6, 37.5, 38.0, 38.5, 39.0, 39.5];

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function fmt(n: number) {
  return n.toFixed(1).replace(".", ",");
}

function tone(t: number) {
  if (t >= 39) return { text: "text-rose-600 dark:text-rose-400", chip: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300", label: "Высокая" };
  if (t >= 38) return { text: "text-orange-600 dark:text-orange-400", chip: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300", label: "Повышенная" };
  if (t >= 37.1) return { text: "text-amber-600 dark:text-amber-400", chip: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300", label: "Субфебрильная" };
  if (t >= 35.5) return { text: "text-emerald-600 dark:text-emerald-400", chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300", label: "Нормальная" };
  return { text: "text-sky-600 dark:text-sky-400", chip: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300", label: "Пониженная" };
}

function lastTemperature(entries: IllnessEntry[]): IllnessEntry | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].temperature !== null) return entries[i];
  }
  return null;
}

function ago(datetime: string): string {
  const diff = Date.now() - new Date(datetime).getTime();
  if (Number.isNaN(diff)) return "";
  const min = Math.round(diff / 60000);
  if (min < 1) return "только что";
  if (min < 60) return `${min} мин назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ч назад`;
  return new Date(datetime).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function QuickTemperatureButton({ setSection }: { setSection: (s: Section) => void }) {
  const { list, activeId } = useChildren();
  const [open, setOpen] = useState(false);
  const [childId, setChildId] = useState("");
  const [value, setValue] = useState(DEFAULT_TEMP);
  const [draft, setDraft] = useState(fmt(DEFAULT_TEMP));

  const sickChildren = useMemo(
    () => list.filter((c) => getActiveIllnessCase(c.id)),
    [list],
  );
  const active = sickChildren.find((c) => c.id === activeId) ?? sickChildren[0] ?? null;
  const activeCase = active ? getActiveIllnessCase(active.id) : null;
  const last = useMemo(
    () =>
      active && activeCase
        ? lastTemperature(listIllnessEntries(active.id).filter((e) => e.caseId === activeCase.id))
        : null,
    [active, activeCase],
  );

  useEffect(() => {
    if (!open) return;
    const id = active?.id || "";
    setChildId(id);
    const prev = id ? lastTemperature(listIllnessEntries(id)) : null;
    const start = prev?.temperature != null && Date.now() - new Date(prev.datetime).getTime() < 2 * 86400000
      ? prev.temperature
      : DEFAULT_TEMP;
    setValue(start);
    setDraft(fmt(start));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickable = sickChildren;

  const apply = (n: number) => {
    const v = round1(Math.min(MAX, Math.max(MIN, n)));
    setValue(v);
    setDraft(fmt(v));
  };

  const onDraft = (raw: string) => {
    const cleaned = raw.replace(/[^\d.,]/g, "").slice(0, 4);
    setDraft(cleaned);
    const n = parseFloat(cleaned.replace(",", "."));
    if (!Number.isNaN(n) && n >= MIN && n <= MAX) setValue(round1(n));
  };

  const draftNum = parseFloat(draft.replace(",", "."));
  const draftValid = !Number.isNaN(draftNum) && draftNum >= MIN && draftNum <= MAX;

  const save = () => {
    if (!childId || !draftValid) return;
    const temp = round1(draftNum);
    const entryId = addIllnessEntry(childId, {
      datetime: localNow(),
      temperature: temp,
      symptoms: [],
      medication: "",
      note: "",
    });
    if (childId !== activeId) setActiveChildId(childId);
    setOpen(false);
    if (!entryId) return;
    const child = list.find((c) => c.id === childId);
    const who = child?.name?.trim() ? ` · ${child.name.trim()}` : "";
    toast.success(`Записано: ${fmt(temp)} °C${who}`, {
      description: temp >= 38 ? "При температуре от 38 °C загляните в «Дневник болезни» и «Первую помощь»" : "Запись добавлена в дневник болезни",
      action: { label: "Отменить", onClick: () => removeIllnessEntry(childId, entryId) },
      duration: 6000,
    });
  };

  if (!active || !activeCase) return null;

  const t = tone(draftValid ? draftNum : value);
  const lastTone = last?.temperature != null ? tone(last.temperature) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mb-5 rounded-3xl border border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-900/60 p-3.5 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
      >
        <span className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-2xl flex-shrink-0">🌡️</span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold text-sm text-foreground">Записать температуру</span>
          <span className="block text-[11px] text-muted-foreground truncate">
            {last?.temperature != null ? (
              <>
                Последняя:{" "}
                <span className={`font-semibold ${lastTone?.text}`}>{fmt(last.temperature)} °C</span>
                {" · "}
                {ago(last.datetime)}
              </>
            ) : (
              <>
                {caseTitle(activeCase)} · {caseDay(activeCase)}-й день
                {active.name ? ` · ${active.name}` : ""}
              </>
            )}
          </span>
        </span>
        <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/30">
          <Icon name="Plus" size={20} />
        </span>
      </button>

      <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        <DrawerContent className="max-w-[480px] mx-auto">
          <DrawerHeader className="text-center pb-1">
            <DrawerTitle className="text-[17px]">Температура</DrawerTitle>
            <DrawerDescription className="text-[12px]">
              Сохранится в дневник болезни с текущим временем
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6">
            {pickable.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 -mx-1 px-1 justify-center flex-wrap">
                {pickable.map((c, i) => {
                  const sel = c.id === childId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setChildId(c.id)}
                      className={`text-[13px] rounded-full px-3.5 py-1.5 border font-semibold transition-colors ${
                        sel ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
                      }`}
                    >
                      {c.gender === "boy" ? "👦 " : c.gender === "girl" ? "👧 " : "🧒 "}
                      {c.name?.trim() || `Ребёнок ${i + 1}`}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => apply(value - 0.1)}
                aria-label="Меньше на 0,1"
                className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground active:scale-90 transition-transform"
              >
                <Icon name="Minus" size={24} />
              </button>
              <div className="flex items-baseline justify-center gap-0.5 w-[160px]">
                <input
                  value={draft}
                  onChange={(e) => onDraft(e.target.value)}
                  onBlur={() => draftValid && apply(draftNum)}
                  inputMode="decimal"
                  aria-label="Температура"
                  className={`w-[118px] bg-transparent text-right text-[50px] font-bold leading-none tabular-nums focus:outline-none ${t.text}`}
                />
                <span className="text-xl font-semibold text-muted-foreground">°C</span>
              </div>
              <button
                onClick={() => apply(value + 0.1)}
                aria-label="Больше на 0,1"
                className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground active:scale-90 transition-transform"
              >
                <Icon name="Plus" size={24} />
              </button>
            </div>

            <div className="flex justify-center mt-2 h-6">
              {draftValid ? (
                <span className={`text-[12px] font-semibold rounded-full px-2.5 py-0.5 ${t.chip}`}>{t.label}</span>
              ) : (
                <span className="text-[12px] text-rose-600 font-medium">Введите от 34 до 43 °C</span>
              )}
            </div>

            <div className="grid grid-cols-6 gap-1.5 mt-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => apply(p)}
                  className={`rounded-xl py-2 text-[13px] font-semibold border tabular-nums transition-colors ${
                    draftValid && round1(draftNum) === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  {fmt(p)}
                </button>
              ))}
            </div>

            <button
              onClick={save}
              disabled={!draftValid || !childId}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-3.5 text-[15px] font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              <Icon name="Check" size={18} />
              Сохранить
            </button>
            <button
              onClick={() => {
                setOpen(false);
                if (childId !== activeId) setActiveChildId(childId);
                setSection("illness");
              }}
              className="mt-2 w-full text-[13px] text-muted-foreground font-medium py-2 flex items-center justify-center gap-1"
            >
              Добавить симптомы и лекарства в дневнике
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default QuickTemperatureButton;
