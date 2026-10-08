import { useEffect, useState } from "react";

const APP_ID = "malyshdok";
const LAST_BACKUP_KEY = "malyshdok:lastBackupAt";
const SNOOZE_KEY = "malyshdok:backupSnoozeUntil";
const FIRST_SEEN_KEY = "malyshdok:firstSeenAt";
const BACKUP_EVENT = "malyshdok:backup:update";
const DAY = 86400000;
export const BACKUP_INTERVAL_DAYS = 30;
const FORMAT_VERSION = 1;

const DATA_KEYS = [
  "malyshdok:childProfiles",
  "malyshdok:childProfiles:active",
  "malyshdok:childProfile",
  "malyshdok:vaccineStatus",
  "malyshdok:checkupStatus",
  "malyshdok:medkit",
  "malyshdok:doseHistory",
  "malyshdok:sectionVisibility",
  "malyshdok:theme",
] as const;

export type BackupFile = {
  app: typeof APP_ID;
  version: number;
  createdAt: string;
  data: Record<string, string>;
};

export type BackupSummary = {
  createdAt: string;
  children: string[];
  vaccines: number;
  checkups: number;
  meds: number;
  diaryEntries: number;
};

function parse<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type ChildLike = {
  name?: string;
  illness?: unknown[];
  sleep?: unknown[];
  feeds?: unknown[];
  measurements?: unknown[];
};

function countMarks(raw: string | undefined): number {
  const all = parse<Record<string, Record<string, unknown>>>(raw, {});
  return Object.values(all || {}).reduce((sum, m) => {
    if (!m || typeof m !== "object") return sum;
    return sum + Object.values(m).filter((v) => v && v !== "none").length;
  }, 0);
}

export function summarize(file: BackupFile): BackupSummary {
  const d = file.data;
  let list = parse<ChildLike[]>(d["malyshdok:childProfiles"], []);
  if (!Array.isArray(list) || list.length === 0) {
    const legacy = parse<ChildLike | null>(d["malyshdok:childProfile"], null);
    list = legacy ? [legacy] : [];
  }
  const meds = parse<unknown[]>(d["malyshdok:medkit"], []);
  return {
    createdAt: file.createdAt,
    children: list.map((c, i) => (c?.name || "").trim() || `Ребёнок ${i + 1}`),
    vaccines: countMarks(d["malyshdok:vaccineStatus"]),
    checkups: countMarks(d["malyshdok:checkupStatus"]),
    meds: Array.isArray(meds) ? meds.length : 0,
    diaryEntries: list.reduce(
      (sum, c) =>
        sum +
        (c?.illness?.length || 0) +
        (c?.sleep?.length || 0) +
        (c?.feeds?.length || 0) +
        (c?.measurements?.length || 0),
      0
    ),
  };
}

export function collectBackup(): BackupFile {
  const data: Record<string, string> = {};
  for (const key of DATA_KEYS) {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) data[key] = v;
    } catch {
      /* ignore */
    }
  }
  return { app: APP_ID, version: FORMAT_VERSION, createdAt: new Date().toISOString(), data };
}

export function hasAnyData(): boolean {
  const s = summarize(collectBackup());
  return s.children.length > 0 || s.vaccines > 0 || s.checkups > 0 || s.meds > 0;
}

