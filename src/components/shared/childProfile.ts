import { useEffect, useState } from "react";

export type Measurement = {
  id: string;
  date: string;
  height: number | null;
  weight: number | null;
};

export type IllnessEntry = {
  id: string;
  datetime: string;
  temperature: number | null;
  symptoms: string[];
  medication: string;
  note: string;
};

export type ChildProfile = {
  name: string;
  birthDate: string;
  weight: string;
  gender: "boy" | "girl" | "";
  allergies: string;
  riskGroup: boolean;
  notifyVaccines: boolean;
  notifyCheckups: boolean;
  measurements?: Measurement[];
  illness?: IllnessEntry[];
};

export type StoredChild = ChildProfile & { id: string };

const STORAGE_KEY = "malyshdok:childProfile";
const LIST_KEY = "malyshdok:childProfiles";
const ACTIVE_KEY = "malyshdok:childProfiles:active";
const EVENT_NAME = "malyshdok:childProfile:update";

export const EMPTY_PROFILE: ChildProfile = {
  name: "",
  birthDate: "",
  weight: "",
  gender: "",
  allergies: "",
  riskGroup: false,
  notifyVaccines: true,
  notifyCheckups: true,
  measurements: [],
  illness: [],
};

function makeId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function hasContent(p: ChildProfile): boolean {
  return Boolean(p.name || p.birthDate || p.weight || p.allergies || p.gender);
}

