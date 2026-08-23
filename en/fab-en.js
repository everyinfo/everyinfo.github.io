/*!
 * CalcLex (calclex.com)
 * Copyright (c) 2026 CalcLex. All rights reserved.
 */
document.addEventListener("DOMContentLoaded", function () {
  const wrap = document.createElement("div");
  wrap.className = "fab-wrap";
  wrap.innerHTML =
    '<button type="button" class="fab hide" id="fabTop" title="Back to top" aria-label="Back to top">↑</button>' +
    '<button type="button" class="fab search" id="fabSearch" title="Search calculators" aria-label="Search calculators">🔍</button>' +
    '<a href="/en/index.html" class="fab" title="Home" aria-label="Home">🏠</a>' +
    '<button type="button" class="fab more" id="fabMore" title="More" aria-label="More">⋮</button>';
  document.body.appendChild(wrap);

  /* ---- Back to top (unchanged: appears after 300px scroll) ---- */
  const topBtn = document.getElementById("fabTop");
  function toggleTop() { topBtn.classList.toggle("hide", window.scrollY < 300); }
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  /* ---- Search (unchanged) ---- */
  let searchOverlay = null;
  document.getElementById("fabSearch").addEventListener("click", function () {
    if (searchOverlay) return;
    searchOverlay = document.createElement("div");
    searchOverlay.className = "fs-overlay";
    searchOverlay.innerHTML =
      '<div class="fs-card">' +
      '<div class="fs-head"><b>Search calculators</b><button type="button" class="fs-close" aria-label="Close">✕</button></div>' +
      '<div class="fs-input-wrap"><span>🔍</span><input type="text" id="fsInput" placeholder="Search by calculator name" autocomplete="off"></div>' +
      '<div class="fs-results" id="fsResults"></div>' +
      '</div>';
    document.body.appendChild(searchOverlay);
    document.body.style.overflow = "hidden";
    const input = searchOverlay.querySelector("#fsInput");
    const results = searchOverlay.querySelector("#fsResults");
    function render(q) {
      if (!q) { results.innerHTML = '<div class="fs-empty">Start typing to search</div>'; return; }
      const list = (window.CALCULATORS || []).filter(c =>
        c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)
      ).slice(0, 20);
      results.innerHTML = list.length === 0
        ? '<div class="fs-empty">No matching calculators</div>'
        : list.map(c =>
            '<a class="fs-item ' + (c.active ? "" : "disabled") + '" href="' + (c.active ? c.url : "#") + '">' +
            '<span class="fs-emoji">' + c.emoji + '</span>' +
            '<span class="fs-text"><span class="fs-title">' + c.title + (c.active ? "" : " (coming soon)") + '</span>' +
            '<span class="fs-desc">' + c.desc + '</span></span></a>'
          ).join("");
    }
    function close() { if (searchOverlay) { searchOverlay.remove(); searchOverlay = null; document.body.style.overflow = ""; } }
    input.addEventListener("input", () => render(input.value.trim().toLowerCase()));
    render("");
    setTimeout(() => input.focus(), 50);
    searchOverlay.querySelector(".fs-close").addEventListener("click", close);
    searchOverlay.addEventListener("click", e => { if (e.target === searchOverlay) close(); });
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } });
  });

  /* ---- More (new): Install app / Recently viewed / All calculators ---- */
  let moreOverlay = null;
  function closeMore() { if (moreOverlay) { moreOverlay.remove(); moreOverlay = null; document.body.style.overflow = ""; } }

  function openMoreMain() {
    moreOverlay.querySelector(".mo-body").innerHTML =
      '<button type="button" class="mo-item" id="moInstall">' +
      '<span class="mo-ic">📲</span><span class="mo-text"><b>Install app</b><small>Add to home screen / taskbar</small></span></button>' +
      '<div class="mo-divider"></div>' +
      '<button type="button" class="mo-item" id="moRecent">' +
      '<span class="mo-ic">🕘</span><span class="mo-text"><b>Recently viewed</b><small>See calculators you used recently</small></span></button>' +
      '<a class="mo-item" href="/en/index.html#calcGrid">' +
      '<span class="mo-ic">📋</span><span class="mo-text"><b>All calculators</b><small>Browse by category</small></span></a>';
    moreOverlay.querySelector("#moInstall").addEventListener("click", function () {
      closeMore();
      if (window.triggerPWAInstall) window.triggerPWAInstall();
    });
    moreOverlay.querySelector("#moRecent").addEventListener("click", openMoreRecent);
  }

  function openMoreRecent() {
    const body = moreOverlay.querySelector(".mo-body");
    body.innerHTML =
      '<button type="button" class="mo-back" id="moBack">← More</button>' +
      '<div id="recentSection"></div>' +
      '<p class="mo-empty-hint" id="moRecentEmpty" style="display:none;">No calculators viewed yet. Use a calculator and it will show up here.</p>';
    body.querySelector("#moBack").addEventListener("click", openMoreMain);
    if (window.renderRecentCalculators) window.renderRecentCalculators();
    const sec = document.getElementById("recentSection");
    if (sec && !sec.innerHTML.trim()) document.getElementById("moRecentEmpty").style.display = "";
  }

  document.getElementById("fabMore").addEventListener("click", function () {
    if (moreOverlay) return;
    moreOverlay = document.createElement("div");
    moreOverlay.className = "fs-overlay";
    moreOverlay.innerHTML =
      '<div class="fs-card">' +
      '<div class="fs-head"><b>More</b><button type="button" class="fs-close" aria-label="Close">✕</button></div>' +
      '<div class="mo-body"></div></div>';
    document.body.appendChild(moreOverlay);
    document.body.style.overflow = "hidden";
    openMoreMain();
    moreOverlay.querySelector(".fs-close").addEventListener("click", closeMore);
    moreOverlay.addEventListener("click", e => { if (e.target === moreOverlay) closeMore(); });
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { closeMore(); document.removeEventListener("keydown", esc); } });
  });

  ensurePWAMeta();
});

