import { useEffect, useState } from "react";

export type ChildProfile = {
  name: string;
  birthDate: string;
  weight: string;
  gender: "boy" | "girl" | "";
  allergies: string;
};

const STORAGE_KEY = "malyshdok:childProfile";
const EVENT_NAME = "malyshdok:childProfile:update";

export const EMPTY_PROFILE: ChildProfile = {
  name: "",
  birthDate: "",
  weight: "",
  gender: "",
  allergies: "",
};

export function loadChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as ChildProfile) };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveChildProfile(profile: ChildProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore */
  }
}

export function clearChildProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore */
  }
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
