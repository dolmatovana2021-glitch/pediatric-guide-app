import { useId, useMemo, useState } from "react";
import { buildChartData, estimatePercentile, type Gender, type Metric } from "@/components/shared/whoGrowthData";

export type CorridorPoint = { id: string; month: number; value: number; date: string };

const W = 340;
const H = 250;
const PAD = { l: 34, r: 24, t: 10, b: 24 };

const ZONES = [
  { from: null, to: "p3", fill: "#fff5f5" },
  { from: "p3", to: "p15", fill: "#fef3c7" },
  { from: "p15", to: "p85", fill: "#c9f2df" },
  { from: "p85", to: "p97", fill: "#fef3c7" },
  { from: "p97", to: null, fill: "#fff5f5" },
] as const;

const CURVES = [
  { key: "p3", label: "3" },
  { key: "p15", label: "15" },
  { key: "p50", label: "50" },
  { key: "p85", label: "85" },
  { key: "p97", label: "97" },
] as const;

function pointColor(p: number | null) {
  if (p === null) return "#6366f1";
  if (p <= 3 || p >= 97) return "#e11d48";
  if (p < 15 || p > 85) return "#d97706";
  return "#059669";
}

function niceStep(range: number) {
  const raw = range / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function fmtAge(m: number) {
  const total = Math.round(m);
  if (total < 12) return `${total} мес`;
  const y = Math.floor(total / 12);
  const r = total % 12;
  const yw = y === 1 ? "год" : y < 5 ? "года" : "лет";
  return r ? `${y} ${yw} ${r} мес` : `${y} ${yw}`;
}

export function GrowthCorridorChart({
  metric,
  gender,
  maxMonths,
  points,
  unit,
}: {
  metric: Metric;
  gender: Gender;
  maxMonths: number;
  points: CorridorPoint[];
  unit: string;
}) {
  const [selId, setSelId] = useState<string | null>(null);
  const clipId = `plot-${useId().replace(/:/g, "")}`;

  const curves = useMemo(() => buildChartData(metric, gender, maxMonths), [metric, gender, maxMonths]);

  const { yMin, yMax, ticks } = useMemo(() => {
    const vals = curves.flatMap((c) => [c.p3, c.p97]).concat(points.map((p) => p.value));
    let lo = Math.min(...vals);
    let hi = Math.max(...vals);
    const pad = (hi - lo) * 0.06;
    lo -= pad;
    hi += pad;
    const step = niceStep(hi - lo);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
    const t: number[] = [];
    for (let v = lo; v <= hi + 1e-9; v += step) t.push(Number(v.toFixed(2)));
    return { yMin: lo, yMax: hi, ticks: t };
  }, [curves, points]);

  const x = (m: number) => PAD.l + (m / maxMonths) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  const xStep = maxMonths <= 12 ? 3 : maxMonths <= 24 ? 6 : 12;
  const xTicks: number[] = [];
  for (let m = 0; m <= maxMonths; m += xStep) xTicks.push(m);
  const xLabel = (m: number) => (maxMonths <= 24 ? `${m}м` : m === 0 ? "0" : `${m / 12}г`);

  const linePath = (key: string) =>
    curves.map((c, i) => `${i ? "L" : "M"}${x(c.month).toFixed(1)},${y(c[key]).toFixed(1)}`).join(" ");

  const zonePath = (from: string | null, to: string | null) => {
    const top = to
      ? curves.map((c) => [x(c.month), y(c[to])])
      : curves.map((c) => [x(c.month), PAD.t]);
    const bottom = from
      ? curves.map((c) => [x(c.month), y(c[from])])
      : curves.map((c) => [x(c.month), H - PAD.b]);
    const pts = [...top, ...bottom.reverse()];
    return pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ") + " Z";
  };

  const enriched = points.map((p) => ({
    ...p,
    pct: estimatePercentile(metric, gender, p.month, p.value),
  }));
  const sel = enriched.find((p) => p.id === selId) ?? enriched[enriched.length - 1] ?? null;
  const lastC = curves[curves.length - 1];
  const labelY = useMemo(() => {
    if (!lastC) return {} as Record<string, number>;
    const ys = CURVES.map((c) => y(lastC[c.key]) + 3);
    for (let i = ys.length - 2; i >= 0; i--) if (ys[i] - ys[i + 1] < 9) ys[i] = ys[i + 1] + 9;
    return Object.fromEntries(CURVES.map((c, i) => [c.key, ys[i]]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastC, yMin, yMax]);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="График замеров на центильных коридорах ВОЗ"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="#ffffff" />
          {ZONES.map((z, i) => (
            <path key={i} d={zonePath(z.from, z.to)} fill={z.fill} />
          ))}
          {ticks.map((t) => (
            <line key={t} x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#64748b" strokeOpacity={0.12} strokeWidth={1} />
          ))}
          {xTicks.map((m) => (
            <line key={m} x1={x(m)} x2={x(m)} y1={PAD.t} y2={H - PAD.b} stroke="#64748b" strokeOpacity={0.12} strokeWidth={1} />
          ))}
          {CURVES.map((c) => (
            <path
              key={c.key}
              d={linePath(c.key)}
              fill="none"
              stroke={c.key === "p50" ? "#10b981" : c.key === "p3" || c.key === "p97" ? "#fda4af" : "#fcd34d"}
              strokeWidth={c.key === "p50" ? 1.6 : 1}
              strokeDasharray={c.key === "p50" ? "4 3" : undefined}
            />
          ))}

          {enriched.length > 1 && (
            <path
              d={enriched.map((p, i) => `${i ? "L" : "M"}${x(p.month).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ")}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {sel && (
            <line x1={x(sel.month)} x2={x(sel.month)} y1={PAD.t} y2={H - PAD.b} stroke="#4f46e5" strokeOpacity={0.35} strokeDasharray="3 3" />
          )}
          {enriched.map((p) => {
            const active = sel?.id === p.id;
            return (
              <g key={p.id} onClick={() => setSelId(p.id)} className="cursor-pointer">
                <circle cx={x(p.month)} cy={y(p.value)} r={14} fill="transparent" />
                <circle
                  cx={x(p.month)}
                  cy={y(p.value)}
                  r={active ? 6 : 4.5}
                  fill={pointColor(p.pct)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </g>

        {lastC &&
          CURVES.map((c) => (
            <text
              key={c.key}
              x={W - PAD.r + 3}
              y={labelY[c.key]}
              fontSize={8.5}
              fill={c.key === "p50" ? "#059669" : "#9ca3af"}
              fontWeight={c.key === "p50" ? 700 : 500}
            >
              {c.label}
            </text>
          ))}

        {ticks.map((t) => (
          <text key={t} x={PAD.l - 5} y={y(t) + 3} fontSize={9} fill="#9ca3af" textAnchor="end">
            {Number.isInteger(t) ? t : t.toFixed(1)}
          </text>
        ))}
        {xTicks.map((m) => (
          <text key={m} x={x(m)} y={H - PAD.b + 14} fontSize={9} fill="#9ca3af" textAnchor="middle">
            {xLabel(m)}
          </text>
        ))}
      </svg>

      {sel && (
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mt-1 text-[12px]">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pointColor(sel.pct) }} />
          <span className="flex-1 min-w-0 text-foreground">
            <b>
              {sel.value}
              {unit ? ` ${unit}` : ""}
            </b>{" "}
            <span className="text-muted-foreground">
              · {fmtDate(sel.date)} · {fmtAge(sel.month)}
            </span>
          </span>
          {sel.pct !== null && (
            <span className="font-semibold whitespace-nowrap" style={{ color: pointColor(sel.pct) }}>
              {sel.pct}-й центиль
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default GrowthCorridorChart;
