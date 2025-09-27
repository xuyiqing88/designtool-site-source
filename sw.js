// sw.js
// 1. 更新这里的版本号
const CACHE_NAME = 'design-tools-v7'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', 
  '/menu.js',
  '/video/menu.js',
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

// fetch 事件修改为 “网络优先”
self.addEventListener('fetch', event => {
  event.respondWith(
    // 优先尝试网络请求
    fetch(event.request).catch(() => {
      // 如果网络请求失败 (例如离线), 则尝试从缓存中寻找匹配的资源
      return caches.match(event.request);
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