/* ---- Make PWA installable (inject manifest/icons/theme-color via JS on every page) ---- */
function ensurePWAMeta() {
  if (document.querySelector('link[rel="manifest"]')) return;
  const head = document.head;
  const manifest = document.createElement("link");
  manifest.rel = "manifest"; manifest.href = "/manifest.json";
  head.appendChild(manifest);
  const iconSvg = document.createElement("link");
  iconSvg.rel = "icon"; iconSvg.type = "image/svg+xml"; iconSvg.href = "/favicon.svg";
  head.appendChild(iconSvg);
  const icon32 = document.createElement("link");
  icon32.rel = "icon"; icon32.type = "image/png"; icon32.sizes = "32x32"; icon32.href = "/favicon-32.png";
  head.appendChild(icon32);
  const appleIcon = document.createElement("link");
  appleIcon.rel = "apple-touch-icon"; appleIcon.href = "/apple-touch-icon.png";
  head.appendChild(appleIcon);
  const theme = document.createElement("meta");
  theme.name = "theme-color"; theme.content = "#000000";
  head.appendChild(theme);
}

/* ---- Install trigger ----
   - Chrome/Edge: automatic install prompt
   - Already installed: accurate message (previously wrongly said "not supported")
   - iOS / Samsung Internet: manual "Add to Home Screen" guide sheet (auto-install is unreliable there) */
(function () {
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function isSamsungInternet() {
    return /SamsungBrowser/i.test(navigator.userAgent);
  }
  async function isAlreadyInstalled() {
    if (isStandalone()) return true;
    try {
      if (navigator.getInstalledRelatedApps) {
        const apps = await navigator.getInstalledRelatedApps();
        return !!(apps && apps.length);
      }
    } catch (e) { /* unsupported browsers just fall through */ }
    return false;
  }
  window.triggerPWAInstall = async function () {
    if (await isAlreadyInstalled()) {
      alert("CalcLex is already installed as an app.\nCheck your home screen or app list.");
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; });
      return;
    }
    if (isIOS() || isSamsungInternet()) { showManualInstallSheet(); return; }
    alert("Couldn't find an automatic install prompt.\nTry 'Add to Home Screen' or 'Install app' from your browser menu.\n(On Chrome, try refreshing the page first.)");
  };
  function showManualInstallSheet() {
    const samsung = isSamsungInternet();
    const steps = samsung
      ? '<li>Tap the <b>≡ Menu</b> button in the bottom right</li><li>Select <b>Add to Home Screen</b></li><li>Tap <b>Add</b> to finish</li>'
      : '<li>Tap the <b>Share ⬆️</b> button</li><li>Select <b>Add to Home Screen</b></li><li>Tap <b>Add</b> in the top right to finish</li>';
    const intro = samsung
      ? "Samsung Internet's automatic install isn't reliable, so please add it this way instead."
      : "iOS doesn't support installing directly from the browser, so please follow these steps.";
    const el = document.createElement("div");
    el.className = "fs-overlay";
    el.innerHTML =
      '<div class="fs-card"><div class="fs-head"><b>Add to Home Screen</b><button type="button" class="fs-close" aria-label="Close">✕</button></div>' +
      '<div class="mo-ios-steps"><p>' + intro + '</p><ol>' + steps + '</ol></div></div>';
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    function close() { el.remove(); document.body.style.overflow = ""; }
    el.querySelector(".fs-close").addEventListener("click", close);
    el.addEventListener("click", e => { if (e.target === el) close(); });
  }
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/service-worker.js").catch(function () {});
    });
  }
})();
