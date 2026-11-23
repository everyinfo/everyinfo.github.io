/*!
 * CalcLex (calclex.com) — 서비스워커
 *  · 동일 출처: Network-First + 캐시 폴백 (온라인이면 항상 최신본, 오프라인이면 캐시)
 *  · 전체 계산기 사전 캐싱: 페이지가 요청하면(calclex-tools/gen_sw_precache.py로 생성한 목록) 조용히 미리 받아둠
 *  · 외부 도메인(광고·분석·CDN): 오프라인에서 기다리지 않고 즉시 빈 응답으로 통과
 * Copyright (c) 2026 CalcLex. All rights reserved.
 */
"use strict";

const CACHE_PREFIX = "calclex-";
const CACHE_NAME = "calclex-v2";
const SHELL_CACHE = CACHE_NAME;
const PRECACHE_CONCURRENCY = 5;
const PRECACHE_STAMP_CACHE = CACHE_NAME + "-meta";
const PRECACHE_STAMP_URL = "/__calclex_precache_stamp";

/* 최소 셸: 오프라인 첫 진입에서도 홈·스타일·아이콘·pwa 스크립트가 있다 */
const SHELL = [
  "/",
  "/index.html",
  "/en/",
  "/en/index.html",
  "/style.css",
  "/pwa.js",
  "/lang-switch.js",
  "/metrics.js",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/favicon-32.png",
  "/favicon.svg"
];

