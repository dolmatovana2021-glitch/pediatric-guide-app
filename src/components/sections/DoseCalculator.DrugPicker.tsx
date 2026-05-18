import { DRUGS, Drug, DrugForm, checkAllergy } from "./DoseCalculator.data";

type Props = {
  drug: Drug;
  form: DrugForm;
  drugKey: Drug["key"];
  ageMonths: number | null;
  allergies: string;
  onDrugChange: (key: Drug["key"], firstFormKey: string) => void;
  onFormChange: (key: string) => void;
};

export function DrugPicker({
  drug,
  form,
  drugKey,
  ageMonths,
  allergies,
  onDrugChange,
  onFormChange,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {DRUGS.map((d) => {
          const dAllergy = checkAllergy(d, allergies);
          const dBlocked = dAllergy?.level === "block";
          const dMinAge = Math.min(...d.forms.map((f) => f.minAgeMonths));
          const dAgeBad = ageMonths !== null && ageMonths < dMinAge;
          const isUnsafe = dBlocked || dAgeBad;
          return (
            <button
              key={d.key}
              onClick={() => onDrugChange(d.key, d.forms[0].key)}
              className={`relative text-xs font-semibold py-2 px-2 rounded-lg border transition ${
                drugKey === d.key
                  ? isUnsafe
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-primary text-white border-primary"
                  : isUnsafe
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    : "bg-white text-foreground border-mint-200 hover:bg-mint-100"
              }`}
            >
              {isUnsafe && <span className="mr-1">⛔</span>}
              {d.name}
            </button>
          );
        })}
      </div>

      {drug.forms.length > 1 && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground mb-1">
            Форма выпуска
          </p>
          <div className="grid grid-cols-2 gap-2">
            {drug.forms.map((f) => {
              const fAgeBad = ageMonths !== null && ageMonths < f.minAgeMonths;
              const active = form.key === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => onFormChange(f.key)}
                  className={`text-[11px] font-semibold py-2 px-2 rounded-lg border transition leading-tight ${
                    active
                      ? fAgeBad
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-primary text-white border-primary"
                      : fAgeBad
                        ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        : "bg-white text-foreground border-mint-200 hover:bg-mint-100"
                  }`}
                >
                  {fAgeBad && <span className="mr-1">⛔</span>}
                  {f.label}
                  <div className={`text-[10px] font-normal mt-0.5 ${active ? "opacity-80" : "text-muted-foreground"}`}>
                    {f.minAge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default DrugPicker;
