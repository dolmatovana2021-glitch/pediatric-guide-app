import func2url from "../../../backend/func2url.json";
import { getToken } from "@/components/shared/auth";

const PHOTOS_URL = (func2url as Record<string, string>).photos;

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
  return json.url as string;
}

export function deletePhoto(url: string) {
  const token = getToken();
  if (!token || url.startsWith("data:")) return;
  fetch(PHOTOS_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ url }),
  }).catch(() => undefined);
}
