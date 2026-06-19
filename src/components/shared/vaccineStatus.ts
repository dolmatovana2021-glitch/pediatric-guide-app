import { useEffect, useState } from "react";
import { getActiveChildId } from "./childProfile";

export type DoseStatus = "none" | "planned" | "done";

const STORAGE_KEY = "malyshdok:vaccineStatus";
const EVENT_NAME = "malyshdok:vaccineStatus:update";

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

export function cycleStatus(current: DoseStatus): DoseStatus {
  if (current === "none") return "planned";
  if (current === "planned") return "done";
  return "none";
}

export function useVaccineStatuses(): {
  statuses: Record<string, DoseStatus>;
  toggle: (doseId: string) => void;
  setStatus: (doseId: string, status: DoseStatus) => void;
} {
  const [statuses, setStatuses] = useState<Record<string, DoseStatus>>({});

  useEffect(() => {
    const refresh = () => setStatuses(getStatuses());
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

  return { statuses, toggle, setStatus };
}
