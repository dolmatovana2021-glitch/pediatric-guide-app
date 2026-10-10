import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  closeIllnessCase,
  startIllnessCase,
  type IllnessCase,
} from "@/components/shared/childProfile";

const QUICK_TITLES = ["ОРВИ", "Грипп", "Ангина", "Отит", "Кишечная инфекция", "Ветрянка"];

export function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function fmtDay(s: string): string {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export function caseDay(c: IllnessCase): number {
  const start = new Date(c.startedAt);
  start.setHours(0, 0, 0, 0);
  const end = c.endedAt ? new Date(c.endedAt) : new Date();
  end.setHours(0, 0, 0, 0);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export function caseTitle(c: IllnessCase): string {
  return c.title.trim() || "Болезнь";
}

export function caseRange(c: IllnessCase): string {
  const days = caseDay(c);
  const base = c.endedAt
    ? `${fmtDay(c.startedAt)} — ${fmtDay(c.endedAt)}`
    : `с ${fmtDay(c.startedAt)}`;
  return `${base} · ${days} ${plural(days, "день", "дня", "дней")}`;
}

export function StartCaseForm({
  childId,
  onCancel,
  onStarted,
}: {
  childId: string;
  onCancel?: () => void;
  onStarted?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [startedAt, setStartedAt] = useState(localNow());

  const submit = () => {
    if (!startedAt) return;
    startIllnessCase(childId, { title, startedAt });
    onStarted?.();
  };

  return (
    <div className="bg-card border border-rose-200 rounded-3xl p-4 shadow-sm mb-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🤒</span>
        <p className="font-bold text-foreground text-[15px]">Новый случай болезни</p>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Что случилось (можно не заполнять)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например, ОРВИ"
          maxLength={60}
          className="block w-full box-border px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_TITLES.map((t) => (
            <button
              key={t}
              onClick={() => setTitle(t)}
              className={`text-[12px] rounded-full px-3 py-1 border font-medium transition-colors ${
                title === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-mint-50 text-foreground border-mint-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Когда началось
        </label>
        <input
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-muted text-foreground rounded-xl py-2.5 text-sm font-semibold active:scale-95 transition-transform"
          >
            Отмена
          </button>
        )}
        <button
          onClick={submit}
          disabled={!startedAt}
          className="flex-[2] bg-rose-500 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50"
        >
          <Icon name="Play" size={15} />
          Начать дневник болезни
        </button>
      </div>
    </div>
  );
}

export function ActiveCaseCard({ childId, current }: { childId: string; current: IllnessCase }) {
  const [confirm, setConfirm] = useState(false);
  const day = caseDay(current);

  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/60 p-4 mb-4">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-2xl flex-shrink-0">
          🤒
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-[15px] leading-tight truncate">{caseTitle(current)}</p>
          <p className="text-[12px] text-rose-700 dark:text-rose-300 font-medium mt-0.5">
            Болеет · {day}-й день · {caseRange(current).split(" · ")[0]}
          </p>
        </div>
      </div>
      {confirm ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 bg-white/70 dark:bg-white/10 text-foreground rounded-xl py-2.5 text-sm font-semibold active:scale-95 transition-transform"
          >
            Ещё болеет
          </button>
          <button
            onClick={() => closeIllnessCase(childId, current.id, localNow())}
            className="flex-[1.4] bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Icon name="Check" size={15} />
            Да, выздоровел
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirm(true)}
          className="mt-3 w-full bg-white/70 dark:bg-white/10 border border-rose-200 dark:border-rose-900/60 text-emerald-700 dark:text-emerald-400 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Icon name="HeartPulse" size={15} />
          Малыш выздоровел
        </button>
      )}
    </div>
  );
}
