import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const STORAGE_KEY = "malyshdok:seizureTimer";

type TimerState = {
  startedAt: number | null;
  elapsedMs: number;
  endedAt: number | null;
};

function loadState(): TimerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { startedAt: null, elapsedMs: 0, endedAt: null };
    return JSON.parse(raw) as TimerState;
  } catch {
    return { startedAt: null, elapsedMs: 0, endedAt: null };
  }
}

function saveState(s: TimerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatStamp(ts: number) {
  return new Date(ts).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function SeizureTimer() {
  const [state, setState] = useState<TimerState>({ startedAt: null, elapsedMs: 0, endedAt: null });
  const [now, setNow] = useState(Date.now());
  const beepedRef = useRef(false);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state.startedAt === null || state.endedAt !== null) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [state.startedAt, state.endedAt]);

  const running = state.startedAt !== null && state.endedAt === null;
  const liveElapsed = running ? Date.now() - state.startedAt! : state.elapsedMs;
  const elapsedSec = Math.floor(liveElapsed / 1000);

  useEffect(() => {
    if (!running) return;
    if (elapsedSec >= 300 && !beepedRef.current) {
      beepedRef.current = true;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          [880, 1100, 880].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            const start = ctx.currentTime + i * 0.35;
            gain.gain.setValueAtTime(0.001, start);
            gain.gain.exponentialRampToValueAtTime(0.3, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.32);
          });
          setTimeout(() => ctx.close(), 1500);
        }
      } catch {
        /* ignore */
      }
    }
  }, [elapsedSec, running]);

  const start = () => {
    const next = { startedAt: Date.now(), elapsedMs: 0, endedAt: null };
    setState(next);
    saveState(next);
    beepedRef.current = false;
    setNow(Date.now());
  };

  const stop = () => {
    if (state.startedAt === null) return;
    const ended = Date.now();
    const next = { startedAt: state.startedAt, elapsedMs: ended - state.startedAt, endedAt: ended };
    setState(next);
    saveState(next);
  };

  const reset = () => {
    const next = { startedAt: null, elapsedMs: 0, endedAt: null };
    setState(next);
    saveState(next);
    beepedRef.current = false;
  };

  const danger = elapsedSec >= 300;
  const warn = elapsedSec >= 180 && elapsedSec < 300;
  void now;

  return (
    <div
      className={`rounded-xl p-3 border space-y-3 ${
        danger
          ? "bg-rose-50 border-rose-300"
          : warn
            ? "bg-amber-50 border-amber-200"
            : "bg-yellow-50 border-yellow-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">⏱️</span>
        <p
          className={`text-xs font-bold uppercase tracking-wide ${
            danger ? "text-rose-700" : warn ? "text-amber-700" : "text-yellow-700"
          }`}
        >
          Секундомер приступа
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 text-center border border-yellow-100">
        <p
          className={`text-5xl font-bold tabular-nums tracking-tight ${
            danger ? "text-rose-600" : warn ? "text-amber-600" : "text-foreground"
          }`}
        >
          {formatTime(liveElapsed)}
        </p>
        {state.startedAt && (
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Начало: {formatStamp(state.startedAt)}
            {state.endedAt && ` · конец: ${formatStamp(state.endedAt)}`}
          </p>
        )}
      </div>

      {danger && running && (
        <div className="bg-rose-100 border border-rose-300 rounded-lg p-2.5 flex items-start gap-2 animate-fade-in">
          <span className="text-lg flex-shrink-0">🆘</span>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-rose-700">Приступ дольше 5 минут</p>
            <p className="text-[11px] text-foreground leading-relaxed mt-0.5">
              Срочно вызовите скорую — 103.
            </p>
            <a
              href="tel:103"
              className="inline-flex items-center gap-1.5 mt-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <Icon name="Phone" size={12} />
              Позвонить 103
            </a>
          </div>
        </div>
      )}

      {warn && running && (
        <p className="text-[11px] text-amber-700 font-medium text-center">
          Приступ дольше 3 минут — приготовьтесь вызвать 103
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {!running && state.endedAt === null && (
          <button
            onClick={start}
            className="col-span-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
          >
            <Icon name="Play" size={16} />
            Начать отсчёт
          </button>
        )}
        {running && (
          <button
            onClick={stop}
            className="col-span-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
          >
            <Icon name="Square" size={16} />
            Приступ закончился
          </button>
        )}
        {!running && state.endedAt !== null && (
          <>
            <div className="col-span-2 bg-white border border-yellow-200 rounded-lg p-2 text-center">
              <p className="text-[11px] text-muted-foreground">Длительность приступа</p>
              <p className="text-base font-bold text-foreground">{formatTime(state.elapsedMs)}</p>
            </div>
            <button
              onClick={start}
              className="bg-white border border-yellow-300 text-yellow-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Icon name="RotateCcw" size={14} />
              Новый приступ
            </button>
            <button
              onClick={reset}
              className="bg-white border border-border text-muted-foreground font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Icon name="X" size={14} />
              Сбросить
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SeizureTimer;
