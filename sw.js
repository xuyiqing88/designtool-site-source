// sw.js
const CACHE_NAME = 'design-tools-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/menu.js',
   '/video/menu.js',
  '/data.js',
  // 添加其他需要缓存的资源
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
});