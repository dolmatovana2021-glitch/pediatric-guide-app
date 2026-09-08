import { getLostDate } from "@/components/shared/childProfile";
import {
  teethOf,
  toothState,
  stateMeta,
  rangeLabel,
  type Tooth,
  type Jaw,
  type ToothKind,
} from "@/components/shared/teethData";

function ToothShape({
  tooth,
  erupted,
  lost,
  ageMonths,
  onClick,
}: {
  tooth: Tooth;
  erupted: boolean;
  lost: boolean;
  ageMonths: number | null;
  onClick: () => void;
}) {
  const state = toothState(tooth, erupted, ageMonths, lost);
  const meta = stateMeta[state];
  const perm = tooth.kind === "permanent";
  const isMolar = perm ? tooth.order >= 5 : tooth.order >= 3;
  const scale = perm ? 0.56 : 1;

  return (
    <button
      onClick={onClick}
      title={`${tooth.group} · ${rangeLabel(tooth)}`}
      className="relative flex-shrink-0 active:scale-90 transition-transform"
      aria-label={`${tooth.group}, ${meta.label}`}
    >
      <svg
        width={Math.round((isMolar ? 34 : 27) * scale)}
        height={Math.round(34 * scale)}
        viewBox="0 0 30 34"
      >
        <path
          d={
            isMolar
              ? "M2 11c0-5 4-8 13-8s13 3 13 8c0 5-1 7-2.5 12-1 3.5-2 6-4 6s-2-4-4.5-4-2.5 4-4.5 4-3-2.5-4-6C3 18 2 16 2 11z"
              : "M6 9c0-4 3-6 9-6s9 2 9 6c0 6-1.5 9-3 14-1 3.5-2.5 5-3.5 5s-1.5-2-2.5-2-1.5 2-2.5 2-2.5-1.5-3.5-5C7.5 18 6 15 6 9z"
          }
          fill={meta.fill}
          stroke={meta.stroke}
          strokeWidth={erupted ? 2.2 : 1.6}
          strokeLinejoin="round"
        />
        {erupted && !lost && (
          <path
            d="M10 16l3.5 3.5L20 13"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {state === "lost" && (
          <path
            d="M10 12l10 10M20 12L10 22"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
        {state === "due" && (
          <circle cx="15" cy="17" r="2.6" fill="#f59e0b" />
        )}
        {state === "late" && (
          <circle cx="15" cy="17" r="2.6" fill="#f43f5e" />
        )}
      </svg>
    </button>
  );
}

function JawRow({
  jaw,
  teeth,
  ageMonths,
  kind,
  onPick,
}: {
  jaw: Jaw;
  teeth: Record<string, string>;
  ageMonths: number | null;
  kind: ToothKind;
  onPick: (t: Tooth) => void;
}) {
  const right = teethOf(jaw, "right", kind);
  const left = teethOf(jaw, "left", kind);
  const ordered = [...right].reverse().concat(left);

  return (
    <div className="flex items-end justify-center gap-0.5">
      {ordered.map((t, i) => (
        <div key={t.id} className={i === right.length ? "ml-2" : ""}>
          <ToothShape
            tooth={t}
            erupted={Boolean(teeth[t.id])}
            lost={Boolean(getLostDate(teeth, t.id))}
            ageMonths={ageMonths}
            onClick={() => onPick(t)}
          />
        </div>
      ))}
    </div>
  );
}

type Props = {
  teeth: Record<string, string>;
  ageMonths: number | null;
  ageLabel: string;
  kind: ToothKind;
  setKind: (k: ToothKind) => void;
  eruptedCount: number;
  total: number;
  expected: number | null;
  onPick: (t: Tooth) => void;
};

export function TeethChart({
  teeth,
  ageMonths,
  ageLabel,
  kind,
  setKind,
  eruptedCount,
  total,
  expected,
  onPick,
}: Props) {
  return (
    <>
      <div className="flex gap-2 mb-3">
        {(["primary", "permanent"] as ToothKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors ${
              kind === k
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground border-border"
            }`}
          >
            {k === "primary" ? "Молочные" : "Коренные"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">Прорезалось</p>
            <p className="text-xl font-bold text-foreground">
              {eruptedCount}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                из {total}
              </span>
            </p>
          </div>
          {expected !== null && (
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Ожидается к возрасту</p>
              <p className="text-xl font-bold text-foreground">~{expected}</p>
            </div>
          )}
          {ageLabel && (
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Возраст</p>
              <p className="text-[13px] font-semibold text-foreground leading-tight">
                {ageLabel}
              </p>
            </div>
          )}
        </div>

        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(eruptedCount / total) * 100}%` }}
          />
        </div>

        <p className="text-[11px] font-semibold text-muted-foreground text-center mb-1">
          Верхняя челюсть
        </p>
        <JawRow jaw="upper" teeth={teeth} ageMonths={ageMonths} kind={kind} onPick={onPick} />

        <div className="border-t border-dashed border-border my-3" />

        <JawRow jaw="lower" teeth={teeth} ageMonths={ageMonths} kind={kind} onPick={onPick} />
        <p className="text-[11px] font-semibold text-muted-foreground text-center mt-1">
          Нижняя челюсть
        </p>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-teal-600 bg-white" />
            прорезался
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            пора
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            задерживается
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            ещё рано
          </span>
          {kind === "primary" && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              выпал
            </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Нажмите на зуб, чтобы отметить дату
        </p>
      </div>
    </>
  );
}

export default TeethChart;
