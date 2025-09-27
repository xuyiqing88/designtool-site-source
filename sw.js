// sw.js
// 1. 更新这里的版本号
const CACHE_NAME = 'design-tools-v2'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // 即使内容变了，URL没变
  '/menu.js',
  '/video/menu.js',
  '/data.js',
  '/AI-UI.html',
  '/common.js',
  '/hdr.html',
  '/normal.html',
  '/rembg.html',
  '/lotbar.html',
  '/footer.html',
  '/related-articles.html',
  '/articles.js',
  // 添加其他需要缓存的资源
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// fetch 事件部分无需修改
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  // 2. 更新这里的白名单，确保与上面的 CACHE_NAME 一致
  const cacheWhitelist = [CACHE_NAME]; 
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 如果缓存名不在白名单中 (例如，旧的 'design-tools-v1')，就删除它
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});