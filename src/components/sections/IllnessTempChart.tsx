import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { tempTone, fmtDateTime } from "@/components/sections/IllnessEntryCard";

export type TempPoint = { time: number; temp: number };

export function IllnessTempChart({
  chartData,
  lastTemp,
  maxTemp,
  entriesCount,
}: {
  chartData: TempPoint[];
  lastTemp: number | null;
  maxTemp: number | null;
  entriesCount: number;
}) {
  return (
    <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground">Последняя</p>
          <p className={`text-xl font-bold ${tempTone(lastTemp)}`}>
            {lastTemp?.toFixed(1)} °C
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground">Максимальная</p>
          <p className={`text-xl font-bold ${tempTone(maxTemp)}`}>
            {maxTemp?.toFixed(1)} °C
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground">Записей</p>
          <p className="text-xl font-bold text-foreground">{entriesCount}</p>
        </div>
      </div>

      <div className="h-[210px] -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) =>
                new Date(v).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                })
              }
            />
            <YAxis
              tick={{ fontSize: 10 }}
              domain={[35, 41]}
              ticks={[35, 36, 37, 38, 39, 40, 41]}
              width={30}
            />
            <Tooltip
              formatter={(v: number) => [`${Number(v).toFixed(1)} °C`, "Температура"]}
              labelFormatter={(l) => fmtDateTime(new Date(Number(l)).toISOString())}
              contentStyle={{ fontSize: 12, borderRadius: 12 }}
            />
            <ReferenceLine y={37} stroke="#fcd34d" strokeDasharray="4 4" />
            <ReferenceLine y={38} stroke="#fb923c" strokeDasharray="4 4" />
            <ReferenceLine y={39} stroke="#f87171" strokeDasharray="4 4" />
            <Line
              dataKey="temp"
              stroke="#e11d48"
              strokeWidth={2}
              dot={{ r: 3, fill: "#e11d48" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-amber-300 rounded" /> 37 °C
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-orange-400 rounded" /> 38 °C
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-red-400 rounded" /> 39 °C
        </span>
      </div>
    </div>
  );
}

export default IllnessTempChart;
