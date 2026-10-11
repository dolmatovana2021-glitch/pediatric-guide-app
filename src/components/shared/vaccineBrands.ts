const PENTAXIM = "Пентаксим";
const HEXA = "Инфанрикс Гекса";
const TETRAXIM = "Тетраксим";
const INFANRIX = "Инфанрикс";
const INFANRIX_IPV = "Инфанрикс ИПВ";
const ADACEL = "Адасель";
const AKDS = "АКДС";
const BUBO_KOK = "Бубо-Кок";
const BUBO_M = "Бубо-М";
const ADS = "АДС";
const ADS_M = "АДС-М";

const MMR = ["Вактривир", "М-М-Р II", "Приорикс"];

export const vaccineBrands: Record<string, string[]> = {
  rsvi: ["Синагис (паливизумаб)"],
  tuberculosis: ["БЦЖ", "БЦЖ-М"],
  hepb: ["Энджерикс В", "Регевак В", "Эувакс В", "Комбиотех", HEXA, BUBO_KOK, BUBO_M],
  pneumo: ["Превенар 13", "Синфлорикс", "Пневмотекс", "Пневмовакс 23"],
  meningo: ["Менактра", "Менинго A+C", "Менингококковая вакцина A"],
  rota: ["РотаТек"],
  pertussis: [PENTAXIM, HEXA, INFANRIX, INFANRIX_IPV, TETRAXIM, AKDS, BUBO_KOK, ADACEL],
  diphtheria: [PENTAXIM, HEXA, INFANRIX, INFANRIX_IPV, TETRAXIM, AKDS, BUBO_KOK, ADACEL, ADS, ADS_M, BUBO_M],
  tetanus: [PENTAXIM, HEXA, INFANRIX, INFANRIX_IPV, TETRAXIM, AKDS, BUBO_KOK, ADACEL, ADS, ADS_M, BUBO_M, "АС-анатоксин"],
  polio: ["Полимилекс", "Имовакс Полио", "Полиорикс", "БиВак Полио (ОПВ)", PENTAXIM, HEXA, INFANRIX_IPV, TETRAXIM],
  hib: ["Акт-ХИБ", "Хиберикс", PENTAXIM, HEXA],
  flu: [
    "Ультрикс Квадри",
    "Ультрикс",
    "Совигрипп",
    "Гриппол плюс",
    "Гриппол Квадривалент",
    "Флю-М",
    "Ваксигрип",
    "Инфлювак",
  ],
  measles: [...MMR, "Дивакцина корь-паротит", "Коревая вакцина (ЖКВ)"],
  rubella: [...MMR, "Краснушная вакцина"],
  mumps: [...MMR, "Дивакцина корь-паротит", "Паротитная вакцина (ЖПВ)"],
  varicella: ["Варилрикс"],
  hepa: ["Хаврикс 720", "Аваксим 80", "Альгавак М", "Геп-А-ин-Вак"],
  tbe: ["Клещ-Э-Вак", "ЭнцеВир Нео", "ФСМЕ-Иммун Джуниор", "Энцепур детский", "Вакцина КЭ (Чумаков)"],
  hpv: ["Гардасил", "Церварикс"],
  covid: ["Спутник М"],
};

export function brandsFor(rowId: string): string[] {
  return vaccineBrands[rowId] ?? [];
}
