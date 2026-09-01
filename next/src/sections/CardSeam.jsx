'use client';

// ─── CardSeam — Kartlar arası görsel nefes / ince ayraç ───────────────────────
// İnce gold filigree + ortada minik 8-köşeli yıldız (Islamic motif).
// Her kart arasında otomatik yerleştirilir; "klinik liste" hissini kırar,
// kartlara nefes verir.
// ──────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';
import { COLORS } from '../tokens';

export default function CardSeam({ variant = 'normal' }) {
  const reduced = useReducedMotionSafe();
  const big = variant === 'seal';

  return (
    <div
      aria-hidden="true"
      style={{
        padding: big ? '40px 24px 30px' : '24px 24px 16px',
        textAlign: 'center',
        background: 'transparent',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: big ? '14px' : '10px',
          justifyContent: 'center',
        }}
      >
        {/* Sol filigree */}
        <div style={{
          width: big ? '90px' : '60px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}88)`,
        }} />

        {/* Sol diamond — sadece seal variant */}
        {big && (
          <div style={{
            width: '5px', height: '5px',
            transform: 'rotate(45deg)',
            background: `${COLORS.gold}66`,
            opacity: 0.7,
          }} />
        )}

        {/* Merkezi ornament — 8-köşeli yıldız (Islamic motif) */}
        <svg aria-hidden="true"
          width={big ? '20' : '14'}
          height={big ? '20' : '14'}
          viewBox="0 0 24 24"
          fill="none"
          style={{ opacity: big ? 0.9 : 0.75 }}
        >
          <path
            d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z"
            fill={COLORS.gold}
            opacity={big ? 0.85 : 0.7}
          />
          <circle cx="12" cy="12" r="1.4" fill={COLORS.cosmicBlack} opacity={0.9} />
        </svg>

        {/* Sağ diamond — sadece seal variant */}
        {big && (
          <div style={{
            width: '5px', height: '5px',
            transform: 'rotate(45deg)',
            background: `${COLORS.gold}66`,
            opacity: 0.7,
          }} />
        )}

        {/* Sağ filigree */}
        <div style={{
          width: big ? '90px' : '60px',
          height: '1px',
          background: `linear-gradient(90deg, ${COLORS.gold}88, transparent)`,
        }} />
      </motion.div>
    </div>
  );
}
