export type DrugForm = {
  key: string;
  label: string;
  concentration: number;
  concentrationLabel: string;
  minAgeMonths: number;
  minAge: string;
};

export type Drug = {
  key: "paracetamol" | "ibuprofen";
  name: string;
  mgPerKg: { min: number; max: number };
  maxSingleMg: number;
  forms: DrugForm[];
  interval: string;
  maxPerDay: string;
  allergyTriggers: string[];
  brands: string[];
};

export const DRUGS: Drug[] = [
  {
    key: "paracetamol",
    name: "Парацетамол",
    mgPerKg: { min: 10, max: 15 },
    maxSingleMg: 1000,
    forms: [
      {
        key: "para-syrup",
        label: "Сироп 120 мг / 5 мл",
        concentration: 24,
        concentrationLabel: "120 мг / 5 мл",
        minAgeMonths: 4,
        minAge: "с 4 месяцев",
      },
    ],
    interval: "каждые 4–6 ч",
    maxPerDay: "не более 4 раз в сутки",
    allergyTriggers: ["парацетам", "paracetam", "ацетаминофен", "acetaminophen"],
    brands: ["панадол", "panadol", "калпол", "calpol", "цефекон", "эффералган", "efferalgan"],
  },
  {
    key: "ibuprofen",
    name: "Ибупрофен",
    mgPerKg: { min: 10, max: 10 },
    maxSingleMg: 600,
    forms: [
      {
        key: "ibu-syrup",
        label: "Сироп 100 мг / 5 мл",
        concentration: 20,
        concentrationLabel: "100 мг / 5 мл",
        minAgeMonths: 3,
        minAge: "с 3 месяцев",
      },
      {
        key: "ibu-conc",
        label: "Концентрат 40 мг / 1 мл",
        concentration: 40,
        concentrationLabel: "40 мг / 1 мл",
        minAgeMonths: 12,
        minAge: "с 12 месяцев",
      },
    ],
    interval: "каждые 6–8 ч",
    maxPerDay: "не более 4 раз в сутки",
    allergyTriggers: ["ибупрофен", "ibuprofen", "нпвс", "nsaid", "аспирин", "aspirin", "нурофен", "nurofen"],
    brands: ["нурофен", "nurofen", "ибуфен", "максиколд"],
  },
];

export type AllergyAlert = {
  level: "block" | "warn";
  message: string;
  match?: string;
};

export function checkAllergy(drug: Drug, allergiesText: string): AllergyAlert | null {
  if (!allergiesText.trim()) return null;
  const text = allergiesText.toLowerCase();

  for (const trigger of drug.allergyTriggers) {
    if (text.includes(trigger)) {
      return {
        level: "block",
        message: `В профиле указана аллергия на ${drug.name.toLowerCase()}. Этот препарат давать нельзя.`,
        match: trigger,
      };
    }
  }

  for (const brand of drug.brands) {
    if (text.includes(brand)) {
      return {
        level: "block",
        message: `В профиле указана аллергия на «${brand}» — это ${drug.name.toLowerCase()}. Давать нельзя.`,
        match: brand,
      };
    }
  }

  if (drug.key === "ibuprofen") {
    const crossNsaid = ["диклофенак", "кеторолак", "найз", "нимесулид", "кетопрофен"];
    for (const m of crossNsaid) {
      if (text.includes(m)) {
        return {
          level: "warn",
          message: `Указана аллергия на «${m}» (НПВС). Возможна перекрёстная реакция с ибупрофеном — посоветуйтесь с врачом.`,
          match: m,
        };
      }
    }
  }

  return null;
}

export type DrugCheck = {
  status: "safe" | "forbidden" | "unknown";
  matched?: string;
  canonical?: string;
  reason?: string;
  hint?: string;
};

const SAFE_LIST: { keys: string[]; canonical: string; hint: string }[] = [
  {
    keys: ["парацетам", "paracetam", "ацетаминофен", "acetaminophen", "панадол", "panadol", "калпол", "calpol", "цефекон", "эффералган", "efferalgan"],
    canonical: "Парацетамол",
    hint: "10–15 мг/кг (макс. 1000 мг за приём), каждые 4–6 ч. С 4 месяцев.",
  },
  {
    keys: ["ибупрофен", "ibuprofen", "нурофен", "nurofen", "ибуфен", "максиколд"],
    canonical: "Ибупрофен",
    hint: "10 мг/кг (макс. 600 мг за приём), каждые 6–8 ч. Сироп с 3 мес., концентрат — с 12 мес.",
  },
];

const FORBIDDEN_LIST: { keys: string[]; canonical: string; reason: string }[] = [
  {
    keys: ["аспирин", "aspirin", "ацетилсалицилов", "acetylsalicyl"],
    canonical: "Ацетилсалициловая кислота (Аспирин)",
    reason: "Риск синдрома Рея — поражение печени и мозга, возможен летальный исход.",
  },
  {
    keys: ["анальгин", "analgin", "метамизол", "metamizol", "баралгин"],
    canonical: "Метамизол натрия (Анальгин)",
    reason: "Угнетает кроветворение.",
  },
  {
    keys: ["нимесулид", "nimesulid", "нимулид", "найз", "nise"],
    canonical: "Нимесулид (Найз, Нимулид)",
    reason: "Токсическое действие на печень.",
  },
];

export function checkDrugByName(input: string): DrugCheck {
  const text = input.trim().toLowerCase();
  if (!text) return { status: "unknown" };

  for (const f of FORBIDDEN_LIST) {
    for (const k of f.keys) {
      if (text.includes(k)) {
        return { status: "forbidden", matched: k, canonical: f.canonical, reason: f.reason };
      }
    }
  }
  for (const s of SAFE_LIST) {
    for (const k of s.keys) {
      if (text.includes(k)) {
        return { status: "safe", matched: k, canonical: s.canonical, hint: s.hint };
      }
    }
  }
  return { status: "unknown" };
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
