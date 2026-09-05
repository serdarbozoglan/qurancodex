'use client';

// ─── HeroRing — Hero Sahne 1 arka katmanı (v2.0) ─────────────────────────────
// 6.236 âyetin tamamı bir halka olarak: 114 sûre yayı, her biri GERÇEK âyet
// sayısıyla ölçekli. Arkasında 14 mukattaa harfinden paralaks bulut. Merkez
// "clear-zone": kutsal metin sütununa hiçbir parçacık girmez. Hover → sûre
// adı + âyet sayısı + (mukattaa sûresiyse) imza harfi. Tıkla → o sûrenin
// okuma sayfası.
//
// Neden ayrı bileşen + dynamic ssr:false: canvas SSR'da anlamsız; §16.6.
// Reduced-motion (§9): dönme durur, statik halka + tam-opak metin render olur.
// Performans (§8, §13.26 md.11): ekran dışında rAF durur (IntersectionObserver).

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';
import { useLanguage } from '../i18n/LanguageContext';
import { surahName } from '../lib/surahNames';

// Kufan/Hafs âyet sayıları (Σ = 6236). verse-graph-bgem3.json'dan türetildi;
// 114 sayı client bundle'ına tüm graf'ı taşımaktan çok daha ucuz.
const COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const TOTAL = 6236;

// Mukattaa ile açılan 29 sûrenin imza harfleri (sûre no → harf dizisi).
const MUKATTAA = {
  2:'الٓمٓ',3:'الٓمٓ',7:'الٓمٓصٓ',10:'الٓر',11:'الٓر',12:'الٓر',13:'الٓمٓر',14:'الٓر',15:'الٓر',
  19:'كٓهيعٓصٓ',20:'طه',26:'طسٓمٓ',27:'طسٓ',28:'طسٓمٓ',29:'الٓمٓ',30:'الٓمٓ',31:'الٓمٓ',32:'الٓمٓ',
  36:'يسٓ',38:'صٓ',40:'حمٓ',41:'حمٓ',42:'حمٓ عٓسٓقٓ',43:'حمٓ',44:'حمٓ',45:'حمٓ',46:'حمٓ',50:'قٓ',68:'نٓ',
};
const CLOUD_LETTERS = ['ا','ح','ر','س','ص','ط','ع','ق','ك','ل','م','ن','ه','ي'];

