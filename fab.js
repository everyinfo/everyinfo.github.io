/*!
 * 계산기서랍 (everyinfo.github.io)
 * Copyright (c) 2026 계산기서랍. All rights reserved.
 * 본 저작물의 무단 복제·배포·전송을 금합니다.
 */
document.addEventListener("DOMContentLoaded", function () {
  const wrap = document.createElement("div");
  wrap.className = "fab-wrap";
  wrap.innerHTML =
    '<button type="button" class="fab hide" id="fabTop" title="맨 위로" aria-label="맨 위로">↑</button>' +
    '<button type="button" class="fab search" id="fabSearch" title="계산기 검색" aria-label="계산기 검색">🔍</button>' +
    '<a href="/index.html" class="fab" title="홈으로" aria-label="홈으로">🏠</a>' +
    '<button type="button" class="fab more" id="fabMore" title="더보기" aria-label="더보기">⋮</button>';
  document.body.appendChild(wrap);

  /* ---- 맨 위로 (기존 동작 그대로: 300px 이상 스크롤해야 보임) ---- */
  const topBtn = document.getElementById("fabTop");
  function toggleTop() { topBtn.classList.toggle("hide", window.scrollY < 300); }
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  /* ---- 검색 (기존 동작 그대로) ---- */
  let searchOverlay = null;
  document.getElementById("fabSearch").addEventListener("click", function () {
    if (searchOverlay) return;
    searchOverlay = document.createElement("div");
    searchOverlay.className = "fs-overlay";
    searchOverlay.innerHTML =
      '<div class="fs-card">' +
      '<div class="fs-head"><b>계산기 검색</b><button type="button" class="fs-close" aria-label="닫기">✕</button></div>' +
      '<div class="fs-input-wrap"><span>🔍</span><input type="text" id="fsInput" placeholder="계산기 이름으로 검색" autocomplete="off"></div>' +
      '<div class="fs-results" id="fsResults"></div>' +
      '</div>';
    document.body.appendChild(searchOverlay);
    document.body.style.overflow = "hidden";
    const input = searchOverlay.querySelector("#fsInput");
    const results = searchOverlay.querySelector("#fsResults");
    function render(q) {
      if (!q) { results.innerHTML = '<div class="fs-empty">계산기 이름을 입력해보세요</div>'; return; }
      const list = (window.CALCULATORS || []).filter(c =>
        c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)
      ).slice(0, 20);
      results.innerHTML = list.length === 0
        ? '<div class="fs-empty">일치하는 계산기가 없어요</div>'
        : list.map(c =>
            '<a class="fs-item ' + (c.active ? "" : "disabled") + '" href="' + (c.active ? c.url : "#") + '">' +
            '<span class="fs-emoji">' + c.emoji + '</span>' +
            '<span class="fs-text"><span class="fs-title">' + c.title + (c.active ? "" : " (준비 중)") + '</span>' +
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

  /* ---- 더보기 (신규): 앱 설치 / 최근 본 계산기 / 전체 계산기 ---- */
  let moreOverlay = null;
  function closeMore() { if (moreOverlay) { moreOverlay.remove(); moreOverlay = null; document.body.style.overflow = ""; } }

  function openMoreMain() {
    moreOverlay.querySelector(".mo-body").innerHTML =
      '<button type="button" class="mo-item" id="moInstall">' +
      '<span class="mo-ic">📲</span><span class="mo-text"><b>앱으로 설치하기</b><small>홈 화면・작업표시줄에 추가</small></span></button>' +
      '<div class="mo-divider"></div>' +
      '<button type="button" class="mo-item" id="moRecent">' +
      '<span class="mo-ic">🕘</span><span class="mo-text"><b>최근 본 계산기</b><small>최근에 사용한 계산기 다시 보기</small></span></button>' +
      '<a class="mo-item" href="/index.html#calcGrid">' +
      '<span class="mo-ic">📋</span><span class="mo-text"><b>전체 계산기</b><small>카테고리별로 모아보기</small></span></a>';
    moreOverlay.querySelector("#moInstall").addEventListener("click", function () {
      closeMore();
      if (window.triggerPWAInstall) window.triggerPWAInstall();
    });
    moreOverlay.querySelector("#moRecent").addEventListener("click", openMoreRecent);
  }

  function openMoreRecent() {
    const body = moreOverlay.querySelector(".mo-body");
    body.innerHTML =
      '<button type="button" class="mo-back" id="moBack">← 더보기</button>' +
      '<div id="recentSection"></div>' +
      '<p class="mo-empty-hint" id="moRecentEmpty" style="display:none;">아직 본 계산기가 없어요. 계산기를 사용해보시면 여기에 표시돼요.</p>';
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
      '<div class="fs-head"><b>더보기</b><button type="button" class="fs-close" aria-label="닫기">✕</button></div>' +
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

/* ---- PWA 설치 가능하게 만들기 (manifest/아이콘/테마색을 매 페이지에 JS로 자동 삽입) ---- */
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

/* ---- 앱 설치 트리거 ----
   - Chrome/Edge: 자동 설치 팝업
   - 이미 설치된 경우: 정확한 안내(예전엔 "지원 안 됨"으로 잘못 떴음)
   - iOS / 삼성인터넷: 수동 "홈 화면에 추가" 안내 시트 (자동 설치가 불안정해서 아예 우회) */
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
    } catch (e) { /* 지원 안 하는 브라우저는 무시하고 계속 진행 */ }
    return false;
  }
  window.triggerPWAInstall = async function () {
    if (await isAlreadyInstalled()) {
      alert("이미 CalcLex 앱으로 설치되어 있어요.\n홈 화면이나 앱 목록에서 찾아보세요.");
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; });
      return;
    }
    if (isIOS() || isSamsungInternet()) { showManualInstallSheet(); return; }
    alert("자동 설치 팝업을 찾을 수 없어요.\n브라우저 메뉴에서 '홈 화면에 추가' 또는 '앱 설치'를 직접 선택해주세요.\n(크롬이라면 새로고침 후 다시 시도해보세요.)");
  };
  function showManualInstallSheet() {
    const samsung = isSamsungInternet();
    const steps = samsung
      ? '<li>오른쪽 아래 <b>≡ 메뉴</b> 버튼을 눌러주세요</li><li><b>홈 화면에 추가</b>를 선택해주세요</li><li><b>추가</b>를 누르면 완료돼요</li>'
      : '<li>하단 <b>공유 ⬆️</b> 버튼을 눌러주세요</li><li><b>홈 화면에 추가</b>를 선택해주세요</li><li>오른쪽 위 <b>추가</b>를 누르면 완료돼요</li>';
    const intro = samsung
      ? '삼성인터넷은 자동 설치가 불안정해서, 아래 방법으로 추가해주세요.'
      : 'iOS는 브라우저에서 바로 설치가 안 돼서, 아래 순서대로 해주세요.';
    const el = document.createElement("div");
    el.className = "fs-overlay";
    el.innerHTML =
      '<div class="fs-card"><div class="fs-head"><b>홈 화면에 추가하기</b><button type="button" class="fs-close" aria-label="닫기">✕</button></div>' +
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
