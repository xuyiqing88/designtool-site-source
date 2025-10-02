// sw.js - v13版，为rembg模型增加豁免规则

// 更新版本号以触发更新
const CACHE_NAME = 'designtool-v12-rembg-hotfix'; 
const urlsToCache = [
  '/',
  '/style.css',
  '/menu.js',
  '/video/menu.js',
  '/common.js',
  '/footer.html',
  '/related-articles.html',
  '/articles.js',
];

// 安装阶段 (不变)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 激活阶段 (不变)
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

// Fetch阶段：增加对.onnx文件的豁免规则
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);

  // 【核心修改】
  // 如果请求的是.onnx模型文件，则不处理，让浏览器自己去请求。
  // 这样 rembg.html 页面里的缓存逻辑就能正常工作了。
  if (url.pathname.endsWith('.onnx')) {
    console.log('Bypassing service worker for ONNX model request.');
    return; 
  }

  // 对于其他所有请求，继续使用高效的“缓存优先，后台更新”策略
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