function readList(): StoredChild[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredChild[];
      if (Array.isArray(parsed)) {
        return parsed
          .filter((x) => x && typeof x === "object")
          .map((x) => ({ ...EMPTY_PROFILE, id: x.id || makeId(), ...x }));
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    if (legacyRaw) {
      const legacy = { ...EMPTY_PROFILE, ...(JSON.parse(legacyRaw) as ChildProfile) };
      if (hasContent(legacy)) {
        const migrated: StoredChild = { ...legacy, id: makeId() };
        localStorage.setItem(LIST_KEY, JSON.stringify([migrated]));
        localStorage.setItem(ACTIVE_KEY, migrated.id);
        return [migrated];
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeList(list: StoredChild[]) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function readActiveId(list: StoredChild[]): string {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id && list.some((c) => c.id === id)) return id;
  } catch {
    /* ignore */
  }
  return list[0]?.id ?? "";
}

function syncLegacy(active: StoredChild | null) {
  try {
    if (active) {
      const { id: _id, ...rest } = active;
      void _id;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

function emit() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function listChildren(): StoredChild[] {
  return readList();
}

export function getActiveChildId(): string {
  return readActiveId(readList());
}

export function setActiveChildId(id: string) {
  const list = readList();
  if (!list.some((c) => c.id === id)) return;
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
  syncLegacy(list.find((c) => c.id === id) ?? null);
  emit();
}

export function loadChildProfile(): ChildProfile {
  const list = readList();
  const activeId = readActiveId(list);
  const active = list.find((c) => c.id === activeId);
  if (active) {
    const { id: _id, ...rest } = active;
    void _id;
    return { ...EMPTY_PROFILE, ...rest };
  }
  return EMPTY_PROFILE;
}

export function saveChildProfile(profile: ChildProfile, childId?: string) {
  const list = readList();
  let id = childId ?? readActiveId(list);
  if (!id || !list.some((c) => c.id === id)) {
    id = makeId();
    list.push({ ...profile, id });
  } else {
    const idx = list.findIndex((c) => c.id === id);
    list[idx] = { ...profile, id };
  }
  writeList(list);
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
  syncLegacy(list.find((c) => c.id === id) ?? null);
  emit();
}

export function addChildProfile(profile: ChildProfile = EMPTY_PROFILE): string {
  const list = readList();
  const id = makeId();
  list.push({ ...profile, id });
  writeList(list);
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
  syncLegacy({ ...profile, id });
  emit();
  return id;
}

export function removeChildProfile(id: string) {
  const list = readList().filter((c) => c.id !== id);
  writeList(list);
  let activeId = readActiveId(list);
  if (!list.some((c) => c.id === activeId)) {
    activeId = list[0]?.id ?? "";
    try {
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {
      /* ignore */
    }
  }
  syncLegacy(list.find((c) => c.id === activeId) ?? null);
  emit();
}

export function listMeasurements(childId: string): Measurement[] {
  const child = readList().find((c) => c.id === childId);
  const arr = child?.measurements;
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) => a.date.localeCompare(b.date));
}

export function addMeasurement(
  childId: string,
  m: { date: string; height: number | null; weight: number | null },
) {
  const list = readList();
  const idx = list.findIndex((c) => c.id === childId);
  if (idx === -1) return;
  const measurements = Array.isArray(list[idx].measurements) ? [...list[idx].measurements!] : [];
  measurements.push({ id: makeId(), ...m });
  list[idx] = { ...list[idx], measurements };
  writeList(list);
  syncLegacy(list[idx]);
  emit();
}

export function removeMeasurement(childId: string, measurementId: string) {
  const list = readList();
  const idx = list.findIndex((c) => c.id === childId);
  if (idx === -1) return;
  const measurements = (list[idx].measurements ?? []).filter((m) => m.id !== measurementId);
  list[idx] = { ...list[idx], measurements };
  writeList(list);
  syncLegacy(list[idx]);
  emit();
}

export function listIllnessEntries(childId: string): IllnessEntry[] {
  const child = readList().find((c) => c.id === childId);
  const arr = child?.illness;
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) => a.datetime.localeCompare(b.datetime));
}

export function addIllnessEntry(
  childId: string,
  entry: Omit<IllnessEntry, "id">,
) {
  const list = readList();
  const idx = list.findIndex((c) => c.id === childId);
  if (idx === -1) return;
  const illness = Array.isArray(list[idx].illness) ? [...list[idx].illness!] : [];
  illness.push({ id: makeId(), ...entry });
  list[idx] = { ...list[idx], illness };
  writeList(list);
  syncLegacy(list[idx]);
  emit();
}

export function removeIllnessEntry(childId: string, entryId: string) {
  const list = readList();
  const idx = list.findIndex((c) => c.id === childId);
  if (idx === -1) return;
  const illness = (list[idx].illness ?? []).filter((e) => e.id !== entryId);
  list[idx] = { ...list[idx], illness };
  writeList(list);
  syncLegacy(list[idx]);
  emit();
}

export function ageInMonthsAt(birthDate: string, date: string): number | null {
  if (!birthDate || !date) return null;
  const b = new Date(birthDate);
  const d = new Date(date);
  if (isNaN(b.getTime()) || isNaN(d.getTime())) return null;
  const days = (d.getTime() - b.getTime()) / 86400000;
  if (days < 0) return null;
  return days / 30.4375;
}

export type ChildrenSnapshot = { list: StoredChild[]; activeId: string };

export function exportChildrenState(): ChildrenSnapshot {
  const list = readList();
  return { list, activeId: readActiveId(list) };
}

export function importChildrenState(snapshot: ChildrenSnapshot) {
  const list = Array.isArray(snapshot?.list)
    ? snapshot.list
        .filter((x) => x && typeof x === "object")
        .map((x) => ({ ...EMPTY_PROFILE, ...x, id: x.id || makeId() }))
    : [];
  writeList(list);
  const activeId = list.some((c) => c.id === snapshot?.activeId)
    ? snapshot.activeId
    : list[0]?.id ?? "";
  try {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
  syncLegacy(list.find((c) => c.id === activeId) ?? null);
  emit();
}

export function clearChildProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LIST_KEY);
    localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function useChildProfile(): ChildProfile {
  const [profile, setProfile] = useState<ChildProfile>(EMPTY_PROFILE);
  useEffect(() => {
    setProfile(loadChildProfile());
    const onUpdate = () => setProfile(loadChildProfile());
    window.addEventListener(EVENT_NAME, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);
  return profile;
}

export function useChildren(): { list: StoredChild[]; activeId: string } {
  const [state, setState] = useState<{ list: StoredChild[]; activeId: string }>({
    list: [],
    activeId: "",
  });
  useEffect(() => {
    const refresh = () => {
      const list = readList();
      setState({ list, activeId: readActiveId(list) });
    };
    refresh();
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}

export function calcAge(birthDate: string): { years: number; months: number; label: string } | null {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  let months = now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return null;
  let label = "";
  if (years > 0) {
    const yWord = years === 1 ? "год" : years >= 2 && years <= 4 ? "года" : "лет";
    label = `${years} ${yWord}`;
    if (months > 0) label += ` ${months} мес`;
  } else {
    label = `${months} мес`;
  }
  return { years, months, label };
}