import { useState } from "react";
import Icon from "@/components/ui/icon";

const ISOLATION_DAYS = 5;
const DAY = 24 * 60 * 60 * 1000;

const toInput = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseInput = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const fmt = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" });

const daysWord = (n: number) => {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return "день";
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "дня";
  return "дней";
};

export function ChickenpoxReturnCalc() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [value, setValue] = useState("");

  const last = value ? parseInput(value) : null;
  const invalid = last ? last.getTime() > today.getTime() : false;
  const returnDate = last && !invalid ? new Date(last.getTime() + ISOLATION_DAYS * DAY) : null;
  const daysLeft = returnDate ? Math.round((returnDate.getTime() - today.getTime()) / DAY) : 0;

  return (
    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <Icon name="CalendarCheck" size={16} className="text-violet-600 flex-shrink-0" />
        <p className="text-[13px] font-bold text-foreground">Когда можно в детский сад</p>
      </div>

      <label className="block">
        <span className="text-[12px] text-muted-foreground">Дата появления последних высыпаний</span>
        <input
          type="date"
          value={value}
          max={toInput(today)}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {invalid && (
        <p className="text-[12px] text-red-600">Дата не может быть в будущем.</p>
      )}

      {returnDate && (
        <div className="bg-card border border-violet-200 rounded-xl p-3 text-center">
          {daysLeft > 0 ? (
            <>
              <p className="text-[12px] text-muted-foreground">Можно вернуться в сад</p>
              <p className="text-base font-bold text-foreground mt-0.5 first-letter:uppercase">{fmt(returnDate)}</p>
              <p className="text-[12px] text-violet-700 font-semibold mt-1">
                Осталось {daysLeft} {daysWord(daysLeft)}
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-bold text-emerald-700">Срок изоляции прошёл</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Можно возвращаться с {fmt(returnDate)}
              </p>
            </>
          )}
        </div>
      )}

      <ul className="space-y-1 text-[11px] text-muted-foreground leading-snug">
        <li>• Изоляция — 5 дней после появления последнего нового элемента сыпи.</li>
        <li>• Если появились новые пузырьки — введите новую дату, срок отсчитывается заново.</li>
        <li>• К этому дню все элементы должны покрыться корочками, а температуры быть не должно. Для сада нужна справка педиатра.</li>
      </ul>
    </div>
  );
}

export default ChickenpoxReturnCalc;