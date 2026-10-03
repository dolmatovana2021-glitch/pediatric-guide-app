import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { type Section, sectionLabel } from "@/components/shared/sectionTypes";
import { tipsForAge } from "@/components/shared/dailyTipsData";

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint-50 to-peach-50 border border-mint-200 p-4">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-mint-100/70" />

      <div className="relative flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
          <Icon name="Lightbulb" size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-foreground leading-tight">Совет дня</p>
          <p
            key={`topic-${animKey}`}
            className="text-[11px] font-semibold text-primary leading-tight mt-0.5 animate-fade-in"
          >
            {tip.topic}
          </p>
        </div>
      </div>

      <div key={`text-${animKey}`} className="relative flex gap-3 animate-fade-in">
        <span className="w-11 h-11 rounded-2xl bg-card border border-mint-200 flex items-center justify-center text-[22px] flex-shrink-0">
          {tip.emoji}
        </span>
        <p className="text-[13px] text-foreground leading-relaxed">{tip.text}</p>
      </div>

      <div className="relative grid grid-cols-2 gap-2 mt-4">
        {link ? (
          <button
            onClick={() => setSection(link)}
            className="bg-primary text-primary-foreground rounded-2xl py-2.5 px-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform min-w-0"
          >
            <span className="truncate">{sectionLabel(link)}</span>
            <Icon name="ChevronRight" size={15} className="flex-shrink-0" />
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={next}
          className="bg-card border border-mint-200 text-primary rounded-2xl py-2.5 px-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          Другой совет
          <Icon name="RefreshCw" size={14} />
        </button>
      </div>
    </div>
  );
}

export default DailyTipCard;
