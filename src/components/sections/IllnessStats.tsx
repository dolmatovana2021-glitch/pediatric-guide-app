import { useMemo, useState } from "react";
import type { IllnessCase, IllnessEntry } from "@/components/shared/childProfile";

const DAY = 86400000;
const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

type Period = { id: string; label: string; from: Date; to: Date };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function caseBounds(c: IllnessCase): [Date, Date] {
  const s = startOfDay(new Date(c.startedAt));
  const e = startOfDay(c.endedAt ? new Date(c.endedAt) : new Date());
  return [s, e < s ? s : e];
}

function overlapDays(c: IllnessCase, from: Date, to: Date): number {
  const [s, e] = caseBounds(c);
  const a = s > from ? s : from;
  const b = e < to ? e : to;
  if (b < a) return 0;
  return Math.round((b.getTime() - a.getTime()) / DAY) + 1;
}

function titleKey(t: string) {
  return t.trim().replace(/\s+/g, " ").toLowerCase().replace(/ё/g, "е");
}

function displayTitle(t: string) {
  const v = t.trim().replace(/\s+/g, " ");
  if (!v) return "Без названия";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function buildPeriods(cases: IllnessCase[]): Period[] {
  const today = startOfDay(new Date());
  const yearAgo = new Date(today);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  yearAgo.setDate(yearAgo.getDate() + 1);
  const periods: Period[] = [{ id: "12m", label: "12 месяцев", from: yearAgo, to: today }];
  const years = new Set<number>();
  cases.forEach((c) => {
    const [s, e] = caseBounds(c);
    for (let y = s.getFullYear(); y <= e.getFullYear(); y++) years.add(y);
  });
  [...years]
    .sort((a, b) => b - a)
    .forEach((y) => {
      const to = y === today.getFullYear() ? today : new Date(y, 11, 31);
      periods.push({ id: String(y), label: `${y} год`, from: new Date(y, 0, 1), to });
    });
  return periods;
}

function monthBuckets(p: Period) {
  const buckets: { key: string; label: string; from: Date; to: Date }[] = [];
  const cur = new Date(p.from.getFullYear(), p.from.getMonth(), 1);
  while (cur <= p.to) {
    const from = new Date(Math.max(cur.getTime(), p.from.getTime()));
    const end = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
    const to = end > p.to ? p.to : end;
    buckets.push({ key: `${cur.getFullYear()}-${cur.getMonth()}`, label: MONTHS[cur.getMonth()], from, to });
    cur.setMonth(cur.getMonth() + 1);
  }
  return buckets.slice(-12);
}

export function IllnessStats({ cases, entries }: { cases: IllnessCase[]; entries: IllnessEntry[] }) {
  const periods = useMemo(() => buildPeriods(cases), [cases]);
  const [periodId, setPeriodId] = useState("12m");
  const period = periods.find((p) => p.id === periodId) ?? periods[0];

  const stats = useMemo(() => {
    const inPeriod = cases
      .map((c) => ({ c, days: overlapDays(c, period.from, period.to) }))
      .filter((x) => x.days > 0);
    const totalDays = inPeriod.reduce((s, x) => s + x.days, 0);
    const finished = inPeriod.filter((x) => x.c.endedAt);
    const avg = finished.length
      ? Math.round(
          finished.reduce((s, x) => {
            const [a, b] = caseBounds(x.c);
            return s + Math.round((b.getTime() - a.getTime()) / DAY) + 1;
          }, 0) / finished.length,
        )
      : null;

    const groups = new Map<string, { title: string; count: number; days: number; spellings: Map<string, number> }>();
    inPeriod.forEach(({ c, days }) => {
      const k = titleKey(c.title);
      const g = groups.get(k) ?? { title: "", count: 0, days: 0, spellings: new Map<string, number>() };
      g.count += 1;
      g.days += days;
      const sp = displayTitle(c.title);
      g.spellings.set(sp, (g.spellings.get(sp) ?? 0) + 1);
      groups.set(k, g);
    });
    const top = [...groups.values()]
      .map((g) => ({
        title: [...g.spellings.entries()].sort((a, b) => b[1] - a[1] || (a[0] === a[0].toUpperCase() ? -1 : 1))[0][0],
        count: g.count,
        days: g.days,
      }))
      .sort((a, b) => b.count - a.count || b.days - a.days);

    const ids = new Set(inPeriod.map((x) => x.c.id));
    const temps = entries
      .filter((e) => e.caseId && ids.has(e.caseId) && e.temperature !== null)
      .map((e) => e.temperature as number);
    const maxTemp = temps.length ? Math.max(...temps) : null;

    const months = monthBuckets(period).map((m) => ({
      ...m,
      days: inPeriod.reduce((s, x) => s + overlapDays(x.c, m.from, m.to), 0),
    }));

    return { count: inPeriod.length, totalDays, avg, top, maxTemp, months };
  }, [cases, entries, period]);

  const maxMonth = Math.max(1, ...stats.months.map((m) => m.days));
  const maxTop = Math.max(1, ...stats.top.map((t) => t.count));
  const periodDays = Math.round((period.to.getTime() - period.from.getTime()) / DAY) + 1;
  const share = Math.round((stats.totalDays / periodDays) * 100);

  return (
    <div className="mt-5 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📊</span>
        <p className="font-bold text-foreground text-[15px] flex-1">Статистика болезней</p>
      </div>

      {periods.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 mb-3">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodId(p.id)}
              className={`text-[12px] whitespace-nowrap rounded-full px-3 py-1 border font-semibold transition-colors ${
                p.id === period.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {stats.count === 0 ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-4 text-center">
          <p className="text-2xl mb-1">🌿</p>
          <p className="text-[13px] font-semibold text-emerald-800 dark:text-emerald-300">За этот период малыш не болел</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-3 text-center">
              <p className="text-[26px] font-bold text-rose-600 dark:text-rose-400 leading-none">{stats.count}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                {plural(stats.count, "раз болел", "раза болел", "раз болел")}
              </p>
            </div>
            <div className="rounded-2xl bg-orange-50 dark:bg-orange-950/30 p-3 text-center">
              <p className="text-[26px] font-bold text-orange-600 dark:text-orange-400 leading-none">{stats.totalDays}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                {plural(stats.totalDays, "день", "дня", "дней")} всего
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 dark:bg-sky-950/30 p-3 text-center">
              <p className="text-[26px] font-bold text-sky-600 dark:text-sky-400 leading-none">{stats.avg ?? "—"}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                {stats.avg !== null ? `${plural(stats.avg, "день", "дня", "дней")} в среднем` : "в среднем"}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
            Болел {share < 1 ? "меньше 1" : share}% дней периода
            {stats.maxTemp !== null && <> · максимум {stats.maxTemp.toFixed(1).replace(".", ",")} °C</>}
          </p>

          <p className="text-[12px] font-semibold text-foreground mt-4 mb-2">Чаще всего</p>
          <div className="space-y-2">
            {stats.top.slice(0, 5).map((t, i) => (
              <div key={t.title}>
                <div className="flex items-baseline gap-2 text-[13px]">
                  <span className="w-4 text-muted-foreground font-semibold">{i + 1}</span>
                  <span className="flex-1 min-w-0 truncate font-semibold text-foreground">{t.title}</span>
                  <span className="text-muted-foreground text-[12px] whitespace-nowrap">
                    {t.count} {plural(t.count, "раз", "раза", "раз")} · {t.days} {plural(t.days, "день", "дня", "дней")}
                  </span>
                </div>
                <div className="ml-6 mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${i === 0 ? "bg-rose-500" : "bg-rose-300 dark:bg-rose-700"}`}
                    style={{ width: `${(t.count / maxTop) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[12px] font-semibold text-foreground mt-4 mb-2">Дни болезни по месяцам</p>
          <div className="flex items-end gap-1 h-[88px]">
            {stats.months.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                {m.days > 0 && (
                  <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 mb-0.5">{m.days}</span>
                )}
                <div
                  className={`w-full rounded-t-md ${m.days > 0 ? "bg-rose-400 dark:bg-rose-600" : "bg-muted"}`}
                  style={{ height: m.days > 0 ? `${Math.max(8, (m.days / maxMonth) * 60)}px` : "3px" }}
                />
                <span className="text-[9px] text-muted-foreground mt-1">{m.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-[10px] text-muted-foreground leading-snug mt-3">
        Считаются случаи, начатые кнопкой «Добавить новый случай болезни». Ранние записи без случая в статистику не попадают.
      </p>
    </div>
  );
}

export default IllnessStats;
