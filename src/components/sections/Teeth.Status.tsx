import Icon from "@/components/ui/icon";
import { getLostDate, setToothDate } from "@/components/shared/childProfile";
import { rangeLabel, type Tooth, type ToothKind } from "@/components/shared/teethData";
import { fmtDate } from "./Teeth.helpers";

type Verdict = {
  text: string;
  tone: string;
  icon: string;
  iconTone: string;
};

type Props = {
  verdict: Verdict;
  kind: ToothKind;
  lostCount: number;
  waitingPermanent: Tooth[];
  history: { tooth: Tooth; date: string }[];
  teeth: Record<string, string>;
  childId: string;
};

export function TeethStatus({
  verdict,
  kind,
  lostCount,
  waitingPermanent,
  history,
  teeth,
  childId,
}: Props) {
  return (
    <>
      <div className={`border rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 ${verdict.tone}`}>
        <Icon
          name={verdict.icon}
          fallback="Info"
          size={16}
          className={`${verdict.iconTone} flex-shrink-0 mt-0.5`}
        />
        <p className="text-[12px] text-foreground leading-snug">{verdict.text}</p>
      </div>

      {kind === "primary" && lostCount > 0 && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="Sparkles" fallback="Info" size={16} className="text-violet-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Выпало молочных зубов: {lostCount}. Постоянный зуб обычно появляется в
            течение 1–6 месяцев после выпадения молочного — отмечайте его на вкладке
            «Коренные».
          </p>
        </div>
      )}

      {kind === "permanent" && waitingPermanent.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5">
          <Icon name="Clock" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-foreground leading-snug">
            <p className="mb-1">
              Молочный зуб выпал, а постоянный ещё не отмечен —{" "}
              {waitingPermanent.length} шт.:
            </p>
            <p className="text-muted-foreground">
              {waitingPermanent
                .map(
                  (t) =>
                    `${t.shortName} (${t.jaw === "upper" ? "верх" : "низ"}, ${t.side === "left" ? "слева" : "справа"})`,
                )
                .join(", ")}
            </p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground mb-2">
            История прорезывания ({history.length})
          </p>
          <div className="space-y-1.5">
            {history.map(({ tooth, date }) => (
                <div
                  key={tooth.id}
                  className="bg-white border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm"
                >
                  <span className="text-base">🦷</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground leading-tight">
                      {tooth.shortName}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {tooth.jaw === "upper" ? "верх" : "низ"},{" "}
                        {tooth.side === "left" ? "слева" : "справа"}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {fmtDate(date)} · норма {rangeLabel(tooth)}
                      {getLostDate(teeth, tooth.id)
                        ? ` · выпал ${fmtDate(getLostDate(teeth, tooth.id)!)}`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setToothDate(childId, tooth.id, null)}
                    className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
                    aria-label="Убрать отметку"
                  >
                    <Icon name="X" size={15} />
                  </button>
                </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground leading-snug">
        Сроки прорезывания индивидуальны: отклонение на 2–3 месяца встречается часто и
        обычно не требует лечения. Раздел носит справочный характер и не заменяет осмотр
        врача.
      </p>
    </>
  );
}

export default TeethStatus;
