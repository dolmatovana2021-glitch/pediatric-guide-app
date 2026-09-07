import { useEffect, useState } from "react";

export type MedItem = {
  id: string;
  name: string;
  form: string;
  dosage: string;
  expiry: string;
  note: string;
};

const STORAGE_KEY = "malyshdok:medkit";
const EVENT_NAME = "malyshdok:medkit:update";

export const MEDKIT_EVENT = EVENT_NAME;

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function read(): MedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MedItem[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function write(items: MedItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function listMeds(): MedItem[] {
  return read();
}

export function addMed(item: Omit<MedItem, "id">) {
  const items = read();
  items.push({ id: makeId(), ...item });
  write(items);
}

export function updateMed(id: string, patch: Partial<Omit<MedItem, "id">>) {
  const items = read().map((m) => (m.id === id ? { ...m, ...patch } : m));
  write(items);
}

export function removeMed(id: string) {
  write(read().filter((m) => m.id !== id));
}

export function exportMedkit(): MedItem[] {
  return read();
}

export function importMedkit(items: MedItem[]) {
  if (!Array.isArray(items)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function hasMedkitData(): boolean {
  return read().length > 0;
}

export type ExpiryState = "expired" | "soon" | "ok" | "unknown";

export function expiryState(expiry: string): { state: ExpiryState; days: number | null } {
  if (!expiry) return { state: "unknown", days: null };
  const end = new Date(expiry);
  if (isNaN(end.getTime())) return { state: "unknown", days: null };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const days = Math.round((end.getTime() - today.getTime()) / 86400000);
  if (days < 0) return { state: "expired", days };
  if (days <= 30) return { state: "soon", days };
  return { state: "ok", days };
}

export function countExpiredMeds(): number {
  return read().filter((m) => expiryState(m.expiry).state === "expired").length;
}

export function useMedkit(): MedItem[] {
  const [items, setItems] = useState<MedItem[]>([]);
  useEffect(() => {
    const refresh = () => setItems(read());
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
