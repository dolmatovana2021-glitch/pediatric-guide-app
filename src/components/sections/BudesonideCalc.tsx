import { useState } from "react";
import { InhalationTimer } from "@/components/sections/InhalationTimer";

const NEBULA_ML = 2;
const DAILY_DOSE_MG = 2;

const concentrations = [
  { id: "0.25", value: 0.25, label: "0,25 мг/мл" },
  { id: "0.5", value: 0.5, label: "0,5 мг/мл" },
];

const schemes = [
  { id: "once", label: "Сразу 2 мг" },
  { id: "split", label: "2 × 1 мг" },
];

const methods = [
  { id: "mask", label: "Маска · до 6 лет" },
  { id: "mouthpiece", label: "Мундштук · с 6 лет" },
];

const nebulaWord = (n: number) => (n === 1 ? "небула" : n < 5 ? "небулы" : "небул");
const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

function Choice({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
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
  const [scheme, setScheme] = useState("once");
  const [method, setMethod] = useState("mask");

  const c = concentrations.find((x) => x.id === conc)!;
  const split = scheme === "split";
  const doseMg = split ? DAILY_DOSE_MG / 2 : DAILY_DOSE_MG;
  const ml = doseMg / c.value;
  const nebulas = ml / NEBULA_ML;
  const portion = `${fmt(nebulas)} ${nebulaWord(nebulas)} · ${fmt(ml)} мл`;

  return (
    <div className="mt-2 bg-card border border-amber-200 rounded-xl p-3 space-y-2.5">
      <p className="text-[12px] font-bold text-amber-800">Калькулятор дозы по инструкции</p>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">Концентрация небулы</p>
        <Choice options={concentrations} value={conc} onChange={setConc} />
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">Схема приёма</p>
        <Choice options={schemes} value={scheme} onChange={setScheme} />
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">Способ ингаляции по возрасту</p>
        <Choice options={methods} value={method} onChange={setMethod} />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
        <p className="text-[11px] text-muted-foreground">
          {split ? "Каждая ингаляция — 1 мг" : "Одна ингаляция — 2 мг"}
        </p>
        <p className="text-lg font-bold text-foreground leading-tight mt-0.5">{portion}</p>
        {split && (
          <p className="text-[12px] text-amber-800 font-semibold mt-1">
            Вторую такую же ингаляцию — через 30 минут
          </p>
        )}
        {split && <InhalationTimer portion={`Вторая доза: ${portion}`} />}
      </div>

      <ul className="space-y-1 text-[11px] text-muted-foreground leading-snug">
        <li>• По инструкции: детям от 6 месяцев — 2 мг в сутки, сразу или в 2 приёма по 1 мг с интервалом 30 минут.</li>
        <li>• Детям младше 6 лет — через детскую маску, с 6 лет — через мундштук. Доза от способа не зависит.</li>
        <li>
          • После ингаляции прополощите ребёнку рот водой
          {method === "mask" ? ", а также умойте лицо — на нём остаётся лекарство." : "."}
        </li>
        <li>• Не используйте ультразвуковой небулайзер.</li>
      </ul>
    </div>
  );
}

export default BudesonideCalc;
