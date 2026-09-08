import Icon from "@/components/ui/icon";
import { formatHours } from "@/components/shared/sleepData";
import { type SleepEntry } from "@/components/shared/childProfile";
import { hoursBetween, isNightSleep, dayKey, fmtDay, fmtTime } from "./SleepLog.data";

type Props = {
  totalCount: number;
  recent: SleepEntry[];
  childId: string;
  onRemove: (childId: string, entryId: string) => void;
};

export function SleepLogHistory({ totalCount, recent, childId, onRemove }: Props) {
  if (totalCount === 0) {
    return (
      <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
        <Icon name="Moon" size={28} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-[13px] text-muted-foreground leading-snug">
          Записей пока нет. Отмечайте засыпание и пробуждение — приложение посчитает
          суточный сон и сравнит его с нормой.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold text-muted-foreground">
        Последние записи ({totalCount})
      </p>
      {recent.map((e) => {
        const h = hoursBetween(e.start, e.end);
        const night = isNightSleep(e.start);
        return (
          <div
            key={e.id}
            className="bg-white border border-border rounded-2xl px-3.5 py-3 flex items-center gap-2.5 shadow-sm"
          >
            <span className="text-base">{night ? "🌙" : "☀️"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight">
                {formatHours(h)}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {night ? "ночной" : "дневной"}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fmtDay(dayKey(e.start))} · {fmtTime(e.start)} — {fmtTime(e.end)}
              </p>
            </div>
            <button
              onClick={() => onRemove(childId, e.id)}
              className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
              aria-label="Удалить запись"
            >
              <Icon name="X" size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default SleepLogHistory;
