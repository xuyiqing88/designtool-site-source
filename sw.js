// sw.js
// 1. 更新这里的版本号
const CACHE_NAME = 'design-tools-static-v1'; 
// 2. 在预缓存列表中，移除 menu.js 和 style.css。
const urlsToCache = [
  '/',
  '/index.html',
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
// 3. 强制新 Service Worker 立即激活
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache for app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // 强制等待中的 Service Worker 被激活
});

// 4. 清理所有旧缓存，并让新 Service Worker 立即控制页面
self.addEventListener('activate', event => {
  // 注意：这里的白名单只包含我们新的静态资源缓存名
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果缓存名不在白名单中，说明是旧缓存，则删除它
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 激活后立即获取控制权
  );
});

// 5. 最关键的部分：实现新的 fetch 逻辑
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 检查请求是否针对 menu.js 或 style.css
  if (url.pathname.endsWith('/menu.js') || url.pathname.endsWith('/style.css')) {
    // 对于这两个文件，我们执行 "Network Only" 策略，并附加一个 no-cache 头
    // 这会强制浏览器绕过它自己的HTTP缓存，直接向服务器请求最新版本。
    event.respondWith(
      fetch(new Request(event.request.url, { cache: 'no-cache' }))
        .catch(error => {
          console.error('Fetch failed for critical file:', event.request.url, error);
          // 如果网络真的失败了，可以提供一个备用响应，或者直接返回错误
          return new Response('Network error', { status: 500 });
        })
    );
    return; // 结束处理
  }

  // 对于所有其他请求，我们采用 "Cache falling back to Network" (缓存优先，网络备用)策略
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 如果缓存中有匹配的响应，则直接返回它
      if (cachedResponse) {
        return cachedResponse;
      }
      // 如果缓存中没有，则发起网络请求
      return fetch(event.request);
    })
  );
});