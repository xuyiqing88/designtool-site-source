// sw.js - 修复模型缓存冲突版本

// 使用一个新的版本号来触发更新
const CACHE_NAME = 'designtool-v4-hotfix'; 

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
  // 其他需要缓存的资源
];

// 安装时，预缓存核心文件
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

// 激活时，清理旧缓存
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

// fetch时，增加豁免规则
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // 【新增规则】如果请求的是 .onnx 模型文件，则不处理，让浏览器自己去请求
  // 这样 rembg.html 页面里的缓存逻辑就能正常工作了
  if (url.pathname.endsWith('.onnx')) {
    console.log('Bypassing service worker for ONNX model request.');
    return; 
  }

  // 对于所有其他请求，继续采用“网络优先，缓存备用”策略
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return networkResponse;
      })
      .catch(() => {
        console.log('Network request failed, trying to serve from cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});