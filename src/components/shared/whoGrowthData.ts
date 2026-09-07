export type Gender = "boy" | "girl";
export type Metric = "height" | "weight" | "bmi";

export const PERCENTILE_LABELS = [3, 15, 50, 85, 97] as const;

type Row = [number, number, number, number, number, number];

const WEIGHT_BOYS: Row[] = [
  [0, 2.5, 2.9, 3.3, 3.9, 4.4],
  [1, 3.4, 3.9, 4.5, 5.1, 5.8],
  [2, 4.4, 4.9, 5.6, 6.3, 7.1],
  [3, 5.1, 5.7, 6.4, 7.2, 8.0],
  [6, 6.4, 7.1, 7.9, 8.8, 9.8],
  [9, 7.1, 7.8, 8.9, 9.9, 11.0],
  [12, 7.7, 8.4, 9.6, 10.8, 12.0],
  [18, 8.8, 9.6, 10.9, 12.2, 13.7],
  [24, 9.7, 10.5, 12.2, 13.6, 15.3],
  [36, 11.3, 12.3, 14.3, 16.2, 18.3],
  [48, 12.7, 13.9, 16.3, 18.6, 21.2],
  [60, 14.1, 15.3, 18.3, 21.3, 24.9],
];

const WEIGHT_GIRLS: Row[] = [
  [0, 2.4, 2.8, 3.2, 3.7, 4.2],
  [1, 3.2, 3.6, 4.2, 4.8, 5.5],
  [2, 3.9, 4.5, 5.1, 5.8, 6.6],
  [3, 4.5, 5.2, 5.8, 6.6, 7.5],
  [6, 5.7, 6.5, 7.3, 8.2, 9.3],
  [9, 6.5, 7.3, 8.2, 9.3, 10.5],
  [12, 7.0, 7.9, 8.9, 10.1, 11.5],
  [18, 8.1, 9.1, 10.2, 11.6, 13.2],
  [24, 9.0, 10.0, 11.5, 13.0, 14.8],
  [36, 10.8, 11.9, 13.9, 15.8, 18.1],
  [48, 12.3, 13.5, 16.1, 18.5, 21.5],
  [60, 13.7, 15.2, 18.2, 21.2, 24.9],
];

const HEIGHT_BOYS: Row[] = [
  [0, 46.3, 47.9, 49.9, 51.8, 53.4],
  [1, 51.1, 52.7, 54.7, 56.7, 58.4],
  [2, 54.7, 56.4, 58.4, 60.5, 62.2],
  [3, 57.6, 59.3, 61.4, 63.5, 65.3],
  [6, 63.6, 65.5, 67.6, 69.8, 71.9],
  [9, 68.0, 69.9, 72.0, 74.2, 76.5],
  [12, 71.3, 73.4, 75.7, 78.0, 80.5],
  [18, 76.9, 79.1, 82.3, 85.1, 87.7],
  [24, 81.0, 83.5, 87.1, 90.2, 93.2],
  [36, 88.7, 91.4, 96.1, 99.8, 103.5],
  [48, 94.9, 98.0, 103.3, 107.5, 111.7],
  [60, 100.7, 104.0, 110.0, 114.6, 119.2],
];

const HEIGHT_GIRLS: Row[] = [
  [0, 45.6, 47.2, 49.1, 51.0, 52.7],
  [1, 50.0, 51.7, 53.7, 55.6, 57.4],
  [2, 53.2, 55.0, 57.1, 59.1, 60.9],
  [3, 55.8, 57.6, 59.8, 61.9, 63.8],
  [6, 61.2, 63.5, 65.7, 68.0, 70.3],
  [9, 65.3, 67.7, 70.1, 72.6, 75.0],
  [12, 68.9, 71.4, 74.0, 76.6, 79.2],
  [18, 74.9, 77.5, 80.7, 83.6, 86.5],
  [24, 79.6, 82.5, 86.4, 89.6, 92.9],
  [36, 87.4, 90.2, 95.1, 99.0, 102.7],
  [48, 94.1, 97.3, 102.7, 107.2, 111.3],
  [60, 99.9, 103.2, 109.4, 114.2, 118.9],
];

const BMI_BOYS: Row[] = [
  [0, 11.3, 12.2, 13.4, 14.8, 16.1],
  [1, 12.8, 13.8, 15.0, 16.4, 17.8],
  [2, 14.0, 15.0, 16.3, 17.8, 19.2],
  [3, 14.6, 15.5, 16.9, 18.4, 19.8],
  [6, 15.0, 15.9, 17.3, 18.8, 20.2],
  [9, 14.8, 15.7, 17.0, 18.5, 19.9],
  [12, 14.6, 15.4, 16.8, 18.2, 19.6],
  [18, 14.3, 15.1, 16.3, 17.8, 19.1],
  [24, 14.1, 14.9, 16.0, 17.4, 18.7],
  [36, 13.8, 14.5, 15.6, 17.0, 18.3],
  [48, 13.5, 14.2, 15.3, 16.7, 18.0],
  [60, 13.2, 13.9, 15.2, 16.6, 18.0],
];

