// sw.js - 生产就绪版 (带导航预加载)

// 更新版本号，这是最后一次大的调整
const CACHE_NAME = 'designtool-v8-production-ready'; 
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

// 激活阶段：【新增】启用导航预加载
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
    }).then(async () => {
      // 【核心新增】检查并启用导航预加载功能
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
        console.log('Navigation Preload enabled!');
      }
      return self.clients.claim();
    })
  );
});

// Fetch阶段：【核心修改】为导航请求使用预加载的响应
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // 策略1: 如果是页面导航请求
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // 尝试使用预加载的响应
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            console.log('Using preload response for navigation');
            // 将预加载的响应放入缓存以备离线时使用
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, preloadResponse.clone());
            return preloadResponse;
          }

          // 如果没有预加载的响应，则正常执行网络请求
          return await fetch(event.request);
        } catch (error) {
          // 如果网络完全断开（预加载和fetch都失败）
          console.log('Fetch failed for navigation; returning offline page from cache.');
          // 从缓存中寻找备用页面
          return await caches.match(event.request);
        }
      })()
    );
    return;
  }

  // 策略2: 对于其他所有资源 (CSS, JS, 图片, 模型等)
  // 我们继续使用高效且稳定的“缓存优先，后台更新”策略
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