import { useEffect, useState } from "react";
import { getActiveChildId, loadChildProfile, calcAge } from "./childProfile";
import { checkupPeriods, type CheckupPeriod } from "./checkupData";

const STORAGE_KEY = "malyshdok:checkupStatus";
const EVENT_NAME = "malyshdok:checkupStatus:update";

type AllStatuses = Record<string, Record<string, boolean>>;

function readAll(): AllStatuses {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as AllStatuses;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeAll(data: AllStatuses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function childKey(): string {
  return getActiveChildId() || "default";
}

export function getCheckupStatuses(): Record<string, boolean> {
  return readAll()[childKey()] || {};
}

export function setCheckupDone(periodId: string, done: boolean) {
  const all = readAll();
  const key = childKey();
  const childMap = { ...(all[key] || {}) };
  if (done) {
    childMap[periodId] = true;
  } else {
    delete childMap[periodId];
  }
  all[key] = childMap;
  writeAll(all);
}

export function useCheckupStatuses(): {
  statuses: Record<string, boolean>;
  toggle: (periodId: string) => void;
} {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const refresh = () => setStatuses(getCheckupStatuses());
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("malyshdok:childProfile:update", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("malyshdok:childProfile:update", refresh);
    };
  }, []);

  const toggle = (periodId: string) => {
    setCheckupDone(periodId, !statuses[periodId]);
  };

  return { statuses, toggle };
}

export function getDueCheckup(): CheckupPeriod | null {
  const profile = loadChildProfile();
  const age = calcAge(profile.birthDate);
  if (!age) return null;
  const ageMonths = age.years * 12 + age.months;
  const statuses = getCheckupStatuses();
  let due: CheckupPeriod | null = null;
  for (const p of checkupPeriods) {
    if (p.ageMonths <= ageMonths) due = p;
  }
  if (due && statuses[due.id]) return null;
  return due;
}

export function useDueCheckup(): CheckupPeriod | null {
  const [due, setDue] = useState<CheckupPeriod | null>(null);
  useEffect(() => {
    const refresh = () => setDue(getDueCheckup());
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("malyshdok:childProfile:update", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("malyshdok:childProfile:update", refresh);
    };
  }, []);
  return due;
}