const BMI_GIRLS: Row[] = [
  [0, 11.1, 12.0, 13.3, 14.7, 16.0],
  [1, 12.4, 13.3, 14.6, 16.1, 17.5],
  [2, 13.5, 14.5, 15.8, 17.4, 18.9],
  [3, 14.1, 15.0, 16.4, 18.0, 19.5],
  [6, 14.5, 15.5, 16.9, 18.5, 20.0],
  [9, 14.4, 15.3, 16.7, 18.3, 19.8],
  [12, 14.2, 15.1, 16.4, 18.0, 19.5],
  [18, 13.9, 14.8, 16.1, 17.6, 19.1],
  [24, 13.7, 14.5, 15.8, 17.3, 18.8],
  [36, 13.4, 14.2, 15.5, 17.0, 18.6],
  [48, 13.1, 13.9, 15.3, 16.8, 18.5],
  [60, 12.9, 13.7, 15.2, 16.9, 18.8],
];

export const MAX_AGE_MONTHS = 60;

function table(metric: Metric, gender: Gender): Row[] {
  if (metric === "weight") return gender === "boy" ? WEIGHT_BOYS : WEIGHT_GIRLS;
  if (metric === "bmi") return gender === "boy" ? BMI_BOYS : BMI_GIRLS;
  return gender === "boy" ? HEIGHT_BOYS : HEIGHT_GIRLS;
}

export function calcBmi(heightCm: number, weightKg: number): number | null {
  if (!heightCm || !weightKg || heightCm <= 0) return null;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function percentileCurveAt(
  metric: Metric,
  gender: Gender,
  months: number,
): [number, number, number, number, number] | null {
  const rows = table(metric, gender);
  if (months < 0 || months > MAX_AGE_MONTHS) return null;
  let lo = rows[0];
  let hi = rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    if (months >= rows[i][0] && months <= rows[i + 1][0]) {
      lo = rows[i];
      hi = rows[i + 1];
      break;
    }
  }
  const span = hi[0] - lo[0];
  const t = span === 0 ? 0 : (months - lo[0]) / span;
  return [1, 2, 3, 4, 5].map((i) => lo[i] + (hi[i] - lo[i]) * t) as [
    number,
    number,
    number,
    number,
    number,
  ];
}

export function estimatePercentile(
  metric: Metric,
  gender: Gender,
  months: number,
  value: number,
): number | null {
  const curve = percentileCurveAt(metric, gender, months);
  if (!curve) return null;
  const ps = PERCENTILE_LABELS;
  if (value <= curve[0]) return 3;
  if (value >= curve[4]) return 97;
  for (let i = 0; i < curve.length - 1; i++) {
    if (value >= curve[i] && value <= curve[i + 1]) {
      const t = (value - curve[i]) / (curve[i + 1] - curve[i]);
      return Math.round(ps[i] + (ps[i + 1] - ps[i]) * t);
    }
  }
  return null;
}

export function percentileVerdict(p: number | null): {
  label: string;
  tone: string;
} {
  if (p === null) return { label: "—", tone: "text-muted-foreground" };
  if (p < 3) return { label: "ниже нормы", tone: "text-rose-600" };
  if (p < 15) return { label: "ниже среднего", tone: "text-amber-600" };
  if (p <= 85) return { label: "норма", tone: "text-emerald-600" };
  if (p <= 97) return { label: "выше среднего", tone: "text-amber-600" };
  return { label: "выше нормы", tone: "text-rose-600" };
}

export function bmiVerdict(p: number | null): { label: string; tone: string } {
  if (p === null) return { label: "—", tone: "text-muted-foreground" };
  if (p < 3) return { label: "дефицит массы тела", tone: "text-rose-600" };
  if (p < 15) return { label: "масса ниже среднего", tone: "text-amber-600" };
  if (p <= 85) return { label: "гармоничное развитие", tone: "text-emerald-600" };
  if (p <= 97) return { label: "избыточная масса", tone: "text-amber-600" };
  return { label: "ожирение", tone: "text-rose-600" };
}

export function buildChartData(metric: Metric, gender: Gender, maxMonths: number) {
  const step = maxMonths <= 12 ? 1 : maxMonths <= 24 ? 2 : 3;
  const out: Record<string, number>[] = [];
  for (let m = 0; m <= maxMonths; m += step) {
    const c = percentileCurveAt(metric, gender, m);
    if (!c) continue;
    out.push({ month: m, p3: c[0], p15: c[1], p50: c[2], p85: c[3], p97: c[4] });
  }
  return out;
}