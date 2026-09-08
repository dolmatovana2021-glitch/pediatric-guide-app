import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  getActiveChildId,
  listChildren,
  loadChildProfile,
  listFeedEntries,
  addFeedEntry,
  removeFeedEntry,
  calcAge,
  type FeedEntry,
  type FeedType,
} from "@/components/shared/childProfile";
import { EVENT_NAME, feedNormFor, localNow, groupByDay } from "./FeedingLog.data";
import { FeedingLogSummary } from "./FeedingLog.Summary";
import { FeedingLogForm } from "./FeedingLog.Form";
import { FeedingLogHistory } from "./FeedingLog.History";

export function FeedingLogSection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const [datetime, setDatetime] = useState(localNow());
  const [type, setType] = useState<FeedType>("breast");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setEntries(id ? listFeedEntries(id) : []);
    const age = calcAge(loadChildProfile().birthDate);
    setAgeMonths(age ? age.years * 12 + age.months : null);
  };

  useEffect(() => {
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const norm = feedNormFor(ageMonths);

  const days = useMemo(() => groupByDay(entries), [entries]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayData = days.find((d) => d.key === todayKey);
  const todayCount = todayData?.count ?? 0;
  const todayVolume = todayData?.volume ?? 0;

  const lastFeed = entries.length ? entries[entries.length - 1] : null;
  const sinceLast = lastFeed
    ? Math.floor((Date.now() - new Date(lastFeed.datetime).getTime()) / 60000)
    : null;

  const countTone =
    norm && todayCount > 0
      ? todayCount < norm.min
        ? "text-amber-600"
        : todayCount > norm.max
          ? "text-sky-600"
          : "text-emerald-600"
      : "text-foreground";

  const save = () => {
    if (!datetime) return;
    const amt = amount ? parseInt(amount, 10) : null;
    const dur = duration ? parseInt(duration, 10) : null;
    addFeedEntry(childId, {
      datetime,
      type,
      amount: amt !== null && !isNaN(amt) ? amt : null,
      duration: dur !== null && !isNaN(dur) ? dur : null,
      note: note.trim(),
    });
    setAmount("");
    setDuration("");
    setNote("");
    setDatetime(localNow());
    setOpen(false);
  };

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🍼"
        title="Кормление"
        subtitle="Время, объём смеси и грудное вскармливание"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — записи привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          <FeedingLogSummary
            norm={norm}
            todayData={todayData}
            todayCount={todayCount}
            todayVolume={todayVolume}
            countTone={countTone}
            lastFeed={lastFeed}
            sinceLast={sinceLast}
          />

          <FeedingLogForm
            open={open}
            setOpen={setOpen}
            datetime={datetime}
            setDatetime={setDatetime}
            type={type}
            setType={setType}
            amount={amount}
            setAmount={setAmount}
            duration={duration}
            setDuration={setDuration}
            note={note}
            setNote={setNote}
            save={save}
          />

          <FeedingLogHistory
            isEmpty={entries.length === 0}
            days={days}
            childId={childId}
            onRemove={removeFeedEntry}
          />

          <p className="text-[10px] text-muted-foreground leading-snug mt-4">
            Ориентиры приведены справочно. Главные признаки достаточного питания — прибавка
            веса, достаточное количество мокрых подгузников и спокойное поведение ребёнка.
            При сомнениях обратитесь к педиатру.
          </p>
        </>
      )}
    </SectionWrapper>
  );
}

export default FeedingLogSection;
