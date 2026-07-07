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

function saveAuth(token: string, user: AuthUser) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export async function requestCode(phone: string): Promise<{ demoCode?: string }> {
  const res = await fetch(`${AUTH_URL}?action=request_code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "request_failed");
  return { demoCode: data.demo_code };
}

export async function verifyCode(phone: string, code: string): Promise<AuthUser> {
  const res = await fetch(`${AUTH_URL}?action=verify_code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "verify_failed");
  saveAuth(data.token, data.user);
  return data.user as AuthUser;
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
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then((d) => {
          if (active) setUser(d.user as AuthUser);
        })
        .catch(() => {
          if (active) {
            logout();
            setUser(null);
          }
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

export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);
  const p = digits.slice(1);
  let out = "+7";
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ") " + p.slice(3, 6);
  if (p.length >= 6) out += "-" + p.slice(6, 8);
  if (p.length >= 8) out += "-" + p.slice(8, 10);
  return out;
}
