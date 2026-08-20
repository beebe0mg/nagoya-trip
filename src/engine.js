/* ============================================================
   미니 슬리피 맵 — OpenStreetMap 타일(가능할 때) + 내장 OSM 벡터(항상)
   외부 라이브러리 0개. 캔버스 렌더 + DOM 핀 오버레이.
   ============================================================ */
const MiniMap = (() => {
  const TS = 256, D2R = Math.PI / 180;
  const px = (lng) => (lng + 180) / 360 * TS;
  const py = (lat) => {
    const s = Math.min(0.9999, Math.max(-0.9999, Math.sin(lat * D2R)));
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TS;
  };
  const unpx = (x) => x / TS * 360 - 180;
  const unpy = (y) => {
    const n = Math.PI - 2 * Math.PI * y / TS;
    return Math.atan(Math.sinh(n)) / D2R;
  };
  /* google encoded polyline → [[lat,lng],…] */
  function decode(str) {
    const out = []; let i = 0, lat = 0, lng = 0;
    while (i < str.length) {
      let r = 0, sh = 0, b;
      do { b = str.charCodeAt(i++) - 63; r |= (b & 0x1f) << sh; sh += 5; } while (b >= 0x20);
      lat += (r & 1) ? ~(r >> 1) : (r >> 1);
      r = 0; sh = 0;
      do { b = str.charCodeAt(i++) - 63; r |= (b & 0x1f) << sh; sh += 5; } while (b >= 0x20);
      lng += (r & 1) ? ~(r >> 1) : (r >> 1);
      out.push([lat / 1e5, lng / 1e5]);
    }
    return out;
  }
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  class Map2 {
    constructor(canvas, box, basemap, opts = {}) {
      this.cv = canvas; this.box = box; this.ctx = canvas.getContext('2d');
      this.cv2 = opts.top || null; this.ctx2 = this.cv2 ? this.cv2.getContext('2d') : null;
      this.lat = 35.168; this.lng = 136.906; this.z = 13;
      this.minZ = 5; this.maxZ = 18;
      this.tiles = new Map(); this.tileMode = false; this.probed = false;
      this.style = opts.style || 'clean';   /* clean = 라벨 없는 CARTO, osm = 일본어 상세 */
      this.labels = [];
      this.overlay = []; this.onView = opts.onView || (() => {});
      this.onTileState = opts.onTileState || (() => {});
      this.base = this.prep(basemap);
      this.pointers = new Map(); this.pinchStart = null;
      this.bind();
      this.resize();
      this.probe();
    }
    /* 내장 벡터 데이터 → 투영 좌표 + bbox 캐시 */
    prep(bm) {
      const conv = (encList) => encList.map(e => {
        const pts = decode(e); const p = new Float64Array(pts.length * 2);
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (let i = 0; i < pts.length; i++) {
          const X = px(pts[i][1]), Y = py(pts[i][0]);
          p[i * 2] = X; p[i * 2 + 1] = Y;
          if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
        }
        return { p, b: [x0, y0, x1, y1] };
      });
      return {
        water: conv(bm.water), river: conv(bm.river), road: conv(bm.road),
        coast: conv(bm.coast), briver: conv(bm.briver),
        park: conv(bm.park.map(o => o.p)),
        rail: bm.rail.map(r => ({ n: r.n, c: r.c, i: r.i, s: conv(r.p) })),
        railLL: bm.rail.map(r => ({ n: r.n, c: r.c, s: r.p.map(decode) }))
      };
    }
    /* ---------- 뷰 ---------- */
    resize() {
      const r = this.box.getBoundingClientRect();
      this.w = Math.max(80, r.width); this.h = Math.max(80, r.height);
      const dpr = Math.min(2.5, window.devicePixelRatio || 1);
      for (const c of [this.cv, this.cv2]) {
        if (!c) continue;
        c.width = Math.round(this.w * dpr); c.height = Math.round(this.h * dpr);
        c.style.width = this.w + 'px'; c.style.height = this.h + 'px';
      }
      this.dpr = dpr; this.draw();
    }
    scale() { return Math.pow(2, this.z); }
    project(lat, lng) {
      const s = this.scale();
      return [(px(lng) - px(this.lng)) * s + this.w / 2, (py(lat) - py(this.lat)) * s + this.h / 2];
    }
    unproject(x, y) {
      const s = this.scale();
      return [unpy(py(this.lat) + (y - this.h / 2) / s), unpx(px(this.lng) + (x - this.w / 2) / s)];
    }
    setView(lat, lng, z, quiet) {
      this.lat = lat; this.lng = lng;
      if (z != null) this.z = Math.max(this.minZ, Math.min(this.maxZ, z));
      this.draw(); if (!quiet) this.onView();
    }
    panBy(dx, dy) {
      const s = this.scale();
      const x = px(this.lng) - dx / s, y = py(this.lat) - dy / s;
      this.lat = unpy(Math.max(0, Math.min(TS, y))); this.lng = unpx(x);
      this.draw(); this.onView();
    }
    zoomTo(z, ax, ay) {
      z = Math.max(this.minZ, Math.min(this.maxZ, z));
      if (ax == null) { ax = this.w / 2; ay = this.h / 2; }
      const before = this.unproject(ax, ay);
      this.z = z;
      const after = this.unproject(ax, ay);
      this.lat += before[0] - after[0]; this.lng += before[1] - after[1];
      this.draw(); this.onView();
    }
    fit(pts, pad = 34) {
      if (!pts.length) return;
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const [la, lo] of pts) {
        const X = px(lo), Y = py(la);
        x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
      }
      const dx = Math.max(1e-6, x1 - x0), dy = Math.max(1e-6, y1 - y0);
      const z = Math.min(Math.log2((this.w - pad * 2) / dx), Math.log2((this.h - pad * 2) / dy));
      this.z = Math.max(this.minZ, Math.min(this.maxZ, z));
      this.lat = unpy((y0 + y1) / 2); this.lng = unpx((x0 + x1) / 2);
      this.draw(); this.onView();
    }
    /* ---------- 타일 ---------- */
    isDark() {
      const t = document.documentElement.dataset.theme;
      if (t === 'dark') return true;
      if (t === 'light') return false;
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    tileURL(z, x, y) {
      if (this.style === 'osm') return 'https://tile.openstreetmap.org/' + z + '/' + x + '/' + y + '.png';
      const r = (window.devicePixelRatio || 1) > 1.4 ? '@2x' : '';
      const sub = 'abcd'[(x + y) % 4];
      return 'https://' + sub + '.basemaps.cartocdn.com/' + (this.isDark() ? 'dark' : 'light') +
        '_nolabels/' + z + '/' + x + '/' + y + r + '.png';
    }
    setStyle(s) {
      if (s === this.style) return;
      this.style = s; this.tiles.clear(); this.draw();
    }
    probe() {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { this.tileMode = true; this.probed = true; this.onTileState(true); this.draw(); };
      img.onerror = () => { this.tileMode = false; this.probed = true; this.onTileState(false); this.draw(); };
      img.src = this.tileURL(13, 7186, 3234);
    }
    tile(z, x, y) {
      const n = 1 << z;
      if (y < 0 || y >= n) return null;
      x = ((x % n) + n) % n;
      const k = z + '/' + x + '/' + y;
      let t = this.tiles.get(k);
      if (!t) {
        t = { img: new Image(), ok: false };
        t.img.crossOrigin = 'anonymous';
        t.img.onload = () => { t.ok = true; this.schedule(); };
        t.img.onerror = () => { t.err = true; };
        t.img.src = this.tileURL(z, x, y);
        this.tiles.set(k, t);
        if (this.tiles.size > 420) { const it = this.tiles.keys(); for (let i = 0; i < 120; i++) this.tiles.delete(it.next().value); }
      }
      return t;
    }
    schedule() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; this.draw(); });
    }
    /* ---------- 그리기 ---------- */
    draw() {
      const c = this.ctx, s = this.scale();
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.w, this.h);
      c.fillStyle = css('--map-land') || '#f6f5f1';
      c.fillRect(0, 0, this.w, this.h);
      const ox = px(this.lng) * s - this.w / 2, oy = py(this.lat) * s - this.h / 2;
      if (this.tileMode) this.drawTiles(c, s, ox, oy); else this.drawVector(c, s, ox, oy);
      const t = this.ctx2 || c;
      if (this.ctx2) {
        t.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        t.clearRect(0, 0, this.w, this.h);
      }
      this.drawRoutes(t, s, ox, oy);
      if (this.style !== 'osm') this.drawLabels(t, s, ox, oy);
    }
    drawTiles(c, s, ox, oy) {
      const z = Math.max(0, Math.min(19, Math.round(this.z)));
      const ts = TS * Math.pow(2, this.z - z);
      const x0 = Math.floor(ox / ts), x1 = Math.floor((ox + this.w) / ts);
      const y0 = Math.floor(oy / ts), y1 = Math.floor((oy + this.h) / ts);
      c.imageSmoothingQuality = 'high';
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        const t = this.tile(z, x, y);
        if (t && t.ok) c.drawImage(t.img, Math.round(x * ts - ox), Math.round(y * ts - oy), Math.ceil(ts) + 1, Math.ceil(ts) + 1);
      }
    }
    path(c, arr, s, ox, oy, close) {
      const b = arr.b;
      if (b[2] * s - ox < -40 || b[0] * s - ox > this.w + 40 || b[3] * s - oy < -40 || b[1] * s - oy > this.h + 40) return false;
      const p = arr.p;
      c.beginPath();
      c.moveTo(p[0] * s - ox, p[1] * s - oy);
      for (let i = 2; i < p.length; i += 2) c.lineTo(p[i] * s - ox, p[i + 1] * s - oy);
      if (close) c.closePath();
      return true;
    }
    drawVector(c, s, ox, oy) {
      const z = this.z, B = this.base;
      c.lineCap = 'round'; c.lineJoin = 'round';
      /* 물 */
      c.fillStyle = css('--map-water');
      for (const a of B.water) if (this.path(c, a, s, ox, oy, true)) c.fill();
      /* 해안선 (넓게 볼 때 바다 느낌) */
      c.strokeStyle = css('--map-coast'); c.lineWidth = Math.max(1, z - 9);
      for (const a of B.coast) if (this.path(c, a, s, ox, oy)) c.stroke();
      /* 큰 강 */
      c.strokeStyle = css('--map-water'); c.lineWidth = Math.max(1.2, (z - 8) * 0.9);
      for (const a of B.briver) if (this.path(c, a, s, ox, oy)) c.stroke();
      if (z > 11) for (const a of B.river) if (this.path(c, a, s, ox, oy)) c.stroke();
      /* 공원 */
      if (z > 11) {
        c.fillStyle = css('--map-park');
        for (const a of B.park) if (this.path(c, a, s, ox, oy, true)) c.fill();
      }
      /* 간선도로 */
      if (z > 11.5) {
        c.strokeStyle = css('--map-road'); c.lineWidth = Math.max(1.5, (z - 11) * 1.7);
        for (const a of B.road) if (this.path(c, a, s, ox, oy)) c.stroke();
      }
      /* 철도 */
      for (const r of B.rail) {
        if (!r.i && z < 12) continue;
        const w = r.i ? Math.max(1.6, (z - 9.5) * 0.85) : Math.max(1, (z - 10.5) * 0.6);
        c.strokeStyle = r.c; c.globalAlpha = r.i ? 0.95 : 0.5; c.lineWidth = w;
        for (const a of r.s) if (this.path(c, a, s, ox, oy)) c.stroke();
        c.globalAlpha = 1;
      }
    }
    drawRoutes(c, s, ox, oy) {
      if (!this.overlay.length) return;
      c.lineCap = 'round'; c.lineJoin = 'round';
      const wide = Math.max(3.4, Math.min(7, (this.z - 9) * 1.15));
      for (const pass of [0, 1]) {
        for (const seg of this.overlay) {
          if (seg.pts.length < 2) continue;
          c.beginPath();
          for (let i = 0; i < seg.pts.length; i++) {
            const X = px(seg.pts[i][1]) * s - ox, Y = py(seg.pts[i][0]) * s - oy;
            i ? c.lineTo(X, Y) : c.moveTo(X, Y);
          }
          if (pass === 0) {
            c.setLineDash([]); c.strokeStyle = css('--card'); c.globalAlpha = 0.85;
            c.lineWidth = wide + 3.4; c.stroke(); c.globalAlpha = 1;
          } else {
            c.strokeStyle = seg.v ? css(seg.v) : seg.color;
            if (seg.dash) { c.setLineDash([wide * 0.9, wide * 1.5]); c.lineWidth = wide * 0.8; }
            else { c.setLineDash([]); c.lineWidth = wide; }
            c.stroke(); c.setLineDash([]);
          }
        }
      }
    }
    /* ---------- 한글 라벨 (역·동네) ---------- */
    drawLabels(t, s, ox, oy) {
      const z = this.z, boxes = [];
      if (!this.labels || !this.labels.length) return;
      /* 핀이 앉은 자리는 라벨을 비켜준다 */
      for (const a of (this.avoid || [])) {
        const X = px(a[1]) * s - ox, Y = py(a[0]) * s - oy, r = a[2] || 16;
        boxes.push([X - r, Y - r, r * 2, r * 2]);
      }
      t.textBaseline = 'middle'; t.textAlign = 'left';
      const halo = css('--card'), inkS = css('--ink-2'), inkA = css('--muted');
      for (const L of this.labels) {
        if (L.k === 'st' && z < 12.4) continue;
        if (L.k === 'area' && (z < 11.8 || z > 16.4)) continue;
        const X = px(L.ll[1]) * s - ox, Y = py(L.ll[0]) * s - oy;
        if (X < -70 || X > this.w + 70 || Y < 14 || Y > this.h - 16) continue;
        const fs = L.k === 'area' ? 12.5 : 11.5;
        t.font = (L.k === 'area' ? '500 ' : '600 ') + fs + 'px "IBM Plex Sans KR", system-ui, sans-serif';
        const w = t.measureText(L.t).width;
        const lx = L.k === 'st' ? X + 9 : X - w / 2;
        const bx = [lx - 3, Y - fs * 0.85, w + 6, fs * 1.7];
        if (boxes.some(b => bx[0] < b[0] + b[2] && b[0] < bx[0] + bx[2] && bx[1] < b[1] + b[3] && b[1] < bx[1] + bx[3])) continue;
        boxes.push(bx);
        if (L.k === 'st') {
          t.beginPath(); t.arc(X, Y, 3.7, 0, 6.2832);
          t.fillStyle = halo; t.fill();
          t.lineWidth = 2.4; t.strokeStyle = css(L.c || '--rule-2'); t.stroke();
        }
        t.lineWidth = 3.8; t.strokeStyle = halo; t.globalAlpha = 0.9;
        t.strokeText(L.t, lx, Y); t.globalAlpha = 1;
        t.fillStyle = L.k === 'area' ? inkA : inkS;
        t.fillText(L.t, lx, Y);
      }
    }

    /* ---------- 입력 ---------- */
    bind() {
      const box = this.box;
      box.addEventListener('pointerdown', (e) => {
        box.setPointerCapture(e.pointerId);
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: Date.now() });
        if (this.pointers.size === 2) {
          const [a, b] = [...this.pointers.values()];
          this.pinchStart = { d: Math.hypot(a.x - b.x, a.y - b.y), z: this.z };
        }
      });
      box.addEventListener('pointermove', (e) => {
        const p = this.pointers.get(e.pointerId);
        if (!p) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        p.x = e.clientX; p.y = e.clientY;
        if (this.pointers.size === 1) { this.panBy(dx, dy); }
        else if (this.pointers.size === 2 && this.pinchStart) {
          const [a, b] = [...this.pointers.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const r = box.getBoundingClientRect();
          const cx = (a.x + b.x) / 2 - r.left, cy = (a.y + b.y) / 2 - r.top;
          this.zoomTo(this.pinchStart.z + Math.log2(Math.max(0.15, d / this.pinchStart.d)), cx, cy);
        }
      });
      const up = (e) => {
        const p = this.pointers.get(e.pointerId);
        this.pointers.delete(e.pointerId);
        if (this.pointers.size < 2) this.pinchStart = null;
        if (p && Date.now() - p.t < 300 && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < 6) {
          const now = Date.now();
          if (this._lastTap && now - this._lastTap < 320) {
            const r = box.getBoundingClientRect();
            this.zoomTo(this.z + 1, e.clientX - r.left, e.clientY - r.top);
            this._lastTap = 0;
          } else this._lastTap = now;
        }
      };
      box.addEventListener('pointerup', up);
      box.addEventListener('pointercancel', up);
      box.addEventListener('wheel', (e) => {
        e.preventDefault();
        const r = box.getBoundingClientRect();
        this.zoomTo(this.z - Math.sign(e.deltaY) * (e.ctrlKey ? 0.5 : 0.36), e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });
      window.addEventListener('resize', () => this.resize());
      const themed = () => { this.tiles.clear(); this.draw(); };
      if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener && mq.addEventListener('change', themed);
      }
      if (window.MutationObserver) {
        new MutationObserver(themed).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.draw());
    }

    /* 두 지점 사이를 실제 노선 위로 잇기: 단일 노선 → 허브 2단 → 자동 분기점 합성 */
    railPath(names, a, b, hubs) {
      const one = this.railSlice(names, a, b);
      if (one) return one;
      for (const h of (hubs || [])) {
        if (!h) continue;
        const s1 = this.railSlice(names, a, h), s2 = this.railSlice(names, h, b);
        if (s1 && s2) return s1.concat(s2);
      }
      return this.railComposite(names, a, b);
    }
    /* 서로 만나는 두 노선을 분기점에서 이어붙인다 */
    railComposite(names, a, b) {
      const lines = [];
      for (const r of this.base.railLL) {
        if (!names.some(n => r.n.indexOf(n) >= 0)) continue;
        for (const l of r.s) if (l.length > 8) lines.push(l);
      }
      const near = (line, p) => {
        let bi = 0, bd = 1e18;
        for (let i = 0; i < line.length; i++) {
          const d = (line[i][0] - p[0]) ** 2 + ((line[i][1] - p[1]) * 0.82) ** 2;
          if (d < bd) { bd = d; bi = i; }
        }
        return [bi, bd];
      };
      let best = null;
      for (const L1 of lines) {
        const [ia, da] = near(L1, a);
        if (da > 0.00016) continue;
        for (const L2 of lines) {
          if (L2 === L1) continue;
          const [ib, db] = near(L2, b);
          if (db > 0.00016) continue;
          /* 분기점: 두 노선에서 가장 가까운 정점 쌍 (성능 위해 3칸씩 샘플) */
          let j1 = 0, j2 = 0, jd = 1e18;
          for (let i = 0; i < L1.length; i += 3) for (let k = 0; k < L2.length; k += 3) {
            const d = (L1[i][0] - L2[k][0]) ** 2 + ((L1[i][1] - L2[k][1]) * 0.82) ** 2;
            if (d < jd) { jd = d; j1 = i; j2 = k; }
          }
          if (jd > 4e-7) continue;
          const score = da + db + jd;
          if (!best || score < best.score) best = { score, L1, ia, j1, L2, j2, ib };
        }
      }
      if (!best) return null;
      const cut = (line, i, j) => {
        const lo = Math.min(i, j), hi = Math.max(i, j);
        const seg = line.slice(lo, hi + 1);
        return i > j ? seg.reverse() : seg;
      };
      return cut(best.L1, best.ia, best.j1).concat(cut(best.L2, best.j2, best.ib));
    }
    /* ---------- 철도 경로 슬라이싱 ---------- */
    railSlice(names, a, b) {
      let best = null;
      for (const r of this.base.railLL) {
        if (!names.some(n => r.n.indexOf(n) >= 0)) continue;
        for (const line of r.s) {
          if (line.length < 4) continue;
          let ia = 0, ib = 0, da = 1e18, db = 1e18;
          for (let i = 0; i < line.length; i++) {
            const p = line[i];
            const d1 = (p[0] - a[0]) ** 2 + ((p[1] - a[1]) * 0.82) ** 2;
            const d2 = (p[0] - b[0]) ** 2 + ((p[1] - b[1]) * 0.82) ** 2;
            if (d1 < da) { da = d1; ia = i; }
            if (d2 < db) { db = d2; ib = i; }
          }
          const score = da + db;
          if (Math.abs(ia - ib) < 2) continue;
          if (!best || score < best.score) best = { score, line, ia, ib, col: r.c };
        }
      }
      if (!best) return null;
      /* 1.2km 넘게 떨어져 있으면 그 노선이 아니라고 판단 */
      if (best.score > 0.00028) return null;
      const { line, ia, ib } = best;
      const lo = Math.min(ia, ib), hi = Math.max(ia, ib);
      let seg = line.slice(lo, hi + 1);
      const loop = Math.hypot(line[0][0] - line[line.length - 1][0], line[0][1] - line[line.length - 1][1]) < 0.004;
      if (loop) {
        const other = line.slice(hi).concat(line.slice(0, lo + 1));
        const len = (ar) => ar.reduce((s, p, i) => i ? s + Math.hypot(p[0] - ar[i - 1][0], (p[1] - ar[i - 1][1]) * 0.82) : 0, 0);
        if (len(other) < len(seg)) seg = other.reverse();
      }
      if (ia > ib) seg = seg.slice().reverse();
      return seg;
    }
  }
  return { Map: Map2, decode, px, py };
})();