/* 계산기 전체 목록 (calclex-tools/gen_sw_precache.py가 갱신) */
// <PRECACHE:BEGIN>
const PRECACHE_URLS = [
  "/",
  "/en/",
  "/calculators/age.html",
  "/calculators/airweight.html",
  "/calculators/average.html",
  "/calculators/avgkid.html",
  "/calculators/baby.html",
  "/calculators/basiccalc.html",
  "/calculators/cbm.html",
  "/calculators/circlearea.html",
  "/calculators/container.html",
  "/calculators/customs.html",
  "/calculators/datediff.html",
  "/calculators/dday.html",
  "/calculators/derivative.html",
  "/calculators/divisor.html",
  "/calculators/dutch.html",
  "/calculators/electric.html",
  "/calculators/explog.html",
  "/calculators/factor.html",
  "/calculators/fraction.html",
  "/calculators/gas.html",
  "/calculators/gcdlcm.html",
  "/calculators/grade.html",
  "/calculators/heat.html",
  "/calculators/hwangap.html",
  "/calculators/integral.html",
  "/calculators/krwword.html",
  "/calculators/linearfn.html",
  "/calculators/loan.html",
  "/calculators/matrix.html",
  "/calculators/mold.html",
  "/calculators/moment.html",
  "/calculators/normaldist.html",
  "/calculators/pallet.html",
  "/calculators/percent.html",
  "/calculators/percentkid.html",
  "/calculators/petage.html",
  "/calculators/pipe.html",
  "/calculators/probability.html",
  "/calculators/pump.html",
  "/calculators/pythagoras.html",
  "/calculators/quadeq.html",
  "/calculators/ratio.html",
  "/calculators/ratiokid.html",
  "/calculators/salary.html",
  "/calculators/salt.html",
  "/calculators/scicalc.html",
  "/calculators/sector.html",
  "/calculators/sequence.html",
  "/calculators/shape.html",
  "/calculators/solidshape.html",
  "/calculators/solution.html",
  "/calculators/speed.html",
  "/calculators/sqrtcalc.html",
  "/calculators/statskid.html",
  "/calculators/stress.html",
  "/calculators/suneung.html",
  "/calculators/torque.html",
  "/calculators/trigratio.html",
  "/calculators/tripcost.html",
  "/calculators/unit-angle.html",
  "/calculators/unit-area.html",
  "/calculators/unit-clothing.html",
  "/calculators/unit-cooking.html",
  "/calculators/unit-currency.html",
  "/calculators/unit-data.html",
  "/calculators/unit-density.html",
  "/calculators/unit-energy.html",
  "/calculators/unit-ev.html",
  "/calculators/unit-force.html",
  "/calculators/unit-fuel.html",
  "/calculators/unit-glucose.html",
  "/calculators/unit-length.html",
  "/calculators/unit-power.html",
  "/calculators/unit-pressure.html",
  "/calculators/unit-shoe.html",
  "/calculators/unit-speed.html",
  "/calculators/unit-temperature.html",
  "/calculators/unit-time.html",
  "/calculators/unit-volume.html",
  "/calculators/unit-weight.html",
  "/calculators/uvalue.html",
  "/calculators/vat.html",
  "/calculators/vector.html",
  "/calculators/wage.html",
  "/calculators/wood.html",
  "/en/calculators/airweight.html",
  "/en/calculators/average.html",
  "/en/calculators/avgkid.html",
  "/en/calculators/baby.html",
  "/en/calculators/basiccalc.html",
  "/en/calculators/cbm.html",
  "/en/calculators/circlearea.html",
  "/en/calculators/container.html",
  "/en/calculators/customs.html",
  "/en/calculators/datediff.html",
  "/en/calculators/dday.html",
  "/en/calculators/derivative.html",
  "/en/calculators/divisor.html",
  "/en/calculators/dutch.html",
  "/en/calculators/electric.html",
  "/en/calculators/explog.html",
  "/en/calculators/factor.html",
  "/en/calculators/fraction.html",
  "/en/calculators/gas.html",
  "/en/calculators/gcdlcm.html",
  "/en/calculators/heat.html",
  "/en/calculators/integral.html",
  "/en/calculators/linearfn.html",
  "/en/calculators/loan.html",
  "/en/calculators/matrix.html",
  "/en/calculators/mold.html",
  "/en/calculators/moment.html",
  "/en/calculators/normaldist.html",
  "/en/calculators/pallet.html",
  "/en/calculators/percent.html",
  "/en/calculators/percentkid.html",
  "/en/calculators/petage.html",
  "/en/calculators/pipe.html",
  "/en/calculators/probability.html",
  "/en/calculators/pump.html",
  "/en/calculators/pythagoras.html",
  "/en/calculators/quadeq.html",
  "/en/calculators/ratio.html",
  "/en/calculators/ratiokid.html",
  "/en/calculators/salt.html",
  "/en/calculators/scicalc.html",
  "/en/calculators/sector.html",
  "/en/calculators/sequence.html",
  "/en/calculators/shape.html",
  "/en/calculators/solidshape.html",
  "/en/calculators/solution.html",
  "/en/calculators/speed.html",
  "/en/calculators/sqrtcalc.html",
  "/en/calculators/statskid.html",
  "/en/calculators/stress.html",
  "/en/calculators/torque.html",
  "/en/calculators/trigratio.html",
  "/en/calculators/tripcost.html",
  "/en/calculators/unit-angle.html",
  "/en/calculators/unit-area.html",
  "/en/calculators/unit-clothing.html",
  "/en/calculators/unit-cooking.html",
  "/en/calculators/unit-currency.html",
  "/en/calculators/unit-data.html",
  "/en/calculators/unit-density.html",
  "/en/calculators/unit-energy.html",
  "/en/calculators/unit-ev.html",
  "/en/calculators/unit-force.html",
  "/en/calculators/unit-fuel.html",
  "/en/calculators/unit-glucose.html",
  "/en/calculators/unit-length.html",
  "/en/calculators/unit-power.html",
  "/en/calculators/unit-pressure.html",
  "/en/calculators/unit-shoe.html",
  "/en/calculators/unit-speed.html",
  "/en/calculators/unit-temperature.html",
  "/en/calculators/unit-time.html",
  "/en/calculators/unit-volume.html",
  "/en/calculators/unit-weight.html",
  "/en/calculators/uvalue.html",
  "/en/calculators/vector.html",
  "/en/calculators/wood.html",
  "/about.html",
  "/contact.html",
  "/privacy.html",
  "/style.css",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/favicon-16.png",
  "/favicon-32.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/basiccalc-en.js",
  "/basiccalc.js",
  "/calc-engine-en.js",
  "/calc-engine.js",
  "/calc-intent-data.js",
  "/calc-intent.js",
  "/calculators-data-en.js",
  "/calculators-data.js",
  "/elementary-en.js",
  "/elementary.js",
  "/engineering-en.js",
  "/engineering.js",
  "/everyday-en.js",
  "/fab-en.js",
  "/fab.js",
  "/full-category-list-en.js",
  "/full-category-list.js",
  "/i18n.js",
  "/input-enhance.js",
  "/lang-switch.js",
  "/logistics-en.js",
  "/logistics.js",
  "/lunar.js",
  "/metrics.js",
  "/pet-loan-en.js",
  "/pet-loan.js",
  "/policy-data.js",
  "/recent-calculators-en.js",
  "/recent-calculators.js",
  "/related-sections-en.js",
  "/related-sections.js",
  "/sci-calc-en.js",
  "/sci-calc.js",
  "/student-en.js",
  "/student.js",
  "/topreset.js",
  "/unit-converter-app-en.js",
  "/unit-converter-app.js",
  "/unit-converter-data-en.js",
  "/unit-converter-data.js",
  "/wage.js",
  "/en/calculators-data-en.js",
  "/en/fab-en.js",
];
// <PRECACHE:END>

const PRECACHE_ASSETS = SHELL.concat(PRECACHE_URLS.filter((u) => SHELL.indexOf(u) === -1));

/* ---------- 설치 / 활성화 ---------- */

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        SHELL.map(async (url) => {
          try {
            const hit = await cache.match(url);
            if (hit) return;
            const res = await fetch(url, { cache: "no-cache" });
            if (res && res.ok) await cache.put(url, res.clone());
          } catch (e) {}
        })
      );
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k.indexOf(CACHE_PREFIX) === 0 && k.indexOf(CACHE_NAME) !== 0 ? caches.delete(k) : null))
      );
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.disable();
        } catch (e) {}
      }
      await self.clients.claim();
    })()
  );
});

