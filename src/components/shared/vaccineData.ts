export type VaccineDose = {
  id: string;
  label: string;
  age: string;
  ageMonths: number;
  note?: string;
};

export type VaccineRow = {
  id: string;
  icon: string;
  color: string;
  disease: string;
  doses: VaccineDose[];
};

export const VACCINE_SOURCE =
  "Идеальный календарь иммунизации Союза педиатров России, 2026. Составлен в соответствии с национальным календарём профилактических прививок (Приказ Минздрава России № 1122н).";

export const vaccineRows: VaccineRow[] = [
  {
    id: "rsvi",
    icon: "ShieldPlus",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    disease: "Респираторно-синцитиальная инфекция (РСВИ)",
    doses: [
      { id: "rsvi-1", label: "Введение 1", age: "С рождения", ageMonths: 0, note: "5 введений с интервалом 1 мес, по показаниям (группы риска)" },
      { id: "rsvi-2", label: "Введение 2", age: "+1 мес", ageMonths: 1 },
      { id: "rsvi-3", label: "Введение 3", age: "+2 мес", ageMonths: 2 },
      { id: "rsvi-4", label: "Введение 4", age: "+3 мес", ageMonths: 3 },
      { id: "rsvi-5", label: "Введение 5", age: "+4 мес", ageMonths: 4 },
    ],
  },
  {
    id: "tuberculosis",
    icon: "Shield",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    disease: "Туберкулёз",
    doses: [
      { id: "tb-v1", label: "V1 (БЦЖ)", age: "3–7 дней", ageMonths: 0 },
      { id: "tb-rv", label: "RV (ревакцинация)", age: "6 лет", ageMonths: 72, note: "При отрицательной пробе Манту" },
    ],
  },
  {
    id: "hepb",
    icon: "Droplet",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    disease: "Вирусный гепатит B",
    doses: [
      { id: "hepb-v1", label: "V1", age: "Новорождённый (0)", ageMonths: 0 },
      { id: "hepb-v2", label: "V2", age: "1 мес", ageMonths: 1 },
      { id: "hepb-v3", label: "V3", age: "6 мес", ageMonths: 6, note: "Группам риска — по схеме 0–1–2–12" },
      { id: "hepb-v4", label: "V4", age: "12 мес", ageMonths: 12, note: "Для детей из групп риска" },
    ],
  },
  {
    id: "pneumo",
    icon: "Wind",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    disease: "Пневмококковая инфекция",
    doses: [
      { id: "pn-v1", label: "V1 ПКВ", age: "2 мес", ageMonths: 2 },
      { id: "pn-v2", label: "V2 ПКВ", age: "4–5 мес", ageMonths: 4 },
      { id: "pn-rv", label: "RV ПКВ", age: "15 мес", ageMonths: 15 },
      { id: "pn-school", label: "ПКВ / ППВ23/ПКВ20", age: "2–3 года и старше", ageMonths: 24, note: "Группам риска" },
    ],
  },
  {
    id: "meningo",
    icon: "Brain",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    disease: "Менингококковая инфекция",
    doses: [
      { id: "mn-v1", label: "V1", age: "С 1,5 мес", ageMonths: 2 },
      { id: "mn-v2", label: "V2", age: "4–5 мес", ageMonths: 4 },
      { id: "mn-v3", label: "V3", age: "6 мес", ageMonths: 6 },
      { id: "mn-rv", label: "RV", age: "12–15 мес", ageMonths: 12 },
      { id: "mn-school", label: "V/RV", age: "2–17 лет", ageMonths: 24, note: "Не менее 4-валентные вакцины" },
    ],
  },
  {
    id: "rota",
    icon: "Waves",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    disease: "Ротавирусная инфекция",
    doses: [
      { id: "rota-v1", label: "V1", age: "2 мес", ageMonths: 2, note: "Старт с 6-недельного возраста" },
      { id: "rota-v2", label: "V2", age: "3 мес", ageMonths: 3 },
      { id: "rota-v3", label: "V3", age: "4–5 мес", ageMonths: 4 },
    ],
  },
  {
    id: "pertussis",
    icon: "Activity",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    disease: "Коклюш",
    doses: [
      { id: "pt-v1", label: "V1", age: "3 мес", ageMonths: 3 },
      { id: "pt-v2", label: "V2", age: "4–5 мес", ageMonths: 4 },
      { id: "pt-v3", label: "V3", age: "6 мес", ageMonths: 6 },
      { id: "pt-rv", label: "1RV", age: "18 мес", ageMonths: 18 },
    ],
  },
  {
    id: "diphtheria",
    icon: "Activity",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    disease: "Дифтерия",
    doses: [
      { id: "df-v1", label: "V1", age: "3 мес", ageMonths: 3 },
      { id: "df-v2", label: "V2", age: "4–5 мес", ageMonths: 4 },
      { id: "df-v3", label: "V3", age: "6 мес", ageMonths: 6 },
      { id: "df-rv1", label: "1RV", age: "18 мес", ageMonths: 18 },
      { id: "df-rv2", label: "2RV", age: "6–7 лет", ageMonths: 72 },
      { id: "df-rv3", label: "3RV", age: "14 лет", ageMonths: 168 },
    ],
  },
  {
    id: "tetanus",
    icon: "Activity",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    disease: "Столбняк",
    doses: [
      { id: "tt-v1", label: "V1", age: "3 мес", ageMonths: 3 },
      { id: "tt-v2", label: "V2", age: "4–5 мес", ageMonths: 4 },
      { id: "tt-v3", label: "V3", age: "6 мес", ageMonths: 6 },
      { id: "tt-rv1", label: "1RV", age: "18 мес", ageMonths: 18 },
      { id: "tt-rv2", label: "2RV", age: "6–7 лет", ageMonths: 72 },
      { id: "tt-rv3", label: "3RV", age: "14 лет", ageMonths: 168 },
    ],
  },
  {
    id: "polio",
    icon: "Footprints",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    disease: "Полиомиелит",
    doses: [
      { id: "pl-v1", label: "V1 ИПВ", age: "3 мес", ageMonths: 3 },
      { id: "pl-v2", label: "V2 ИПВ", age: "4–5 мес", ageMonths: 4 },
      { id: "pl-v3", label: "V3 ИПВ", age: "6 мес", ageMonths: 6 },
      { id: "pl-rv1", label: "1RV ИПВ", age: "18 мес", ageMonths: 18 },
      { id: "pl-rv2", label: "2RV ИПВ/ОПВ", age: "20 мес", ageMonths: 20 },
      { id: "pl-rv3", label: "3RV ИПВ/ОПВ", age: "6 лет", ageMonths: 72 },
    ],
  },
  {
    id: "hib",
    icon: "Shield",
    color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    disease: "Гемофильная инфекция типа b",
    doses: [
      { id: "hib-v1", label: "V1", age: "3 мес", ageMonths: 3 },
      { id: "hib-v2", label: "V2", age: "4–5 мес", ageMonths: 4 },
      { id: "hib-v3", label: "V3", age: "6 мес", ageMonths: 6 },
      { id: "hib-rv", label: "RV", age: "18 мес", ageMonths: 18 },
    ],
  },
  {
    id: "flu",
    icon: "ThermometerSnowflake",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    disease: "Грипп",
    doses: [
      { id: "flu-1", label: "Ежегодно", age: "С 6 мес", ageMonths: 6, note: "Прививают каждый сезон. В 6 мес – 9 лет впервые двукратно с интервалом 4 нед" },
    ],
  },
  {
    id: "measles",
    icon: "Sparkles",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    disease: "Корь",
    doses: [
      { id: "ms-v1", label: "V1 ККП", age: "12 мес", ageMonths: 12, note: "С 8 мес — группам риска" },
      { id: "ms-v2", label: "V2 ККП", age: "6 лет", ageMonths: 72 },
    ],
  },
  {
    id: "rubella",
    icon: "Sparkles",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    disease: "Краснуха",
    doses: [
      { id: "rb-v1", label: "V1 ККП", age: "12 мес", ageMonths: 12 },
      { id: "rb-v2", label: "V2 ККП", age: "6 лет", ageMonths: 72 },
    ],
  },
  {
    id: "mumps",
    icon: "Sparkles",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    disease: "Эпидемический паротит",
    doses: [
      { id: "mp-v1", label: "V1 ККП", age: "12 мес", ageMonths: 12 },
      { id: "mp-v2", label: "V2 ККП", age: "6 лет", ageMonths: 72 },
    ],
  },
  {
    id: "varicella",
    icon: "Sparkles",
    color: "bg-lime-50 text-lime-700 border-lime-200",
    disease: "Ветряная оспа",
    doses: [
      { id: "vz-v1", label: "V1", age: "12 мес", ageMonths: 12, note: "С 9 мес — группам риска" },
      { id: "vz-v2", label: "V2", age: "15 мес", ageMonths: 15 },
    ],
  },
  {
    id: "hepa",
    icon: "Droplet",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    disease: "Вирусный гепатит A",
    doses: [
      { id: "ha-v1", label: "V1", age: "20 мес", ageMonths: 20 },
      { id: "ha-v2", label: "V2", age: "2–3 года", ageMonths: 26, note: "Через 6 мес после первой" },
    ],
  },
  {
    id: "tbe",
    icon: "Bug",
    color: "bg-green-50 text-green-700 border-green-200",
    disease: "Клещевой вирусный энцефалит",
    doses: [
      { id: "tbe-1", label: "Курс вакцинации", age: "С 12 мес", ageMonths: 12, note: "По эпидемическим показаниям, схема зависит от препарата" },
    ],
  },
  {
    id: "hpv",
    icon: "ShieldCheck",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    disease: "Папилломавирусная инфекция (ВПЧ)",
    doses: [
      { id: "hpv-v1", label: "V1", age: "С 9 лет", ageMonths: 108, note: "9–14 лет: 2-дозовая схема 0–6 мес" },
      { id: "hpv-v2", label: "V2", age: "+6 мес", ageMonths: 114 },
    ],
  },
  {
    id: "covid",
    icon: "Shield",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    disease: "Коронавирусная инфекция (SARS-CoV-2)",
    doses: [
      { id: "cv-1", label: "Вакцинация", age: "12–17 лет", ageMonths: 144, note: "При письменном согласии родителя, приоритет — детям из групп риска" },
    ],
  },
];
