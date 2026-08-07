// 계산기 페이지 하단 - 연관 계산기 / 인기 계산기 가로 스크롤 섹션
// 사용법: <div id="relatedSections"></div> 를 두고, renderRelatedSections('현재 계산기 URL') 호출
(function(){

  function cardHtml(c){
    return `
      <a class="rel-card${c.active ? '' : ' disabled'}" href="${c.active ? c.url : '#'}">
        <span class="rel-emoji">${c.emoji}</span>
        <span class="rel-cat">${c.cat}</span>
        <span class="rel-title">${c.title}</span>
      </a>
    `;
  }

  function sectionHtml(title, items){
    if(items.length === 0) return '';
    return `
      <div class="rel-section">
        <h2 class="rel-heading">${title}</h2>
        <div class="rel-scroll">${items.map(cardHtml).join('')}</div>
      </div>
    `;
  }

  window.renderRelatedSections = function(currentUrl){
    const wrap = document.getElementById('relatedSections');
    if(!wrap || !window.CALCULATORS) return;

    const all = window.CALCULATORS;
    const current = all.find(c => c.url === currentUrl);
    const currentCat = current ? current.cat : null;

    // 연관 계산기: 같은 카테고리 우선, 부족하면 다른 카테고리에서 채움 (최대 10개)
    const sameCat = all.filter(c => c.url !== currentUrl && c.cat === currentCat);
    const otherCat = all.filter(c => c.url !== currentUrl && c.cat !== currentCat);
    const related = sameCat.concat(otherCat).slice(0, 10);

    // 인기 계산기: 방문수 기준 상위 10개 (방문 데이터 없으면 섹션 자체를 생략)
    const popular = all
      .filter(c => c.url !== currentUrl && c.active && c.visits > 0)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    wrap.innerHTML =
      sectionHtml('🔗 연관 계산기', related) +
      sectionHtml('🔥 인기 계산기', popular);
  };
})();
