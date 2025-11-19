// Simple service worker with precache + runtime caching and offline fallback.

const CACHE_NAME = 'dnd-pwa-v1';
const PRECACHE_URLS = [
  '/', // root
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  // Add commonly used assets here (fonts, CSS, main JS)
  // '/styles.css',
  // '/main.js'
];

// Install: pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first for navigation, cache first for other requests, fallback to offline page
self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // For navigation requests, try network -> cache -> offline
  if (request.mode === 'navigate' || (request.destination === 'document')) {
    event.respondWith(
      fetch(request).then(response => {
        // Put a copy in cache
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() =>
        caches.match(request).then(match => match || caches.match('/offline.html'))
      )
    );
    return;
  }

  // For other requests, try cache-first then network
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then(networkResponse => {
        // Put a copy in cache for future
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          // Only cache same-origin resources to avoid CORS complications
          if (new URL(request.url).origin === location.origin) {
            cache.put(request, clone);
          }
        });
        return networkResponse;
      }).catch(() => {
        // If request is for an image and it fails, optionally return a placeholder
        if (request.destination === 'image') {
          // return caches.match('/images/offline-image.png') || Response.error();
        }
        // No match => return offline page for navigations handled above
      });
    })
  );
});
