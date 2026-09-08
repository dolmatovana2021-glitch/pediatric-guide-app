import Icon from "@/components/ui/icon";
import {
  formatHours,
  type SleepNorm,
  type SleepVerdict,
} from "@/components/shared/sleepData";
import { type SleepDay } from "./SleepLog.data";

type VerdictMeta = {
  label: string;
  tone: string;
  card: string;
  icon: string;
  iconTone: string;
};

type Props = {
  norm: SleepNorm | null;
  lastDay: SleepDay | null;
  avg7: number | null;
  verdict: SleepVerdict | null;
  vMeta: VerdictMeta | null;
};

export function SleepLogSummary({ norm, lastDay, avg7, verdict, vMeta }: Props) {
  return (
    <>
      {norm && (
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Норма для возраста</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {norm.minHours}–{norm.maxHours} ч
              </p>
              <p className="text-[11px] text-muted-foreground">{norm.label}</p>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Сегодня / посл. день</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {lastDay ? formatHours(lastDay.total) : "—"}
              </p>
              {lastDay && (
                <p className="text-[11px] text-muted-foreground">
                  ночь {formatHours(lastDay.night)}
                </p>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Среднее за 7 дней</p>
              <p
                className={`text-lg font-bold leading-tight ${vMeta ? vMeta.tone : "text-foreground"}`}
              >
                {avg7 !== null ? formatHours(avg7) : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground">{norm.naps}</p>
            </div>
          </div>
        </div>
      )}

      {vMeta && (
        <div className={`border rounded-2xl p-3.5 mb-3 flex items-start gap-2.5 ${vMeta.card}`}>
          <Icon
            name={vMeta.icon}
            fallback="Info"
            size={16}
            className={`${vMeta.iconTone} flex-shrink-0 mt-0.5`}
          />
          <p className="text-[12px] text-foreground leading-snug">
            {verdict === "ok" &&
              "Ребёнок спит в пределах возрастной нормы. Потребность во сне индивидуальна, небольшие колебания по дням — это нормально."}
            {verdict === "low" &&
              `В среднем ребёнок спит меньше рекомендованных ${norm!.minHours} ч. Если он вялый, капризный или плохо засыпает — обсудите режим с педиатром.`}
            {verdict === "high" &&
              `В среднем ребёнок спит больше рекомендованных ${norm!.maxHours} ч. Обычно это не проблема, но при постоянной сонливости стоит показаться врачу.`}
          </p>
        </div>
      )}

      {!norm && (
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Укажите дату рождения в профиле, чтобы сравнивать сон с возрастной нормой.
          </p>
        </div>
      )}
    </>
  );
}

export default SleepLogSummary;
