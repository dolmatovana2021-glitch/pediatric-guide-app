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

const EVENT_NAME = "malyshdok:childProfile:update";

const typeMeta: Record<FeedType, { label: string; emoji: string; chip: string }> = {
  breast: { label: "Грудь", emoji: "🤱", chip: "bg-rose-100 text-rose-700" },
  formula: { label: "Смесь", emoji: "🍼", chip: "bg-sky-100 text-sky-700" },
  solid: { label: "Прикорм", emoji: "🥣", chip: "bg-amber-100 text-amber-700" },
};

type FeedNorm = { label: string; min: number; max: number; hint: string };

function feedNormFor(ageMonths: number | null): FeedNorm | null {
  if (ageMonths === null) return null;
  if (ageMonths < 1) return { label: "0–1 месяц", min: 8, max: 12, hint: "каждые 2–3 часа, в том числе ночью" };
  if (ageMonths < 4) return { label: "1–3 месяца", min: 7, max: 9, hint: "каждые 3–4 часа" };
  if (ageMonths < 6) return { label: "4–5 месяцев", min: 6, max: 8, hint: "каждые 3–4 часа" };
  if (ageMonths < 9) return { label: "6–8 месяцев", min: 5, max: 7, hint: "молоко плюс 1–2 прикорма" };
  if (ageMonths < 12) return { label: "9–11 месяцев", min: 4, max: 6, hint: "молоко плюс 2–3 прикорма" };
  return { label: "старше года", min: 4, max: 6, hint: "3 основных приёма и 1–2 перекуса" };
}

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function fmtDay(key: string): string {
  const d = new Date(key);
  if (isNaN(d.getTime())) return key;
  const todayKey = new Date().toISOString().slice(0, 10);
  if (key === todayKey) return "Сегодня";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

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

  const days = useMemo(() => {
    const map = new Map<string, FeedEntry[]>();
    for (const e of entries) {
      const key = dayKey(e.datetime);
      map.set(key, [...(map.get(key) || []), e]);
    }
    return [...map.entries()]
      .map(([key, list]) => ({
        key,
        list: list.sort((a, b) => b.datetime.localeCompare(a.datetime)),
        count: list.length,
        volume: list.reduce((s, e) => s + (e.amount || 0), 0),
        breast: list.filter((e) => e.type === "breast").length,
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [entries]);

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

          {open ? (
            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Чем кормили
                </label>
                <div className="flex gap-2">
                  {(Object.keys(typeMeta) as FeedType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                        type === t
                          ? "bg-primary text-white border-primary"
                          : "bg-mint-50 text-foreground border-mint-200"
                      }`}
                    >
                      <span>{typeMeta[t].emoji}</span>
                      {typeMeta[t].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Дата и время
                </label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {type === "breast" ? (
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Длительность, минут
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="20"
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Объём, мл
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="120"
                    className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Заметка
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: срыгнул, ел с аппетитом"
                  className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={save}
                  className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm active:scale-95 transition-transform"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setDatetime(localNow());
                setOpen(true);
              }}
              className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
            >
              <Icon name="Plus" size={16} />
              Добавить кормление
            </button>
          )}

          {entries.length === 0 ? (
            <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
              <Icon name="Milk" fallback="Baby" size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-[13px] text-muted-foreground leading-snug">
                Записей пока нет. Отмечайте кормления — приложение посчитает их количество и
                объём за сутки.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {days.slice(0, 14).map((d) => (
                <div key={d.key}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {fmtDay(d.key)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.count} корм.
                      {d.volume > 0 ? ` · ${d.volume} мл` : ""}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {d.list.map((e) => {
                      const meta = typeMeta[e.type];
                      const details = [
                        e.amount !== null ? `${e.amount} мл` : "",
                        e.duration !== null ? `${e.duration} мин` : "",
                        e.note,
                      ].filter(Boolean);
                      return (
                        <div
                          key={e.id}
                          className="bg-white border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm"
                        >
                          <span className="text-base">{meta.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground leading-tight">
                              {fmtTime(e.datetime)}
                              <span
                                className={`ml-2 text-[10px] font-semibold rounded-full px-2 py-0.5 ${meta.chip}`}
                              >
                                {meta.label}
                              </span>
                            </p>
                            {details.length > 0 && (
                              <p className="text-[11px] text-muted-foreground">
                                {details.join(" · ")}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFeedEntry(childId, e.id)}
                            className="text-muted-foreground hover:text-rose-600 flex-shrink-0"
                            aria-label="Удалить запись"
                          >
                            <Icon name="X" size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

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
