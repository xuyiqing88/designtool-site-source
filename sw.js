// sw.js - 性能调优版 (全面采用Stale-While-Revalidate)

// 更新版本号以触发更新
const CACHE_NAME = 'designtool-v11-performance-tuned'; 
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

// Fetch阶段：将所有请求（除模型外）统一为Stale-While-Revalidate策略
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);

  // 豁免规则：让.onnx模型文件由页面自己管理（或者由下面的SWR策略管理，如果之前rembg.html代码已简化）
  if (url.pathname.endsWith('.onnx')) {
    // 您可以选择让SW完全不管(return;)，或者也用SWR策略。我们这里统一用SWR。
  }

  // 【核心修改】
  // 我们不再对 navigation 请求做特殊处理，让它和CSS/JS等资源一样
  // 统一享受“缓存优先、后台更新”带来的极速体验。
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // 发起网络请求去获取最新版本
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // 如果成功，就用新版本更新缓存
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 立即返回缓存的版本（如果有），实现秒开
        return cachedResponse || fetchPromise;
      });
    })
  );
});