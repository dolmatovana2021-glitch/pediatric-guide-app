import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionShared";
import {
  getActiveChildId,
  listChildren,
  loadChildProfile,
  getTeeth,
  setToothDate,
  setToothLostDate,
  getLostDate,
  calcAge,
} from "@/components/shared/childProfile";
import {
  teethByKind,
  toothState,
  expectedCount,
  TOTAL_TEETH,
  TOTAL_PERMANENT_TEETH,
  predecessorId,
  type Tooth,
  type ToothKind,
} from "@/components/shared/teethData";
import { EVENT_NAME, today } from "./Teeth.helpers";
import { TeethChart } from "./Teeth.Chart";
import { TeethStatus } from "./Teeth.Status";
import { TeethPickerModal } from "./Teeth.PickerModal";

export function TeethSection() {
  const [childId, setChildId] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [teeth, setTeeth] = useState<Record<string, string>>({});
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [ageLabel, setAgeLabel] = useState("");
  const [picked, setPicked] = useState<Tooth | null>(null);
  const [dateInput, setDateInput] = useState(today());
  const [kind, setKind] = useState<ToothKind>("primary");

  const refresh = () => {
    const id = getActiveChildId();
    setChildId(id);
    setHasChild(listChildren().length > 0);
    setTeeth(id ? getTeeth(id) : {});
    const profile = loadChildProfile();
    const age = calcAge(profile.birthDate);
    setAgeMonths(age ? age.years * 12 + age.months : null);
    setAgeLabel(age ? age.label : "");
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

  const currentTeeth = useMemo(() => teethByKind(kind), [kind]);
  const total = kind === "primary" ? TOTAL_TEETH : TOTAL_PERMANENT_TEETH;

  const eruptedCount = Object.keys(teeth).filter((k) =>
    currentTeeth.some((t) => t.id === k),
  ).length;

  const expected = ageMonths !== null ? expectedCount(ageMonths, kind) : null;

  const lateTeeth = useMemo(
    () =>
      ageMonths === null
        ? []
        : currentTeeth.filter(
            (t) => !teeth[t.id] && toothState(t, false, ageMonths) === "late",
          ),
    [teeth, ageMonths, currentTeeth],
  );

  const dueTeeth = useMemo(
    () =>
      ageMonths === null
        ? []
        : currentTeeth.filter(
            (t) => !teeth[t.id] && toothState(t, false, ageMonths) === "due",
          ),
    [teeth, ageMonths, currentTeeth],
  );

  const verdict = (() => {
    if (ageMonths === null)
      return {
        text: "Укажите дату рождения в профиле, чтобы сверить сроки с нормами.",
        tone: "bg-mint-50 border-mint-200",
        icon: "Info",
        iconTone: "text-primary",
      };
    if (lateTeeth.length > 0)
      return {
        text: `${lateTeeth.length} ${lateTeeth.length === 1 ? "зуб задерживается" : "зубов задерживаются"} более чем на полгода от верхней границы нормы. Стоит показать ребёнка стоматологу или педиатру.`,
        tone: "bg-rose-50 border-rose-200",
        icon: "TriangleAlert",
        iconTone: "text-rose-600",
      };
    if (dueTeeth.length > 0)
      return {
        text: `Сейчас по возрасту могут прорезаться ${dueTeeth.length} ${dueTeeth.length === 1 ? "зуб" : "зубов"}. Небольшие отклонения от сроков — вариант нормы.`,
        tone: "bg-amber-50 border-amber-200",
        icon: "Clock",
        iconTone: "text-amber-600",
      };
    if (kind === "permanent" && eruptedCount === 0)
      return {
        text: "Постоянные зубы обычно начинают прорезаться с 6 лет: первыми выходят моляры и нижние центральные резцы. Отмечайте их по мере смены молочных.",
        tone: "bg-mint-50 border-mint-200",
        icon: "Info",
        iconTone: "text-primary",
      };
    return {
      text:
        kind === "permanent"
          ? "Смена зубов идёт по возрастным нормам. Сроки индивидуальны, сдвиг на полгода–год встречается часто."
          : "Всё идёт по возрастным нормам. Сроки прорезывания индивидуальны, сдвиг на 2–3 месяца — это нормально.",
      tone: "bg-emerald-50 border-emerald-200",
      icon: "CircleCheck",
      iconTone: "text-emerald-600",
    };
  })();

  const openPicker = (t: Tooth) => {
    setPicked(t);
    setDateInput(teeth[t.id] || today());
  };

  const confirmTooth = () => {
    if (!picked) return;
    setToothDate(childId, picked.id, dateInput);
    setPicked(null);
  };

  const clearTooth = () => {
    if (!picked) return;
    setToothDate(childId, picked.id, null);
    setToothLostDate(childId, picked.id, null);
    setPicked(null);
  };

  const markLost = () => {
    if (!picked) return;
    setToothLostDate(childId, picked.id, dateInput);
    setPicked(null);
  };

  const unmarkLost = () => {
    if (!picked) return;
    setToothLostDate(childId, picked.id, null);
    setPicked(null);
  };

  const waitingPermanent = useMemo(
    () =>
      currentTeeth.filter((t) => {
        if (t.kind !== "permanent") return false;
        if (teeth[t.id]) return false;
        const prev = predecessorId(t);
        return prev ? Boolean(getLostDate(teeth, prev)) : false;
      }),
    [teeth, currentTeeth],
  );

  const lostCount = useMemo(
    () => teethByKind("primary").filter((t) => getLostDate(teeth, t.id)).length,
    [teeth],
  );

  const history = useMemo(
    () =>
      currentTeeth
        .filter((t) => teeth[t.id])
        .map((t) => ({ tooth: t, date: teeth[t.id] }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [teeth, currentTeeth],
  );

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🦷"
        title="Зубная формула"
        subtitle="Отмечайте молочные и коренные зубы на схеме и следите за сроками"
      />

      {!hasChild ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground leading-snug">
            Сначала добавьте ребёнка в разделе «Профиль» — отметки привязываются к ребёнку.
          </p>
        </div>
      ) : (
        <>
          <TeethChart
            teeth={teeth}
            ageMonths={ageMonths}
            ageLabel={ageLabel}
            kind={kind}
            setKind={setKind}
            eruptedCount={eruptedCount}
            total={total}
            expected={expected}
            onPick={openPicker}
          />

          <TeethStatus
            verdict={verdict}
            kind={kind}
            lostCount={lostCount}
            waitingPermanent={waitingPermanent}
            history={history}
            teeth={teeth}
            childId={childId}
          />
        </>
      )}

      <TeethPickerModal
        picked={picked}
        setPicked={setPicked}
        teeth={teeth}
        dateInput={dateInput}
        setDateInput={setDateInput}
        confirmTooth={confirmTooth}
        clearTooth={clearTooth}
        markLost={markLost}
        unmarkLost={unmarkLost}
      />
    </SectionWrapper>
  );
}

export default TeethSection;
