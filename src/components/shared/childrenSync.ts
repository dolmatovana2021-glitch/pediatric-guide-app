import { useEffect, useRef, useState } from "react";
import func2url from "../../../backend/func2url.json";
import { getToken } from "@/components/shared/auth";
import {
  exportChildrenState,
  importChildrenState,
  type ChildrenSnapshot,
} from "@/components/shared/childProfile";
import {
  exportVaccineStatuses,
  importVaccineStatuses,
  hasVaccineData,
} from "@/components/shared/vaccineStatus";
import {
  exportCheckupStatuses,
  importCheckupStatuses,
  hasCheckupData,
} from "@/components/shared/checkupStatus";
import {
  exportMedkit,
  importMedkit,
  hasMedkitData,
  MEDKIT_EVENT,
  type MedItem,
} from "@/components/shared/medkitStore";

const CHILDREN_URL = (func2url as Record<string, string>).children;

const CHANGE_EVENTS = [
  "malyshdok:childProfile:update",
  "malyshdok:vaccineStatus:update",
  "malyshdok:checkupStatus:update",
  MEDKIT_EVENT,
];

export type SyncStatus = "idle" | "loading" | "saving" | "saved" | "error";

const STATUS_EVENT = "malyshdok:sync:status";

let currentStatus: SyncStatus = "idle";

function broadcast(status: SyncStatus) {
  currentStatus = status;
  window.dispatchEvent(new CustomEvent(STATUS_EVENT));
}

export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>(currentStatus);
  useEffect(() => {
    const refresh = () => setStatus(currentStatus);
    refresh();
    window.addEventListener(STATUS_EVENT, refresh);
    return () => window.removeEventListener(STATUS_EVENT, refresh);
  }, []);
  return status;
}

type CloudSnapshot = ChildrenSnapshot & {
  vaccines?: Record<string, Record<string, string>>;
  checkups?: Record<string, Record<string, boolean>>;
  medkit?: MedItem[];
};

function collect(): CloudSnapshot {
  return {
    ...exportChildrenState(),
    vaccines: exportVaccineStatuses() as Record<string, Record<string, string>>,
    checkups: exportCheckupStatuses(),
    medkit: exportMedkit(),
  };
}

function apply(remote: CloudSnapshot) {
  importChildrenState({ list: remote.list, activeId: remote.activeId });
  if (remote.vaccines) {
    importVaccineStatuses(
      remote.vaccines as unknown as Parameters<typeof importVaccineStatuses>[0],
    );
  }
  if (remote.checkups) importCheckupStatuses(remote.checkups);
  if (remote.medkit) importMedkit(remote.medkit);
}

function localIsEmpty(): boolean {
  return (
    exportChildrenState().list.length === 0 &&
    !hasVaccineData() &&
    !hasCheckupData() &&
    !hasMedkitData()
  );
}

function remoteHasData(remote: CloudSnapshot | null): boolean {
  if (!remote) return false;
  const children = Array.isArray(remote.list) && remote.list.length > 0;
  const vac = remote.vaccines && Object.keys(remote.vaccines).length > 0;
  const chk = remote.checkups && Object.keys(remote.checkups).length > 0;
  const med = Array.isArray(remote.medkit) && remote.medkit.length > 0;
  return Boolean(children || vac || chk || med);
}

async function fetchRemote(token: string): Promise<CloudSnapshot | null> {
  const res = await fetch(CHILDREN_URL, { headers: { "X-Auth-Token": token } });
  if (!res.ok) return null;
  const json = await res.json();
  const data = json.data;
  if (!data || typeof data !== "object") return null;
  return data as CloudSnapshot;
}

async function pushRemote(token: string, snapshot: CloudSnapshot): Promise<boolean> {
  const res = await fetch(CHILDREN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ data: snapshot }),
  });
  return res.ok;
}

export function useChildrenSync(enabled: boolean): SyncStatus {
  const status = useSyncStatus();
  const ready = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const token = getToken();
    if (!token) return;

    let active = true;
    broadcast("loading");

    fetchRemote(token)
      .then((remote) => {
        if (!active) return;
        if (remoteHasData(remote) && localIsEmpty()) {
          apply(remote as CloudSnapshot);
        } else if (!localIsEmpty()) {
          void pushRemote(token, collect());
        }
        broadcast("idle");
      })
      .catch(() => {
        if (active) broadcast("error");
      })
      .finally(() => {
        ready.current = true;
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onChange = () => {
      if (!ready.current) return;
      const token = getToken();
      if (!token) return;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        broadcast("saving");
        pushRemote(token, collect())
          .then((ok) => {
            broadcast(ok ? "saved" : "error");
            if (ok) window.setTimeout(() => broadcast("idle"), 2000);
          })
          .catch(() => broadcast("error"));
      }, 800);
    };

    CHANGE_EVENTS.forEach((e) => window.addEventListener(e, onChange));
    return () => {
      CHANGE_EVENTS.forEach((e) => window.removeEventListener(e, onChange));
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [enabled]);

  return status;
}