function fileName(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `malyshdok-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

export async function saveBackupFile(): Promise<"shared" | "downloaded" | "cancelled"> {
  const backup = collectBackup();
  const json = JSON.stringify(backup, null, 2);
  const name = fileName();
  const file = new File([json], name, { type: "application/json" });

  const nav = navigator as Navigator & {
    canShare?: (d: { files: File[] }) => boolean;
  };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "МалышДок — резервная копия" });
      markBackupDone();
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
    }
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  markBackupDone();
  return "downloaded";
}

export class BackupError extends Error {}

export async function readBackupFile(file: File): Promise<BackupFile> {
  if (file.size > 20 * 1024 * 1024) throw new BackupError("Файл слишком большой");
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BackupError("Это не файл МалышДока");
  }
  const b = parsed as Partial<BackupFile>;
  if (!b || b.app !== APP_ID || !b.data || typeof b.data !== "object") {
    throw new BackupError("Это не файл МалышДока");
  }
  if ((b.version ?? 0) > FORMAT_VERSION) {
    throw new BackupError("Файл сделан в более новой версии приложения");
  }
  const data: Record<string, string> = {};
  for (const key of DATA_KEYS) {
    const v = (b.data as Record<string, unknown>)[key];
    if (typeof v === "string") data[key] = v;
  }
  return { app: APP_ID, version: b.version ?? FORMAT_VERSION, createdAt: b.createdAt || "", data };
}

export function restoreBackup(file: BackupFile) {
  for (const key of DATA_KEYS) {
    if (key === "malyshdok:theme") continue;
    try {
      if (key in file.data) localStorage.setItem(key, file.data[key]);
      else localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
  const theme = file.data["malyshdok:theme"];
  if (theme) {
    try {
      localStorage.setItem("malyshdok:theme", theme);
    } catch {
      /* ignore */
    }
  }
}

function readNum(key: string): number {
  try {
    const v = Number(localStorage.getItem(key));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}

function writeNum(key: string, v: number) {
  try {
    localStorage.setItem(key, String(v));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(BACKUP_EVENT));
}

export function markBackupDone() {
  writeNum(LAST_BACKUP_KEY, Date.now());
  try {
    localStorage.removeItem(SNOOZE_KEY);
  } catch {
    /* ignore */
  }
}

export function snoozeBackupReminder(days = 7) {
  writeNum(SNOOZE_KEY, Date.now() + days * DAY);
}

export function getLastBackupAt(): number {
  return readNum(LAST_BACKUP_KEY);
}

function firstSeenAt(): number {
  const v = readNum(FIRST_SEEN_KEY);
  if (v) return v;
  const now = Date.now();
  try {
    localStorage.setItem(FIRST_SEEN_KEY, String(now));
  } catch {
    /* ignore */
  }
  return now;
}

export type BackupReminder = {
  due: boolean;
  lastBackupAt: number;
  daysSince: number | null;
};

function readReminder(): BackupReminder {
  const last = getLastBackupAt();
  const now = Date.now();
  const daysSince = last ? Math.floor((now - last) / DAY) : null;
  const since = last || firstSeenAt();
  const snoozed = readNum(SNOOZE_KEY) > now;
  const due = !snoozed && now - since >= BACKUP_INTERVAL_DAYS * DAY && hasAnyData();
  return { due, lastBackupAt: last, daysSince };
}

const WATCH_EVENTS = [
  BACKUP_EVENT,
  "malyshdok:childProfile:update",
  "malyshdok:vaccineStatus:update",
  "malyshdok:checkupStatus:update",
  "malyshdok:medkit:update",
  "storage",
];

export function useBackupReminder(): BackupReminder {
  const [state, setState] = useState<BackupReminder>(readReminder);
  useEffect(() => {
    const refresh = () => setState(readReminder());
    refresh();
    WATCH_EVENTS.forEach((e) => window.addEventListener(e, refresh));
    return () => WATCH_EVENTS.forEach((e) => window.removeEventListener(e, refresh));
  }, []);
  return state;
}

export function formatBackupAge(r: BackupReminder): string {
  if (!r.lastBackupAt || r.daysSince === null) return "Копию ещё не сохраняли";
  const d = r.daysSince;
  if (d === 0) return "Последняя копия — сегодня";
  if (d === 1) return "Последняя копия — вчера";
  const m10 = d % 10, m100 = d % 100;
  const word = m10 === 1 && m100 !== 11 ? "день" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "дня" : "дней";
  return `Последняя копия — ${d} ${word} назад`;
}
