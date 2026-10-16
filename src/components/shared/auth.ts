import { useEffect, useState } from "react";
import func2url from "../../../backend/func2url.json";

const AUTH_URL = (func2url as Record<string, string>).auth;

const TOKEN_KEY = "malyshdok:authToken";
const USER_KEY = "malyshdok:authUser";
const EVENT_NAME = "malyshdok:auth:update";

export type AuthUser = { id: number; phone: string };

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("malyshdok:childProfile");
    localStorage.removeItem("malyshdok:childProfiles");
    localStorage.removeItem("malyshdok:childProfiles:active");
    localStorage.removeItem("malyshdok:vaccineStatus");
    localStorage.removeItem("malyshdok:checkupStatus");
    localStorage.removeItem("malyshdok:medkit");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("malyshdok:childProfile:update"));
  window.dispatchEvent(new CustomEvent("malyshdok:vaccineStatus:update"));
  window.dispatchEvent(new CustomEvent("malyshdok:checkupStatus:update"));
  window.dispatchEvent(new CustomEvent("malyshdok:medkit:update"));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export async function deleteAccount(): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("no_token");
  const res = await fetch(`${AUTH_URL}?action=account`, {
    method: "DELETE",
    headers: { "X-Auth-Token": token },
  });
  if (!res.ok && res.status !== 401) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "delete_failed");
  }
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useAuth(): { user: AuthUser | null; loading: boolean } {
  const [user, setUser] = useState<AuthUser | null>(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
    } else {
      fetch(`${AUTH_URL}?action=me`, { headers: { "X-Auth-Token": token } })
        .then(async (r) => {
          if (!active) return;
          if (r.status === 401) {
            clearSession();
            setUser(null);
            return;
          }
          if (!r.ok) return;
          const d = await r.json();
          if (!active) return;
          if (d.user) {
            setUser(d.user as AuthUser);
          } else {
            clearSession();
            setUser(null);
          }
        })
        .catch(() => {
          /* нет интернета — данные на устройстве не трогаем */
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    const refresh = () => setUser(getUser());
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { user, loading };
}