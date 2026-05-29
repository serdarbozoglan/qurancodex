'use client';

import { useRef, useEffect } from 'react';

// CLAUDE.md §6 — Mukattaa harfleri (14 harf): Kur'an'da 29 surenin
// başında geçen "kesik harfler" — yapısal bir kodlama. Hero arka planında
// %5 oranında particle yerine bu harflerden biri süzülür. Şeffaf, yavaş,
// görünür-görünmez sınırında: site adı "Görünmeyen Mimari"ye semantic
// parite. Akademik kullanıcı için subtle ama unique brand detayı.
const MUKATTAA_HARFLER = ['ا', 'ح', 'ر', 'س', 'ص', 'ط', 'ع', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ي'];

export default function ParticleBackground({ particleCount = 80, glyphRatio = 0.20 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let w = 0;
    let h = 0;

    const particles = Array.from({ length: particleCount }, () => {
      const isGlyph = Math.random() < glyphRatio;
      // Glyph'ler için: bazıları belirgin sağa, bazıları sola süzülsün — sadece
      // yukarı düz değil. Daha güçlü horizontal drift = çoklu yön hissi.
      const glyphDirection = Math.random();
      const glyphRising = glyphDirection > 0.3; // %70 yukarı, %30 aşağı
      return {
        x: 0,
        y: 0,
        isGlyph,
        glyph: isGlyph ? MUKATTAA_HARFLER[Math.floor(Math.random() * MUKATTAA_HARFLER.length)] : null,
        // Glyph 28-46px (kullanıcı bir tık büyüt dedi — 22-38'den +6px artırıldı)
        size: isGlyph ? Math.random() * 18 + 28 : Math.random() * 2 + 0.5,
        // Glyph'ler daha güçlü horizontal drift: -0.2 → +0.2 (önce -0.075 → +0.075)
        // Bu sayede bazıları belirgin sağa, bazıları sola süzülür
        speedX: isGlyph ? (Math.random() - 0.5) * 0.4 : (Math.random() - 0.5) * 0.15,
        // Glyph: %70 yukarı, %30 aşağı (çoklu yön); nokta: sadece yukarı
        speedY: isGlyph
          ? (glyphRising ? -1 : 1) * (Math.random() * 0.15 + 0.05)
          : -(Math.random() * 0.25 + 0.05),
        opacity: isGlyph ? Math.random() * 0.18 + 0.15 : Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7
          ? [201, 162, 39]   // royal gold
          : [212, 165, 116], // antique gold
      };
    });

    // Canvas fillText API'sı font HAZIR olmasını ister. Yenilemede KFGQPC font
    // cache invalidate olabilir; .load() Promise'i await edilmediği için canvas
    // çizmeye fallback serif ile başlıyordu — fallback serif Arapça mukattaa
    // harflerini desteklemediği için harfler GÖRÜNMÜYORDU (user audit).
    // Çözüm: bir flag ile glyph çizimini font hazır olana dek skip et.
    let glyphsReady = false;
    if (document.fonts && document.fonts.load) {
      document.fonts.load("32px 'KFGQPC'")
        .then(() => { glyphsReady = true; })
        .catch(() => { glyphsReady = true; });
    } else {
      glyphsReady = true;
    }

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent.clientWidth;
      h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.forEach(p => {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.phase += 0.012;

        // Glyph daha büyük olduğu için margin daha geniş tutuldu (size kadar)
        const margin = p.isGlyph ? p.size : 5;
        // Y-wrap her iki yönde: yukarı çıkan alttan, aşağı inen üstten girer
        if (p.y < -margin) {
          p.y = h + margin;
          p.x = Math.random() * w;
        } else if (p.y > h + margin) {
          p.y = -margin;
          p.x = Math.random() * w;
        }
        // X-wrap: ekstra glyph horizontal drift için her iki yön
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;

        const twinkle = 0.5 + 0.5 * Math.sin(p.phase);
        const alpha = p.opacity * twinkle;
        const [r, g, b] = p.color;

        if (p.isGlyph) {
          // Font yüklenene dek glyph çizimi atla — fallback serif Arapça
          // mukattaa için tofu/boş üretir, harfler "hiç yoktu" gibi görünür.
          if (!glyphsReady) continue;
          // Arapça mukattaa harfi: KFGQPC font + RTL ortalama
          ctx.font = `${p.size}px 'KFGQPC', 'Amiri Quran', serif`;
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.glyph, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [particleCount, glyphRatio]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
