/*!
 * 계산기서랍 (CalcLex) - 최소 서비스워커
 * PWA 설치 조건 충족용. 오프라인 캐싱 전략은 추후 확장 가능.
 */
const CACHE_NAME = "calclex-shell-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // 네트워크 우선, 실패 시(오프라인 등)에만 캐시 확인
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
