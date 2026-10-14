import { useState } from "react";

const NEBULA_ML = 2;

const concentrations = [
  { id: "0.25", value: 0.25, label: "0,25 мг/мл" },
  { id: "0.5", value: 0.5, label: "0,5 мг/мл" },
];

const methods = [
  { id: "mouthpiece", dose: 1, label: "Мундштук" },
  { id: "mask", dose: 2, label: "Маска" },
];

const nebulaWord = (n: number) => (n === 1 ? "небула" : n < 5 ? "небулы" : "небул");

function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`rounded-xl border py-2 text-[13px] font-semibold transition-colors ${
            value === o.id
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-card text-foreground border-amber-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function BudesonideCalc() {
  const [conc, setConc] = useState("0.5");
  const [method, setMethod] = useState("mouthpiece");

  const c = concentrations.find((x) => x.id === conc)!;
  const m = methods.find((x) => x.id === method)!;
  const ml = m.dose / c.value;
  const nebulas = ml / NEBULA_ML;
  const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

  return (
    <div className="mt-2 bg-card border border-amber-200 rounded-xl p-3 space-y-2.5">
      <p className="text-[12px] font-bold text-amber-800">Калькулятор дозы</p>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">Концентрация небулы</p>
        <Choice options={concentrations} value={conc} onChange={setConc} />
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">Способ ингаляции</p>
        <Choice options={methods} value={method} onChange={setMethod} />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
        <p className="text-[11px] text-muted-foreground">Разовая доза {fmt(m.dose)} мг</p>
        <p className="text-lg font-bold text-foreground leading-tight mt-0.5">
          {fmt(nebulas)} {nebulaWord(nebulas)} · {fmt(ml)} мл
        </p>
      </div>
    </div>
  );
}

export default BudesonideCalc;
