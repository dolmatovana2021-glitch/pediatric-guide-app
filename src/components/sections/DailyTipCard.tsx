import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { type Section, sectionLabel } from "@/components/shared/sectionTypes";
import { tipsForAge } from "@/components/shared/dailyTipsData";
import { Bear } from "@/components/shared/Bear";

type Props = {
  ageMonths: number | null;
  setSection: (s: Section) => void;
  isVisible: (s: Section) => boolean;
};

const dayOfYear = () =>
  Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

export function DailyTipCard({ ageMonths, setSection, isVisible }: Props) {
  const tips = useMemo(
    () => tipsForAge(ageMonths).filter((t) => !t.section || isVisible(t.section)),
    [ageMonths, isVisible]
  );
  const [index, setIndex] = useState(() => dayOfYear() % Math.max(tips.length, 1));
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setIndex(dayOfYear() % Math.max(tips.length, 1));
  }, [tips.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(tips.length, 1));
    setAnimKey((k) => k + 1);
  }, [tips.length]);

  useEffect(() => {
    const id = setInterval(next, 90000);
    return () => clearInterval(id);
  }, [next]);

  if (!tips.length) return null;
  const tip = tips[index % tips.length];
  const link = tip.section && tip.section !== "home" ? tip.section : null;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="font-bold text-[15px] text-foreground">Совет дня</h3>
        {tips.length > 1 && (
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {(index % tips.length) + 1} из {tips.length}
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint-100 to-teal-100 shadow-md shadow-teal-300/30 p-4 pb-3">
        <div className="absolute -right-8 -bottom-12 w-40 h-40 rounded-full bg-card/40" />
        <Bear pose="main" nightAware className="absolute -right-2 -bottom-2 w-[96px] h-[96px] pointer-events-none" />

        <div key={`text-${animKey}`} className="relative pr-[78px] animate-fade-in">
          <span className="inline-flex items-center gap-1.5 bg-card/70 rounded-full pl-1.5 pr-2.5 py-1 text-[11px] font-semibold text-teal-700">
            <span className="text-[14px] leading-none">{tip.emoji}</span>
            {tip.topic}
          </span>
          <p className="text-[13.5px] text-foreground leading-relaxed mt-2.5 min-h-[88px]">{tip.text}</p>
        </div>

        <div className="relative flex items-center gap-2 mt-3 pr-[78px]">
          {link && (
            <button
              onClick={() => setSection(link)}
              className="bg-primary text-primary-foreground rounded-full py-2 pl-3.5 pr-2.5 text-[12px] font-semibold flex items-center gap-1 active:scale-95 transition-transform min-w-0 shadow-sm"
            >
              <span className="truncate">{sectionLabel(link)}</span>
              <Icon name="ChevronRight" size={14} className="flex-shrink-0" />
            </button>
          )}
          {tips.length > 1 && (
            <button
              onClick={next}
              aria-label="Другой совет"
              className="bg-card/80 text-teal-700 rounded-full py-2 px-3 text-[12px] font-semibold flex items-center gap-1.5 active:scale-95 transition-transform flex-shrink-0"
            >
              <Icon name="RefreshCw" size={13} />
              Ещё
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyTipCard;
