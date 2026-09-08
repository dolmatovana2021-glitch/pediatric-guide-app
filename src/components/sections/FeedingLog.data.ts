import { type FeedEntry, type FeedType } from "@/components/shared/childProfile";

export const EVENT_NAME = "malyshdok:childProfile:update";

export const typeMeta: Record<FeedType, { label: string; emoji: string; chip: string }> = {
  breast: { label: "Грудь", emoji: "🤱", chip: "bg-rose-100 text-rose-700" },
  formula: { label: "Смесь", emoji: "🍼", chip: "bg-sky-100 text-sky-700" },
  solid: { label: "Прикорм", emoji: "🥣", chip: "bg-amber-100 text-amber-700" },
};

export type FeedNorm = { label: string; min: number; max: number; hint: string };

export function feedNormFor(ageMonths: number | null): FeedNorm | null {
  if (ageMonths === null) return null;
  if (ageMonths < 1) return { label: "0–1 месяц", min: 8, max: 12, hint: "каждые 2–3 часа, в том числе ночью" };
  if (ageMonths < 4) return { label: "1–3 месяца", min: 7, max: 9, hint: "каждые 3–4 часа" };
  if (ageMonths < 6) return { label: "4–5 месяцев", min: 6, max: 8, hint: "каждые 3–4 часа" };
  if (ageMonths < 9) return { label: "6–8 месяцев", min: 5, max: 7, hint: "молоко плюс 1–2 прикорма" };
  if (ageMonths < 12) return { label: "9–11 месяцев", min: 4, max: 6, hint: "молоко плюс 2–3 прикорма" };
  return { label: "старше года", min: 4, max: 6, hint: "3 основных приёма и 1–2 перекуса" };
}

export function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDay(key: string): string {
  const d = new Date(key);
  if (isNaN(d.getTime())) return key;
  const todayKey = new Date().toISOString().slice(0, 10);
  if (key === todayKey) return "Сегодня";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export type FeedDayGroup = {
  key: string;
  list: FeedEntry[];
  count: number;
  volume: number;
  breast: number;
};

export function groupByDay(entries: FeedEntry[]): FeedDayGroup[] {
  const map = new Map<string, FeedEntry[]>();
  for (const e of entries) {
    const key = dayKey(e.datetime);
    map.set(key, [...(map.get(key) || []), e]);
  }
  return [...map.entries()]
    .map(([key, list]) => ({
      key,
      list: list.sort((a, b) => b.datetime.localeCompare(a.datetime)),
      count: list.length,
      volume: list.reduce((s, e) => s + (e.amount || 0), 0),
      breast: list.filter((e) => e.type === "breast").length,
    }))
    .sort((a, b) => b.key.localeCompare(a.key));
}
