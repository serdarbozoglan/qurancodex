'use client';

// ─── CardWaveViz — "Ses Mimarisi" kartı için canlı ses dokusu (v2.0) ─────────
// Kartın kendi temasını görselleştirir: SOL yarı sert/patlayıcı ünsüzler
// (jagged), SAĞ yarı akıcı/yumuşak sesler (smooth) — kartın anlattığı
// "sert ünsüzler korku · yumuşak akıcılar şefkat" temasının görsel karşılığı.
// Süs değil, kartın içeriğinin dokusu. Reduced-motion (§9): statik tek kare.
// Performans (§8): ekran dışında rAF durur.

import { useEffect, useRef } from 'react';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';

export default function CardWaveViz() {
  const ref = useRef(null);
  const reduced = useReducedMotionSafe();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, on = true;
    const hash = (n) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;

    function size() {
      const r = cv.getBoundingClientRect();
      cv.width = r.width * dpr; cv.height = 52 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(now) {
      const rd = reducedRef.current;
      const w = cv.getBoundingClientRect().width, h = 52, t = now * 0.001;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const u = x / w;
        const mix = Math.min(Math.max((u - 0.35) / 0.3, 0), 1); // 0=sert →1=akıcı
        const n1 = hash(Math.floor(u * 40)), n2 = hash(Math.floor(u * 40) + 1), fr = (u * 40) % 1;
        const hard = ((n1 + (n2 - n1) * fr) - 0.5) * 34 * (1 + (rd ? 0 : 0.4 * Math.sin(t * 3 + u * 9)));
        const soft = Math.sin(u * 14 + (rd ? 0 : t * 1.8)) * 12 + Math.sin(u * 5 - (rd ? 0 : t)) * 6;
        const y = h / 2 + hard * (1 - mix) + soft * mix;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(212,165,116,.6)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      if (on && !rd) raf = requestAnimationFrame(draw);
    }
    const io = new IntersectionObserver((e) => {
      const was = on; on = e[0].isIntersecting;
      if (on && !was) { size(); raf = requestAnimationFrame(draw); }
    }, { threshold: 0.3 });
    io.observe(cv);
    size();
    if (reducedRef.current) draw(0); else raf = requestAnimationFrame(draw);
    const onResize = () => { if (on) size(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ width: '100%', height: '52px', display: 'block', margin: '0 0 18px', opacity: 0.9 }}
    />
  );
}
