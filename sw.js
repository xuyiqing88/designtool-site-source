// sw.js
const CACHE_NAME = 'designtool-v2-safe';
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
// 1. 安装时，预缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. 激活时，清理旧缓存
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

// 3. fetch时，采用“网络优先，缓存备用”策略
self.addEventListener('fetch', event => {
  // 我们只处理GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // 优先尝试网络请求
    fetch(event.request)
      .then(networkResponse => {
        // 如果网络请求成功，我们做两件事：
        // 1. 将最新的响应放入缓存中，以备将来离线时使用
        // 2. 将响应返回给页面
        
        // 需要克隆响应，因为响应体只能被读取一次
        const responseToCache = networkResponse.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return networkResponse;
      })
      .catch(() => {
        // 如果网络请求失败（例如用户离线了）
        // 我们就去缓存里找有没有匹配的旧版本
        console.log('Network request failed, trying to serve from cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});