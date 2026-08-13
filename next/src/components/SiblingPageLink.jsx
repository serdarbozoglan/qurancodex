'use client';

// ─── SiblingPageLink — kardeş sayfa geçişi ──────────────────────────────────
//
// /hakkinda (Metodoloji) ve /kaynakca (Kaynakça) bir çift gibi davranmalı:
// anasayfadaki MethodologyRibbon "Metodoloji & Kaynaklar" diyerek ikisini
// birden vaat ediyor ama yalnız /hakkinda'ya götürüyor.
//
// Ölçüm (2026-08-13):
//   /hakkinda  (2.387px) → /kaynakca'ya TEK link, y=1530px'te (sayfanın %64'ü),
//                          gövde metninin içinde gömülü — pratikte görünmez.
//   /kaynakca  (5.039px) → /hakkinda'ya HİÇ link yok. Çıkmaz sokak.
//
// Bu bileşen her iki sayfanın başlığının hemen altında durur; küçük, sessiz,
// ama görünür.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { COLORS, FONTS, RADIUS } from '../tokens';

export default function SiblingPageLink({ href, labelTr, labelEn, language = 'tr' }) {
  const tr = language !== 'en';
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        padding: '8px 14px 8px 12px',
        borderRadius: RADIUS.pillSm || '999px',
        background: `${COLORS.gold}0f`,
        border: `1px solid ${COLORS.gold}2e`,
        color: COLORS.gold,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textDecoration: 'none',
        transition: 'background 0.45s cubic-bezier(0.32,0.72,0,1), border-color 0.45s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" style={{ flexShrink: 0, opacity: 0.85 }}
      >
        <path d="M4 19.5V6a2 2 0 0 1 2-2h9l5 5v10.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M14 4v5h5" />
      </svg>
      <span>{tr ? labelTr : labelEn}</span>
      <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>→</span>
    </Link>
  );
}
