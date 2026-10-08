const VERSION = "malyshdok-v1";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

const STATIC_FILES = [
  "/",
  "/manifest.webmanifest",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/bear/main.webp?v=3",
  "/bear/thermometer.webp?v=3",
  "/bear/sleep.webp?v=3",
  "/bear/school.webp?v=3",
  "/bear/firstaid.webp?v=3",
  "/bear/night.webp?v=3",
  "/rash-elements/bulla.webp",
  "/rash-elements/cicatrix.webp",
  "/rash-elements/crusta.webp",
  "/rash-elements/erosio.webp",
  "/rash-elements/excoriatio.webp",
  "/rash-elements/fissura.webp",
  "/rash-elements/lichenificatio.webp",
  "/rash-elements/macula.webp",
  "/rash-elements/nodus.webp",
  "/rash-elements/papula.webp",
  "/rash-elements/petechiae.webp",
  "/rash-elements/pigment.webp",
  "/rash-elements/purpura.webp",
  "/rash-elements/pustula.webp",
  "/rash-elements/roseola.webp",
  "/rash-elements/squama.webp",
  "/rash-elements/tuberculum.webp",
  "/rash-elements/ulcus.webp",
  "/rash-elements/urtica.webp",
  "/rash-elements/vesicula.webp",
];

const SKIP_HOSTS = ["functions.poehali.dev", "mc.yandex.ru", "mc.yandex.com"];

async function precacheShell() {
  const cache = await caches.open(SHELL);
  await Promise.all(
    STATIC_FILES.map((url) => cache.add(url).catch(() => undefined))
  );

  const res = await cache.match("/");
  if (!res) return;
  const html = await res.clone().text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  await Promise.all(assets.map((url) => cache.add(url).catch(() => undefined)));

  const scripts = await Promise.all(
    assets
      .filter((u) => u.endsWith(".js"))
      .map((u) => cache.match(u).then((r) => (r ? r.text() : "")))
  );
  const text = scripts.join("\n");
  const media = new Set([
    ...[...text.matchAll(/https:\/\/cdn\.poehali\.dev\/[^"'`\s)]+?\.(?:jpe?g|png|webp)/g)].map((m) => m[0]),
  ]);
  const runtime = await caches.open(RUNTIME);
  await Promise.all(
    [...media].map(async (url) => {
      if (await runtime.match(url)) return;
      try {
        const r = await fetch(url, { mode: url.startsWith("http") ? "cors" : "same-origin" });
        if (r.ok) await runtime.put(url, r);
      } catch {
        /* offline or unavailable */
      }
    })
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirstPage(request) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put("/", res.clone());
    return res;
  } catch {
    return (await cache.match("/")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok || res.type === "opaque") {
    const cache = await caches.open(RUNTIME);
    cache.put(request, res.clone());
  }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok || res.type === "opaque") cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (SKIP_HOSTS.includes(url.hostname)) return;
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (request.mode === "navigate" && url.origin === self.location.origin) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/assets/") || /\.(png|webp|jpe?g|svg|webmanifest)$/.test(url.pathname)) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  if (url.hostname === "cdn.poehali.dev" && /\.(png|webp|jpe?g|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
