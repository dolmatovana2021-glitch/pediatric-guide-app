import Icon from "@/components/ui/icon";
import { type FeedEntry } from "@/components/shared/childProfile";
import { fmtTime, type FeedDayGroup, type FeedNorm } from "./FeedingLog.data";

type Props = {
  norm: FeedNorm | null;
  todayData: FeedDayGroup | undefined;
  todayCount: number;
  todayVolume: number;
  countTone: string;
  lastFeed: FeedEntry | null;
  sinceLast: number | null;
};

export function FeedingLogSummary({
  norm,
  todayData,
  todayCount,
  todayVolume,
  countTone,
  lastFeed,
  sinceLast,
}: Props) {
  return (
    <>
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">Сегодня кормлений</p>
            <p className={`text-xl font-bold leading-tight ${countTone}`}>{todayCount}</p>
            {norm && (
              <p className="text-[11px] text-muted-foreground">
                ориентир {norm.min}–{norm.max}
              </p>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">Объём за сутки</p>
            <p className="text-xl font-bold text-foreground leading-tight">
              {todayVolume > 0 ? `${todayVolume}` : "—"}
              {todayVolume > 0 && (
                <span className="text-sm font-normal text-muted-foreground"> мл</span>
              )}
            </p>
            {todayData && todayData.breast > 0 && (
              <p className="text-[11px] text-muted-foreground">
                грудь {todayData.breast} раз
              </p>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">С последнего</p>
            <p className="text-xl font-bold text-foreground leading-tight">
              {sinceLast === null
                ? "—"
                : sinceLast < 60
                  ? `${sinceLast} мин`
                  : `${Math.floor(sinceLast / 60)} ч ${sinceLast % 60} мин`}
            </p>
            {lastFeed && (
              <p className="text-[11px] text-muted-foreground">
                в {fmtTime(lastFeed.datetime)}
              </p>
            )}
          </div>
        </div>
      </div>

      {norm && (
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Ориентир для возраста {norm.label}: {norm.min}–{norm.max} кормлений в сутки,{" "}
            {norm.hint}. Ребёнка на грудном вскармливании кормят по требованию — число
            кормлений может отличаться.
          </p>
        </div>
      )}
    </>
  );
}

export default FeedingLogSummary;
