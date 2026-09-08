export type Jaw = "upper" | "lower";
export type Side = "left" | "right";

export type ToothKind = "primary" | "permanent";

export type Tooth = {
  id: string;
  jaw: Jaw;
  side: Side;
  order: number;
  group: string;
  shortName: string;
  fromMonth: number;
  toMonth: number;
  kind: ToothKind;
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

const PERM_GROUPS: {
  key: string;
  group: string;
  shortName: string;
  upper: [number, number];
  lower: [number, number];
}[] = [
  { key: "pi1", group: "Центральный резец", shortName: "Центр. резец", upper: [84, 96], lower: [72, 84] },
  { key: "pi2", group: "Боковой резец", shortName: "Бок. резец", upper: [96, 108], lower: [84, 96] },
  { key: "pc", group: "Клык", shortName: "Клык", upper: [132, 144], lower: [108, 132] },
  { key: "pm1", group: "Первый премоляр", shortName: "1-й премоляр", upper: [120, 132], lower: [120, 132] },
  { key: "pm2", group: "Второй премоляр", shortName: "2-й премоляр", upper: [120, 144], lower: [120, 144] },
  { key: "pmo1", group: "Первый моляр", shortName: "1-й моляр", upper: [72, 84], lower: [72, 84] },
  { key: "pmo2", group: "Второй моляр", shortName: "2-й моляр", upper: [144, 156], lower: [144, 156] },
  { key: "pmo3", group: "Зуб мудрости", shortName: "Зуб мудрости", upper: [204, 300], lower: [204, 300] },
];

const PERM_ORDER = ["pi1", "pi2", "pc", "pm1", "pm2", "pmo1", "pmo2", "pmo3"];

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
          kind: "primary",
        });
      });
    }
  }
  return teeth;
}

function buildPermanent(): Tooth[] {
  const teeth: Tooth[] = [];
  for (const jaw of ["upper", "lower"] as Jaw[]) {
    for (const side of ["right", "left"] as Side[]) {
      PERM_GROUPS.forEach((g) => {
        const [fromMonth, toMonth] = jaw === "upper" ? g.upper : g.lower;
        teeth.push({
          id: `perm-${jaw}-${side}-${g.key}`,
          jaw,
          side,
          order: PERM_ORDER.indexOf(g.key),
          group: g.group,
          shortName: g.shortName,
          fromMonth,
          toMonth,
          kind: "permanent",
        });
      });
    }
  }
  return teeth;
}

export const allTeeth = build();

export const permanentTeeth = buildPermanent();

export const TOTAL_TEETH = 20;

export const TOTAL_PERMANENT_TEETH = 32;

export function teethByKind(kind: ToothKind): Tooth[] {
  return kind === "primary" ? allTeeth : permanentTeeth;
}

export function teethOf(jaw: Jaw, side: Side, kind: ToothKind = "primary"): Tooth[] {
  return teethByKind(kind)
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

export function expectedCount(ageMonths: number, kind: ToothKind = "primary"): number {
  return teethByKind(kind).filter((t) => ageMonths >= t.fromMonth).length;
}

export function rangeLabelYears(t: Tooth): string {
  const from = Math.round(t.fromMonth / 12);
  const to = Math.round(t.toMonth / 12);
  return from === to ? `${from} лет` : `${from}–${to} лет`;
}

export function rangeLabel(t: Tooth): string {
  if (t.kind === "permanent") return rangeLabelYears(t);
  return `${t.fromMonth}–${t.toMonth} мес`;
}