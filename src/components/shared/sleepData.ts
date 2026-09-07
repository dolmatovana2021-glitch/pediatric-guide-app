export type SleepNorm = {
  label: string;
  minHours: number;
  maxHours: number;
  naps: string;
};

const NORMS: { upToMonths: number; norm: SleepNorm }[] = [
  { upToMonths: 3, norm: { label: "0–3 месяца", minHours: 14, maxHours: 17, naps: "4–6 дневных снов" } },
  { upToMonths: 11, norm: { label: "4–11 месяцев", minHours: 12, maxHours: 16, naps: "2–3 дневных сна" } },
  { upToMonths: 24, norm: { label: "1–2 года", minHours: 11, maxHours: 14, naps: "1–2 дневных сна" } },
  { upToMonths: 60, norm: { label: "3–5 лет", minHours: 10, maxHours: 13, naps: "1 дневной сон или без него" } },
  { upToMonths: 156, norm: { label: "6–12 лет", minHours: 9, maxHours: 12, naps: "без дневного сна" } },
  { upToMonths: 1200, norm: { label: "старше 12 лет", minHours: 8, maxHours: 10, naps: "без дневного сна" } },
];

export function sleepNormFor(ageMonths: number | null): SleepNorm | null {
  if (ageMonths === null) return null;
  for (const n of NORMS) {
    if (ageMonths <= n.upToMonths) return n.norm;
  }
  return NORMS[NORMS.length - 1].norm;
}

export type SleepVerdict = "low" | "ok" | "high";

export function sleepVerdict(hours: number, norm: SleepNorm): SleepVerdict {
  if (hours < norm.minHours) return "low";
  if (hours > norm.maxHours) return "high";
  return "ok";
}

export const verdictMeta: Record<
  SleepVerdict,
  { label: string; tone: string; card: string; icon: string; iconTone: string }
> = {
  low: {
    label: "меньше нормы",
    tone: "text-amber-600",
    card: "bg-amber-50 border-amber-200",
    icon: "TriangleAlert",
    iconTone: "text-amber-600",
  },
  ok: {
    label: "в пределах нормы",
    tone: "text-emerald-600",
    card: "bg-emerald-50 border-emerald-200",
    icon: "CircleCheck",
    iconTone: "text-emerald-600",
  },
  high: {
    label: "больше нормы",
    tone: "text-sky-600",
    card: "bg-sky-50 border-sky-200",
    icon: "Info",
    iconTone: "text-sky-600",
  },
};

export function formatHours(h: number): string {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  if (mins === 0) return `${hours} ч`;
  return `${hours} ч ${mins} мин`;
}
