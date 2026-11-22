/*!
 * CalcLex (calclex.com)
 * Copyright (c) 2026 CalcLex. All rights reserved.
 *
 * 클라이언트 전용 의도 매칭 검색 — 서버·API 비용 없이 문장형 질문을 계산기로 연결합니다.
 * window.CALC_INTENT (calc-intent-data.js) 의 키워드·상황 문장·추천 이유를 점수화합니다.
 */
(function(){
  'use strict';

  var DATA = window.CALC_INTENT || {};
  var LANG = (function(){
    var l = (document.documentElement && document.documentElement.lang || 'ko').toLowerCase();
    return l.indexOf('en') === 0 ? 'en' : 'ko';
  })();

  var STOP = {
    the:1, a:1, an:1, of:1, to:1, for:1, in:1, on:1, at:1, by:1, is:1, are:1, am:1,
    do:1, does:1, did:1, how:1, many:1, much:1, my:1, me:1, i:1, it:1, its:1, and:1,
    with:1, can:1, could:1, what:1, which:1, should:1, need:1, want:1, get:1, from:1,
    if:1, be:1, we:1, you:1, your:1, this:1, that:1, there:1, will:1, would:1, s:1,
    t:1, about:1, into:1, out:1, up:1, down:1, use:1, using:1, find:1, calculate:1,
    calculator:1, compute:1, number:1, numbers:1, value:1
  };
  var KO_STOP = ['어떻게','얼마나','얼마','몇개','몇','무엇','뭐','어디','어떤','인가요','일까',
    '할까','해줘','알려줘','알려','구하기','계산','계산기','좀','수','것','거','때','경우',
    '있는','있어','되나요','돼','나와','나오','인지','건지','거야','하는','한','할','그','저',
    '내','나','제','우리','그리고','하면','해','하는데','싶어','싶다','이렇게','저렇게','좀더'];

  var SUFFIX = ['에서는','에게서','이라고','라고','에서','에게','한테','으로','부터','까지','처럼',
    '보다','이랑','이나','거나','와','과','을','를','이','가','은','는','에','의','도','만','로','랑','야','요','께'];

  function norm(s){
    s = String(s == null ? '' : s).toLowerCase();
    try{ s = s.normalize('NFKC'); }catch(e){}
    return s.replace(/[^\w\u3131-\u318E\uAC00-\uD7A3\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function compact(s){ return norm(s).replace(/\s+/g, ''); }

  function stripParticle(t){
    if(!/^[\uAC00-\uD7A3]+$/.test(t) || t.length < 3) return t;
    for(var i = 0; i < SUFFIX.length; i++){
      var suf = SUFFIX[i];
      if(t.length - suf.length >= 2 && t.slice(-suf.length) === suf) return t.slice(0, -suf.length);
    }
    return t;
  }

  function tokens(s){
    var raw = norm(s).split(' '), out = [], seen = {};
    for(var i = 0; i < raw.length; i++){
      var t = raw[i];
      if(!t) continue;
      if(STOP[t] || KO_STOP.indexOf(t) >= 0) continue;
      t = stripParticle(t);
      if(t.length < 1 || STOP[t] || KO_STOP.indexOf(t) >= 0) continue;
      if(seen[t]) continue;
      seen[t] = 1;
      out.push(t);
    }
    return out;
  }

  function bigrams(s){
    var out = {}, n = s.length, i, g;
    if(n < 2){ if(n === 1) out[s] = 1; return out; }
    for(i = 0; i < n - 1; i++){ g = s.substr(i, 2); out[g] = (out[g] || 0) + 1; }
    return out;
  }
  function dice(a, b){
    if(!a || !b) return 0;
    if(a === b) return 1;
    var A = bigrams(a), B = bigrams(b), inter = 0, na = 0, nb = 0, k;
    for(k in A) na += A[k];
    for(k in B) nb += B[k];
    for(k in A) if(B[k]) inter += Math.min(A[k], B[k]);
    return (2 * inter) / (na + nb) || 0;
  }

  function slugOf(url){
    var parts = String(url || '').split('/');
    return (parts[parts.length - 1] || '').split('?')[0].replace(/\.html$/, '');
  }

  var LATIN = /^[a-z0-9][a-z0-9 .\/\-+]*$/;
  function escRx(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  // 영어 키워드는 단어 경계로 확인한다 (triangle 안의 angle 같은 오검색 방지)
  function latinPresent(k, qn){
    if(qn.indexOf(k) < 0) return false;
    return new RegExp('(^|[^a-z0-9])' + escRx(k) + '([^a-z0-9]|$)').test(qn);
  }

  function scoreEntry(entry, q, qn, qt, calc){
    var score = 0, bestKw = '', bestGain = 0, kws = entry.kw || [], i, k, gained, d;

    for(i = 0; i < kws.length; i++){
      var raw = kws[i];
      k = compact(raw);
      if(!k) continue;
      gained = 0;
      var latin = LATIN.test(k);

      if(q === k){
        gained = 24;
      } else if(latin ? latinPresent(k, qn) : q.indexOf(k) >= 0){
        gained = 7 + Math.min(9, k.length * 1.05);
        if(k.length >= 4) gained += 2;
      } else if(!latin && k.indexOf(q) >= 0 && q.length >= 2){
        gained = 5 + Math.min(6, q.length * 0.8);
      } else if(qt.length){
        for(var j = 0; j < qt.length; j++){
          var t = qt[j];
          if(t.length >= 2 && (k.indexOf(t) >= 0 || t.indexOf(k) >= 0)){
            gained = Math.max(gained, 4 + Math.min(4, t.length));
            break;
          }
        }
        if(!gained && q.length >= 4 && k.length >= 3){
          d = dice(q, k);
          if(d >= 0.62) gained = 4 + 6 * d;
        }
      }

      if(gained){
        score += gained;
        if(gained > bestGain || (gained === bestGain && k.length < compact(bestKw).length)){
          bestKw = raw; bestGain = gained;
        }
      }
    }

    var sits = (entry[LANG] && entry[LANG].s) || [];
    for(i = 0; i < sits.length; i++){
      var sc = compact(sits[i]);
      if(!sc) continue;
      if(q.indexOf(sc) >= 0) score += 10;
      else {
        d = dice(q, sc);
        if(d >= 0.55) score += 9 * d;
      }
    }

    var tc = compact(calc.title || ''), dc = compact(calc.desc || '');
    if(q.length >= 2 && tc.indexOf(q) >= 0) score += 16;
    else if(q.length >= 3 && dc.indexOf(q) >= 0) score += 7;

    return { score: score, matched: bestKw };
  }

  function reasonFor(entry, matched){
    var base = (entry[LANG] && entry[LANG].r) || entry.reason || '';
    var m = matched && compact(matched).length <= 24 ? matched : '';
    if(LANG === 'en'){
      return (m ? 'Matched \u201C' + m + '\u201D \u2014 ' : 'Why this one \u2014 ') + base;
    }
    return (m ? '\u2018' + m + '\u2019 \uAD00\uB828 \u2014 ' : '\uCD94\uCC9C \u2014 ') + base;
  }

  window.calcIntentSearch = function(query, calcs){
    var q = compact(query);
    if(!q || q.length < 2) return [];
    var list = (calcs || window.CALCULATORS || []).slice();
    // 이 언어에 페이지가 없는 계산기는 link 로만 연결한다 (예: 영어 페이지에서 국내 연봉 계산기)
    Object.keys(DATA).forEach(function(key){
      var e = DATA[key];
      if(!e || !e.link) return;
      if(list.some(function(x){ return x && x.url === e.link.url; })) return;
      list.push({ url: e.link.url, title: e.link.title || e.link.url, desc: e.link.desc || '', emoji: e.link.emoji || '', active: true, linked: true });
    });
    var qn = norm(query);
    var qt = tokens(query);
    var hits = [];

    for(var i = 0; i < list.length; i++){
      var c = list[i];
      if(!c || c.active === false) continue;
      var slug = slugOf(c.url);
      var entry = DATA[slug] || DATA[slug + '.html'];
      if(!entry) continue;
      var r = scoreEntry(entry, q, qn, qt, c);
      if(r.score >= 10) hits.push({ calc: c, score: r.score, reason: reasonFor(entry, r.matched) });
    }

    hits.sort(function(a, b){ return b.score - a.score; });
    return hits.slice(0, 3);
  };

  window.calcIntentLang = function(){ return LANG; };
})();
