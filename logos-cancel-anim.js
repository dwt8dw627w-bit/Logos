/**
 * Logos — улучшенная анимация отмены голосовых / видеокружков
 * v2 · быстрее сминание · меньше комки · уникальные формы · 3D-урна · надёжный flipCam
 * Подключается после rec2-js (defer) и переопределяет window.__p3 + flipCam.
 */
(function () {
  'use strict';

  const Q = s => document.querySelector(s);
  const HV = n => { try { navigator.vibrate && navigator.vibrate(n); } catch (e) {} };
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- helpers ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const F = n => n.toFixed(1);
  const A = (el, k, o) => {
    try { return el.animate(k, Object.assign({ fill: 'forwards' }, o)); }
    catch (e) { return null; }
  };
  const tw = (d, f) => {
    const t0 = performance.now();
    const s = n => {
      const k = Math.min(1, (n - t0) / d);
      f(k);
      if (k < 1) requestAnimationFrame(s);
    };
    requestAnimationFrame(s);
  };
  const mk = (css, inner) => {
    const e = document.createElement('div');
    if (css) e.style.cssText = css;
    if (inner) e.innerHTML = inner;
    return e;
  };

  // ---------- 3D-урна (чёрный металл + фиолетовые акценты, фиксированные пропорции) ----------
  function makeBinSVG() {
    // viewBox 0 0 48 58 · корпус никогда не масштабируется по Y отдельно
    return `<svg viewBox="0 0 48 58" width="48" height="58" style="display:block;overflow:visible">
      <defs>
        <linearGradient id="p3m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2a2a32"/>
          <stop offset=".35" stop-color="#1a1a22"/>
          <stop offset=".7" stop-color="#0e0e14"/>
          <stop offset="1" stop-color="#18181f"/>
        </linearGradient>
        <linearGradient id="p3s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff55"/>
          <stop offset=".15" stop-color="#ffffff18"/>
          <stop offset="1" stop-color="#00000040"/>
        </linearGradient>
        <linearGradient id="p3p" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#7c4dff00"/>
          <stop offset=".5" stop-color="#a78bfa88"/>
          <stop offset="1" stop-color="#7c4dff00"/>
        </linearGradient>
        <filter id="p3sh" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity=".55"/>
        </filter>
        <linearGradient id="p3lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4a4a58"/>
          <stop offset=".4" stop-color="#32323c"/>
          <stop offset="1" stop-color="#1e1e28"/>
        </linearGradient>
      </defs>
      <!-- корпус -->
      <g filter="url(#p3sh)">
        <path d="M8 16h32l-2.6 36.2a3.6 3.6 0 0 1-3.6 3.3H14.2a3.6 3.6 0 0 1-3.6-3.3z" fill="url(#p3m)" stroke="#ffffff22" stroke-width=".8"/>
        <path d="M8 16h32l-2.6 36.2a3.6 3.6 0 0 1-3.6 3.3H14.2a3.6 3.6 0 0 1-3.6-3.3z" fill="url(#p3s)"/>
        <!-- рёбра -->
        <path d="M16.5 22v28M24 22v28M31.5 22v28" stroke="#ffffff18" stroke-width="1.2" stroke-linecap="round"/>
        <!-- фиолетовый блик по ободку -->
        <path d="M9.2 17.5h29.6" stroke="url(#p3p)" stroke-width="2.2" stroke-linecap="round"/>
      </g>
      <!-- крышка (отдельная группа с transform-origin у шарнира) -->
      <g class="lid" style="transform-origin:10px 14px">
        <rect x="5.5" y="11" width="37" height="6.5" rx="3.2" fill="url(#p3lid)" stroke="#ffffff30" stroke-width=".7"/>
        <rect x="5.5" y="11" width="37" height="2.8" rx="2" fill="#ffffff12"/>
        <!-- ручка крышки -->
        <path d="M18.5 11V9.2a2.2 2.2 0 0 1 2.2-2.2h6.6a2.2 2.2 0 0 1 2.2 2.2V11" fill="none" stroke="#b79cff" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="8.5" r="1.1" fill="#c4a8ff"/>
      </g>
    </svg>`;
  }

  // ---------- уникальная форма комка ----------
  function makeCrumplePoints(circle) {
    const N = 14;
    const ang = [...Array(N)].map((_, i) => i / N * Math.PI * 2 - Math.PI / 2 + rnd(-0.08, 0.08));
    const rectP = a => {
      const c = Math.cos(a), s = Math.sin(a);
      const k = 0.5 / Math.max(Math.abs(c), Math.abs(s));
      return [0.5 + c * k, 0.5 + s * k];
    };
    const circP = a => [0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5];
    const blob = (lo, hi) => ang.map(a => {
      const q = rnd(lo, hi) * 0.5;
      // лёгкая эллиптичность + шум
      const ex = 1 + rnd(-0.12, 0.18);
      const ey = 1 + rnd(-0.15, 0.12);
      return [0.5 + Math.cos(a) * q * ex, 0.5 + Math.sin(a) * q * ey];
    });
    const mix = (p, q, m) => p.map((v, i) => [
      v[0] + (q[i][0] - v[0]) * m,
      v[1] + (q[i][1] - v[1]) * m
    ]);
    const P0 = ang.map(circle ? circP : rectP);
    const PB = blob(0.48, 0.92);
    const P1 = mix(P0, PB, 0.42 + rnd(0, 0.2));
    return { P0, P1, PB, ang };
  }

  function creases(n) {
    return [...Array(n)].map(() => {
      const a = ri(8, 72);
      const w = ri(3, 7);
      return `linear-gradient(${ri(0, 180)}deg,transparent ${a}%,rgba(0,0,0,.38) ${a + 2}%,rgba(255,255,255,.28) ${a + w}%,transparent ${a + w + 5}%)`;
    }).join(',');
  }

  function poly(p) {
    return 'polygon(' + p.map(v => F(v[0] * 100) + '% ' + F(v[1] * 100) + '%').join(',') + ')';
  }

  // ---------- основной crumple ----------
  function crumple(r, circle, cv, html) {
    if (reduced()) return;

    const B = document.body;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const vw = innerWidth;
    const vh = innerHeight;
    const Z = 2147483000;

    // режим: bin / plane / boat / miss / sling
    let mode = 'bin';
    try {
      const f = localStorage.lg_anim;
      if (/^(plane|boat|miss|sling|bin)$/.test(f)) mode = f;
      else {
        const x = Math.random();
        // 1/10000 sling, иначе 1/1000 на одну из трёх, иначе bin
        mode = x < 1e-4 ? 'sling' : x < 1.001e-3 ? ['plane', 'boat', 'miss'][ri(0, 2)] : 'bin';
      }
    } catch (e) {}

    const { P0, P1, PB } = makeCrumplePoints(circle);
    const pp = document.createElement('div');
    pp.className = 'p3pp cr' + (circle ? ' c' : '');
    Object.assign(pp.style, {
      left: r.left + 'px',
      top: r.top + 'px',
      width: r.width + 'px',
      height: r.height + 'px',
      borderRadius: circle ? '50%' : '24px',
      position: 'fixed',
      zIndex: Z,
      overflow: 'hidden',
      pointerEvents: 'none',
      willChange: 'transform, clip-path, opacity'
    });
    if (cv) {
      cv.style.width = '100%';
      cv.style.height = '100%';
      cv.style.objectFit = 'cover';
      pp.appendChild(cv);
    } else {
      pp.innerHTML = html;
    }
    const cl = mk('position:absolute;inset:0;pointer-events:none;opacity:0;background:' + creases(5));
    pp.appendChild(cl);
    B.appendChild(pp);

    // ускоренное сминание (было ~250ms → ~155ms)
    const CRUMPLE_MS = 155;
    const BALL_SZ = 14; // было 22
    const scW = BALL_SZ / Math.max(r.width, r.height);

    const toPoint = (tx, ty, sc, dur, lift) => {
      const m = Math.max(sc * 1.85, 0.42);
      A(cl, [{ opacity: 0 }, { opacity: 1 }], { duration: dur * 0.65, delay: dur * 0.12 });
      // уникальные оси масштаба + вращение каждый раз
      const sx = m * rnd(0.75, 1.25);
      const sy = m * rnd(0.72, 1.22);
      const rot1 = ri(-32, 32);
      const rot2 = ri(-95, 95);
      return A(pp, [
        { transform: 'none', clipPath: poly(P0), offset: 0 },
        {
          transform: `translate(${F((tx - cx) * 0.42)}px,${F((ty - cy) * 0.42 - lift)}px) scale(${F(sx)},${F(sy)}) rotate(${rot1}deg)`,
          clipPath: poly(P1),
          offset: 0.48
        },
        {
          transform: `translate(${F(tx - cx)}px,${F(ty - cy)}px) scale(${sc}) rotate(${rot2}deg)`,
          clipPath: poly(PB),
          offset: 1
        }
      ], { duration: dur, easing: 'cubic-bezier(.42,.02,.32,1)' });
    };

    const mkBall = (sz, css) => {
      const b = document.createElement('i');
      const { PB: shape } = makeCrumplePoints(false);
      b.style.cssText = `position:absolute;display:block;width:${sz}px;height:${sz}px;border-radius:50%;${css || ''};
        background:${creases(4)},radial-gradient(circle at ${ri(22, 48)}% ${ri(18, 42)}%,#f5f5f8,#c8c8d4 52%,#7a7a8a);
        clip-path:${poly(shape)};box-shadow:0 1px 4px #0006;will-change:transform`;
      return b;
    };

    // ---------- самолётик ----------
    if (mode === 'plane') {
      toPoint(cx, cy, Math.min(1, 48 / Math.max(r.width, r.height)), 180, 0);
      setTimeout(() => {
        A(pp, [{ opacity: 1 }, { opacity: 0 }], { duration: 70 });
        setTimeout(() => pp.remove(), 80);
        const d = mk(`position:fixed;left:${cx - 32}px;top:${cy - 18}px;width:64px;height:36px;z-index:${Z};pointer-events:none;will-change:transform`,
          `<svg viewBox="0 0 70 40" width="64" height="36"><path d="M2 20L66 3L36 24Z" fill="#fafafc"/><path d="M2 20L36 24L30 37Z" fill="#c4c4d0"/><path d="M36 24L66 3L30 37Z" fill="#e0e0e8"/><path d="M2 20L66 3" stroke="#fff" stroke-opacity=".7" fill="none"/></svg>`);
        B.appendChild(d);
        const tx = rnd(0.55, 0.92) * vw;
        const ty = rnd(0.08, 0.32) * vh;
        A(d, [
          { transform: 'translate(0,0) rotate(0) scale(1)', offset: 0 },
          { transform: `translate(${F((tx - cx) * 0.35)}px,${F((ty - cy) * 0.25)}px) rotate(${ri(-18, 25)}deg) scale(.92)`, offset: 0.35 },
          { transform: `translate(${F(tx - cx)}px,${F(ty - cy)}px) rotate(${ri(40, 120)}deg) scale(.18)`, offset: 1 }
        ], { duration: 1100, easing: 'cubic-bezier(.2,.5,.4,1)' });
        setTimeout(() => { A(d, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }); setTimeout(() => d.remove(), 240); }, 980);
      }, 180);
      return;
    }

    // ---------- кораблик ----------
    if (mode === 'boat') {
      toPoint(cx, cy + 20, Math.min(1, 44 / Math.max(r.width, r.height)), 170, 8);
      setTimeout(() => {
        A(pp, [{ opacity: 1 }, { opacity: 0 }], { duration: 60 });
        setTimeout(() => pp.remove(), 70);
        const waterY = Math.min(vh - 80, cy + 40);
        const boat = mk(`position:fixed;left:${cx - 28}px;top:${waterY - 18}px;width:56px;height:36px;z-index:${Z};pointer-events:none;will-change:transform`,
          `<svg viewBox="0 0 56 36" width="56" height="36">
            <ellipse cx="28" cy="30" rx="26" ry="5" fill="#3b82f633"/>
            <path d="M4 22 L14 30 H42 L52 22 Z" fill="#e8e8f0" stroke="#bbb" stroke-width=".6"/>
            <path d="M18 22 V10 L28 4 L38 10 V22" fill="#f4f4fa" stroke="#ccc" stroke-width=".5"/>
            <path d="M28 4 V22" stroke="#aaa" stroke-width=".7"/>
          </svg>`);
        B.appendChild(boat);
        // вода + покачивание
        const dir = Math.random() < 0.5 ? -1 : 1;
        A(boat, [
          { transform: 'translateX(0) rotate(0deg)', offset: 0 },
          { transform: `translateX(${dir * 40}px) rotate(${dir * 6}deg)`, offset: 0.25 },
          { transform: `translateX(${dir * 110}px) rotate(${dir * -5}deg)`, offset: 0.55 },
          { transform: `translateX(${dir * 220}px) rotate(${dir * 4}deg)`, offset: 1 }
        ], { duration: 1400, easing: 'cubic-bezier(.25,.4,.4,1)' });
        setTimeout(() => { A(boat, [{ opacity: 1 }, { opacity: 0 }], { duration: 280 }); setTimeout(() => boat.remove(), 300); }, 1180);
      }, 170);
      return;
    }

    // ---------- рогатка + стекло (1/10000) ----------
    if (mode === 'sling') {
      const ov = mk(`position:fixed;inset:0;z-index:${Z};pointer-events:none;overflow:hidden`);
      B.appendChild(ov);
      const fx = vw * 0.5, tipY = vh * 0.62, rest = tipY - 48, pull = 52, NS = 'http://www.w3.org/2000/svg';
      const sv = document.createElementNS(NS, 'svg');
      sv.setAttribute('width', vw); sv.setAttribute('height', vh);
      sv.style.cssText = 'position:absolute;left:0;top:0';
      sv.innerHTML = `<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b5b8c"/><stop offset="1" stop-color="#2a2038"/></linearGradient></defs>
        <path class="bd" d="M${fx - 27} ${tipY}L${fx} ${rest}L${fx + 27} ${tipY}" fill="none" stroke="#c4a8ff" stroke-width="3.2" stroke-linecap="round"/>
        <circle class="pc" cx="${fx}" cy="${rest}" r="9" fill="url(#sg)" stroke="#e9d6ff" stroke-width="1.5"/>
        <path d="M${fx - 34} ${tipY + 2} L${fx - 22} ${tipY + 28} M${fx + 34} ${tipY + 2} L${fx + 22} ${tipY + 28}" stroke="#8b7aa8" stroke-width="4" stroke-linecap="round"/>`;
      const bd = sv.querySelector('.bd'), pc = sv.querySelector('.pc');
      const band = py => {
        bd.setAttribute('d', `M${fx - 27} ${tipY}L${fx} ${F(py)}L${fx + 27} ${tipY}`);
        pc.setAttribute('cx', fx); pc.setAttribute('cy', F(py));
      };
      band(rest);
      ov.append(sv);
      A(sv, [{ transform: 'translateY(140px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.3,1.4,.5,1)' });
      toPoint(fx, rest, scW, 200, 22);
      setTimeout(() => {
        pp.remove();
        const b = mkBall(BALL_SZ, `left:${fx - BALL_SZ / 2}px;top:${rest - BALL_SZ / 2}px`);
        ov.append(b);
        tw(200, k => {
          const e = 1 - (1 - k) * (1 - k);
          band(rest + pull * e);
          b.style.transform = `translateY(${pull * e}px) rotate(${e * 70}deg)`;
        });
        setTimeout(() => {
          const tx = rnd(0.28, 0.72) * vw, ty = rnd(0.14, 0.38) * vh;
          A(b, [
            { transform: `translateY(${pull}px) rotate(70deg) scale(1)` },
            { transform: `translate(${F(tx - fx)}px,${F(ty - rest)}px) rotate(480deg) scale(1.7)` }
          ], { duration: 260, easing: 'cubic-bezier(.2,.5,.5,1)' });
          tw(260, k => band(rest + pull * Math.cos(k * Math.PI * 3.2) * (1 - k)));
          setTimeout(() => {
            b.remove();
            // трещины
            HV(36);
            const s = document.createElementNS(NS, 'svg');
            s.setAttribute('width', vw); s.setAttribute('height', vh);
            s.style.cssText = 'position:absolute;left:0;top:0';
            const n = ri(8, 12), a0 = rnd(0, 6.28);
            let h = '';
            const R = [];
            for (let i = 0; i < n; i++) {
              let a = a0 + i / n * 6.283 + rnd(-0.14, 0.14), px = tx, py = ty;
              const len = rnd(0.32, 0.88) * Math.max(vw, vh) * 0.55, sg = ri(3, 5), pr = [[tx, ty]];
              for (let j = 0; j < sg; j++) {
                a += rnd(-0.2, 0.2);
                const dl = len / sg * rnd(0.7, 1.25);
                px += Math.cos(a) * dl; py += Math.sin(a) * dl;
                pr.push([px, py]);
                if (Math.random() < 0.32) {
                  const ba = a + rnd(0.5, 1) * (Math.random() < 0.5 ? -1 : 1);
                  const bl = dl * rnd(0.6, 1.6);
                  h += `M${F(px)} ${F(py)}L${F(px + Math.cos(ba) * bl)} ${F(py + Math.sin(ba) * bl)}`;
                }
              }
              R.push(pr);
              h += 'M' + pr.map(p => F(p[0]) + ' ' + F(p[1])).join('L');
            }
            s.innerHTML = `<path d="${h}" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="3.2" stroke-linejoin="round"/>
              <path d="${h}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.3" stroke-linejoin="round"/>
              <circle cx="${F(tx)}" cy="${F(ty)}" r="6" fill="rgba(0,0,0,.5)" stroke="#fff" stroke-width="1.3"/>`;
            ov.append(s);
            A(s, [
              { clipPath: `circle(0px at ${F(tx)}px ${F(ty)}px)` },
              { clipPath: `circle(${Math.round(Math.hypot(vw, vh))}px at ${F(tx)}px ${F(ty)}px)` }
            ], { duration: 280, easing: 'cubic-bezier(.1,.8,.3,1)' });
            // исчезновение
            setTimeout(() => {
              A(s, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 400 });
              A(sv, [{ transform: 'none' }, { transform: 'translateY(160px)' }], { duration: 240, delay: 200, easing: 'ease-in' });
              setTimeout(() => ov.remove(), 1400);
            }, 320);
          }, 260);
        }, 220);
      }, 200);
      return;
    }

    // ---------- урна / промах ----------
    const BX = vw - 78;
    const bt = vh - 130;
    const o = mk(`position:fixed;left:${BX}px;top:${bt}px;width:48px;height:58px;z-index:${Z};pointer-events:none;transform-origin:50% 100%;will-change:transform`);
    o.innerHTML = makeBinSVG();
    B.appendChild(o);
    const L = o.querySelector('.lid');
    const i = o; // корпус = корневой svg-контейнер

    const lid = (open, dur, delay) => {
      if (!L) return;
      A(L, [
        { transform: open ? 'rotate(0deg)' : 'rotate(-108deg)' },
        { transform: open ? 'rotate(-108deg)' : 'rotate(0deg)' }
      ], { duration: dur || 160, delay: delay || 0, easing: 'cubic-bezier(.3,1.2,.5,1)' });
    };

    // появление урны
    A(o, [
      { transform: 'translateY(40px) scale(.7)', opacity: 0 },
      { transform: 'translateY(0) scale(1)', opacity: 1 }
    ], { duration: 180, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    lid(1, 140, 40);

    const P1x = BX + 24;
    const P1y = bt - 10;
    const T0 = 165; // ускорено
    const exit = () => {
      lid(0, 140, 0);
      A(o, [
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(36px) scale(.75)', opacity: 0 }
      ], { duration: 200, delay: 80, easing: 'ease-in' });
      setTimeout(() => o.remove(), 300);
    };

    toPoint(P1x, P1y, scW, T0, 28);

    setTimeout(() => {
      pp.remove();
      if (mode === 'bin') {
        const b = mkBall(BALL_SZ, `left:17px;top:-20px;z-index:2`);
        i.insertBefore(b, i.lastElementChild);
        A(b, [
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: 'translateY(22px) rotate(130deg)', offset: 0.42 },
          { transform: 'translateY(40px) rotate(250deg) scale(.85)' }
        ], { duration: 150, easing: 'cubic-bezier(.5,0,.9,.7)' });
        setTimeout(() => {
          b.remove();
          HV(7);
          // реакция урны — только сдвиг/поворот, без сжатия пропорций корпуса
          A(i, [
            { transform: 'translateY(0) rotate(0deg)' },
            { transform: 'translateY(5px) rotate(-2.5deg)', offset: 0.28 },
            { transform: 'translateY(-1px) rotate(1.5deg)', offset: 0.55 },
            { transform: 'translateY(0) rotate(0deg)' }
          ], { duration: 220 });
          setTimeout(() => { L.style.zIndex = 6; lid(0, 130, 0); }, 50);
          setTimeout(exit, 240);
        }, 150);
      } else {
        // промах
        const w = mkBall(BALL_SZ, `position:fixed;left:${P1x - BALL_SZ / 2}px;top:${P1y - BALL_SZ / 2}px;z-index:${Z + 1}`);
        B.appendChild(w);
        const X = BX, Y = bt;
        const d = (x, y, r) => `translate(${F(X + x - P1x)}px,${F(Y + y - P1y)}px) rotate(${r}deg)`;
        A(w, [
          { transform: d(P1x - X, P1y - Y, 0), offset: 0, easing: 'cubic-bezier(.5,0,.9,.7)' },
          { transform: d(16, 6, 140), offset: 0.28, easing: 'cubic-bezier(.1,.7,.4,1)' },
          { transform: d(38, -12, 240), offset: 0.52, easing: 'cubic-bezier(.5,0,.9,.6)' },
          { transform: d(62, 48, 380), offset: 0.78, easing: 'cubic-bezier(.2,.8,.5,1)' },
          { transform: d(78, 52, 480), offset: 1 }
        ], { duration: 620 });
        let tb = null;
        setTimeout(() => {
          HV(12);
          L.style.zIndex = 6;
          let k = 0;
          const fl = () => {
            if (k >= 5) return;
            k % 2 ? lid(1, 90, 0) : lid(0, 90, 0);
            k++;
            setTimeout(fl, 110);
          };
          fl();
          A(i, [
            { transform: 'none', offset: 0 },
            { transform: 'translateY(-4px) rotate(-2.5deg)', offset: 0.18 },
            { transform: 'translateY(0)', offset: 0.35 },
            { transform: 'translateY(-3px) rotate(2deg)', offset: 0.55 },
            { transform: 'translateY(0)', offset: 0.75 },
            { transform: 'none', offset: 1 }
          ], { duration: 640 });
          const jokes = ['Мимо!', 'Ха-ха!', 'Почти…', 'Рядом!'];
          tb = mk(`position:fixed;left:${X + 30}px;top:${Y - 32}px;z-index:${Z + 2};padding:5px 10px;border-radius:14px 14px 14px 3px;background:#fff;color:#111;font:700 12.5px/1 system-ui,sans-serif;pointer-events:none;white-space:nowrap`, jokes[ri(0, jokes.length - 1)]);
          B.appendChild(tb);
          A(tb, [
            { transform: 'scale(.15)', opacity: 0 },
            { transform: 'scale(1.08)', opacity: 1, offset: 0.55 },
            { transform: 'scale(1)', opacity: 1 }
          ], { duration: 220, easing: 'ease-out' });
        }, 190);
        setTimeout(() => {
          exit();
          if (tb) A(tb, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 });
          setTimeout(() => tb && tb.remove(), 220);
        }, 980);
        setTimeout(() => {
          A(w, [{ opacity: 1 }, { opacity: 0 }], { duration: 280 });
          setTimeout(() => w.remove(), 300);
        }, 1500);
      }
    }, T0);
  }

  // ---------- публичный API (переопределяем) ----------
  function cancelAnim(g) {
    if (!g) return;
    const circle = g.kind === 'circle';
    let r = null, cv = null, html = '';
    try {
      if (circle) {
        const o = Q('.hcirc');
        if (o) {
          r = o.getBoundingClientRect();
          const v = o.querySelector('video');
          if (v) {
            cv = document.createElement('canvas');
            cv.width = cv.height = 160;
            const x = cv.getContext('2d');
            x.translate(160, 0);
            x.scale(-1, 1);
            const s = Math.min(v.videoWidth, v.videoHeight) || 0;
            if (s) x.drawImage(v, (v.videoWidth - s) / 2, (v.videoHeight - s) / 2, s, s, 0, 0, 160, 160);
            else { x.fillStyle = '#222'; x.fillRect(0, 0, 160, 160); }
          }
        }
      } else {
        const b = Q('#recb');
        if (b) {
          r = b.getBoundingClientRect();
          html = b.innerHTML.replace(/ id="[^"]*"/g, '');
        }
      }
    } catch (e) {}
    // очистка состояния записи (вызываем оригинальные, если есть)
    try {
      if (typeof window.G !== 'undefined') window.G = null;
      if (typeof clean === 'function') clean();
      else document.querySelectorAll('.p3lk,.p3lc').forEach(e => e.remove());
    } catch (e) {}
    HV(9);
    try {
      if (typeof recCancel === 'function') recCancel();
      else if (typeof holdClear === 'function') holdClear();
    } catch (e) {}
    if (r && r.width && !reduced()) crumple(r, circle, cv, html);
  }

  // надёжный flipCam (поверх существующего)
  const _origFlip = window.flipCam;
  window.flipCam = async function () {
    if (!window.R || R.k !== 'circle' || R.flp) return;
    if (R.phase !== 'pre' && R.phase !== 'rec') return;
    R.flp = 1;
    const nf = R.face === 'user' ? 'environment' : 'user';
    const rec = R.phase === 'rec';
    try {
      const constraints = {
        video: {
          facingMode: { ideal: nf },
          width: { ideal: 480 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };
      let s;
      try {
        s = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // fallback без ideal
        s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: nf },
          audio: false
        });
      }
      if (!R) { s.getTracks().forEach(t => t.stop()); return; }
      if (rec) {
        R.vst?.getTracks().forEach(t => t.stop());
        R.st.getVideoTracks().forEach(t => t.stop());
        R.vst = s;
        // если идёт запись через canvas — обновляем source
        const v = Q('.hcirc video') || Q('#cvv');
        if (v) {
          v.srcObject = s;
          v.style.transform = nf === 'user' ? 'scaleX(-1)' : 'none';
          v.play?.().catch(() => {});
        }
      } else {
        R.st.getTracks().forEach(t => t.stop());
        R.st = s;
        const v = Q('.hcirc video');
        if (v) {
          v.srcObject = s;
          v.style.transform = nf === 'user' ? 'scaleX(-1)' : 'none';
          v.play?.().catch(() => {});
        }
      }
      R.face = nf;
      HV(8);
    } catch (e) {
      try {
        if (typeof toast === 'function') toast('Эта камера недоступна на устройстве');
        else alert('Эта камера недоступна на устройстве');
      } catch (x) {}
    }
    if (R) R.flp = 0;
  };

  // экспорт
  window.__p3 = { crumple, cancelAnim };
  window.p3cancel = () => {
    try {
      if (window.G) cancelAnim(window.G);
    } catch (e) {}
  };

  // если оригинальный cancelAnim уже висит на pointer — подменяем
  try {
    if (window.cancelAnim) window.cancelAnim = cancelAnim;
  } catch (e) {}

  console.log('[logos-cancel-anim] v2 ready · faster crumple · smaller balls · 3D bin · solid flipCam');
})();
