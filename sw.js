// sw.js - 高性能版本 (Stale-While-Revalidate)

// 再次更新版本号，以触发Service Worker的更新
const CACHE_NAME = 'designtool-v6-performance'; 
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

// 安装阶段：预缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache for app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch阶段：实现 Stale-While-Revalidate 策略
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  // 豁免规则，让模型文件由页面自己管理
  if (new URL(event.request.url).pathname.endsWith('.onnx')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // 1. 发起网络请求去获取最新版本
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // 如果成功获取，就用新版本更新缓存
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 2. 立即返回缓存的版本（如果存在），让页面秒开
        //    同时，上面的 fetchPromise 会在后台继续进行，以便下次访问时使用最新版本
        return cachedResponse || fetchPromise;
      });
    })
  );
});