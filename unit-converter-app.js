// 단위변환 계산기 공용 엔진. 모든 unit-*.html 페이지가 이 파일 하나를 공유합니다.
(function(){
  let currentCat = null;
  let currencyRates = null; // {krw:1, usd:.., ...} = 1 KRW 당 각 통화 값
  let currencyDate = null;
  let currencyLoading = false;

  function fmtNum(n){
    if(!isFinite(n)) return '-';
    const rounded = Math.round(n * 1e6) / 1e6;
    return rounded.toLocaleString('ko-KR', { maximumFractionDigits: 6 });
  }

  // ---------- 변환 함수 ----------
  function convertLinear(cat, value, fromKey, toKey){
    const f = cat.units[fromKey].factor, t = cat.units[toKey].factor;
    return value * f / t;
  }
  function convertTemperature(value, fromKey, toKey){
    let c;
    if(fromKey==='C') c = value;
    else if(fromKey==='F') c = (value - 32) * 5/9;
    else c = value - 273.15;
    if(toKey==='C') return c;
    if(toKey==='F') return c * 9/5 + 32;
    return c + 273.15;
  }
  function convertFuel(value, fromKey, toKey){
    let kml;
    if(fromKey==='kml') kml = value;
    else if(fromKey==='l100km') kml = value === 0 ? 0 : 100/value;
    else if(fromKey==='mpgUs') kml = value * 0.425144;
    else kml = value * 0.354006;
    if(toKey==='kml') return kml;
    if(toKey==='l100km') return kml === 0 ? 0 : 100/kml;
    if(toKey==='mpgUs') return kml / 0.425144;
    return kml / 0.354006;
  }
  function convertEv(value, fromKey, toKey){
    // 내부 기준: km/kWh
    let kmkwh;
    if(fromKey==='kmkwh') kmkwh = value;
    else if(fromKey==='whkm') kmkwh = value === 0 ? 0 : 1000/value;
    else if(fromKey==='kwh100km') kmkwh = value === 0 ? 0 : 100/value;
    else if(fromKey==='mikwh') kmkwh = value * 1.609344;
    else kmkwh = value * 1.609344 / 33.705; // MPGe (1 gal 휘발유 = 33.705 kWh)

    if(toKey==='kmkwh') return kmkwh;
    if(toKey==='whkm') return kmkwh === 0 ? 0 : 1000/kmkwh;
    if(toKey==='kwh100km') return kmkwh === 0 ? 0 : 100/kmkwh;
    if(toKey==='mikwh') return kmkwh / 1.609344;
    return kmkwh / 1.609344 * 33.705; // MPGe
  }

  function convertCurrency(value, fromKey, toKey){
    if(!currencyRates) return null;
    const inKrw = value / currencyRates[fromKey];
    return inKrw * currencyRates[toKey];
  }

  async function loadCurrencyRates(){
    if(currencyRates || currencyLoading) return;
    currencyLoading = true;
    const urls = [
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json',
      'https://latest.currency-api.pages.dev/v1/currencies/krw.json'
    ];
    for(const url of urls){
      try{
        const res = await fetch(url);
        const data = await res.json();
        currencyRates = data.krw;
        currencyDate = data.date;
        break;
      }catch(e){ /* try next mirror */ }
    }
    currencyLoading = false;
  }

  // ---------- 렌더링 ----------
  function renderCategoryButton(){
    const cat = UNIT_CATEGORIES[currentCat];
    document.getElementById('ucCatLabel').textContent = `${cat.emoji} ${cat.name}`;
  }

  function renderCatPanel(){
    const panel = document.getElementById('ucCatPanel');
    const ids = Object.keys(UNIT_CATEGORIES).sort((a,b)=>UNIT_CATEGORIES[a].order-UNIT_CATEGORIES[b].order);
    panel.innerHTML = ids.map(id=>{
      const c = UNIT_CATEGORIES[id];
      return `<button type="button" class="uc-cat-item${id===currentCat?' active':''}" data-id="${id}">${c.emoji} ${c.name}</button>`;
    }).join('');
    panel.querySelectorAll('.uc-cat-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        switchCategory(btn.dataset.id);
        panel.classList.remove('open');
      });
    });
  }

  function switchCategory(id){
    currentCat = id;
    renderCategoryButton();
    renderBody();
    document.querySelectorAll('.uc-cat-item').forEach(b=>{
      b.classList.toggle('active', b.dataset.id === id);
    });
  }

  function renderBody(){
    const cat = UNIT_CATEGORIES[currentCat];
    const body = document.getElementById('ucBody');

    if(cat.type === 'table'){
      renderTableUI(cat, body);
      return;
    }

    const unitKeys = Object.keys(cat.units);
    const fromDefault = unitKeys[0];
    const toDefault = unitKeys[1] || unitKeys[0];

    body.innerHTML = `
      <div class="uc-row">
        <div class="uc-field">
          <input type="text" inputmode="decimal" class="uc-input" id="ucFromVal" value="1">
          <select class="uc-select" id="ucFromUnit">
            ${unitKeys.map(k=>`<option value="${k}"${k===fromDefault?' selected':''}>${cat.units[k].label}</option>`).join('')}
          </select>
        </div>
        <button type="button" class="uc-swap" id="ucSwap" title="바꾸기">⇄</button>
        <div class="uc-field">
          <input type="text" class="uc-input uc-output" id="ucToVal" readonly>
          <select class="uc-select" id="ucToUnit">
            ${unitKeys.map(k=>`<option value="${k}"${k===toDefault?' selected':''}>${cat.units[k].label}</option>`).join('')}
          </select>
        </div>
      </div>
      ${cat.type==='currency' ? '<div class="uc-currency-date" id="ucCurrencyDate">환율 불러오는 중…</div>' : ''}
      ${cat.note ? `<div class="uc-note">${cat.note}</div>` : ''}
    `;

    const fromVal = document.getElementById('ucFromVal');
    const fromUnit = document.getElementById('ucFromUnit');
    const toVal = document.getElementById('ucToVal');
    const toUnit = document.getElementById('ucToUnit');

    function doConvert(){
      const v = parseFloat(fromVal.value);
      if(isNaN(v)){ toVal.value = ''; return; }
      let r;
      if(cat.type === 'linear') r = convertLinear(cat, v, fromUnit.value, toUnit.value);
      else if(cat.type === 'temperature') r = convertTemperature(v, fromUnit.value, toUnit.value);
      else if(cat.type === 'fuel') r = convertFuel(v, fromUnit.value, toUnit.value);
      else if(cat.type === 'ev') r = convertEv(v, fromUnit.value, toUnit.value);
      else if(cat.type === 'currency') r = convertCurrency(v, fromUnit.value, toUnit.value);
      toVal.value = (r === null) ? '환율 로딩 중…' : fmtNum(r);
    }

    fromVal.addEventListener('input', doConvert);
    fromUnit.addEventListener('change', doConvert);
    toUnit.addEventListener('change', doConvert);
    document.getElementById('ucSwap').addEventListener('click', ()=>{
      const fu = fromUnit.value, tu = toUnit.value;
      fromUnit.value = tu; toUnit.value = fu;
      doConvert();
    });

    if(cat.type === 'currency'){
      loadCurrencyRates().then(()=>{
        const dateEl = document.getElementById('ucCurrencyDate');
        if(dateEl) dateEl.textContent = currencyRates ? `환율 기준일: ${currencyDate}` : '환율 정보를 불러오지 못했어요. 새로고침 해보세요.';
        doConvert();
      });
    } else {
      doConvert();
    }
  }

  function renderTableUI(cat, body){
    const cols = cat.columns;
    const rows = cat.table;
    body.innerHTML = `
      <div class="uc-table-pick">
        <label class="uc-table-pick-label">${cat.labels[cols[0]]} 선택</label>
        <select class="uc-select uc-table-select" id="ucTableSelect">
          ${rows.map((r,i)=>`<option value="${i}">${r[cols[0]]}</option>`).join('')}
        </select>
      </div>
      <div class="uc-table-result" id="ucTableResult"></div>
      ${cat.note ? `<div class="uc-note">${cat.note}</div>` : ''}
    `;
    const select = document.getElementById('ucTableSelect');
    function renderRow(){
      const row = rows[select.value];
      const resultEl = document.getElementById('ucTableResult');
      resultEl.innerHTML = cols.slice(1).map(c=>`
        <div class="uc-table-cell">
          <div class="uc-table-cell-label">${cat.labels[c]}</div>
          <div class="uc-table-cell-val">${row[c] === null || row[c] === undefined ? '-' : row[c]}</div>
        </div>
      `).join('');
    }
    select.addEventListener('change', renderRow);
    renderRow();
  }

  window.initUnitConverter = function(defaultCategoryId){
    currentCat = defaultCategoryId;
    renderCategoryButton();
    renderCatPanel();
    renderBody();

    document.getElementById('ucCatBtn').addEventListener('click', ()=>{
      document.getElementById('ucCatPanel').classList.toggle('open');
    });
    document.addEventListener('click', (e)=>{
      if(!e.target.closest('.uc-cat-wrap')) document.getElementById('ucCatPanel').classList.remove('open');
    });
  };
})();
