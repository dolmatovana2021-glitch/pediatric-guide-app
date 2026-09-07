import { useEffect, useRef, useState } from "react";
import func2url from "../../../backend/func2url.json";
import { getToken } from "@/components/shared/auth";
import {
  exportChildrenState,
  importChildrenState,
  type ChildrenSnapshot,
} from "@/components/shared/childProfile";

const CHILDREN_URL = (func2url as Record<string, string>).children;
const EVENT_NAME = "malyshdok:childProfile:update";

export type SyncStatus = "idle" | "loading" | "saving" | "saved" | "error";

async function fetchRemote(token: string): Promise<ChildrenSnapshot | null> {
  const res = await fetch(CHILDREN_URL, { headers: { "X-Auth-Token": token } });
  if (!res.ok) return null;
  const json = await res.json();
  const data = json.data;
  if (!data || !Array.isArray(data.list)) return null;
  return data as ChildrenSnapshot;
}

async function pushRemote(token: string, snapshot: ChildrenSnapshot): Promise<boolean> {
  const res = await fetch(CHILDREN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ data: snapshot }),
  });
  return res.ok;
}

export function useChildrenSync(enabled: boolean): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const ready = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const token = getToken();
    if (!token) return;

    let active = true;
    setStatus("loading");

    fetchRemote(token)
      .then((remote) => {
        if (!active) return;
        const local = exportChildrenState();
        if (remote && remote.list.length > 0) {
          if (local.list.length === 0) {
            importChildrenState(remote);
          }
        } else if (local.list.length > 0) {
          void pushRemote(token, local);
        }
        setStatus("idle");
      })
      .catch(() => {
        if (active) setStatus("error");
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
        setStatus("saving");
        pushRemote(token, exportChildrenState())
          .then((ok) => {
            setStatus(ok ? "saved" : "error");
            if (ok) window.setTimeout(() => setStatus("idle"), 1500);
          })
          .catch(() => setStatus("error"));
      }, 800);
    };

    window.addEventListener(EVENT_NAME, onChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [enabled]);

  return status;
}
