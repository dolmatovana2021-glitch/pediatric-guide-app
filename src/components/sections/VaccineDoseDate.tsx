import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import type { DoseDate } from "@/components/shared/vaccineStatus";

function fmt(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export function VaccineDoseDate({
  value,
  minDate,
  brands = [],
  onChange,
}: {
  value: DoseDate | undefined;
  minDate?: string;
  brands?: string[];
  onChange: (v: DoseDate | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(value?.date ?? "");
  const [note, setNote] = useState(value?.note ?? "");
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (!editing) {
      setDate(value?.date ?? "");
      setNote(value?.note ?? "");
    }
  }, [value, editing]);

  if (!editing) {
    return value?.date ? (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="w-full flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-left active:scale-[0.99] transition-transform"
      >
        <Icon name="CalendarCheck" size={15} className="text-emerald-600 flex-shrink-0" />
        <span className="flex-1 min-w-0 text-[12px] text-foreground">
          Сделана <b>{fmt(value.date)}</b>
          {value.note && <span className="text-muted-foreground"> · {value.note}</span>}
        </span>
        <Icon name="Pencil" size={13} className="text-muted-foreground flex-shrink-0" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          setDate(today);
          setEditing(true);
        }}
        className="w-full flex items-center gap-2 rounded-lg border border-dashed border-border bg-card px-3 py-2 text-left text-[12px] font-semibold text-primary active:scale-[0.99] transition-transform"
      >
        <Icon name="CalendarPlus" size={15} className="flex-shrink-0" />
        Записать дату выполнения
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-mint-200 p-2.5 space-y-2 animate-fade-in">
      <label className="block">
          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Дата</span>
          <input
            type="date"
            value={date}
            min={minDate || undefined}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full box-border appearance-none h-[36px] px-2 bg-mint-50 border border-mint-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      <div>
        <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
          Вакцина (необязательно)
        </span>
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {brands.map((b) => {
              const active = note.trim() === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setNote(active ? "" : b)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition active:scale-95 ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-mint-50 text-foreground border-mint-200"
                  }`}
                >
                  {active && <Icon name="Check" size={11} className="inline -mt-0.5 mr-0.5" />}
                  {b}
                </button>
              );
            })}
          </div>
        )}
        <input
          type="text"
          value={note}
          maxLength={60}
          onChange={(e) => setNote(e.target.value)}
          placeholder={brands.length ? "Другая — впишите название" : "Название вакцины"}
          className="block w-full box-border h-[36px] px-2 bg-mint-50 border border-mint-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!date}
          onClick={() => {
            onChange({ date, note: note.trim() || undefined });
            setEditing(false);
          }}
          className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-[12px] font-semibold disabled:opacity-50 active:scale-95 transition-transform"
        >
          Сохранить
        </button>
        {value?.date && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setEditing(false);
            }}
            aria-label="Удалить дату"
            className="w-9 h-9 rounded-lg border border-border bg-card text-rose-500 flex items-center justify-center active:scale-95"
          >
            <Icon name="Trash2" size={15} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-semibold text-muted-foreground active:scale-95"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default VaccineDoseDate;
