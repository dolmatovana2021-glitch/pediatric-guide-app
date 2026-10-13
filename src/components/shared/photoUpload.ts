import { useEffect, useState } from "react";
import func2url from "../../../backend/func2url.json";
import { getToken } from "@/components/shared/auth";

const PHOTOS_URL = (func2url as Record<string, string>).photos;
const PRIV = "priv:";
const LEGACY_CDN = "https://cdn.poehali.dev/";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad_image"));
    };
    img.src = url;
  });
}

export async function compressImage(file: File, maxSide = 1400, quality = 0.8): Promise<string> {
  const img = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no_canvas");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function uploadPhoto(file: File): Promise<string> {
  const token = getToken();
  if (!token) return compressImage(file, 900, 0.7);
  const dataUrl = await compressImage(file);
  const res = await fetch(PHOTOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ image: dataUrl, contentType: "image/jpeg" }),
  });
  if (!res.ok) throw new Error("upload_failed");
  const json = await res.json();
  return json.ref as string;
}

export function deletePhoto(ref: string) {
  const token = getToken();
  if (!token || !ref.startsWith(PRIV)) return;
  fetch(PHOTOS_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ ref }),
  }).catch(() => undefined);
}

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

async function fetchPrivate(ref: string, token: string): Promise<string> {
  const res = await fetch(`${PHOTOS_URL}?ref=${encodeURIComponent(ref)}`, {
    headers: { "X-Auth-Token": token },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new Error("locked");
  if (!res.ok) throw new Error("not_found");
  const json = await res.json();
  return json.image as string;
}

export async function migrateLegacyPhoto(url: string): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(PHOTOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ action: "migrate", url }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.ref as string) || null;
}

export const isLegacyPhoto = (ref: string) => ref.startsWith(LEGACY_CDN);

export type PhotoState = { src: string | null; status: "ok" | "loading" | "locked" | "missing" };

export function usePhotoSrc(ref: string): PhotoState {
  const direct = ref.startsWith("data:");
  const [state, setState] = useState<PhotoState>(() =>
    direct ? { src: ref, status: "ok" } : cache.has(ref) ? { src: cache.get(ref)!, status: "ok" } : { src: null, status: "loading" },
  );

  useEffect(() => {
    if (direct) {
      setState({ src: ref, status: "ok" });
      return;
    }
    if (cache.has(ref)) {
      setState({ src: cache.get(ref)!, status: "ok" });
      return;
    }
    const token = getToken();
    if (!token || !ref.startsWith(PRIV)) {
      setState({ src: null, status: "locked" });
      return;
    }
    let alive = true;
    setState({ src: null, status: "loading" });
    let p = pending.get(ref);
    if (!p) {
      p = fetchPrivate(ref, token);
      pending.set(ref, p);
    }
    p.then((src) => {
      cache.set(ref, src);
      if (alive) setState({ src, status: "ok" });
    })
      .catch((e: Error) => {
        if (alive) setState({ src: null, status: e.message === "locked" ? "locked" : "missing" });
      })
      .finally(() => pending.delete(ref));
    return () => {
      alive = false;
    };
  }, [ref, direct]);

  return state;
}

export function clearPhotoCache() {
  cache.clear();
}

if (typeof window !== "undefined") {
  window.addEventListener("malyshdok:auth:update", () => {
    if (!getToken()) clearPhotoCache();
  });
}
