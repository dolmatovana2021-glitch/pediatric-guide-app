import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

export type DrugKey = "paracetamol" | "ibuprofen";

type DoseRecord = {
  id: string;
  drug: DrugKey;
  drugName: string;
  ml?: number;
  mg?: number;
  takenAt: number;
};

const STORAGE_KEY = "malyshdok:doseHistory";
const NOTIFY_KEY = "malyshdok:doseNotify";
const NOTIFIED_KEY = "malyshdok:doseNotified";
const DAY_MS = 24 * 60 * 60 * 1000;

function loadNotifyEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIFY_KEY) === "1";
  } catch {
    return false;
  }
}

function loadNotifiedIds(): string[] {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveNotifiedIds(ids: string[]) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(ids.slice(-30)));
  } catch {
    /* ignore */
  }
}

function playBeep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
    setTimeout(() => ctx.close(), 800);
  } catch {
    /* ignore */
  }
}

function showBrowserNotification(title: string, body: string) {
  try {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, icon: "/favicon.ico", tag: "malyshdok-dose" });
  } catch {
    /* ignore */
  }
}

const DRUG_INTERVAL_HOURS: Record<DrugKey, number> = {
  paracetamol: 4,
  ibuprofen: 6,
};

const DRUG_MAX_PER_DAY: Record<DrugKey, number> = {
  paracetamol: 4,
  ibuprofen: 3,
};

function loadHistory(): DoseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DoseRecord[];
    return parsed.filter((r) => Date.now() - r.takenAt < 3 * DAY_MS);
  } catch {
    return [];
  }
}

function saveHistory(records: DoseRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function formatDayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(Date.now() - DAY_MS);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) return "Сегодня";
  if (isYesterday) return "Вчера";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "можно сейчас";
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `через ${h} ч ${m} мин`;
  return `через ${m} мин`;
}

