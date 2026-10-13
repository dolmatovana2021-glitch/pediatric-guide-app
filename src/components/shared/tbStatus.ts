import { useEffect, useState } from "react";
import { loadChildProfile, type ChildProfile } from "./childProfile";

export type TbTestType = "mantu" | "diaskin" | "quantiferon" | "tspot";
export type TbResult = "negative" | "doubtful" | "positive" | "hyper";

export type TbRecord = {
  id: string;
  date: string;
  type: TbTestType;
  result: TbResult;
  size?: string;
};

export const tbTypeLabel: Record<TbTestType, string> = {
  mantu: "Проба Манту",
  diaskin: "Диаскинтест",
  quantiferon: "Квантифероновый тест",
  tspot: "T-SPOT.TB",
};

export const tbResultMeta: Record<TbResult, { label: string; chip: string }> = {
  negative: { label: "Отрицательная", chip: "bg-emerald-50 border-emerald-300 text-emerald-700" },
  doubtful: { label: "Сомнительная", chip: "bg-amber-50 border-amber-300 text-amber-700" },
  positive: { label: "Положительная", chip: "bg-red-50 border-red-300 text-red-700" },
  hyper: { label: "Гиперергическая", chip: "bg-red-100 border-red-400 text-red-800" },
};

export const resultsFor = (type: TbTestType): TbResult[] =>
  type === "mantu" ? ["negative", "doubtful", "positive", "hyper"] : ["negative", "doubtful", "positive"];

export const isSkinTest = (type: TbTestType) => type === "mantu" || type === "diaskin";

export type TbPlan =
  | { kind: "no-birth" }
  | { kind: "adult" }
  | { kind: "positive"; last: TbRecord }
  | { kind: "planned"; next: string; test: TbTestType; daysLeft: number; last?: TbRecord }
  | { kind: "due"; next: string; test: TbTestType; overdueDays: number; last?: TbRecord };

const DAY = 86400000;

function parse(d: string) {
  return new Date(d + "T00:00:00");
}

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addMonths(d: Date, m: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + m);
  return r;
}

function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function sortedRecords(p: Pick<ChildProfile, "tbTests">): TbRecord[] {
  return [...(p.tbTests || [])].sort((a, b) => b.date.localeCompare(a.date));
}

export function calcTbPlan(p: ChildProfile): TbPlan {
  if (!p.birthDate) return { kind: "no-birth" };
  const birth = parse(p.birthDate);
  if (isNaN(birth.getTime())) return { kind: "no-birth" };
  const now = today();
  const adultAt = addMonths(birth, 18 * 12);
  if (now >= adultAt) return { kind: "adult" };

  const records = sortedRecords(p);
  const last = records[0];
  if (last && (last.result === "positive" || last.result === "hyper")) return { kind: "positive", last };

  const noBcg = p.noBcg === true;
  const tbRisk = p.tbRisk === true;
  const firstAt = addMonths(birth, noBcg ? 6 : 12);
  let next = firstAt;
  if (last) {
    const lastD = parse(last.date);
    const before8 = lastD < addMonths(birth, 8 * 12);
    const interval = (noBcg && before8) || (tbRisk && !before8) ? 6 : 12;
    const fromLast = addMonths(lastD, interval);
    next = fromLast > firstAt ? fromLast : firstAt;
  }
  if (next >= adultAt) return { kind: "adult" };

  const test: TbTestType = next < addMonths(birth, 8 * 12) ? "mantu" : "diaskin";
  const diff = Math.round((next.getTime() - now.getTime()) / DAY);
  if (diff <= 0) return { kind: "due", next: iso(next), test, overdueDays: -diff, last };
  return { kind: "planned", next: iso(next), test, daysLeft: diff, last };
}

export const TB_SOON_DAYS = 30;

export function isTbAttention(plan: TbPlan): boolean {
  return plan.kind === "due" || (plan.kind === "planned" && plan.daysLeft <= TB_SOON_DAYS);
}

export function useTbPlan(): TbPlan | null {
  const [plan, setPlan] = useState<TbPlan | null>(null);
  useEffect(() => {
    const refresh = () => {
      const p = loadChildProfile();
      setPlan(p.notifyVaccines === false ? null : calcTbPlan(p));
    };
    refresh();
    window.addEventListener("malyshdok:childProfile:update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("malyshdok:childProfile:update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return plan;
}

export function fmtDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export function daysWord(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "день";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "дня";
  return "дней";
}
