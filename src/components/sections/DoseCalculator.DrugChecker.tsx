import Icon from "@/components/ui/icon";
import { Drug, DrugCheck } from "./DoseCalculator.data";

type Props = {
  drugQuery: string;
  drugCheck: DrugCheck;
  onQueryChange: (value: string) => void;
  onPickDrug: (key: Drug["key"]) => void;
};

export function DrugChecker({ drugQuery, drugCheck, onQueryChange, onPickDrug }: Props) {
  return (
    <div className="bg-white border border-mint-200 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-base">🔎</span>
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Проверить препарат
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Введите название препарата — покажу, можно ли его давать ребёнку.
      </p>
      <div className="relative">
        <input
          type="text"
          value={drugQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="например, Найз, Нурофен, Анальгин"
          className="w-full text-sm py-2 px-3 pr-9 rounded-lg border border-mint-200 bg-mint-50 focus:outline-none focus:border-primary focus:bg-white transition"
        />
        {drugQuery && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-mint-100 flex items-center justify-center text-muted-foreground"
            aria-label="Очистить"
          >
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      {drugQuery.trim() && drugCheck.status === "safe" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-start gap-2 animate-fade-in">
          <span className="text-base flex-shrink-0">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-emerald-700">
              Безопасный — {drugCheck.canonical}
            </p>
            <p className="text-[11px] text-foreground leading-relaxed mt-0.5">
              {drugCheck.hint}
            </p>
            <button
              onClick={() => {
                if (drugCheck.canonical?.startsWith("Парацетамол")) onPickDrug("paracetamol");
                if (drugCheck.canonical?.startsWith("Ибупрофен")) onPickDrug("ibuprofen");
              }}
              className="text-[11px] font-semibold text-emerald-700 underline mt-1"
            >
              Рассчитать дозу
            </button>
          </div>
        </div>
      )}

      {drugQuery.trim() && drugCheck.status === "forbidden" && (
        <div className="bg-rose-50 border border-rose-300 rounded-lg p-2.5 flex items-start gap-2 animate-fade-in">
          <span className="text-base flex-shrink-0">⛔</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-rose-700">
              Запрещено — {drugCheck.canonical}
            </p>
            <p className="text-[11px] text-foreground leading-relaxed mt-0.5">
              {drugCheck.reason}
            </p>
          </div>
        </div>
      )}

      {drugQuery.trim().length > 1 && drugCheck.status === "unknown" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 animate-fade-in">
          <span className="text-base flex-shrink-0">❓</span>
          <p className="text-[11px] text-foreground leading-relaxed">
            Препарата нет в нашем списке. Не давайте без рекомендации врача.
          </p>
        </div>
      )}
    </div>
  );
}

export default DrugChecker;
