/* ============================================================
   나고야 뚜벅이 노선도 — 화면 렌더
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const esc = (s) => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const tel = (t) => String(t).replace(/(0\d{1,3}-\d{2,4}-\d{4})/g, '<a class="tel" href="tel:$1">📞 $1</a>');
  const gmap = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  const gdir = (from, to, mode) => 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(from) +
    '&destination=' + encodeURIComponent(to) + '&travelmode=' + (mode || 'transit');

  const MODEV = { yellow: '--yellow-line', purple: '--purple-line', red: '--red-line', bus: '--bus-line', jr: '--jr-line', walk: '--walk' };
  const MODEL = { yellow: '노란선 히가시야마', purple: '보라선 메이조·메이코', red: '메이테츠 · 뮤스카이', bus: '고속버스', jr: 'JR', walk: '도보' };
  const RAILN = {
    yellow: ['히가시야마선'], purple: ['메이조선', '메이코선'],
    red: ['뮤스카이', '이누야마선', '공항선', '도코나메선', '나고야본선'], jr: ['JR']
  };
  const HUBS = ['카나야마', '메이테츠 나고야', '나고야', '사카에'];
  const START = new Date(2026, 9, 21);

  const P = COORDS.P, S = COORDS.S;
  const llOf = (st) => (st.q && P[st.q]) || null;
  function nodeLL(token, st) {
    if (!token) return null;
    if (S[token]) return S[token];
    if (P[token]) return P[token];
    const me = llOf(st);
    if (me && (st.name.indexOf(token) >= 0 || token.indexOf(st.name) >= 0)) return me;
    return null;
  }

  /* ---------- 지도 ---------- */
  const mapbox = $('#mapbox'), cv = $('#cv'), pinsEl = $('#pins'), msgEl = $('#mapmsg');
  const map = new MiniMap.Map(cv, mapbox, BASEMAP, {
    top: $('#cvTop'),
    onView: () => placePins(),
    onTileState: (ok) => {
      mapbox.classList.toggle('tiles', ok);
      mapbox.classList.toggle('osmtiles', map.style === 'osm');
      msgEl.hidden = ok;
      if (!ok) msgEl.innerHTML = '타일 서버를 못 불러와서 <b>내장 OSM 벡터 지도</b>로 그렸어 — 노선·물·공원은 실제 좌표야.';
      setAttr(ok);
    }
  });

  let dayIdx = 0, stopIdx = -1, mePin = null, meLL = null;

  /* ---------- 한글 라벨: 우리가 쓰는 역 + 동네 ---------- */
  const ST_LABELS = [
    ['사카에', '--purple-line'], ['나고야', '--yellow-line'], ['야바초', '--purple-line'],
    ['카미마에즈', '--purple-line'], ['카나야마', '--purple-line'], ['나고야조', '--purple-line'],
    ['후시미', '--yellow-line'], ['카메지마', '--yellow-line'], ['히가시야마코엔', '--yellow-line'],
    ['산노', '--red-line'], ['나고야코', '--purple-line'], ['이누야마', '--red-line']
  ];
  const AREAS = [
    ['오스 상점가', 35.1588, 136.9008], ['니시키 밤거리', 35.1716, 136.9048],
    ['나고야역 서쪽', 35.1700, 136.8785], ['히사야오도리', 35.1745, 136.9088],
    ['시라카와고 마을', 36.2585, 136.9048], ['이누야마 성하마을', 35.3856, 136.9412]
  ];
  map.labels = ST_LABELS.filter(x => S[x[0]]).map(x => ({ ll: S[x[0]], t: x[0], k: 'st', c: x[1] }))
    .concat(AREAS.map(x => ({ ll: [x[1], x[2]], t: x[0], k: 'area' })));

  const JP = {
    '사카에': '栄駅 名古屋', '나고야': '名古屋駅', '야바초': '矢場町駅', '카미마에즈': '上前津駅',
    '카나야마': '金山駅 名古屋', '나고야조': '名古屋城駅', '후시미': '伏見駅 名古屋', '카메지마': '亀島駅',
    '히가시야마코엔': '東山公園駅', '산노': '山王駅 名鉄', '나고야코': '名古屋港駅', '이누야마': '犬山駅',
    '오스 상점가': '大須商店街', '니시키 밤거리': '名古屋市中区錦三丁目', '나고야역 서쪽': '名古屋駅 太閤通口',
    '히사야오도리': '久屋大通公園', '시라카와고 마을': '白川郷', '이누야마 성하마을': '犬山城下町'
  };
  function setAttr(ok) {
    const osm = '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> 기여자';
    $('#attr').innerHTML = !ok ? ('OSM 데이터 내장 · © ' + osm)
      : map.style === 'osm' ? ('지도 © ' + osm)
      : ('지도 © ' + osm + ' · 타일 © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>');
  }

  /* ---------- 하루 동선 → 지도 선 ---------- */
  function dayOverlay(day) {
    const segs = [], seen = new Set();
    for (const st of day.stops) {
      if (!st.route) continue;
      const r = st.route;
      for (let i = 1; i < r.length; i += 2) {
        const parts = String(r[i]).split('|');
        const mode = parts[1] || 'walk';
        const A = nodeLL(r[i - 1], st), B = nodeLL(r[i + 1], st);
        if (!A || !B || (A[0] === B[0] && A[1] === B[1])) continue;
        const key = mode + A.join() + B.join();
        if (seen.has(key)) continue;
        seen.add(key);
        let pts = null;
        if (RAILN[mode]) pts = map.railPath(RAILN[mode], A, B, HUBS.map(h => S[h]).filter(Boolean));
        if (pts && pts.length > 1) {
          segs.push({ pts, v: MODEV[mode], dash: false });
          segs.push({ pts: [A, pts[0]], v: '--walk', dash: true });
          segs.push({ pts: [pts[pts.length - 1], B], v: '--walk', dash: true });
        } else {
          segs.push({ pts: [A, B], v: MODEV[mode] || '--walk', dash: mode === 'walk' || mode === 'bus' || !RAILN[mode] });
        }
      }
    }
    return segs;
  }

  /* ---------- 핀 ---------- */
  let pinData = [];
  function buildPins(day) {
    pinsEl.innerHTML = '';
    pinData = [];
    day.stops.forEach((st, i) => {
      const ll = llOf(st);
      if (!ll) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pin' + (st.home ? ' home' : '') + (st.opt ? ' opt' : '');
      b.textContent = String(i + 1);
      b.setAttribute('aria-label', (i + 1) + '. ' + st.name);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const me = pinData.find(p => p.el === b);
        if (me && me.gz) { map.zoomTo(map.z + 1.7, me.gz[0], me.gz[1]); placePins(); return; }
        selectStop(i, true);
      });
      pinsEl.appendChild(b);
      pinData.push({ el: b, ll, i });
    });
    if (mePin) pinsEl.appendChild(mePin);
    placePins();
    map.draw();
  }
  function subPins(st) {
    if (!st || !st.subs) return;
    st.subs.forEach((s) => {
      const ll = s.q && P[s.q];
      if (!ll) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pin sub';
      b.textContent = '·';
      b.title = s.n;
      b.setAttribute('aria-label', s.n);
      b.addEventListener('click', (e) => { e.stopPropagation(); window.open(gmap(s.q), '_blank', 'noopener'); });
      pinsEl.appendChild(b);
      pinData.push({ el: b, ll, sub: true });
    });
  }
  function placePins() {
    const pad = 6;
    map.avoid = pinData.map(p => [p.ll[0], p.ll[1], p.sub ? 10 : 17]);
    /* 1) 화면 좌표 계산 + 화면 밖 숨김 */
    const vis = [];
    for (const p of pinData) {
      const xy = map.project(p.ll[0], p.ll[1]);
      const on = xy[0] > -pad && xy[0] < map.w + pad && xy[1] > -pad && xy[1] < map.h + pad;
      p.el.style.display = on ? '' : 'none';
      p.el.classList.remove('grouped');
      p.el.removeAttribute('data-more');
      p.gz = null;
      if (on) { p.x = xy[0]; p.y = xy[1]; vis.push(p); }
    }
    /* 2) 가까운 핀은 하나로 묶어서 보여준다 (탭하면 확대) */
    const groups = [];
    for (const p of vis) {
      const near = groups.find(g => Math.hypot(g.x - p.x, g.y - p.y) < (p.sub || g.sub ? 15 : 27));
      if (near) { near.m.push(p); near.sub = near.sub && p.sub; }
      else groups.push({ x: p.x, y: p.y, m: [p], sub: !!p.sub });
    }
    /* 3) 대표 핀만 남기고, 겹친 서브 핀은 살짝 밀어서 표시 */
    for (const g of groups) {
      const sel = g.m.find(p => !p.sub && p.i === stopIdx);
      const rep = sel || g.m.find(p => !p.sub) || g.m[0];
      const rest = g.m.filter(p => p !== rep);
      rep.el.style.left = g.x + 'px'; rep.el.style.top = g.y + 'px';
      const hidden = rest.filter(p => !p.sub).length;
      if (hidden > 0) {
        rep.el.classList.add('grouped');
        rep.el.setAttribute('data-more', '+' + hidden);
        rep.gz = [g.x, g.y];
        rep.el.setAttribute('aria-label', '이 자리에 ' + g.m.length + '곳 — 눌러서 확대');
      }
      for (const p of rest) {
        if (p.sub) { /* 서브 핀은 작으니 6px만 밀어서 남겨둔다 */
          p.el.style.left = (g.x + 9) + 'px'; p.el.style.top = (g.y + 9) + 'px';
        } else p.el.style.display = 'none';
      }
    }
    if (mePin && meLL) {
      const xy = map.project(meLL[0], meLL[1]);
      mePin.style.left = xy[0] + 'px'; mePin.style.top = xy[1] + 'px';
    }
  }

  /* ---------- 탭 ---------- */
  const tabsEl = $('#tabs');
  function renderTabs() {
    tabsEl.innerHTML = '';
    DAYS.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.role = 'tab';
      b.setAttribute('aria-selected', i === dayIdx && dayIdx >= 0 ? 'true' : 'false');
      b.innerHTML = '<span class="n">D' + d.d + '</span><span class="ic">' + d.icon + '</span><span class="wd">' + esc(d.date) + '</span>';
      b.addEventListener('click', () => selectDay(i));
      tabsEl.appendChild(b);
    });
    const inf = document.createElement('button');
    inf.type = 'button'; inf.className = 'tab info-tab'; inf.role = 'tab';
    inf.setAttribute('aria-selected', dayIdx < 0 ? 'true' : 'false');
    inf.innerHTML = '<span class="ic">🧷</span><span>기본 정보</span>';
    inf.addEventListener('click', () => selectDay(-1));
    tabsEl.appendChild(inf);
  }

  /* ---------- 하루 렌더 ---------- */
  const main = $('#main'), infoPane = $('#infoPane'), app = $('.app');
  function chipsFor(st) {
    const out = [];
    if (st.cat) out.push('<span class="chip cat">' + esc(st.cat) + '</span>');
    const modes = new Set();
    (st.route || []).forEach((t, i) => { if (i % 2 === 1) { const m = String(t).split('|')[1]; if (m) modes.add(m); } });
    modes.forEach(m => out.push('<span class="chip c-' + m + '">' + (MODEL[m] || m).split(' ')[0] + '</span>'));
    return out.join('');
  }
  function routeHTML(r) {
    let h = '<div class="route">';
    r.forEach((t, i) => {
      if (i % 2 === 0) h += '<span class="rp">' + esc(t) + '</span>';
      else {
        const p = String(t).split('|');
        h += '<span class="rm m-' + (p[1] || 'walk') + '"><i></i>' + esc(p[0]) + '</span>';
      }
    });
    return h + '</div>';
  }
  function detailHTML(st, prev) {
    let h = '<div class="det">';
    if (st.route) h += '<div class="sec"><span class="lb">가는 길</span>' + routeHTML(st.route) + '</div>';
    if (st.warn) h += '<div class="sec"><div class="callout"><span aria-hidden="true">⚠️</span><span><b>주의</b> ' + tel(st.warn) + '</span></div></div>';
    if (st.facts) {
      h += '<div class="sec"><span class="lb">정보</span><dl class="facts">';
      st.facts.forEach(f => { h += '<dt>' + esc(f[0]) + '</dt><dd>' + tel(f[1]) + '</dd>'; });
      h += '</dl></div>';
    }
    if (st.subs) {
      h += '<div class="sec"><span class="lb">안에서 들를 곳</span><ul class="subs">';
      st.subs.forEach(s => {
        h += '<li' + (s.star ? ' class="star"' : '') + '><div class="sn">' + esc(s.n) + (s.star ? '<span class="sub-n">핵심</span>' : '') + '</div>' +
          '<div class="sj ja">' + esc(s.j || '') + '</div><div class="sd">' + tel(s.d || '') + '</div>' +
          (s.q ? '<div class="acts" style="margin-top:8px"><a class="gmap ghost" href="' + gmap(s.q) + '" target="_blank" rel="noopener">구글맵 <span class="ar">↗</span></a></div>' : '') + '</li>';
      });
      h += '</ul></div>';
    }
    if (st.tips) {
      h += '<div class="sec"><span class="lb">팁</span><ul class="tips">';
      st.tips.forEach(t => h += '<li>' + tel(t) + '</li>');
      h += '</ul></div>';
    }
    if (st.alts) {
      h += '<div class="sec"><span class="lb alt">밀렸을 때 — 플랜 B</span><ol class="alts">';
      st.alts.forEach(t => h += '<li>' + tel(t) + '</li>');
      h += '</ol></div>';
    }
    if (st.q) {
      const modes = new Set();
      (st.route || []).forEach((t, i) => { if (i % 2 === 1) { const m = String(t).split('|')[1]; if (m) modes.add(m); } });
      const tm = (modes.size === 1 && modes.has('walk')) ? 'walking' : 'transit';
      const from = prev && prev.q;
      h += '<div class="sec"><div class="acts">' +
        '<a class="gmap" href="' + gmap(st.q) + '" target="_blank" rel="noopener">구글맵에서 열기 <span class="ar">↗</span></a>' +
        (from ? '<a class="gmap ghost" href="' + gdir(from, st.q, tm) + '" target="_blank" rel="noopener">여기까지 길찾기 <span class="ar">↗</span></a>' : '') +
        '<button type="button" class="gmap ghost js-showmap">지도에서 보기 🗺</button>' +
        '</div></div>';
    }
    return h + '</div>';
  }
  function renderDay(i) {
    const d = DAYS[i];
    main.innerHTML = '';
    const head = document.createElement('section');
    head.className = 'card dayhead';
    head.innerHTML = '<span class="eb">Day ' + d.d + ' · ' + esc(d.date) + '</span><h2>' + esc(d.theme) + '</h2>' +
      (d.spend ? '<p class="spend">' + esc(d.spend) + '</p>' : '') +
      (d.keys ? '<div class="keys">' + d.keys.map(k => '<div class="key"><b>' + esc(k[0]) + '</b><span>' + tel(k[1]) + '</span></div>').join('') + '</div>' : '');
    main.appendChild(head);

    const list = document.createElement('section');
    list.className = 'card';
    const ol = document.createElement('ol');
    ol.className = 'tl';
    d.stops.forEach((st, si) => {
      const li = document.createElement('li');
      const prev = si > 0 ? d.stops[si - 1] : null;
      const cls = ['stopbtn', st.home ? 'home' : '', st.opt ? 'opt' : '', st.transit ? 'transit' : ''].filter(Boolean).join(' ');
      li.innerHTML = '<button type="button" class="' + cls + '" aria-expanded="false">' +
        '<span class="tm">' + esc(st.t) + '</span>' +
        '<span class="bd">' + (st.transit ? '↓' : (si + 1)) + '</span>' +
        '<span><span class="nm">' + esc(st.name) + (st.home ? '<span class="badge-home">🏨 베이스</span>' : '') + '</span>' +
        (st.ja ? '<span class="jp">' + esc(st.ja) + '</span>' : '') +
        (st.note ? '<span class="nt">' + tel(st.note) + '</span>' : '') +
        '<span class="cv">' + chipsFor(st) + '</span></span>' +
        '<span class="caret" aria-hidden="true">▾</span></button>' +
        '<div class="detwrap" hidden>' + detailHTML(st, prev) + '</div>';
      const btn = li.querySelector('.stopbtn');
      btn.addEventListener('click', () => selectStop(si, false));
      const smap = li.querySelector('.js-showmap');
      if (smap) smap.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const ll = llOf(st);
        setFull(true);
        if (ll) map.setView(ll[0], ll[1], Math.max(map.z, 16));
        stopIdx = si;
        pinData.forEach(p => p.el.classList.toggle('sel', p.i === si));
        placePins();
        showSheet(st);
      });
      ol.appendChild(li);
    });
    list.appendChild(ol);
    main.appendChild(list);

    if (d.drop) {
      const dr = document.createElement('section');
      dr.className = 'card drop';
      dr.innerHTML = '<span class="lb">밀리면 이 순서로 버려</span><p>' + tel(d.drop) + '</p>';
      main.appendChild(dr);
    }

    /* 지도 */
    $('#mapTitle').textContent = 'Day ' + d.d + ' 동선 · ' + d.theme;
    map.overlay = dayOverlay(d);
    buildPins(d);
    fitDay(d, false);
    renderLegend(d, farCount(d) > 0);
  }
  /* 시내 클러스터에서 멀리 떨어진 지점(공항·시라카와고 등) 수 */
  const KM = (a, b) => Math.hypot((a[0] - b[0]) * 111.3, (a[1] - b[1]) * 91.2);
  const FITPAD = { t: 48, r: 56, b: 38, l: 34 };
  function cluster(d) {
    const pts = d.stops.map(llOf).filter(Boolean);
    if (pts.length < 3) return { core: pts, far: [] };
    const mid = (arr) => arr.slice().sort((x, y) => x - y)[Math.floor(arr.length / 2)];
    const c = [mid(pts.map(p => p[0])), mid(pts.map(p => p[1]))];
    const core = pts.filter(p => KM(p, c) < 5), far = pts.filter(p => KM(p, c) >= 5);
    return { core: core.length > 1 ? core : pts, far };
  }
  function farCount(d) { return cluster(d).far.length; }
  function fitDay(d, all) {
    const pts = d.stops.map(llOf).filter(Boolean);
    map.fit(all ? pts : cluster(d).core, FITPAD);
  }

  function renderLegend(d, hasFar) {
    const modes = new Set();
    d.stops.forEach(st => (st.route || []).forEach((t, i) => { if (i % 2 === 1) { const m = String(t).split('|')[1]; if (m) modes.add(m); } }));
    let h = '';
    ['yellow', 'purple', 'red', 'bus', 'walk'].forEach(m => {
      if (!modes.has(m)) return;
      h += '<span class="lg l-' + m[0] + '"><i></i>' + MODEL[m] + '</span>';
    });
    h += '<span class="lg l-h"><i></i>🏨 호텔</span>';
    if (hasFar) h += '<span class="lg" style="color:var(--muted)">⤢ 전체 = 공항·근교까지</span>';
    $('#legend').innerHTML = h;
  }

  function selectStop(si, fromPin) {
    const d = DAYS[dayIdx];
    const items = main.querySelectorAll('.tl > li');
    items.forEach((li, i) => {
      const btn = li.querySelector('.stopbtn'), wrap = li.querySelector('.detwrap');
      const on = i === si && !(stopIdx === si && !fromPin);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      btn.classList.toggle('sel', on);
      wrap.hidden = !on;
    });
    const closing = stopIdx === si && !fromPin;
    stopIdx = closing ? -1 : si;
    if (closing) fsheet.hidden = true;
    pinData.forEach(p => p.el.classList.toggle('sel', !closing && p.i === si));
    if (!closing) {
      const st = d.stops[si], ll = llOf(st);
      /* 서브 핀 갱신 */
      pinData = pinData.filter(p => { if (p.sub) { p.el.remove(); return false; } return true; });
      subPins(st);
      if (ll) map.setView(ll[0], ll[1], Math.max(map.z, 15.4));
      placePins();
      if (fromPin) {
        if (isFull()) showSheet(st);
        else scrollToStop(si);
      } else if (isFull()) showSheet(st);
    }
  }

  function selectDay(i) {
    dayIdx = i; stopIdx = -1;
    renderTabs();
    if (i < 0) {
      main.hidden = true; infoPane.hidden = false;
      app.classList.add('info-mode');
      infoPane.innerHTML = tel(INFO);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    main.hidden = false; infoPane.hidden = true;
    app.classList.remove('info-mode');
    fitAll = false;
    $('#btnFit').setAttribute('aria-pressed', 'false');
    renderDay(i);
    if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' });
    fabSync();
    requestAnimationFrame(() => map.resize());
  }

  /* 지도 위의 역·동네 점을 누르면 그 자리로 이동 */
  map.onTap = (x, y) => {
    const L = map.hitLabel(x, y);
    if (!L) return;
    map.setView(L.ll[0], L.ll[1], Math.max(map.z, L.k === 'st' ? 15.6 : 15));
    placePins();
    const q = (L.k === 'st' ? L.t + '역 나고야' : L.t);
    const href = meLL ? gdir(meLL[0] + ',' + meLL[1], JP[L.t] || q, 'transit') : gmap(JP[L.t] || q);
    sheet((L.k === 'st' ? '🚇 ' : '📍 ') + L.t, href, '닫기', () => { fsheet.hidden = true; }, L.ll);
  };

  /* ---------- 컨트롤 ---------- */
  let fitAll = false;
  $('#btnFit').addEventListener('click', (e) => {
    if (!DAYS[dayIdx]) return;
    fitAll = !fitAll;
    e.currentTarget.setAttribute('aria-pressed', fitAll ? 'true' : 'false');
    fitDay(DAYS[dayIdx], fitAll);
  });
  $('#btnIn').addEventListener('click', () => map.zoomTo(map.z + 1));
  $('#btnOut').addEventListener('click', () => map.zoomTo(map.z - 1));
  const fsheet = $('#fsheet');
  function setFull(on) {
    document.body.classList.toggle('full', on);
    $('#btnFull').setAttribute('aria-pressed', on ? 'true' : 'false');
    $('#btnFull').firstChild.textContent = on ? '✕' : '⛶';
    $('#btnFull').querySelector('.lbl').textContent = on ? '닫기' : '크게';
    if (!on) fsheet.hidden = true;
    requestAnimationFrame(() => { map.resize(); placePins(); fabSync(); });
  }
  const isFull = () => document.body.classList.contains('full');
  $('#btnFull').addEventListener('click', () => setFull(!isFull()));
  $('#fab').addEventListener('click', () => setFull(true));

  /* 지도가 화면에서 벗어나면 떠 있는 '지도' 버튼을 보여준다 */
  const fabSync = () => {
    const r = $('#mapwrap').getBoundingClientRect();
    const away = r.bottom < 64;
    $('#fab').classList.toggle('show', !isFull() && dayIdx >= 0 && away);
    if (away && !isFull()) fsheet.hidden = true;
  };
  window.addEventListener('scroll', fabSync, { passive: true });
  window.addEventListener('resize', fabSync);
  function scrollToStop(si) {
    const li = main.querySelectorAll('.tl > li')[si];
    if (!li) return;
    const off = $('.hd').offsetHeight + $('#tabs').offsetHeight + 8;
    window.scrollTo({ top: Math.max(0, li.getBoundingClientRect().top + window.scrollY - off), behavior: 'smooth' });
  }
  const M = (a, b) => {
    const R = 6371000, d1 = (b[0] - a[0]) * Math.PI / 180, d2 = (b[1] - a[1]) * Math.PI / 180;
    const x = Math.sin(d1 / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(d2 / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(x)));
  };
  const dist = (ll) => {
    if (!meLL || !ll) return '';
    const m = M(meLL, ll);
    return ' · 내 위치에서 ' + (m > 1200 ? (m / 1000).toFixed(1) + 'km' : m + 'm');
  };
  let sheetAct = null;
  $('#fsheetX').addEventListener('click', () => { if (sheetAct) sheetAct(); });
  function sheet(title, href, actLabel, act, ll) {
    fsheet.hidden = false;
    $('#fsheetT').textContent = title + dist(ll);
    const g = $('#fsheetG');
    if (href) { g.hidden = false; g.href = href; g.textContent = meLL ? '내 위치 → 길찾기 ↗' : '구글맵 ↗'; } else g.hidden = true;
    $('#fsheetX').textContent = actLabel;
    sheetAct = act;
  }
  function showSheet(st) {
    if (!isFull()) { fsheet.hidden = true; return; }
    const ll = llOf(st);
    const href = st.q ? (meLL ? gdir(meLL[0] + ',' + meLL[1], st.q, 'transit') : gmap(st.q)) : '';
    sheet(st.t + ' · ' + st.name, href, '일정 보기', () => { const si = stopIdx; setFull(false); if (si >= 0) scrollToStop(si); }, ll);
  }
  $('#btnHide').addEventListener('click', (e) => {
    const w = $('#mapwrap');
    w.classList.toggle('hid');
    const hid = w.classList.contains('hid');
    e.currentTarget.querySelector('.lbl').textContent = hid ? '지도' : '접기';
    e.currentTarget.firstChild.textContent = hid ? '▸' : '▾';
    if (!hid) requestAnimationFrame(() => { map.resize(); placePins(); });
  });
  $('#btnStyle').addEventListener('click', (e) => {
    const to = map.style === 'clean' ? 'osm' : 'clean';
    map.setStyle(to);
    mapbox.classList.toggle('osmtiles', to === 'osm');
    e.currentTarget.setAttribute('aria-pressed', to === 'osm' ? 'true' : 'false');
    e.currentTarget.querySelector('.lbl').textContent = to === 'osm' ? '깔끔' : '상세';
    e.currentTarget.firstChild.textContent = to === 'osm' ? '🇯🇵' : '🗺';
    setAttr(map.tileMode);
    placePins();
  });
  let geoWatch = null, geoFirst = true;
  const baseMsg = () => { msgEl.hidden = map.tileMode; if (!map.tileMode) msgEl.innerHTML = '타일 서버를 못 불러와서 <b>내장 OSM 벡터 지도</b>로 그렸어 — 노선·물·공원은 실제 좌표야.'; };
  const tellMsg = (t) => { msgEl.hidden = false; msgEl.innerHTML = t; };
  function geoStop() {
    if (geoWatch != null && navigator.geolocation) navigator.geolocation.clearWatch(geoWatch);
    geoWatch = null; geoFirst = true; meLL = null; map.me = null;
    if (mePin) { mePin.remove(); mePin = null; }
    $('#btnGeo').setAttribute('aria-pressed', 'false');
    $('#btnGeo').querySelector('.lbl').textContent = '내 위치';
    baseMsg(); map.draw();
  }
  function geoStart() {
    if (!navigator.geolocation) { tellMsg('이 브라우저에선 위치를 쓸 수 없어.'); return; }
    $('#btnGeo').setAttribute('aria-pressed', 'true');
    $('#btnGeo').querySelector('.lbl').textContent = '위치 ON';
    tellMsg('내 위치 찾는 중…');
    geoWatch = navigator.geolocation.watchPosition((pos) => {
      meLL = [pos.coords.latitude, pos.coords.longitude];
      map.me = { ll: meLL, acc: pos.coords.accuracy || 0 };
      if (!mePin) {
        mePin = document.createElement('div');
        mePin.className = 'pin me';
        mePin.title = '내 위치';
      }
      if (!mePin.parentNode) pinsEl.appendChild(mePin);
      if (geoFirst) {
        geoFirst = false;
        map.setView(meLL[0], meLL[1], Math.max(map.z, 15.4));
        baseMsg();
      }
      placePins(); map.draw();
    }, (err) => {
      const why = err && err.code === 1 ? '위치 권한이 거부됐어 — 설정에서 이 사이트의 위치 접근을 허용해줘.'
        : err && err.code === 3 ? '위치를 찾는 데 시간이 너무 걸려. 실외에서 다시 눌러줘.'
        : '위치를 못 가져왔어.';
      tellMsg(why);
      geoStop();
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 4000 });
  }
  const GEOKEY = 'nagoya-geo';
  $('#btnGeo').addEventListener('click', () => {
    if (geoWatch == null) { geoStart(); try { localStorage.setItem(GEOKEY, '1'); } catch (e) {} }
    else { geoStop(); try { localStorage.removeItem(GEOKEY); } catch (e) {} }
  });
  /* 한 번 켰으면 다음에 열 때 알아서 다시 켠다 (처음엔 권한 창을 띄우지 않음) */
  try { if (localStorage.getItem(GEOKEY) === '1') setTimeout(geoStart, 600); } catch (e) {}

  /* ---------- 카운트다운 · 첫 화면 ---------- */
  (function boot() {
    const now = new Date();
    const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((START - day0) / 86400000);
    const el = $('#dcount');
    let start = 0;
    if (diff > 0) el.textContent = 'D-' + diff;
    else if (diff <= 0 && diff > -5) { el.textContent = 'Day ' + (1 - diff) + ' 진행 중'; start = -diff; }
    else el.textContent = '여행 완료 🍁';
    renderTabs();
    selectDay(Math.min(DAYS.length - 1, start));
  })();
})();
