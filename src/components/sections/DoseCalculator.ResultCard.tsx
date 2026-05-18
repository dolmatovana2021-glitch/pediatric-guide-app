import { AllergyAlert, DRUGS, Drug, DrugForm, checkAllergy } from "./DoseCalculator.data";

type ResultData = {
  mgMin: number;
  mgMax: number;
  mgAvg: number;
  mlMin: number;
  mlMax: number;
  mlAvg: number;
  capped: boolean;
};

type AlertProps = {
  drug: Drug;
  allergies: string;
  ageMonths: number | null;
  allergyAlert: AllergyAlert | null;
  ageWarning: string | null;
  blocked: boolean;
  onSwitchDrug: (key: Drug["key"]) => void;
};

export function AllergyAlertBlock({
  drug,
  allergies,
  ageMonths,
  allergyAlert,
  ageWarning,
  blocked,
  onSwitchDrug,
}: AlertProps) {
  if (!allergyAlert && !ageWarning) return null;
  return (
    <div
      className={`rounded-xl p-3 border flex items-start gap-2 animate-fade-in ${
        blocked
          ? "bg-rose-50 border-rose-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <span className="text-lg flex-shrink-0">{blocked ? "⛔" : "⚠️"}</span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-bold mb-0.5 ${
            blocked ? "text-rose-700" : "text-amber-700"
          }`}
        >
          {blocked ? "Препарат давать нельзя" : "Возможна перекрёстная реакция"}
        </p>
        <p className="text-[11px] text-foreground leading-relaxed">
          {ageWarning || allergyAlert?.message}
        </p>
        {allergyAlert?.match && (
          <p className="text-[10px] text-muted-foreground mt-1">
            Найдено в профиле: «{allergyAlert.match}»
          </p>
        )}
        {DRUGS.some(
          (d) =>
            d.key !== drug.key &&
            checkAllergy(d, allergies)?.level !== "block" &&
            !(ageMonths !== null && ageMonths < d.minAgeMonths),
        ) && (
          <button
            onClick={() => {
              const safe = DRUGS.find(
                (d) =>
                  d.key !== drug.key &&
                  checkAllergy(d, allergies)?.level !== "block" &&
                  !(ageMonths !== null && ageMonths < d.minAgeMonths),
              );
              if (safe) onSwitchDrug(safe.key);
            }}
            className={`mt-2 text-[11px] font-semibold underline ${
              blocked ? "text-rose-700" : "text-amber-700"
            }`}
          >
            Переключиться на безопасный препарат
          </button>
        )}
      </div>
    </div>
  );
}

type ResultProps = {
  drug: Drug;
  form: DrugForm;
  blocked: boolean;
  result: ResultData | null;
  weightNum: number;
};

export function ResultBlock({ drug, form, blocked, result, weightNum }: ResultProps) {
  if (!result || blocked) return null;
  return (
    <div className="bg-white border border-mint-200 rounded-xl p-3 space-y-2 animate-fade-in">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">Разовая доза для {weightNum} кг</p>
        <p className="text-[10px] text-muted-foreground">{form.concentrationLabel}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-primary">{result.mlAvg}</p>
        <p className="text-base font-semibold text-foreground">мл</p>
        <p className="text-xs text-muted-foreground ml-auto">≈ {result.mgAvg} мг</p>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Допустимый диапазон: <strong>{result.mlMin}–{result.mlMax} мл</strong> ({result.mgMin}–{result.mgMax} мг)
      </p>
      {result.capped && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
          ⚠️ Доза ограничена максимумом за приём — не более {drug.maxSingleMg} мг.
        </p>
      )}
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
        {drug.name} — {form.minAge}. Доза: {drug.mgPerKg.min === drug.mgPerKg.max ? `${drug.mgPerKg.min}` : `${drug.mgPerKg.min}–${drug.mgPerKg.max}`} мг/кг, но не более {drug.maxSingleMg} мг за приём. Это ориентир, при сомнениях — врач.
      </p>
    </div>
  );
}

export default ResultBlock;
