'use client';

// ─── QuietParticles — kart bölgelerine yumuşak gold particle drift ────────────
// Hero'daki ParticleBackground'un sade kuzeni. CSS animation, ~10 particle,
// %20 opacity altında, çok yavaş drift. Cluster div'leri içine fixed pos'lu
// koyulur, zIndex 0 (kartlar üstte zIndex 1).
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 3,
  duration: 18 + Math.random() * 22,
  delay: -Math.random() * 20,
}));

export default function QuietParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {PARTICLES.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,165,116,0.6), rgba(212,165,116,0))',
            opacity: 0.4,
            animation: `quietDrift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes quietDrift {
          0%   { transform: translate(0, 0); opacity: 0; }
          10%  { opacity: 0.5; }
          50%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { transform: translate(40px, -120px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
