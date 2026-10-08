const APP_ID = "malyshdok";
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
