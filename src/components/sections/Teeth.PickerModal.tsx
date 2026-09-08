import { getLostDate } from "@/components/shared/childProfile";
import {
  rangeLabel,
  successorId,
  predecessorId,
  type Tooth,
} from "@/components/shared/teethData";
import { today, fmtDate } from "./Teeth.helpers";

type Props = {
  picked: Tooth | null;
  setPicked: (t: Tooth | null) => void;
  teeth: Record<string, string>;
  dateInput: string;
  setDateInput: (v: string) => void;
  confirmTooth: () => void;
  clearTooth: () => void;
  markLost: () => void;
  unmarkLost: () => void;
};

export function TeethPickerModal({
  picked,
  setPicked,
  teeth,
  dateInput,
  setDateInput,
  confirmTooth,
  clearTooth,
  markLost,
  unmarkLost,
}: Props) {
  if (!picked) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={() => setPicked(null)}
    >
      <div
        className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-bold text-foreground text-sm">{picked.group}</p>
        <p className="text-[11px] text-muted-foreground mb-3">
          {picked.jaw === "upper" ? "Верхняя" : "Нижняя"} челюсть,{" "}
          {picked.side === "left" ? "слева" : "справа"} · норма {rangeLabel(picked)}
        </p>

        {picked.kind === "primary" && getLostDate(teeth, picked.id) && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 mb-3">
            <p className="text-[11px] text-foreground leading-snug">
              Зуб выпал {fmtDate(getLostDate(teeth, picked.id)!)}.
              {(() => {
                const succ = successorId(picked);
                if (!succ) return null;
                return teeth[succ]
                  ? " Постоянный зуб уже отмечен как прорезавшийся."
                  : " Постоянный зуб на его месте ещё не отмечен.";
              })()}
            </p>
          </div>
        )}

        {picked.kind === "permanent" &&
          (() => {
            const prev = predecessorId(picked);
            if (!prev) return null;
            const lostAt = getLostDate(teeth, prev);
            if (!lostAt || teeth[picked.id]) return null;
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                <p className="text-[11px] text-foreground leading-snug">
                  Молочный зуб на этом месте выпал {fmtDate(lostAt)}. Постоянный ещё не
                  отмечен.
                </p>
              </div>
            );
          })()}

        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          {picked.kind === "primary" ? "Дата прорезывания или выпадения" : "Дата прорезывания"}
        </label>
        <input
          type="date"
          value={dateInput}
          max={today()}
          onChange={(e) => setDateInput(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="flex gap-2">
          <button
            onClick={confirmTooth}
            className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm active:scale-95 transition-transform"
          >
            Прорезался
          </button>
          {picked.kind === "primary" &&
            (getLostDate(teeth, picked.id) ? (
              <button
                onClick={unmarkLost}
                className="px-4 bg-white border border-violet-300 text-violet-700 rounded-xl py-2.5 font-semibold text-sm"
              >
                Не выпал
              </button>
            ) : (
              <button
                onClick={markLost}
                className="px-4 bg-violet-100 border border-violet-300 text-violet-700 rounded-xl py-2.5 font-semibold text-sm active:scale-95 transition-transform"
              >
                Выпал
              </button>
            ))}
          {teeth[picked.id] && (
            <button
              onClick={clearTooth}
              className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
            >
              Убрать
            </button>
          )}
        </div>
        <button
          onClick={() => setPicked(null)}
          className="w-full mt-2 bg-white border border-border text-muted-foreground rounded-xl py-2.5 font-semibold text-sm"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default TeethPickerModal;
