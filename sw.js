const CACHE = 'networth-v1';
const ASSETS = [
  '/networth-dashboard/',
  '/networth-dashboard/index.html',
  '/networth-dashboard/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only cache same-origin HTML/CSS/JS, pass through API calls
  if(e.request.url.includes('supabase') || e.request.url.includes('googleapis') || e.request.url.includes('er-api')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
