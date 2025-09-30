// sw.js - 终极版 (混合策略)

// 更新版本号以触发更新
const CACHE_NAME = 'designtool-v6-final'; 
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
];

// 安装阶段：预缓存核心文件 (不变)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 激活阶段：清理旧缓存 (不变)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch阶段：实现智能的混合策略
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // 策略1: 如果是页面导航请求，则使用“网络优先”
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 策略2: 如果是.onnx模型文件，则使用“缓存优先、后台更新”，实现秒开
  if (url.pathname.endsWith('.onnx')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 策略3: 对于其他所有资源 (CSS, JS, 图片等)，使用“缓存优先、后台更新”
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});