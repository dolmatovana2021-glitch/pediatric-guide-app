import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  getActiveChildId,
  listChildren,
  loadChildProfile,
  listSleepEntries,
  addSleepEntry,
  removeSleepEntry,
  calcAge,
  type SleepEntry,
} from "@/components/shared/childProfile";
import {
  sleepNormFor,
  sleepVerdict,
  verdictMeta,
  formatHours,
} from "@/components/shared/sleepData";

const EVENT_NAME = "malyshdok:childProfile:update";

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function hoursBetween(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return (b - a) / 3600000;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function fmtDay(key: string): string {
  const d = new Date(key);
  if (isNaN(d.getTime())) return key;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

function isNightSleep(start: string): boolean {
  const h = new Date(start).getHours();
  return h >= 19 || h < 6;
}

export function SleepSection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const [start, setStart] = useState(localNow());
  const [end, setEnd] = useState(localNow());

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setEntries(id ? listSleepEntries(id) : []);
    const age = calcAge(loadChildProfile().birthDate);
    setAgeMonths(age ? age.years * 12 + age.months : null);
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

  const norm = sleepNormFor(ageMonths);

  const byDay = useMemo(() => {
    const map = new Map<string, { total: number; night: number; day: number }>();
    for (const e of entries) {
      const h = hoursBetween(e.start, e.end);
      if (h <= 0) continue;
      const key = dayKey(e.start);
      const cur = map.get(key) || { total: 0, night: 0, day: 0 };
      cur.total += h;
      if (isNightSleep(e.start)) cur.night += h;
      else cur.day += h;
      map.set(key, cur);
    }
    return [...map.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [entries]);

  const chartData = byDay.slice(-14).map((d) => ({
    day: fmtDay(d.key),
    total: Number(d.total.toFixed(1)),
  }));

  const lastDay = byDay.length ? byDay[byDay.length - 1] : null;
  const avg7 = useMemo(() => {
    const last = byDay.slice(-7);
    if (!last.length) return null;
    return last.reduce((s, d) => s + d.total, 0) / last.length;
  }, [byDay]);

  const verdict = norm && avg7 !== null ? sleepVerdict(avg7, norm) : null;
  const vMeta = verdict ? verdictMeta[verdict] : null;

  const save = () => {
    const h = hoursBetween(start, end);
    if (h <= 0) return;
    addSleepEntry(childId, { start, end });
    setOpen(false);
    setStart(localNow());
    setEnd(localNow());
  };

  const duration = hoursBetween(start, end);

  const recent = [...entries].reverse().slice(0, 30);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="😴"
        title="Сон"
        subtitle="Засыпание, пробуждение и сравнение с возрастной нормой"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — записи сна привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          {norm && (
            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground">Норма для возраста</p>
                  <p className="text-lg font-bold text-foreground leading-tight">
                    {norm.minHours}–{norm.maxHours} ч
                  </p>
                  <p className="text-[11px] text-muted-foreground">{norm.label}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground">Сегодня / посл. день</p>
                  <p className="text-lg font-bold text-foreground leading-tight">
                    {lastDay ? formatHours(lastDay.total) : "—"}
                  </p>
                  {lastDay && (
                    <p className="text-[11px] text-muted-foreground">
                      ночь {formatHours(lastDay.night)}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground">Среднее за 7 дней</p>
                  <p
                    className={`text-lg font-bold leading-tight ${vMeta ? vMeta.tone : "text-foreground"}`}
                  >
                    {avg7 !== null ? formatHours(avg7) : "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{norm.naps}</p>
                </div>
              </div>
            </div>
          )}

          {vMeta && (
            <div className={`border rounded-2xl p-3.5 mb-3 flex items-start gap-2.5 ${vMeta.card}`}>
              <Icon
                name={vMeta.icon}
                fallback="Info"
                size={16}
                className={`${vMeta.iconTone} flex-shrink-0 mt-0.5`}
              />
              <p className="text-[12px] text-foreground leading-snug">
                {verdict === "ok" &&
                  "Ребёнок спит в пределах возрастной нормы. Потребность во сне индивидуальна, небольшие колебания по дням — это нормально."}
                {verdict === "low" &&
                  `В среднем ребёнок спит меньше рекомендованных ${norm!.minHours} ч. Если он вялый, капризный или плохо засыпает — обсудите режим с педиатром.`}
                {verdict === "high" &&
                  `В среднем ребёнок спит больше рекомендованных ${norm!.maxHours} ч. Обычно это не проблема, но при постоянной сонливости стоит показаться врачу.`}
              </p>
            </div>
          )}

          {!norm && (
            <div className="bg-mint-50 border border-mint-200 rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
              <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-foreground leading-snug">
                Укажите дату рождения в профиле, чтобы сравнивать сон с возрастной нормой.
              </p>
            </div>
          )}

          {chartData.length > 0 && norm && (
            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                Сон по дням, часов
              </p>
              <div className="h-[210px] -ml-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 20]} width={26} />
                    <Tooltip
                      formatter={(v: number) => [formatHours(Number(v)), "Всего сна"]}
                      contentStyle={{ fontSize: 12, borderRadius: 12 }}
                    />
                    <ReferenceArea
                      y1={norm.minHours}
                      y2={norm.maxHours}
                      fill="#10b981"
                      fillOpacity={0.12}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {chartData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={
                            d.total < norm.minHours
                              ? "#f59e0b"
                              : d.total > norm.maxHours
                                ? "#0ea5e9"
                                : "#10b981"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Зелёная зона — возрастная норма {norm.minHours}–{norm.maxHours} ч
              </p>
            </div>
          )}

          {open ? (
            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Уснул
                </label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Проснулся
                </label>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {duration > 0 && (
                <p className="text-[12px] text-foreground bg-mint-50 border border-mint-200 rounded-xl px-3 py-2">
                  Продолжительность: <span className="font-semibold">{formatHours(duration)}</span>
                  {" · "}
                  {isNightSleep(start) ? "ночной сон" : "дневной сон"}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={duration <= 0}
                  className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setStart(localNow());
                setEnd(localNow());
                setOpen(true);
              }}
              className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
            >
              <Icon name="Plus" size={16} />
              Добавить сон
            </button>
          )}

          {entries.length === 0 ? (
            <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
              <Icon name="Moon" size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-[13px] text-muted-foreground leading-snug">
                Записей пока нет. Отмечайте засыпание и пробуждение — приложение посчитает
                суточный сон и сравнит его с нормой.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Последние записи ({entries.length})
              </p>
              {recent.map((e) => {
                const h = hoursBetween(e.start, e.end);
                const night = isNightSleep(e.start);
                return (
                  <div
                    key={e.id}
                    className="bg-white border border-border rounded-2xl px-3.5 py-3 flex items-center gap-2.5 shadow-sm"
                  >
                    <span className="text-base">{night ? "🌙" : "☀️"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground leading-tight">
                        {formatHours(h)}
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          · {night ? "ночной" : "дневной"}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {fmtDay(dayKey(e.start))} · {fmtTime(e.start)} — {fmtTime(e.end)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSleepEntry(childId, e.id)}
                      className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
                      aria-label="Удалить запись"
                    >
                      <Icon name="X" size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-snug mt-4">
            Нормы приведены по рекомендациям Американской академии медицины сна. Потребность
            во сне индивидуальна; раздел носит справочный характер и не заменяет консультацию
            врача.
          </p>
        </>
      )}
    </SectionWrapper>
  );
}

export default SleepSection;
