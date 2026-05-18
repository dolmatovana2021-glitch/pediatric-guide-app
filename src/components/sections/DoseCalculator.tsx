import { useState, useMemo, useEffect } from "react";
import { DoseHistory } from "./DoseHistory";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";
import {
  DRUGS,
  Drug,
  checkAllergy,
  checkDrugByName,
  round1,
} from "./DoseCalculator.data";
import { DrugPicker } from "./DoseCalculator.DrugPicker";
import { WeightInput } from "./DoseCalculator.WeightInput";
import { AllergyAlertBlock, ResultBlock } from "./DoseCalculator.ResultCard";
import { DrugChecker } from "./DoseCalculator.DrugChecker";

export function DoseCalculator() {
  const profile = useChildProfile();
  const [weight, setWeight] = useState<string>("");
  const [drugKey, setDrugKey] = useState<Drug["key"]>("paracetamol");
  const [formKey, setFormKey] = useState<string>("para-syrup");
  const [usedProfile, setUsedProfile] = useState(false);
  const [drugQuery, setDrugQuery] = useState("");
  const drugCheck = useMemo(() => checkDrugByName(drugQuery), [drugQuery]);

  useEffect(() => {
    if (profile.weight && !weight) {
      setWeight(profile.weight);
      setUsedProfile(true);
    }
  }, [profile.weight, weight]);

  const drug = DRUGS.find((d) => d.key === drugKey)!;
  const form = drug.forms.find((f) => f.key === formKey) ?? drug.forms[0];
  const w = parseFloat(weight.replace(",", "."));
  const valid = !isNaN(w) && w > 0 && w <= 80;
  const age = calcAge(profile.birthDate);

  useEffect(() => {
    if (!drug.forms.find((f) => f.key === formKey)) {
      setFormKey(drug.forms[0].key);
    }
  }, [drug, formKey]);

  const allergyAlert = useMemo(
    () => checkAllergy(drug, profile.allergies || ""),
    [drug, profile.allergies],
  );

  const ageMonths = age ? age.years * 12 + age.months : null;
  const ageWarning =
    ageMonths !== null && ageMonths < form.minAgeMonths
      ? `${drug.name} (${form.label}) разрешён ${form.minAge}, ребёнку ${age!.label}. Эту форму давать нельзя.`
      : null;

  const blocked = allergyAlert?.level === "block" || !!ageWarning;

  const result = useMemo(() => {
    if (!valid) return null;
    const capMg = drug.maxSingleMg;
    const rawMgMin = w * drug.mgPerKg.min;
    const rawMgMax = w * drug.mgPerKg.max;
    const mgMin = Math.min(rawMgMin, capMg);
    const mgMax = Math.min(rawMgMax, capMg);
    const mgAvg = (mgMin + mgMax) / 2;
    const mlMin = mgMin / form.concentration;
    const mlMax = mgMax / form.concentration;
    const mlAvg = mgAvg / form.concentration;
    return {
      mgMin: Math.round(mgMin),
      mgMax: Math.round(mgMax),
      mgAvg: Math.round(mgAvg),
      mlMin: round1(mlMin),
      mlMax: round1(mlMax),
      mlAvg: round1(mlAvg),
      capped: rawMgMax > capMg,
    };
  }, [w, drug, form, valid]);

  return (
    <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">🧮</span>
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Калькулятор дозы
        </p>
      </div>

      <DrugPicker
        drug={drug}
        form={form}
        drugKey={drugKey}
        ageMonths={ageMonths}
        allergies={profile.allergies || ""}
        onDrugChange={(key, firstFormKey) => {
          setDrugKey(key);
          setFormKey(firstFormKey);
        }}
        onFormChange={setFormKey}
      />

      <AllergyAlertBlock
        drug={drug}
        allergies={profile.allergies || ""}
        ageMonths={ageMonths}
        allergyAlert={allergyAlert}
        ageWarning={ageWarning}
        blocked={blocked}
        onSwitchDrug={(key) => setDrugKey(key)}
      />

      <WeightInput
        profile={profile}
        age={age}
        weight={weight}
        usedProfile={usedProfile}
        valid={valid}
        onUseProfile={() => {
          setWeight(profile.weight);
          setUsedProfile(true);
        }}
        onChange={(value) => {
          setWeight(value);
          setUsedProfile(false);
        }}
        onClear={() => setWeight("")}
      />

      <ResultBlock
        drug={drug}
        form={form}
        blocked={blocked}
        result={result}
        weightNum={w}
      />

      <DrugChecker
        drugQuery={drugQuery}
        drugCheck={drugCheck}
        onQueryChange={setDrugQuery}
        onPickDrug={(key) => setDrugKey(key)}
      />

      <DoseHistory
        currentDrug={drug.key}
        currentDrugName={drug.name}
        currentMl={result?.mlAvg}
        currentMg={result?.mgAvg}
      />
    </div>
  );
}

export default DoseCalculator;
