/*!
 * CalcLex (calclex.com) | Copyright (c) 2026 CalcLex. All rights reserved.
 * Proprietary source code. Unauthorized copying, scraping, redistribution, or AI-assisted reproduction is strictly prohibited.
 *
 * PWA bootstrap: manifest link check, service worker registration, precache request, network status icon
 */
(function () {
  "use strict";

  var SW_URL = "/sw.js";
  var isEN = /^\/en(\/|$)/.test(location.pathname) || (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var TXT = isEN
    ? { online: "Online · Ready for offline use", offline: "Offline mode · Works without internet", on: "Online", off: "Offline" }
    : { online: "온라인 · 오프라인 사용 준비됨", offline: "오프라인 모드 · 인터넷 없이 계산 가능", on: "온라인", off: "오프라인" };

  var SVG_ON =
    '<svg class="net-svg net-svg-on" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M3 9.2a15.5 15.5 0 0 1 18 0"/>' +
    '<path d="M6.2 13a10.5 10.5 0 0 1 11.6 0"/>' +
    '<path d="M9.2 16.7a5.6 5.6 0 0 1 5.6 0"/>' +
    '<circle cx="12" cy="20.1" r="1.1" fill="currentColor" stroke="none"/>' +
    "</svg>";

  var SVG_OFF =
    '<svg class="net-svg net-svg-off" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M3 9.2a15.5 15.5 0 0 1 5.05-3.02"/>' +
    '<path d="M14.3 5.9a15.5 15.5 0 0 1 6.7 3.3"/>' +
    '<path d="M6.2 13a10.5 10.5 0 0 1 4.1-2.15"/>' +
    '<path d="M16.4 11.6a10.5 10.5 0 0 1 1.4 1.4"/>' +
    '<path d="M9.2 16.7a5.6 5.6 0 0 1 5.6 0"/>' +
    '<circle cx="12" cy="20.1" r="1.1" fill="currentColor" stroke="none"/>' +
    '<line x1="3" y1="3" x2="21" y2="21"/>' +
    "</svg>";

  /* ---------- 1. Network status icon ---------- */

  function buildIcon() {
    var el = document.createElement("button");
    el.type = "button";
    el.id = "netStatus";
    el.className = "net-status";
    el.setAttribute("aria-label", TXT.online);
    el.setAttribute("aria-live", "polite");
    el.innerHTML = SVG_ON + SVG_OFF + '<span class="net-tip" role="status"></span>';
    el.dataset.state = navigator.onLine ? "online" : "offline";
    var tip = el.querySelector(".net-tip");
    if (tip) tip.textContent = navigator.onLine ? TXT.online : TXT.off;

    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (el.classList.contains("is-open")) hideTip(el);
      else showTip(el, 3600);
    });
    el.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") hideTip(el);
    });
    return el;
  }

  var tipTimer = null;
  function showTip(el, ms) {
    el.classList.add("is-open");
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(function () {
      hideTip(el);
    }, ms || 3600);
  }
  function hideTip(el) {
    if (tipTimer) {
      clearTimeout(tipTimer);
      tipTimer = null;
    }
    el.classList.remove("is-open");
  }

  function placeIcon() {
    var nav = document.querySelector(".nav-inner") || document.querySelector(".nav");
    if (!nav) return false;
    var el = document.getElementById("netStatus") || buildIcon();
    var sw = nav.querySelector(".lang-switch");
    if (sw) {
      if (el.parentNode !== nav || el.nextElementSibling !== sw) nav.insertBefore(el, sw);
    } else if (el.parentNode !== nav) {
      nav.appendChild(el);
    }
    return true;
  }

  function setState() {
    var el = document.getElementById("netStatus");
    if (!el) return;
    var online = navigator.onLine;
    var next = online ? "online" : "offline";
    var changed = el.dataset.state !== next;
    el.dataset.state = next;
    el.setAttribute("aria-label", online ? TXT.online : TXT.offline);
    var tip = el.querySelector(".net-tip");
    if (tip) tip.textContent = online ? TXT.online : TXT.offline;
    if (changed && !online) showTip(el, 4200);
    if (changed && online) hideTip(el);
  }

  /* ---------- 2. Service worker registration + precache request ---------- */

  var asked = false;
  function askPrecache() {
    if (asked || !navigator.onLine) return;
    asked = true;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready
      .then(function (reg) {
        if (reg && reg.active) reg.active.postMessage({ type: "CALCLEX_PRECACHE" });
      })
      .catch(function () {});
  }

  function registerSW() {
    if (!("serviceWorker" in navigator) || location.protocol !== "https:") return;
    navigator.serviceWorker
      .register(SW_URL, { scope: "/", updateViaCache: "none" })
      .then(function (reg) {
        try {
          reg.update();
        } catch (e) {}
        setTimeout(askPrecache, 1800);
      })
      .catch(function () {});
  }

  /* ---------- 3. Bootstrap ---------- */

  function boot() {
    placeIcon();
    setState();

    // lang-switch.js injects the KO/EN switch later, so move the icon just before it at that point.
    var nav = document.querySelector(".nav-inner") || document.querySelector(".nav");
    if (nav && "MutationObserver" in window) {
      var obs = new MutationObserver(function () {
        placeIcon();
      });
      obs.observe(nav, { childList: true, subtree: true });
      setTimeout(function () {
        obs.disconnect();
      }, 5000);
    }

    window.addEventListener("online", function () {
      setState();
      asked = false;
      askPrecache();
    });
    window.addEventListener("offline", setState);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) setState();
    });
    document.addEventListener("click", function () {
      var el = document.getElementById("netStatus");
      if (el) hideTip(el);
    });

    registerSW();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ---------- 4. Home-screen install banner (2nd visit and later) ---------- */
