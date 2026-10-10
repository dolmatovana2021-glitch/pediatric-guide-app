import Icon from "@/components/ui/icon";
import type { IllnessEntry } from "@/components/shared/childProfile";

export function tempTone(t: number | null): string {
  if (t === null) return "text-muted-foreground";
  if (t >= 39) return "text-rose-600";
  if (t >= 38) return "text-orange-600";
  if (t >= 37.1) return "text-amber-600";
  return "text-emerald-600";
}

export function fmtDateTime(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EntryCard({ e, onRemove }: { e: IllnessEntry; onRemove: () => void }) {
  return (
    <div
      className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground">
            {fmtDateTime(e.datetime)}
          </p>
          {e.temperature !== null && (
            <p className={`text-lg font-bold leading-tight ${tempTone(e.temperature)}`}>
              {e.temperature.toFixed(1)} °C
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
          aria-label="Удалить запись"
        >
          <Icon name="X" size={15} />
        </button>
      </div>

      {e.symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {e.symptoms.map((s) => (
            <span
              key={s}
              className="text-[11px] bg-mint-50 border border-mint-200 text-foreground rounded-full px-2.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {e.medication && (
        <p className="text-[12px] text-foreground mt-2 flex items-start gap-1.5">
          <Icon name="Pill" size={13} className="text-primary flex-shrink-0 mt-0.5" />
          {e.medication}
        </p>
      )}

      {e.note && (
        <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
          {e.note}
        </p>
      )}
    </div>
  );
}

export default EntryCard;
