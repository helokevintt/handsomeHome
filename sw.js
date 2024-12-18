const CACHE_NAME = 'handsome-home-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/main.js',
    '/js/config.js',
    '/wallpapers.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 