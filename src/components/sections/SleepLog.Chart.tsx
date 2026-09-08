import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatHours, type SleepNorm } from "@/components/shared/sleepData";

type ChartPoint = { day: string; total: number };

type Props = {
  chartData: ChartPoint[];
  norm: SleepNorm | null;
};

export function SleepLogChart({ chartData, norm }: Props) {
  if (!(chartData.length > 0 && norm)) return null;

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4">
      <p className="text-[11px] font-semibold text-muted-foreground mb-2">
        Сон по дням, часов
      </p>
      <div className="h-[210px] -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} domain={[0, 20]} width={26} />
            <Tooltip
              formatter={(v: number) => [formatHours(Number(v)), "Всего сна"]}
              contentStyle={{ fontSize: 12, borderRadius: 12 }}
            />
            <ReferenceArea
              y1={norm.minHours}
              y2={norm.maxHours}
              fill="#10b981"
              fillOpacity={0.12}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.total < norm.minHours
                      ? "#f59e0b"
                      : d.total > norm.maxHours
                        ? "#0ea5e9"
                        : "#10b981"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        Зелёная зона — возрастная норма {norm.minHours}–{norm.maxHours} ч
      </p>
    </div>
  );
}

export default SleepLogChart;
