const CACHE = 'fieldwork-quick-practice-v1';
const HOME = '/practice/';
const assets = [
  HOME,
  '/practice/practice.css',
  '/practice/practice.js',
  '/practice/cards.js',
  '/practice/review.js',
  '/practice/manifest.webmanifest',
  '/practice/icon-192.png',
  '/practice/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(assets.map(async path => {
      const response = await fetch(path, { cache: 'reload', redirect: 'error' });
      if (!response.ok || path.endsWith('.js') && response.headers.get('content-type')?.includes('text/html')) {
        throw new Error('Unable to cache practice assets');
      }
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('fieldwork-quick-practice-') && name !== CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' && (url.pathname === HOME || url.pathname === '/practice/index.html')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok || response.status < 500) return response;
      } catch {}
      return (await caches.open(CACHE)).match(HOME);
    })());
    return;
  }
  if (assets.includes(url.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.pathname)) || fetch(request))());
  }
});
