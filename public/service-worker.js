const CACHE_NAME = 'rescue-ping-v1';
const RUNTIME_CACHE = 'rescue-ping-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/Gemini_Generated_Image_7c3uv87c3uv87c3u.svg',
];

// API endpoints to cache dynamically
const API_CACHE_PATTERNS = [
  /\/api\//,
  /openweathermap\.org/,
  /open-meteo\.com/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // Cache API responses
    if (API_CACHE_PATTERNS.some((pattern) => pattern.test(url.href))) {
      event.respondWith(networkFirstStrategy(request));
    }
    return;
  }

  // Use cache-first for static assets
  if (request.method === 'GET') {
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Cache-first strategy (static assets)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page if available
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Network-first strategy (API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

async function syncAlerts() {
  // Sync pending alerts when back online
  const alerts = await getStoredAlerts();
  for (const alert of alerts) {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        body: JSON.stringify(alert),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.log('Failed to sync alert:', error);
    }
  }
}

async function getStoredAlerts() {
  // Retrieve alerts from IndexedDB
  return [];
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Rescue Ping Notification';
  const options = {
    body: data.body || 'New disaster alert',
    icon: '/Gemini_Generated_Image_7c3uv87c3uv87c3u.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'alert',
    requireInteraction: true,
    data: data.url,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
