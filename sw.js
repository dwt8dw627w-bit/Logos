const CACHE_NAME = "logos-shell-v5";
const APP_SHELL = ["./", "manifest.webmanifest"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).catch(() => {}));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Always network-first for HTML and JS so updates arrive without ?v=
  const path = url.pathname;
  const isCode = path.endsWith(".html") || path.endsWith(".js") || path.endsWith("/") || path.endsWith(".css");
  if (isCode) {
    event.respondWith(
      fetch(req, { cache: "no-store" }).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match("./")))
  );
});

self.addEventListener("push", event => {
  let p = { title: "Logos", body: "Новое сообщение", chat: null };
  try { if (event.data) p = { ...p, ...event.data.json() }; } catch (_) { if (event.data) p.body = event.data.text(); }
  event.waitUntil(self.registration.showNotification(p.title || "Logos", {
    body: p.body, icon: "icon-192.png", badge: "icon-192.png",
    tag: p.chat ? "c" + p.chat : "logos", renotify: true, data: { chat: p.chat, url: "./" }
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const d = event.notification.data || {};
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of wins) {
      if ("focus" in c) { await c.focus(); if (d.chat) c.postMessage({ type: "OPEN_CHAT", chat: d.chat }); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow(d.url || "./");
  })());
});
