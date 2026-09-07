export type Jaw = "upper" | "lower";
export type Side = "left" | "right";

export type Tooth = {
  id: string;
  jaw: Jaw;
  side: Side;
  order: number;
  group: string;
  shortName: string;
  fromMonth: number;
  toMonth: number;
};

const GROUPS: {
  key: string;
  group: string;
  shortName: string;
  upper: [number, number];
  lower: [number, number];
}[] = [
  { key: "i1", group: "Центральный резец", shortName: "Центр. резец", upper: [8, 12], lower: [6, 10] },
  { key: "i2", group: "Боковой резец", shortName: "Бок. резец", upper: [9, 13], lower: [10, 16] },
  { key: "c", group: "Клык", shortName: "Клык", upper: [16, 22], lower: [17, 23] },
  { key: "m1", group: "Первый моляр", shortName: "1-й моляр", upper: [13, 19], lower: [14, 18] },
  { key: "m2", group: "Второй моляр", shortName: "2-й моляр", upper: [25, 33], lower: [23, 31] },
];

const ORDER = ["i1", "i2", "c", "m1", "m2"];

function build(): Tooth[] {
  const teeth: Tooth[] = [];
  for (const jaw of ["upper", "lower"] as Jaw[]) {
    for (const side of ["right", "left"] as Side[]) {
      GROUPS.forEach((g) => {
        const [fromMonth, toMonth] = jaw === "upper" ? g.upper : g.lower;
        teeth.push({
          id: `${jaw}-${side}-${g.key}`,
          jaw,
          side,
          order: ORDER.indexOf(g.key),
          group: g.group,
          shortName: g.shortName,
          fromMonth,
          toMonth,
        });
      });
    }
  }
  return teeth;
}

export const allTeeth = build();

export const TOTAL_TEETH = 20;

export function teethOf(jaw: Jaw, side: Side): Tooth[] {
  return allTeeth
    .filter((t) => t.jaw === jaw && t.side === side)
    .sort((a, b) => a.order - b.order);
}

export type ToothState = "erupted" | "due" | "soon" | "waiting" | "late";

export function toothState(
  tooth: Tooth,
  erupted: boolean,
  ageMonths: number | null,
): ToothState {
  if (erupted) return "erupted";
  if (ageMonths === null) return "waiting";
  if (ageMonths > tooth.toMonth + 6) return "late";
  if (ageMonths >= tooth.fromMonth) return "due";
  if (ageMonths >= tooth.fromMonth - 2) return "soon";
  return "waiting";
}

export const stateMeta: Record<ToothState, { label: string; fill: string; stroke: string; text: string }> = {
  erupted: { label: "прорезался", fill: "#ffffff", stroke: "#0d9488", text: "text-emerald-600" },
  due: { label: "пора прорезаться", fill: "#fef3c7", stroke: "#f59e0b", text: "text-amber-600" },
  soon: { label: "скоро", fill: "#f1f5f9", stroke: "#cbd5e1", text: "text-muted-foreground" },
  waiting: { label: "ещё рано", fill: "#f8fafc", stroke: "#e2e8f0", text: "text-muted-foreground" },
  late: { label: "задерживается", fill: "#ffe4e6", stroke: "#f43f5e", text: "text-rose-600" },
};

export function expectedCount(ageMonths: number): number {
  return allTeeth.filter((t) => ageMonths >= t.fromMonth).length;
}

export function rangeLabel(t: Tooth): string {
  return `${t.fromMonth}–${t.toMonth} мес`;
}