export default function HeroRing({ className }) {
  const canvasRef = useRef(null);
  const tipRef = useRef(null);
  const router = useRouter();
  const { language } = useLanguage();
  const reduced = useReducedMotionSafe();
  const langRef = useRef(language);
  langRef.current = language;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    const tip = tipRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, cx = 0, cy = 0, R = 0;
    let pts = [], segs = [], cloud = [];
    let hovSura = -1, mx = -9999, my = -9999;
    let rot = 0, t0 = performance.now(), raf = 0, visible = true;
    const GAP = 0.010;

    function build() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2 + 16; // v2.0 — biraz aşağı
      // Mobilde (dar+uzun) min(W,H) çok küçük kalıp halka metnin içinde eziliyor;
      // genişliğe göre büyüterek uzun metin sütununu ÇEVRELER. Masaüstünde
      // 0.44 — İngilizce çeviri Türkçe'den geniş; 0.40'ta halka kenarları metne
      // değiyordu. 0.44 halka kenarını metnin ötesine iter (her iki dilde).
      R = W < 620 ? W * 0.55 : Math.min(W, H) * 0.41;
      pts = []; segs = []; cloud = [];
      const CLN = W < 620 ? 14 : 26;
      for (let ci = 0; ci < CLN; ci++) {
        const lj = (ci * 0.61803) % 1;
        cloud.push({ ch: CLOUD_LETTERS[ci % 14], a0: ci * 2.399963, r: R * (0.55 + lj * 0.82), sz: 26 + ((ci * 0.377) % 1) * 34, p: lj * 6.28 });
      }
      const usable = Math.PI * 2 - GAP * 114;
      let a = -Math.PI / 2;
      for (let s = 0; s < 114; s++) {
        const span = usable * (COUNTS[s] / TOTAL);
        for (let v = 0; v < COUNTS[s]; v++) {
          const t = COUNTS[s] === 1 ? 0.5 : v / (COUNTS[s] - 1);
          const jr = Math.abs((Math.sin(v * 12.9898 + s * 78.233) * 43758.5453) % 1);
          pts.push({ sura: s, a0: a + span * t, r: R * (0.96 + jr * 0.10), tw: jr * 6.28, sz: 0.8 + jr * 1.1 });
        }
        segs.push({ start: a, end: a + span });
        a += span + GAP;
      }
    }

    function draw(now) {
      const rd = reducedRef.current;
      if (!visible) { if (tip) tip.style.opacity = 0; return; }
      const dt = Math.min(now - t0, 50); t0 = now;
      if (!rd) rot += 0.00035 * dt;
      ctx.clearRect(0, 0, W, H);

      // hover tespiti (açı + yarıçap)
      hovSura = -1;
      const dx = mx - cx, dy = my - cy, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > R * 0.82 && dist < R * 1.18) {
        const ma = Math.atan2(dy, dx) - rot, twoPi = Math.PI * 2;
        for (let s = 0; s < 114; s++) {
          const rel = ((ma - segs[s].start) % twoPi + twoPi) % twoPi;
          const span = ((segs[s].end - segs[s].start) % twoPi + twoPi) % twoPi;
          if (rel <= span) { hovSura = s; break; }
        }
      }

      // Clear-zone HALKA yarıçapına bağlı (viewport'a değil) — mobilde uzun
      // ekranda üst/alt yayları kırpmasın, hep tam halka görünsün. clrRx geniş
      // (0.72) — İngilizce gibi geniş çevirilerde metin kenarı temiz kalsın.
      const clrRx = R * 0.72, clrRy = R * 0.72;
      const inClear = (x, y) => { const ddx = (x - cx) / clrRx, ddy = (y - cy) / clrRy; return ddx * ddx + ddy * ddy < 1; };
      const time = now * 0.001;

      // katman 1 — harf bulutu (paralaks: 1/3 hız, ters yön)
      for (let c2 = 0; c2 < cloud.length; c2++) {
        const cl = cloud[c2], ca = cl.a0 - rot * 0.33;
        const x2 = cx + Math.cos(ca) * cl.r, y2 = cy + Math.sin(ca) * cl.r;
        if (inClear(x2, y2)) continue;
        const breathe = (W < 620 ? 0.07 : 0.11) + (rd ? 0.02 : 0.05 * Math.sin(time * 0.6 + cl.p));
        ctx.font = cl.sz + 'px "KFGQPC", "Amiri Quran", serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(212,165,116,' + breathe + ')';
        ctx.fillText(cl.ch, x2, y2);
      }

      // katman 2 — veri halkası (net, önde)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], ang = p.a0 + rot;
        const wob = rd ? 0 : Math.sin(time * 1.4 + p.tw) * 2.2;
        const x = cx + Math.cos(ang) * (p.r + wob), y = cy + Math.sin(ang) * (p.r + wob);
        const hot = p.sura === hovSura;
        if (inClear(x, y) && !hot) continue;
        const tw = rd ? 0.75 : (0.55 + 0.45 * Math.sin(time * 2 + p.tw));
        ctx.beginPath(); ctx.arc(x, y, hot ? p.sz * 1.25 : p.sz, 0, 6.284);
        ctx.fillStyle = hot ? 'rgba(224,180,131,' + (0.5 * tw + 0.25) + ')' : 'rgba(212,165,116,' + (0.10 + 0.20 * tw) + ')';
        ctx.fill();
      }

      // hover: parlayan yay + tooltip
      if (hovSura >= 0 && tip) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.13, segs[hovSura].start + rot, segs[hovSura].end + rot);
        ctx.strokeStyle = 'rgba(212,165,116,.55)'; ctx.lineWidth = 2; ctx.stroke();
        const n = hovSura + 1, mk = MUKATTAA[n], lc = langRef.current;
        const ayetLbl = lc === 'en' ? 'verses' : 'âyet';
        const readLbl = lc === 'en' ? 'CLICK — READ SURA' : 'TIKLA — SÛREYİ OKU';
        tip.style.opacity = 1; tip.style.left = mx + 'px';
        if (my < 150) { tip.style.top = (my + 18) + 'px'; tip.style.transform = 'translate(-50%,0)'; }
        else { tip.style.top = my + 'px'; tip.style.transform = 'translate(-50%,-140%)'; }
        tip.innerHTML =
          '<b>' + n + '. ' + surahName(n, lc) + '</b> <span>· ' + COUNTS[hovSura] + ' ' + ayetLbl + '</span>' +
          (mk ? '<div class="hr-mk" lang="ar" dir="rtl">' + mk + ' <span>MUKATTAA</span></div>' : '') +
          '<div class="hr-cta">' + readLbl + '</div>';
        canvas.style.cursor = 'pointer';
      } else if (tip) { tip.style.opacity = 0; canvas.style.cursor = 'default'; }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) { mx = e.clientX; my = e.clientY; }
    function onClick() {
      if (hovSura >= 0) router.push(`/${langRef.current}/oku/${hovSura + 1}`);
    }

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', build);
    canvas.addEventListener('click', onClick);

    const io = new IntersectionObserver((entries) => {
      const was = visible; visible = entries[0].isIntersecting;
      if (visible && !was) { t0 = performance.now(); raf = requestAnimationFrame(draw); }
      if (!visible && tip) tip.style.opacity = 0;
    }, { threshold: 0.05 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', build);
      canvas.removeEventListener('click', onClick);
      io.disconnect();
    };
  }, [router]);

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'auto' }} />
      <div ref={tipRef} className="hero-ring-tip" role="tooltip" />
    </div>
  );
}
