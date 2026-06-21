import { useEffect, useState } from "react";
import type { Section } from "@/components/shared/sectionTypes";

export type ToggleableSection = "psychdev" | "feeding";

export type SectionVisibility = Record<ToggleableSection, boolean>;

const STORAGE_KEY = "malyshdok:sectionVisibility";
const EVENT_NAME = "malyshdok:sectionVisibility:update";

export const DEFAULT_VISIBILITY: SectionVisibility = {
  psychdev: true,
  feeding: true,
};

export const TOGGLEABLE_SECTIONS: ToggleableSection[] = ["psychdev", "feeding"];

function read(): SectionVisibility {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SectionVisibility>;
      return { ...DEFAULT_VISIBILITY, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_VISIBILITY;
}

function write(v: SectionVisibility) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function isSectionVisible(section: Section, v: SectionVisibility): boolean {
  if (section === "psychdev" || section === "feeding") return v[section];
  return true;
}

export function setSectionVisible(section: ToggleableSection, visible: boolean) {
  const current = read();
  write({ ...current, [section]: visible });
}

export function useSectionVisibility(): SectionVisibility {
  const [state, setState] = useState<SectionVisibility>(DEFAULT_VISIBILITY);
  useEffect(() => {
    setState(read());
    const refresh = () => setState(read());
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}
