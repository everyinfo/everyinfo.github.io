/*!
 * CalcLex (calclex.com)
 * Copyright (c) 2026 CalcLex. All rights reserved.
 */
!function(){function t(){const t=document.querySelector(".calc-card .card");if(!t||t.querySelector(".top-reset"))return;const e=document.createElement("button");e.type="button",e.className="top-reset",e.title="입력값 새로고침",e.setAttribute("aria-label","입력값 새로고침"),e.textContent="↻",e.addEventListener("click",function(){history.replaceState(null,"",location.pathname),location.reload()}),t.style.position=t.style.position||"relative",t.querySelector(".uc-cat-wrap")&&t.classList.add("has-top-select"),t.appendChild(e)}document.addEventListener("DOMContentLoaded",t);const e=document.getElementById("calcBody");e&&new MutationObserver(t).observe(e,{childList:!0})}();