(function () {
  "use strict";
  if (window.__lxPwaBanner) return;
  window.__lxPwaBanner = 1;

  var KEY_VISITS = "calclexVisits";
  var KEY_DISMISSED = "calclexPwaDismissed";
  var isEN = /^\/en(\/|$)/.test(location.pathname) ||
    (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var TXT = isEN
    ? { msg: "Add CalcLex to your home screen and open it like an app.",
        ios: "In Safari: Share → Add to Home Screen.",
        add: "Add", close: "Dismiss" }
    : { msg: "홈 화면에 추가하면 앱처럼 바로 쓸 수 있어요",
        ios: "Safari에서 공유 → 홈 화면에 추가를 눌러 주세요.",
        add: "추가", close: "닫기" };

  var deferred = null;
  var shown = false;

  function readNum(k) {
    try { return parseInt(localStorage.getItem(k) || "0", 10) || 0; } catch (e) { return 0; }
  }
  function dismissed() {
    try { return localStorage.getItem(KEY_DISMISSED) === "1"; } catch (e) { return true; }
  }
  function setDismissed() {
    try { localStorage.setItem(KEY_DISMISSED, "1"); } catch (e) {}
  }
  function standalone() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
    } catch (e) {}
    return navigator.standalone === true;
  }
  function isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  /* Count one visit per page load (a counter only, nothing else is stored). */
  var visits = readNum(KEY_VISITS) + 1;
  try { localStorage.setItem(KEY_VISITS, String(visits)); } catch (e) {}

  function build() {
    var el = document.createElement("div");
    el.id = "pwaBanner";
    el.className = "pwa-banner";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", isEN ? "Install CalcLex" : "CalcLex 홈 화면 추가");
    var msg = TXT.msg + (deferred ? "" : " " + TXT.ios);
    el.innerHTML = '<span class="pwa-banner-msg"></span>' +
      (deferred ? '<button type="button" class="pwa-banner-add"></button>' : "") +
      '<button type="button" class="pwa-banner-close">✕</button>';
    el.querySelector(".pwa-banner-msg").textContent = msg;
    var add = el.querySelector(".pwa-banner-add");
    if (add) {
      add.textContent = TXT.add;
      add.addEventListener("click", function () {
        if (!deferred) return;
        var p = deferred;
        deferred = null;
        try { p.prompt(); } catch (e) {}
        if (p.userChoice && p.userChoice.then) {
          p.userChoice.then(function (r) {
            if (r && r.outcome === "accepted") setDismissed();
            hide();
          }).catch(function () { hide(); });
        } else {
          hide();
        }
      });
    }
    var close = el.querySelector(".pwa-banner-close");
    close.setAttribute("aria-label", TXT.close);
    close.title = TXT.close;
    close.addEventListener("click", function () { setDismissed(); hide(); });
    document.body.appendChild(el);
    return el;
  }

  function hide() {
    var el = document.getElementById("pwaBanner");
    if (el) el.classList.remove("show");
    if (document.body) document.body.classList.remove("pwa-banner-open");
  }

  function maybeShow() {
    if (shown || !document.body) return;
    if (visits < 2 || dismissed() || standalone()) return;
    if (!deferred && !isIOS()) return;
    var el = document.getElementById("pwaBanner") || build();
    shown = true;
    el.classList.add("show");
    document.body.classList.add("pwa-banner-open");
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    if (e && e.preventDefault) e.preventDefault();
    deferred = e;
    if (document.body) maybeShow();
    else document.addEventListener("DOMContentLoaded", maybeShow);
  });
  window.addEventListener("appinstalled", function () { setDismissed(); hide(); });

  if (document.body) maybeShow();
  else document.addEventListener("DOMContentLoaded", maybeShow);
})();
