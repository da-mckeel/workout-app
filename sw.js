// LiftLog service worker — caches the app shell so the PWA opens on flaky
// connections. API requests are never intercepted or cached.
const CACHE = 'liftlog-shell-v1';

const SHELL = [
  '/',
  '/index.html',
  '/config.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isCDN = url.hostname === 'cdn.jsdelivr.net';

  // leave everything else alone — in particular PocketBase API calls,
  // which may live on this origin (/api/...) or a separate one
  if (!sameOrigin && !isCDN) return;
  if (sameOrigin && url.pathname.startsWith('/api')) return;

  // network-first: always fresh when online, cached shell when offline
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === 'navigate') {
          const shell = await caches.match('/');
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
