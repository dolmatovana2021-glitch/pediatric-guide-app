import Icon from "@/components/ui/icon";
import { typeMeta, fmtTime, fmtDay, type FeedDayGroup } from "./FeedingLog.data";

type Props = {
  isEmpty: boolean;
  days: FeedDayGroup[];
  childId: string;
  onRemove: (childId: string, entryId: string) => void;
};

export function FeedingLogHistory({ isEmpty, days, childId, onRemove }: Props) {
  if (isEmpty) {
    return (
      <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
        <Icon name="Milk" fallback="Baby" size={28} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-[13px] text-muted-foreground leading-snug">
          Записей пока нет. Отмечайте кормления — приложение посчитает их количество и
          объём за сутки.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {days.slice(0, 14).map((d) => (
        <div key={d.key}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {fmtDay(d.key)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {d.count} корм.
              {d.volume > 0 ? ` · ${d.volume} мл` : ""}
            </p>
          </div>
          <div className="space-y-1.5">
            {d.list.map((e) => {
              const meta = typeMeta[e.type];
              const details = [
                e.amount !== null ? `${e.amount} мл` : "",
                e.duration !== null ? `${e.duration} мин` : "",
                e.note,
              ].filter(Boolean);
              return (
                <div
                  key={e.id}
                  className="bg-white border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm"
                >
                  <span className="text-base">{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground leading-tight">
                      {fmtTime(e.datetime)}
                      <span
                        className={`ml-2 text-[10px] font-semibold rounded-full px-2 py-0.5 ${meta.chip}`}
                      >
                        {meta.label}
                      </span>
                    </p>
                    {details.length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        {details.join(" · ")}
                      </p>
                    )}
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
        </div>
      ))}
    </div>
  );
}

export default FeedingLogHistory;
