import { useMemo, useState } from "react";
import { GrowthCorridorChart } from "@/components/sections/GrowthCorridorChart";
import Icon from "@/components/ui/icon";
import {
  addMeasurement,
  removeMeasurement,
  ageInMonthsAt,
  type ChildProfile,
  type Measurement,
} from "@/components/shared/childProfile";
import {
  estimatePercentile,
  percentileVerdict,
  bmiVerdict,
  calcBmi,
  MAX_AGE_MONTHS,
  type Metric,
} from "@/components/shared/whoGrowthData";

const metricMeta: Record<Metric, { label: string; unit: string; emoji: string }> = {
  height: { label: "Рост", unit: "см", emoji: "📏" },
  weight: { label: "Вес", unit: "кг", emoji: "⚖️" },
  bmi: { label: "ИМТ", unit: "", emoji: "⚕️" },
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
        let value: number | null;
        if (metric === "height") value = m.height;
        else if (metric === "weight") value = m.weight;
        else
          value =
            m.height !== null && m.weight !== null ? calcBmi(m.height, m.weight) : null;
        if (months === null || value === null || months > MAX_AGE_MONTHS) return null;
        return {
          month: Number(months.toFixed(1)),
          value: Number(value.toFixed(1)),
          id: m.id,
          date: m.date,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a!.month - b!.month) as { month: number; value: number; id: string; date: string }[];
  }, [measurements, metric, profile.birthDate, hasBirth]);

  const maxMonths = useMemo(() => {
    const maxPoint = points.length ? Math.max(...points.map((p) => p.month)) : 0;
    return Math.min(MAX_AGE_MONTHS, Math.max(12, Math.ceil((maxPoint + 3) / 6) * 6));
  }, [points]);

  const last = points.length ? points[points.length - 1] : null;
  const lastPercentile = last
    ? estimatePercentile(metric, gender, last.month, last.value)
    : null;
  const verdict =
    metric === "bmi" ? bmiVerdict(lastPercentile) : percentileVerdict(lastPercentile);

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
    <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📈</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm leading-tight">
            Рост, вес и ИМТ
          </p>
          <p className="text-[11px] text-muted-foreground">
            Центильные коридоры ВОЗ, 0–5 лет
          </p>
        </div>
      </div>

      {!hasBirth ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
          <Icon name="Info" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Укажите дату рождения выше — тогда появится график динамики.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["height", "weight", "bmi"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-semibold border transition-colors ${
                  metric === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-mint-50 text-foreground border-mint-200"
                }`}
              >
                <span>{metricMeta[m].emoji}</span>
                {metricMeta[m].label}
              </button>
            ))}
          </div>

          {metric === "bmi" && points.length === 0 && measurements.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3 flex items-start gap-2">
              <Icon name="Info" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-foreground leading-snug">
                Для расчёта ИМТ нужны рост и вес в одном замере. Добавьте оба значения.
              </p>
            </div>
          )}

          {last && (
            <div className="bg-mint-50 border border-mint-200 rounded-2xl p-3 mb-3">
              <p className="text-[11px] text-muted-foreground">
                {metric === "bmi" ? "Последний расчёт ИМТ" : "Последний замер"}
              </p>
              <p className="text-sm font-bold text-foreground">
                {last.value}
                {meta.unit ? ` ${meta.unit}` : ""}
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

          <GrowthCorridorChart
            metric={metric}
            gender={gender}
            maxMonths={maxMonths}
            points={points}
            unit={meta.unit}
          />

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-2 mb-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-2.5 rounded-sm bg-emerald-100 border border-emerald-200" /> норма 15–85
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-2.5 rounded-sm bg-amber-100 border border-amber-200" /> 3–15 и 85–97
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-2.5 rounded-sm bg-rose-50 border border-rose-200" /> ниже 3 / выше 97
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t-2 border-dashed border-emerald-500" /> медиана
            </span>
          </div>
          {points.length > 1 && (
            <p className="text-[10px] text-muted-foreground -mt-2 mb-3">Нажмите на точку, чтобы увидеть замер</p>
          )}

          {open ? (
            <div className="bg-mint-50 border border-mint-200 rounded-2xl p-3 space-y-2.5 mb-3">
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
                  className="block w-full box-border appearance-none h-[40px] px-3 bg-card border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={!date || (!height && !weight)}
                  className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Сохранить замер
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 bg-card border border-mint-200 text-foreground rounded-xl py-2.5 font-semibold text-sm"
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