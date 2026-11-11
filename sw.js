// Service worker: salva il gioco sul dispositivo così funziona anche offline.
// Prima prova la rete (così ricevi sempre l'ultima versione); se sei offline usa la copia salvata.
// Quando pubblichi una nuova versione puoi cambiare il numero qui sotto (v6 -> v7...).
const CACHE = "stellina-v6";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(hit => hit || caches.match("index.html"))));
});
