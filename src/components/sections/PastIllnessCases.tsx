import Icon from "@/components/ui/icon";
import {
  removeIllnessEntry,
  removeIllnessCase,
  reopenIllnessCase,
  type IllnessCase,
  type IllnessEntry,
} from "@/components/shared/childProfile";
import { caseRange, caseTitle } from "@/components/sections/IllnessCaseCard";
import { EntryCard, tempTone } from "@/components/sections/IllnessEntryCard";

export function PastIllnessCases({
  childId,
  pastCases,
  allEntries,
  activeCase,
  expanded,
  setExpanded,
}: {
  childId: string;
  pastCases: IllnessCase[];
  allEntries: IllnessEntry[];
  activeCase: IllnessCase | null;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
}) {
  return (
    <div className="mt-5 space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground px-1">
        Прошлые болезни ({pastCases.length})
      </p>
      {pastCases.map((c) => {
        const items = allEntries.filter((e) => e.caseId === c.id);
        const temps = items.map((e) => e.temperature).filter((t): t is number => t !== null);
        const max = temps.length ? Math.max(...temps) : null;
        const isOpen = expanded === c.id;
        return (
          <div key={c.id} className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : c.id)}
              className="w-full flex items-center gap-3 p-3.5 text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">🩹</span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm text-foreground truncate">{caseTitle(c)}</span>
                <span className="block text-[11px] text-muted-foreground truncate">
                  {caseRange(c)}
                  {max !== null && <> · макс. <span className={`font-semibold ${tempTone(max)}`}>{max.toFixed(1)} °C</span></>}
                </span>
              </span>
              <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0" />
            </button>
            {isOpen && (
              <div className="px-3.5 pb-3.5 space-y-2">
                {items.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground">Записей нет</p>
                ) : (
                  [...items].reverse().map((e) => (
                    <EntryCard key={e.id} e={e} onRemove={() => removeIllnessEntry(childId, e.id)} />
                  ))
                )}
                <div className="flex gap-2 pt-1">
                  {!activeCase && (
                    <button
                      onClick={() => reopenIllnessCase(childId, c.id)}
                      className="flex-1 text-[12px] font-semibold text-foreground bg-muted rounded-xl py-2 active:scale-95 transition-transform"
                    >
                      Снова болеет
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("Удалить этот случай вместе со всеми записями?")) {
                        items.forEach((e) => removeIllnessEntry(childId, e.id));
                        removeIllnessCase(childId, c.id);
                      }
                    }}
                    className="flex-1 text-[12px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl py-2 active:scale-95 transition-transform"
                  >
                    Удалить случай
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PastIllnessCases;
