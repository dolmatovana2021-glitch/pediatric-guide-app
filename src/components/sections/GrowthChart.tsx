import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Icon from "@/components/ui/icon";
import {
  addMeasurement,
  removeMeasurement,
  listMeasurements,
  ageInMonthsAt,
  type ChildProfile,
  type Measurement,
} from "@/components/shared/childProfile";
import {
  buildChartData,
  estimatePercentile,
  percentileVerdict,
  MAX_AGE_MONTHS,
  type Metric,
} from "@/components/shared/whoGrowthData";

const metricMeta: Record<Metric, { label: string; unit: string; emoji: string }> = {
  height: { label: "Рост", unit: "см", emoji: "📏" },
  weight: { label: "Вес", unit: "кг", emoji: "⚖️" },
};

export function GrowthChart({
  childId,
  profile,
  measurements,
}: {
  childId: string;
  profile: ChildProfile;
  measurements: Measurement[];
}) {
  const [metric, setMetric] = useState<Metric>("height");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const gender = profile.gender === "girl" ? "girl" : "boy";
  const hasBirth = Boolean(profile.birthDate);

  const points = useMemo(() => {
    if (!hasBirth) return [];
    return measurements
      .map((m) => {
        const months = ageInMonthsAt(profile.birthDate, m.date);
        const value = metric === "height" ? m.height : m.weight;
        if (months === null || value === null || months > MAX_AGE_MONTHS) return null;
        return { month: Number(months.toFixed(1)), value, id: m.id, date: m.date };
      })
      .filter(Boolean) as { month: number; value: number; id: string; date: string }[];
  }, [measurements, metric, profile.birthDate, hasBirth]);

  const maxMonths = useMemo(() => {
    const maxPoint = points.length ? Math.max(...points.map((p) => p.month)) : 0;
    return Math.min(MAX_AGE_MONTHS, Math.max(12, Math.ceil((maxPoint + 3) / 6) * 6));
  }, [points]);

  const curves = useMemo(
    () => buildChartData(metric, gender, maxMonths),
    [metric, gender, maxMonths],
  );

  const chartData = useMemo(() => {
    const merged: Record<string, number | null>[] = curves.map((c) => ({ ...c, point: null }));
    points.forEach((p) => {
      merged.push({ month: p.month, point: p.value });
    });
    return merged.sort((a, b) => (a.month as number) - (b.month as number));
  }, [curves, points]);

  const last = points.length ? points[points.length - 1] : null;
  const lastPercentile = last
    ? estimatePercentile(metric, gender, last.month, last.value)
    : null;
  const verdict = percentileVerdict(lastPercentile);

  const save = () => {
    const h = height ? parseFloat(height.replace(",", ".")) : null;
    const w = weight ? parseFloat(weight.replace(",", ".")) : null;
    if (!date || (h === null && w === null)) return;
    addMeasurement(childId, {
      date,
      height: h !== null && !isNaN(h) ? h : null,
      weight: w !== null && !isNaN(w) ? w : null,
    });
    setHeight("");
    setWeight("");
    setOpen(false);
  };

  const meta = metricMeta[metric];

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📈</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm leading-tight">
            Рост и вес
          </p>
          <p className="text-[11px] text-muted-foreground">
            Центильные коридоры ВОЗ, 0–5 лет
          </p>
        </div>
      </div>

      {!hasBirth ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <Icon name="Info" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Укажите дату рождения выше — тогда появится график динамики.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["height", "weight"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold border transition-colors ${
                  metric === m
                    ? "bg-primary text-white border-primary"
                    : "bg-mint-50 text-foreground border-mint-200"
                }`}
              >
                <span>{metricMeta[m].emoji}</span>
                {metricMeta[m].label}
              </button>
            ))}
          </div>

          {last && (
            <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 mb-3">
              <p className="text-[11px] text-muted-foreground">Последний замер</p>
              <p className="text-sm font-bold text-foreground">
                {last.value} {meta.unit}
                <span className="font-normal text-muted-foreground text-xs">
                  {" "}· {Math.round(last.month)} мес
                </span>
              </p>
              {lastPercentile !== null && (
                <p className={`text-[12px] font-semibold mt-0.5 ${verdict.tone}`}>
                  {lastPercentile}-й центиль — {verdict.label}
                </p>
              )}
            </div>
          )}

          <div className="h-[240px] -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  type="number"
                  domain={[0, maxMonths]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${v}м`}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={["auto", "auto"]}
                  width={38}
                  unit={meta.unit === "см" ? "" : ""}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const names: Record<string, string> = {
                      p3: "3-й центиль",
                      p15: "15-й",
                      p50: "медиана",
                      p85: "85-й",
                      p97: "97-й",
                      point: "Ваш замер",
                    };
                    return [`${Number(value).toFixed(1)} ${meta.unit}`, names[name] || name];
                  }}
                  labelFormatter={(l) => `${Number(l).toFixed(1)} мес`}
                  contentStyle={{ fontSize: 12, borderRadius: 12 }}
                />
                <Line dataKey="p3" stroke="#fca5a5" dot={false} strokeWidth={1} connectNulls />
                <Line dataKey="p15" stroke="#fcd34d" dot={false} strokeWidth={1} connectNulls />
                <Line dataKey="p50" stroke="#34d399" dot={false} strokeWidth={2} connectNulls />
                <Line dataKey="p85" stroke="#fcd34d" dot={false} strokeWidth={1} connectNulls />
                <Line dataKey="p97" stroke="#fca5a5" dot={false} strokeWidth={1} connectNulls />
                <Scatter dataKey="point" fill="#6366f1" shape="circle" />
                <Line
                  dataKey="point"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#6366f1" }}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-1 mb-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-emerald-400 rounded" /> медиана
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-amber-300 rounded" /> 15–85
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-red-300 rounded" /> 3–97
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> замеры
            </span>
          </div>

          {open ? (
            <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 space-y-2.5 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Дата замера
                </label>
                <input
                  type="date"
                  value={date}
                  max={new Date().toISOString().slice(0, 10)}
                  min={profile.birthDate || undefined}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full box-border appearance-none h-[40px] px-3 bg-white border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Рост, см
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="75"
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Вес, кг
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="9.5"
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={!date || (!height && !weight)}
                  className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Сохранить замер
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 bg-white border border-mint-200 text-foreground rounded-xl py-2.5 font-semibold text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="w-full bg-mint-50 border border-dashed border-mint-300 text-foreground rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mb-3 active:scale-95 transition-transform"
            >
              <Icon name="Plus" size={15} />
              Добавить замер
            </button>
          )}

          {measurements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground">
                История ({measurements.length})
              </p>
              {[...measurements].reverse().map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 bg-mint-50/60 border border-mint-200 rounded-xl px-3 py-2"
                >
                  <span className="text-[11px] text-muted-foreground w-[74px] flex-shrink-0">
                    {new Date(m.date).toLocaleDateString("ru-RU")}
                  </span>
                  <span className="text-[12px] font-semibold text-foreground flex-1">
                    {m.height ? `${m.height} см` : ""}
                    {m.height && m.weight ? " · " : ""}
                    {m.weight ? `${m.weight} кг` : ""}
                  </span>
                  <button
                    onClick={() => removeMeasurement(childId, m.id)}
                    className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
                    aria-label="Удалить замер"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-snug mt-3">
            Данные носят справочный характер. Оценку физического развития проводит врач.
          </p>
        </>
      )}
    </div>
  );
}

export default GrowthChart;