export function DoseHistory({
  currentDrug,
  currentDrugName,
  currentMl,
  currentMg,
}: {
  currentDrug: DrugKey;
  currentDrugName: string;
  currentMl?: number;
  currentMg?: number;
}) {
  const [records, setRecords] = useState<DoseRecord[]>([]);
  const [now, setNow] = useState(Date.now());
  const [notifyEnabled, setNotifyEnabled] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );

  useEffect(() => {
    setRecords(loadHistory());
    setNotifyEnabled(loadNotifyEnabled());
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!notifyEnabled) return;
    const notified = loadNotifiedIds();
    let changed = false;
    records.forEach((r) => {
      const due = r.takenAt + DRUG_INTERVAL_HOURS[r.drug] * 60 * 60 * 1000;
      if (due <= now && !notified.includes(r.id)) {
        notified.push(r.id);
        changed = true;
        playBeep();
        showBrowserNotification(
          "МалышДок · можно дать жаропонижающее",
          `${r.drugName}: прошло ${DRUG_INTERVAL_HOURS[r.drug]} ч с приёма в ${formatTime(r.takenAt)}`,
        );
      }
    });
    if (changed) saveNotifiedIds(notified);
  }, [records, now, notifyEnabled]);

  const toggleNotify = async () => {
    if (notifyEnabled) {
      setNotifyEnabled(false);
      try {
        localStorage.setItem(NOTIFY_KEY, "0");
      } catch {
        /* ignore */
      }
      return;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        const p = await Notification.requestPermission();
        setPermission(p);
      } catch {
        /* ignore */
      }
    }
    setNotifyEnabled(true);
    try {
      localStorage.setItem(NOTIFY_KEY, "1");
    } catch {
      /* ignore */
    }
    playBeep();
  };

  const addDose = () => {
    const rec: DoseRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      drug: currentDrug,
      drugName: currentDrugName,
      ml: currentMl,
      mg: currentMg,
      takenAt: Date.now(),
    };
    const next = [rec, ...records].slice(0, 30);
    setRecords(next);
    saveHistory(next);
  };

  const removeDose = (id: string) => {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    saveHistory(next);
  };

  const clearAll = () => {
    setRecords([]);
    saveHistory([]);
  };

  const lastByDrug = (drug: DrugKey) =>
    records.filter((r) => r.drug === drug).sort((a, b) => b.takenAt - a.takenAt)[0];

  const todayCount = (drug: DrugKey) =>
    records.filter((r) => r.drug === drug && now - r.takenAt < DAY_MS).length;

  const last = lastByDrug(currentDrug);
  const intervalMs = DRUG_INTERVAL_HOURS[currentDrug] * 60 * 60 * 1000;
  const nextAvailable = last ? last.takenAt + intervalMs : 0;
  const remaining = Math.max(0, nextAvailable - now);
  const canTakeNow = !last || remaining === 0;
  const dailyMax = DRUG_MAX_PER_DAY[currentDrug];
  const todayTaken = todayCount(currentDrug);
  const reachedLimit = todayTaken >= dailyMax;

  return (
    <div className="bg-white border border-mint-200 rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🕐</span>
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            История приёмов
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] text-muted-foreground hover:text-rose-600 font-medium"
          >
            Очистить
          </button>
        )}
      </div>

      <button
        onClick={toggleNotify}
        disabled={permission === "unsupported"}
        className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 border text-xs transition ${
          permission === "unsupported"
            ? "bg-muted border-border text-muted-foreground cursor-not-allowed"
            : notifyEnabled
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-mint-50 border-mint-200 text-foreground hover:bg-mint-100"
        }`}
      >
        <span className="flex items-center gap-2">
          <Icon name={notifyEnabled ? "Bell" : "BellOff"} size={14} />
          <span className="font-semibold">
            {permission === "unsupported"
              ? "Уведомления недоступны"
              : notifyEnabled
                ? "Напоминания включены"
                : "Напомнить, когда подойдёт время"}
          </span>
        </span>
        {permission !== "unsupported" && (
          <span
            className={`w-8 h-4 rounded-full relative transition ${
              notifyEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                notifyEnabled ? "left-4" : "left-0.5"
              }`}
            />
          </span>
        )}
      </button>
      {notifyEnabled && permission === "denied" && (
        <p className="text-[10px] text-amber-700">
          Браузер блокирует системные уведомления — будет только звуковой сигнал.
        </p>
      )}

      <div
        className={`rounded-xl p-3 border ${
          canTakeNow && !reachedLimit
            ? "bg-mint-50 border-mint-200"
            : reachedLimit
              ? "bg-amber-50 border-amber-200"
              : "bg-rose-50 border-rose-200"
        }`}
      >
        <p className="text-[11px] text-muted-foreground mb-0.5">
          Следующая доза {currentDrugName}
        </p>
        {reachedLimit ? (
          <>
            <p className="text-base font-bold text-amber-700">
              ⛔ Лимит на сутки достигнут
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Сегодня уже {todayTaken} из {dailyMax} приёмов. Если жар возвращается — звоните врачу.
            </p>
          </>
        ) : canTakeNow ? (
          <>
            <p className="text-base font-bold text-primary">✅ Можно дать сейчас</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {last
                ? `Прошло достаточно времени с ${formatTime(last.takenAt)}`
                : "Записей пока нет"}
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-rose-700">
              ⏳ {formatCountdown(remaining)} ({formatTime(nextAvailable)})
            </p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Последний приём в {formatTime(last!.takenAt)}. Минимум{" "}
              {DRUG_INTERVAL_HOURS[currentDrug]} ч между дозами.
            </p>
          </>
        )}
      </div>

      <button
        onClick={addDose}
        disabled={reachedLimit}
        className={`w-full rounded-xl py-2.5 px-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform ${
          reachedLimit
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-white"
        }`}
      >
        <Icon name="Plus" size={16} />
        Отметить приём
        {currentMl ? ` (${currentMl} мл)` : ""}
      </button>

      <div className="grid grid-cols-2 gap-2">
        {(["paracetamol", "ibuprofen"] as DrugKey[]).map((k) => {
          const count = todayCount(k);
          const max = DRUG_MAX_PER_DAY[k];
          const name = k === "paracetamol" ? "Парацетамол" : "Ибупрофен";
          return (
            <div key={k} className="bg-mint-50 rounded-xl p-2 text-center">
              <p className="text-[10px] text-muted-foreground">{name}</p>
              <p className="text-sm font-bold text-foreground">
                {count}/{max}
                <span className="text-[10px] text-muted-foreground font-normal ml-1">
                  за сутки
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {records.length === 0 ? (
        <p className="text-[11px] text-muted-foreground text-center py-2">
          Здесь будут отмеченные приёмы. История хранится 3 дня.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {records.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 bg-mint-50/60 border border-mint-100 rounded-lg px-2.5 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {r.drugName}
                  {r.ml ? ` · ${r.ml} мл` : ""}
                  {r.mg ? ` (${r.mg} мг)` : ""}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatDayLabel(r.takenAt)} · {formatTime(r.takenAt)}
                </p>
              </div>
              <button
                onClick={() => removeDose(r.id)}
                className="w-6 h-6 rounded-full hover:bg-rose-100 flex items-center justify-center text-muted-foreground hover:text-rose-600"
                aria-label="Удалить"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}