import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { DoseHistory } from "./DoseHistory";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";

type Drug = {
  key: "paracetamol" | "ibuprofen";
  name: string;
  mgPerKg: { min: number; max: number };
  concentration: number;
  concentrationLabel: string;
  interval: string;
  maxPerDay: string;
  minAge: string;
};

const DRUGS: Drug[] = [
  {
    key: "paracetamol",
    name: "Парацетамол",
    mgPerKg: { min: 10, max: 15 },
    concentration: 24,
    concentrationLabel: "120 мг / 5 мл",
    interval: "каждые 4–6 ч",
    maxPerDay: "не более 4 раз в сутки",
    minAge: "с рождения",
  },
  {
    key: "ibuprofen",
    name: "Ибупрофен",
    mgPerKg: { min: 5, max: 10 },
    concentration: 20,
    concentrationLabel: "100 мг / 5 мл",
    interval: "каждые 6–8 ч",
    maxPerDay: "не более 3 раз в сутки",
    minAge: "с 3 месяцев",
  },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

export function DoseCalculator() {
  const profile = useChildProfile();
  const [weight, setWeight] = useState<string>("");
  const [drugKey, setDrugKey] = useState<Drug["key"]>("paracetamol");
  const [usedProfile, setUsedProfile] = useState(false);

  useEffect(() => {
    if (profile.weight && !weight) {
      setWeight(profile.weight);
      setUsedProfile(true);
    }
  }, [profile.weight, weight]);

  const drug = DRUGS.find((d) => d.key === drugKey)!;
  const w = parseFloat(weight.replace(",", "."));
  const valid = !isNaN(w) && w > 0 && w <= 80;
  const age = calcAge(profile.birthDate);

  const result = useMemo(() => {
    if (!valid) return null;
    const mgMin = w * drug.mgPerKg.min;
    const mgMax = w * drug.mgPerKg.max;
    const mgAvg = (mgMin + mgMax) / 2;
    const mlMin = mgMin / drug.concentration;
    const mlMax = mgMax / drug.concentration;
    const mlAvg = mgAvg / drug.concentration;
    return {
      mgMin: Math.round(mgMin),
      mgMax: Math.round(mgMax),
      mgAvg: Math.round(mgAvg),
      mlMin: round1(mlMin),
      mlMax: round1(mlMax),
      mlAvg: round1(mlAvg),
    };
  }, [w, drug, valid]);

  return (
    <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">🧮</span>
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Калькулятор дозы
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DRUGS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDrugKey(d.key)}
            className={`text-xs font-semibold py-2 px-2 rounded-lg border transition ${
              drugKey === d.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground border-mint-200 hover:bg-mint-100"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {profile.weight && (
        <button
          onClick={() => {
            setWeight(profile.weight);
            setUsedProfile(true);
          }}
          className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 border text-xs transition ${
            usedProfile && weight === profile.weight
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-white border-mint-200 text-foreground hover:bg-mint-100"
          }`}
        >
          <span className="text-base">
            {profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
          </span>
          <span className="flex-1 text-left truncate">
            <span className="font-semibold">{profile.name || "Малыш"}</span>
            {age ? ` · ${age.label}` : ""} · {profile.weight} кг
          </span>
          <Icon name={usedProfile && weight === profile.weight ? "Check" : "ArrowDown"} size={12} />
        </button>
      )}

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Вес ребёнка, кг
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            min="1"
            max="80"
            step="0.1"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setUsedProfile(false);
            }}
            placeholder="например, 12"
            className="w-full px-3 py-2.5 bg-white border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {weight && (
            <button
              onClick={() => setWeight("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-mint-100 flex items-center justify-center text-muted-foreground"
              aria-label="Очистить"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      {!valid && weight && (
        <p className="text-[11px] text-rose-600">
          Введите вес от 1 до 80 кг
        </p>
      )}

      {result && (
        <div className="bg-white border border-mint-200 rounded-xl p-3 space-y-2 animate-fade-in">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">Разовая доза для {w} кг</p>
            <p className="text-[10px] text-muted-foreground">{drug.concentrationLabel}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary">{result.mlAvg}</p>
            <p className="text-base font-semibold text-foreground">мл</p>
            <p className="text-xs text-muted-foreground ml-auto">≈ {result.mgAvg} мг</p>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Допустимый диапазон: <strong>{result.mlMin}–{result.mlMax} мл</strong> ({result.mgMin}–{result.mgMax} мг)
          </p>
          <div className="pt-1.5 border-t border-mint-100 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="text-muted-foreground">Интервал</p>
              <p className="font-semibold text-foreground">{drug.interval}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Максимум</p>
              <p className="font-semibold text-foreground">{drug.maxPerDay}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground pt-1">
            {drug.name} — {drug.minAge}. Это ориентир, при сомнениях — врач.
          </p>
        </div>
      )}

      <DoseHistory
        currentDrug={drug.key}
        currentDrugName={drug.name}
        currentMl={result?.mlAvg}
        currentMg={result?.mgAvg}
      />
    </div>
  );
}