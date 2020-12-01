var CACHE_NAME = 'offline-cche';
var files = [
    '/',
    '/style.css',
    '/helpers.js',
    '/index.html',
    '/about.html',
    '/icon.png',
    '/manifest.webmanifest',
    '/app.js'
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil((async () => {
        self.skipWaiting();
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(files);
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const url = event.request.url;
        const cache = await caches.open(CACHE_NAME);
        try {
            const networkResponse = await fetch(url);
            if (networkResponse.ok) {
                console.log('From network: ${url}');
                return networkResponse;
            }
            throw Error("Fetch Failing with status ${networkResponse.status}");
        } catch (err) {
            console.log('From cache: ${url}');
            return cache.match(url);
        }
    })());
});