import Icon from "@/components/ui/icon";
import { formatHours } from "@/components/shared/sleepData";
import { localNow, isNightSleep } from "./SleepLog.data";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  start: string;
  setStart: (v: string) => void;
  end: string;
  setEnd: (v: string) => void;
  duration: number;
  save: () => void;
};

export function SleepLogForm({
  open,
  setOpen,
  start,
  setStart,
  end,
  setEnd,
  duration,
  save,
}: Props) {
  if (!open) {
    return (
      <button
        onClick={() => {
          setStart(localNow());
          setEnd(localNow());
          setOpen(true);
        }}
        className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
      >
        <Icon name="Plus" size={16} />
        Добавить сон
      </button>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Уснул
        </label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Проснулся
        </label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {duration > 0 && (
        <p className="text-[12px] text-foreground bg-mint-50 border border-mint-200 rounded-xl px-3 py-2">
          Продолжительность: <span className="font-semibold">{formatHours(duration)}</span>
          {" · "}
          {isNightSleep(start) ? "ночной сон" : "дневной сон"}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={duration <= 0}
          className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
        >
          Сохранить
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default SleepLogForm;
