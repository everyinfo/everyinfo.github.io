/*!
 * 계산기서랍 (calclex.com)
 * Copyright (c) 2026 계산기서랍. All rights reserved.
 */
document.addEventListener("DOMContentLoaded",function(){const e=document.createElement("div");e.className="fab-wrap",e.innerHTML='<button type="button" class="fab hide" id="fabTop" title="맨 위로" aria-label="맨 위로">↑</button><a href="/index.html" class="fab" title="홈으로" aria-label="홈으로">🏠</a>',document.body.appendChild(e);const t=document.getElementById("fabTop");function n(){t.classList.toggle("hide",window.scrollY<300)}t.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"})),window.addEventListener("scroll",n,{passive:!0}),n()});