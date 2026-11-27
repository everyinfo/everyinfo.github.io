/*!
 * CalcLex (calclex.com) | Copyright (c) 2026 CalcLex. All rights reserved.
 * Proprietary source code. Unauthorized copying, scraping, redistribution, or AI-assisted reproduction is strictly prohibited.
 */
!function(){const e="recentCalculators";function n(){try{const n=localStorage.getItem(e);return n?JSON.parse(n):[]}catch(e){return[]}}function t(n){try{localStorage.setItem(e,JSON.stringify(n))}catch(e){}}window.recordRecentCalculator=function(e){let l=n().filter(n=>n!==e);l.unshift(e),t(l.slice(0,10))},window.clearAllRecent=function(){t([]),window.renderRecentCalculators()},window.removeRecentCalculator=function(e){t(n().filter(n=>n!==e)),window.renderRecentCalculators()},window.renderRecentCalculators=function(){const e=document.getElementById("recentSection");if(!e||!window.CALCULATORS)return;const t=n().map(e=>window.CALCULATORS.find(n=>n.url===e)).filter(Boolean);if(0===t.length)return void(e.innerHTML="");e.innerHTML=`\n      <div class="rel-section" style="padding-left:0;padding-right:0;">\n        <div class="rel-heading-row">\n          <h2 class="rel-heading" style="margin:0;">🕘 최근 본 계산기</h2>\n          <button type="button" class="rel-clear-all" id="recentClearAll">모두 삭제</button>\n        </div>\n        <div class="rel-scroll">\n          ${t.map(e=>`\n            <div class="rel-card recent-card">\n              <button type="button" class="recent-del" data-url="${e.url}" title="목록에서 제거">✕</button>\n              <a href="${e.url}" class="recent-link">\n                <span class="rel-emoji">${e.emoji}</span>\n                <span class="rel-title">${e.title}</span>\n              </a>\n            </div>\n          `).join("")}\n        </div>\n      </div>\n    `,e.querySelectorAll(".recent-del").forEach(e=>{e.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),window.removeRecentCalculator(this.dataset.url)})});const l=document.getElementById("recentClearAll");l&&l.addEventListener("click",function(e){e.preventDefault(),confirm("최근 본 계산기를 모두 지울까요?")&&window.clearAllRecent()})}}();
/* ---------- Favorites (Additive: recentCalculators and its functions are untouched) ---------- */
!function () {
  if (window.__lxFavInit) return;
  window.__lxFavInit = 1;

  var FAV_KEY = "favoriteCalculators";
  var MAX_FAV = 12;
  var isEN = /^\/en(\/|$)/.test(location.pathname) ||
    (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var T = isEN
    ? { fav: "⭐ Favorites", clear: "Clear all", ask: "Remove all favorite calculators?",
        add: "Add to favorites", remove: "Remove from favorites" }
    : { fav: "⭐ 자주 쓰는 계산기", clear: "모두 해제", ask: "자주 쓰는 계산기를 모두 해제할까요?",
        add: "자주 쓰는 계산기에 추가", remove: "자주 쓰는 계산기에서 빼기" };

  function read() {
    try {
      var v = localStorage.getItem(FAV_KEY);
      var a = v ? JSON.parse(v) : [];
      if (!Array.isArray(a)) return [];
      return a.filter(function (u) { return typeof u === "string" && u; });
    } catch (e) { return []; }
  }
  function write(a) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function pageUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    if (c && c.href) {
      try { return new URL(c.href, location.href).pathname; } catch (e) {}
    }
    return location.pathname;
  }

  window.getFavoriteCalculators = read;
  window.isFavoriteCalculator = function (u) { return read().indexOf(u) >= 0; };
  window.toggleFavoriteCalculator = function (u) {
    if (!u) return false;
    var list = read();
    var has = list.indexOf(u) >= 0;
    var next = has ? list.filter(function (x) { return x !== u; })
                   : [u].concat(list).slice(0, MAX_FAV);
    write(next);
    refresh();
    return !has;
  };

  /* ---- home: ⭐ favorites row right above the recent list ---- */
  function ensureSection() {
    var recent = document.getElementById("recentSection");
    if (!recent) return null;
    var box = document.getElementById("favoriteSection");
    if (!box) {
      box = document.createElement("div");
      box.id = "favoriteSection";
      box.className = "popular-section";
      recent.parentNode.insertBefore(box, recent);
    }
    return box;
  }
  function syncVisibility() {
    var box = document.getElementById("favoriteSection");
    var recent = document.getElementById("recentSection");
    if (!box || !recent) return;
    box.style.display = recent.style.display === "none" ? "none" : "";
  }
  function renderFavorites() {
    var box = ensureSection();
    if (!box) return;
    var urls = read();
    var all = window.CALCULATORS || [];
    var cards = [];
    for (var i = 0; i < urls.length; i++) {
      for (var j = 0; j < all.length; j++) {
        if (all[j] && all[j].url === urls[i]) { if (all[j].active !== false) cards.push(all[j]); break; }
      }
    }
    if (!cards.length) { box.innerHTML = ""; box.style.display = "none"; return; }
    box.innerHTML = '\n      <div class="rel-section" style="padding-left:0;padding-right:0;">\n' +
      '        <div class="rel-heading-row">\n' +
      '          <h2 class="rel-heading" style="margin:0;">' + T.fav + '</h2>\n' +
      '          <button type="button" class="rel-clear-all" id="favClearAll">' + T.clear + '</button>\n' +
      '        </div>\n' +
      '        <div class="rel-scroll">' + cards.map(function (c) {
        return '\n            <div class="rel-card recent-card">\n' +
          '              <button type="button" class="recent-del fav-del" data-url="' + esc(c.url) + '" title="' + T.remove + '">✕</button>\n' +
          '              <a href="' + esc(c.url) + '" class="recent-link">\n' +
          '                <span class="rel-emoji">' + (c.emoji || "") + '</span>\n' +
          '                <span class="rel-title">' + esc(c.title) + '</span>\n' +
          '              </a>\n' +
          '            </div>\n          ';
      }).join("") + '</div>\n      </div>\n    ';
    box.style.display = "";
    syncVisibility();
    var dels = box.querySelectorAll(".fav-del");
    for (var k = 0; k < dels.length; k++) {
      dels[k].addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        window.toggleFavoriteCalculator(this.getAttribute("data-url"));
      });
    }
    var clear = document.getElementById("favClearAll");
    if (clear) clear.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm(T.ask)) { write([]); refresh(); }
    });
  }

  /* ---- ☆ / ⭐ toggle buttons: recent cards on home, page title on detail pages ---- */
  function makeStar(url, host) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = host === "title" ? "fav-toggle fav-toggle-title" : "fav-toggle";
    b.setAttribute("data-url", url);
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      window.toggleFavoriteCalculator(url);
    });
    return b;
  }
  function paintStars() {
    var favs = read();

    var recent = document.getElementById("recentSection");
    if (recent) {
      var cards = recent.querySelectorAll(".recent-card");
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.querySelector(".fav-toggle")) continue;
        var src = card.querySelector(".recent-del[data-url]") || card.querySelector("a.recent-link[href]");
        if (!src) continue;
        var url = src.getAttribute("data-url") || src.getAttribute("href");
        if (url) card.appendChild(makeStar(url, "card"));
      }
    }

    var title = document.querySelector("h1.page-title");
    if (title && !title.querySelector(".fav-toggle")) title.appendChild(makeStar(pageUrl(), "title"));

    var btns = document.querySelectorAll(".fav-toggle");
    for (var k = 0; k < btns.length; k++) {
      var b = btns[k];
      var on = favs.indexOf(b.getAttribute("data-url")) >= 0;
      b.textContent = on ? "⭐" : "☆";
      b.className = (b.classList.contains("fav-toggle-title") ? "fav-toggle fav-toggle-title" : "fav-toggle") + (on ? " is-fav" : "");
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", on ? T.remove : T.add);
      b.setAttribute("title", on ? T.remove : T.add);
    }
  }

  function refresh() { renderFavorites(); paintStars(); }

  var orig = window.renderRecentCalculators;
  if (typeof orig === "function") {
    window.renderRecentCalculators = function () {
      var r = orig.apply(this, arguments);
      paintStars();
      return r;
    };
  }

  function boot() {
    renderFavorites();
    paintStars();
    var recent = document.getElementById("recentSection");
    if (recent && "MutationObserver" in window) {
      new MutationObserver(syncVisibility).observe(recent, { attributes: true, attributeFilter: ["style"] });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}();