/* ---------- 사전 캐싱 ---------- */

let precacheRunning = false;

async function readStamp() {
  try {
    const cache = await caches.open(PRECACHE_STAMP_CACHE);
    const res = await cache.match(PRECACHE_STAMP_URL);
    if (!res) return 0;
    const txt = await res.text();
    return parseInt(txt, 10) || 0;
  } catch (e) {
    return 0;
  }
}

async function writeStamp() {
  try {
    const cache = await caches.open(PRECACHE_STAMP_CACHE);
    await cache.put(
      PRECACHE_STAMP_URL,
      new Response(String(Date.now()), { headers: { "Content-Type": "text/plain" } })
    );
  } catch (e) {}
}

/* sitemap.xml에서 아직 목록에 없는 새 계산기를 보충한다 */
async function sitemapUrls() {
  try {
    const res = await fetch("/sitemap.xml", { cache: "no-cache" });
    if (!res || !res.ok) return [];
    const xml = await res.text();
    const out = [];
    xml.replace(/<loc>\s*([^<\s]+)\s*<\/loc>/g, (m, loc) => {
      let path = loc.replace(/^https?:\/\/[^/]+/, "");
      if (!path) path = "/";
      if (!/^[a-zA-Z0-9._~\-\/%]+$/.test(path)) return m;
      if (/.xml$/.test(path)) return m;
      out.push(path);
      return m;
    });
    return out;
  } catch (e) {
    return [];
  }
}

async function precacheAll(force) {
  if (precacheRunning) return;
  if (!navigator.onLine) return;
  if (!force) {
    const last = await readStamp();
    if (last && Date.now() - last < 6 * 60 * 60 * 1000) return;
  }
  precacheRunning = true;
  try {
    const cache = await caches.open(SHELL_CACHE);
    let queue = PRECACHE_ASSETS.slice();
    const extra = await sitemapUrls();
    extra.forEach((u) => {
      if (queue.indexOf(u) === -1) queue.push(u);
    });

    const CONCURRENCY = PRECACHE_CONCURRENCY;
    async function worker() {
      while (queue.length) {
        const url = queue.shift();
        try {
          const hit = await cache.match(url);
          if (hit) continue;
          const res = await fetch(url, { cache: "no-cache" });
          if (res && res.ok) await cache.put(url, res.clone());
        } catch (e) {}
      }
    }
    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) workers.push(worker());
    await Promise.all(workers);
    await writeStamp();
  } finally {
    precacheRunning = false;
  }
}

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "CALCLEX_PRECACHE") {
    event.waitUntil(precacheAll(!!data.force));
  }
});

/* ---------- 외부 도메인: 오프라인이면 즉시 빈 응답 ---------- */

function emptyResponse(request) {
  const dest = request.destination;
  if (dest === "script") {
    return new Response("/* offline: external script skipped */", {
      status: 200,
      headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" }
    });
  }
  if (dest === "style") {
    return new Response("/* offline: external style skipped */", {
      status: 200,
      headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "no-store" }
    });
  }
  if (dest === "image") {
    return new Response("", { status: 204, statusText: "No Content" });
  }
  return new Response("", { status: 204, statusText: "No Content" });
}

async function crossOrigin(request) {
  if (!navigator.onLine) return emptyResponse(request);
  try {
    return await fetch(request);
  } catch (e) {
    return emptyResponse(request);
  }
}

/* ---------- 오프라인 안내 페이지 ---------- */

function offlinePage() {
  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1e3a5f">
<title>오프라인 · CalcLex</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8F8F8;font-family:-apple-system,'Pretendard','Noto Sans KR',sans-serif;color:#1F1F1E;text-align:center;padding:24px;line-height:1.6}
.card{max-width:360px}h1{font-size:19px;margin:0 0 10px;color:#2E5C8A}p{font-size:13.5px;color:#5C5B58;margin:0 0 18px}
a{display:inline-block;padding:11px 18px;border-radius:10px;background:#2E5C8A;color:#F5F7FA;text-decoration:none;font-size:13.5px;font-weight:700}</style>
</head><body><div class="card"><h1>인터넷에 연결되어 있지 않아요</h1>
<p>이 페이지는 아직 저장되지 않았습니다. 연결된 상태에서 한 번 열어두면 오프라인에서도 계산기를 쓸 수 있어요.</p>
<a href="/">계산기 홈으로</a></div></body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}

/* ---------- 동일 출처: Network-First + 캐시 폴백 ---------- */

async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok && res.type === "basic") cache.put(request, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    let hit = await cache.match(request);
    if (!hit) hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === "navigate") {
      const home = await cache.match("/index.html");
      if (home) return home;
      return offlinePage();
    }
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (url.origin !== self.location.origin) {
    event.respondWith(crossOrigin(request));
    return;
  }
  if (url.pathname === "/sw.js" || url.pathname === "/service-worker.js") return;
  if (url.pathname.indexOf("/__calclex_precache_stamp") === 0) return;

  event.respondWith(networkFirst(request));
});
