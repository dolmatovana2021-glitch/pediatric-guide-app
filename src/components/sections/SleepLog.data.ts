import { type SleepEntry } from "@/components/shared/childProfile";

export const EVENT_NAME = "malyshdok:childProfile:update";

export function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function hoursBetween(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return (b - a) / 3600000;
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
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export function isNightSleep(start: string): boolean {
  const h = new Date(start).getHours();
  return h >= 19 || h < 6;
}

export type SleepDay = {
  key: string;
  total: number;
  night: number;
  day: number;
};

export function groupByDay(entries: SleepEntry[]): SleepDay[] {
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
}
