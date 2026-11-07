const CACHE_NAME = "logos-shell-v1";
const APP_SHELL = ["./", "manifest.webmanifest"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* network first, cache as offline fallback (only own files) */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match("./")))
  );
});

/* Web Push (needs a server that sends pushes; local notifications work without it) */
self.addEventListener("push", event => {
  let p = { title: "Logos", body: "Новое сообщение", chat: null };
  try { if (event.data) p = { ...p, ...event.data.json() }; } catch (_) { if (event.data) p.body = event.data.text(); }
  event.waitUntil(self.registration.showNotification(p.title || "Logos", {
    body: p.body, icon: "icons/icon-192.png", badge: "icons/icon-192.png",
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
