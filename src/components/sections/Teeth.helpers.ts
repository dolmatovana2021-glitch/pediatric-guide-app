export const EVENT_NAME = "malyshdok:childProfile:update";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU");
}
