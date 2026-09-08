import {
  ageInMonthsAt,
  getLostDate,
  type ChildProfile,
  type Measurement,
} from "@/components/shared/childProfile";
import {
  estimatePercentile,
  calcBmi,
  MAX_AGE_MONTHS,
} from "@/components/shared/whoGrowthData";
import { getStatuses } from "@/components/shared/vaccineStatus";
import { vaccineRows } from "@/components/shared/vaccineData";
import { allTeeth, permanentTeeth, toothState, type Tooth } from "@/components/shared/teethData";
import { sleepNormFor, sleepVerdict, type SleepNorm, type SleepVerdict } from "@/components/shared/sleepData";

export function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU");
}

export function pct(v: number | null): string {
  if (v === null) return "—";
  if (v < 3) return "<3";
  if (v > 97) return ">97";
  return String(Math.round(v));
}

export type GrowthRow = {
  date: string;
  months: number | null;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  hp: number | null;
  wp: number | null;
  bp: number | null;
};

export function buildGrowthRows(
  profile: ChildProfile,
  measurements: Measurement[],
): GrowthRow[] {
  const gender = profile.gender === "girl" ? "girl" : "boy";
  return [...measurements]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => {
      const months = profile.birthDate ? ageInMonthsAt(profile.birthDate, m.date) : null;
      const inRange = months !== null && months <= MAX_AGE_MONTHS;
      const bmi = m.height !== null && m.weight !== null ? calcBmi(m.height, m.weight) : null;
      return {
        date: m.date,
        months,
        height: m.height,
        weight: m.weight,
        bmi,
        hp: inRange && m.height !== null ? estimatePercentile("height", gender, months!, m.height) : null,
        wp: inRange && m.weight !== null ? estimatePercentile("weight", gender, months!, m.weight) : null,
        bp: inRange && bmi !== null ? estimatePercentile("bmi", gender, months!, bmi) : null,
      };
    });
}

export function buildDoneVaccines(): string[] {
  const vacStatuses = getStatuses();
  const doneVaccines: string[] = [];
  for (const row of vaccineRows) {
    for (const dose of row.doses) {
      if (vacStatuses[dose.id] === "done") {
        doneVaccines.push(`${row.disease} — ${dose.label}`);
      }
    }
  }
  return doneVaccines;
}

export type EruptedTooth = {
  tooth: Tooth;
  date: string;
  verdictText: string;
  lostAt: string | null;
};

export function buildTeeth(profile: ChildProfile, ageMonthsNow: number | null) {
  const teethMap = profile.teeth ?? {};

  const eruptedTeeth: EruptedTooth[] = [...allTeeth, ...permanentTeeth]
    .filter((t) => teethMap[t.id])
    .map((t) => {
      const date = teethMap[t.id];
      const at = profile.birthDate ? ageInMonthsAt(profile.birthDate, date) : null;
      let verdictText = "—";
      if (at !== null) {
        const m = Math.round(at);
        if (m < t.fromMonth) verdictText = `${m} мес — раньше нормы`;
        else if (m > t.toMonth) verdictText = `${m} мес — позже нормы`;
        else verdictText = `${m} мес — в норме`;
      }
      return { tooth: t, date, verdictText, lostAt: getLostDate(teethMap, t.id) };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const lateTeeth =
    ageMonthsNow === null
      ? []
      : allTeeth.filter(
          (t) => !teethMap[t.id] && toothState(t, false, ageMonthsNow) === "late",
        );

  return { eruptedTeeth, lateTeeth };
}

export type SleepStats = {
  sleepNorm: SleepNorm | null;
  sleepByDay: { key: string; total: number; night: number; naps: number }[];
  sleepAvg: number | null;
  sleepNightAvg: number | null;
  sleepNapsAvg: number | null;
  sleepV: SleepVerdict | null;
};

export function buildSleepStats(
  profile: ChildProfile,
  ageMonthsNow: number | null,
): SleepStats {
  const sleepNorm = sleepNormFor(ageMonthsNow);
  const sleepByDay = (() => {
    const map = new Map<string, { total: number; night: number; naps: number }>();
    for (const e of profile.sleep ?? []) {
      const a = new Date(e.start).getTime();
      const b = new Date(e.end).getTime();
      if (isNaN(a) || isNaN(b) || b <= a) continue;
      const h = (b - a) / 3600000;
      const key = e.start.slice(0, 10);
      const cur = map.get(key) || { total: 0, night: 0, naps: 0 };
      cur.total += h;
      const hh = new Date(e.start).getHours();
      if (hh >= 19 || hh < 6) cur.night += h;
      else {
        cur.naps += 1;
      }
      map.set(key, cur);
    }
    return [...map.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => a.key.localeCompare(b.key));
  })();
  const sleepLast7 = sleepByDay.slice(-7);
  const sleepAvg = sleepLast7.length
    ? sleepLast7.reduce((s, d) => s + d.total, 0) / sleepLast7.length
    : null;
  const sleepNightAvg = sleepLast7.length
    ? sleepLast7.reduce((s, d) => s + d.night, 0) / sleepLast7.length
    : null;
  const sleepNapsAvg = sleepLast7.length
    ? sleepLast7.reduce((s, d) => s + d.naps, 0) / sleepLast7.length
    : null;
  const sleepV = sleepAvg !== null && sleepNorm ? sleepVerdict(sleepAvg, sleepNorm) : null;

  return { sleepNorm, sleepByDay, sleepAvg, sleepNightAvg, sleepNapsAvg, sleepV };
}

export type FeedDay = {
  key: string;
  count: number;
  volume: number;
  breast: number;
  formula: number;
  solid: number;
};

export function buildFeedStats(profile: ChildProfile) {
  const feedsByDay = (() => {
    const map = new Map<
      string,
      { count: number; volume: number; breast: number; formula: number; solid: number }
    >();
    for (const e of profile.feeds ?? []) {
      const key = e.datetime.slice(0, 10);
      const cur = map.get(key) || { count: 0, volume: 0, breast: 0, formula: 0, solid: 0 };
      cur.count += 1;
      cur.volume += e.amount || 0;
      cur[e.type] += 1;
      map.set(key, cur);
    }
    return [...map.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.key.localeCompare(a.key));
  })();
  const feedsRecent = feedsByDay.slice(0, 14);
  const feedsAvgCount = feedsRecent.length
    ? feedsRecent.reduce((s, d) => s + d.count, 0) / feedsRecent.length
    : null;

  return { feedsRecent, feedsAvgCount };
}