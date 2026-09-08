import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  getActiveChildId,
  listChildren,
  loadChildProfile,
  listSleepEntries,
  addSleepEntry,
  removeSleepEntry,
  calcAge,
  type SleepEntry,
} from "@/components/shared/childProfile";
import { sleepNormFor, sleepVerdict, verdictMeta } from "@/components/shared/sleepData";
import {
  EVENT_NAME,
  localNow,
  hoursBetween,
  fmtDay,
  groupByDay,
} from "./SleepLog.data";
import { SleepLogSummary } from "./SleepLog.Summary";
import { SleepLogChart } from "./SleepLog.Chart";
import { SleepLogForm } from "./SleepLog.Form";
import { SleepLogHistory } from "./SleepLog.History";

export function SleepSection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const [start, setStart] = useState(localNow());
  const [end, setEnd] = useState(localNow());

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setEntries(id ? listSleepEntries(id) : []);
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

  const norm = sleepNormFor(ageMonths);

  const byDay = useMemo(() => groupByDay(entries), [entries]);

  const chartData = byDay.slice(-14).map((d) => ({
    day: fmtDay(d.key),
    total: Number(d.total.toFixed(1)),
  }));

  const lastDay = byDay.length ? byDay[byDay.length - 1] : null;
  const avg7 = useMemo(() => {
    const last = byDay.slice(-7);
    if (!last.length) return null;
    return last.reduce((s, d) => s + d.total, 0) / last.length;
  }, [byDay]);

  const verdict = norm && avg7 !== null ? sleepVerdict(avg7, norm) : null;
  const vMeta = verdict ? verdictMeta[verdict] : null;

  const save = () => {
    const h = hoursBetween(start, end);
    if (h <= 0) return;
    addSleepEntry(childId, { start, end });
    setOpen(false);
    setStart(localNow());
    setEnd(localNow());
  };

  const duration = hoursBetween(start, end);

  const recent = [...entries].reverse().slice(0, 30);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="😴"
        title="Сон"
        subtitle="Засыпание, пробуждение и сравнение с возрастной нормой"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — записи сна привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          <SleepLogSummary
            norm={norm}
            lastDay={lastDay}
            avg7={avg7}
            verdict={verdict}
            vMeta={vMeta}
          />

          <SleepLogChart chartData={chartData} norm={norm} />

          <SleepLogForm
            open={open}
            setOpen={setOpen}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            duration={duration}
            save={save}
          />

          <SleepLogHistory
            totalCount={entries.length}
            recent={recent}
            childId={childId}
            onRemove={removeSleepEntry}
          />

          <p className="text-[10px] text-muted-foreground leading-snug mt-4">
            Нормы приведены по рекомендациям Американской академии медицины сна. Потребность
            во сне индивидуальна; раздел носит справочный характер и не заменяет консультацию
            врача.
          </p>
        </>
      )}
    </SectionWrapper>
  );
}

export default SleepSection;
