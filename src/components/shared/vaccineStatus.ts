import { useEffect, useState } from "react";
import { getActiveChildId, loadChildProfile, calcAge } from "./childProfile";
import { vaccineRows } from "./vaccineData";

export type DoseStatus = "none" | "planned" | "done";

const STORAGE_KEY = "malyshdok:vaccineStatus";
const EVENT_NAME = "malyshdok:vaccineStatus:update";
const DATES_KEY = "malyshdok:vaccineDates";

export type DoseDate = { date: string; note?: string };
type AllDates = Record<string, Record<string, DoseDate>>;

function readDates(): AllDates {
  try {
    const raw = localStorage.getItem(DATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as AllDates;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeDates(data: AllDates) {
  try {
    localStorage.setItem(DATES_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function getDoseDates(): Record<string, DoseDate> {
  return readDates()[childKey()] || {};
}

export function setDoseDate(doseId: string, value: DoseDate | null) {
  const all = readDates();
  const key = childKey();
  const map = { ...(all[key] || {}) };
  if (!value || !value.date) delete map[doseId];
  else map[doseId] = value.note ? { date: value.date, note: value.note } : { date: value.date };
  all[key] = map;
  writeDates(all);
}

export function exportVaccineDates(): AllDates {
  return readDates();
}

export function importVaccineDates(data: AllDates) {
  if (!data || typeof data !== "object") return;
  writeDates(data);
}

type AllStatuses = Record<string, Record<string, DoseStatus>>;

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

export function getStatuses(): Record<string, DoseStatus> {
  return readAll()[childKey()] || {};
}

export function setDoseStatus(doseId: string, status: DoseStatus) {
  const all = readAll();
  const key = childKey();
  const childMap = { ...(all[key] || {}) };
  if (status === "none") {
    delete childMap[doseId];
  } else {
    childMap[doseId] = status;
  }
  all[key] = childMap;
  writeAll(all);
}

export function exportVaccineStatuses(): AllStatuses {
  return readAll();
}

export function importVaccineStatuses(data: AllStatuses) {
  if (!data || typeof data !== "object") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function hasVaccineData(): boolean {
  const all = readAll();
  const d = readDates();
  return (
    Object.values(all).some((m) => m && Object.keys(m).length > 0) ||
    Object.values(d).some((m) => m && Object.keys(m).length > 0)
  );
}

export function cycleStatus(current: DoseStatus): DoseStatus {
  if (current === "none") return "planned";
  if (current === "planned") return "done";
  return "none";
}

export function useVaccineStatuses(): {
  statuses: Record<string, DoseStatus>;
  dates: Record<string, DoseDate>;
  toggle: (doseId: string) => void;
  setStatus: (doseId: string, status: DoseStatus) => void;
  setDate: (doseId: string, value: DoseDate | null) => void;
} {
  const [statuses, setStatuses] = useState<Record<string, DoseStatus>>({});
  const [dates, setDates] = useState<Record<string, DoseDate>>({});

  useEffect(() => {
    const refresh = () => {
      setStatuses(getStatuses());
      setDates(getDoseDates());
    };
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

  const toggle = (doseId: string) => {
    const next = cycleStatus(statuses[doseId] || "none");
    setDoseStatus(doseId, next);
  };

  const setStatus = (doseId: string, status: DoseStatus) => {
    setDoseStatus(doseId, status);
  };

  const setDate = (doseId: string, value: DoseDate | null) => {
    setDoseDate(doseId, value);
    if (value?.date && statuses[doseId] !== "done") setDoseStatus(doseId, "done");
  };

  return { statuses, dates, toggle, setStatus, setDate };
}

export function countDueVaccines(): number {
  const profile = loadChildProfile();
  if (profile.notifyVaccines === false) return 0;
  const age = calcAge(profile.birthDate);
  if (!age) return 0;
  const ageMonths = age.years * 12 + age.months;
  const statuses = getStatuses();
  const inRisk = profile.riskGroup === true;
  let due = 0;
  for (const row of vaccineRows) {
    for (const dose of row.doses) {
      if (dose.tier === "risk" && !inRisk) continue;
      if (statuses[dose.id] === "done") continue;
      if (ageMonths >= dose.ageMonths) due += 1;
    }
  }
  return due;
}

export function useDueVaccines(): number {
  const [due, setDue] = useState(0);
  useEffect(() => {
    const refresh = () => setDue(countDueVaccines());
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