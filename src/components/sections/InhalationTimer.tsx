import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const STORAGE_KEY = "malyshdok_budesonide_timer";
const DURATION_MS = 30 * 60 * 1000;

function loadEnd(): number | null {
  try {
    const v = Number(localStorage.getItem(STORAGE_KEY));
    return v && v > Date.now() - 30 * 60 * 1000 ? v : null;
  } catch {
    return null;
  }
}

function saveEnd(v: number | null) {
  try {
    if (v) localStorage.setItem(STORAGE_KEY, String(v));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function playAlarm() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.8, 1.6].forEach((start) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.65);
    });
    setTimeout(() => ctx.close(), 2600);
  } catch {
    /* ignore */
  }
}

function notify() {
  try {
    if ("vibrate" in navigator) navigator.vibrate([400, 200, 400, 200, 400]);
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    new Notification("МалышДок · вторая ингаляция", {
      body: "Прошло 30 минут — пора сделать вторую ингаляцию будесонида (1 мг).",
      icon: "/icon-192.png?v=3",
      tag: "malyshdok-budesonide",
    });
  } catch {
    /* ignore */
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

export function InhalationTimer({ portion }: { portion: string }) {
  const [endAt, setEndAt] = useState<number | null>(() => loadEnd());
  const [now, setNow] = useState(Date.now());
  const firedRef = useRef(false);

  const left = endAt ? Math.max(0, endAt - now) : 0;
  const running = endAt !== null && left > 0;
  const done = endAt !== null && left === 0;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => setNow(Date.now());
    document.addEventListener("visibilitychange", onVisible);
    type WakeLock = { release: () => Promise<void> };
    let lock: WakeLock | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => undefined);
    };
  }, [running]);

  useEffect(() => {
    if (!done || firedRef.current) return;
    firedRef.current = true;
    if (endAt && Date.now() - endAt < 60 * 1000) {
      playAlarm();
      notify();
    }
  }, [done, endAt]);

  const start = async () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* ignore */
      }
    }
    const end = Date.now() + DURATION_MS;
    firedRef.current = false;
    setNow(Date.now());
    setEndAt(end);
    saveEnd(end);
  };

  const reset = () => {
    setEndAt(null);
    saveEnd(null);
  };

  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);
  const progress = endAt ? 1 - left / DURATION_MS : 0;

  if (!endAt) {
    return (
      <button
        type="button"
        onClick={start}
        className="mt-2.5 w-full bg-amber-500 text-white rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Icon name="Timer" size={16} />
        Сделали первую ингаляцию — запустить таймер
      </button>
    );
  }

  if (done) {
    return (
      <div className="mt-2.5 bg-emerald-600 text-white rounded-xl p-3 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2">
          <Icon name="BellRing" size={18} />
          <p className="text-sm font-bold">Пора делать вторую ингаляцию</p>
        </div>
        <p className="text-[12px] opacity-90 mt-1">{portion}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-2.5 bg-white text-emerald-700 rounded-lg px-4 py-1.5 text-[12px] font-semibold active:scale-95 transition-transform"
        >
          Готово, вторую сделали
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2.5 bg-card border border-amber-200 rounded-xl p-3 text-center">
      <p className="text-[11px] text-muted-foreground">До второй ингаляции</p>
      <p className="text-3xl font-bold text-foreground tabular-nums leading-tight mt-0.5" aria-live="polite">
        {pad(mins)}:{pad(secs)}
      </p>
      <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
        Когда время выйдет, прозвучит сигнал. Не блокируйте телефон и не закрывайте приложение — иначе сигнал может не сработать.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 text-[12px] font-semibold text-amber-800 inline-flex items-center gap-1"
      >
        <Icon name="RotateCcw" size={13} />
        Сбросить таймер
      </button>
    </div>
  );
}

export default InhalationTimer;
