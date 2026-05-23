'use client';

// ─── ToolStub ────────────────────────────────────────────────────────────────
// Generic placeholder overlay. Vite Navbar 38 farklı tool overlay'i lazy
// import ediyor. Bunlar batch'lerle next/'e migrate edilene kadar, her tool
// click'i bu generic stub'ı açar. Görsel UI Vite ile birebir aynı kalsın
// diye Navbar'ın mega-menü tasarımı bütünüyle korunur; sadece "açılacak
// içerik" şimdilik bu placeholder.
//
// Migration ilerledikçe Navbar.jsx'teki lazy import'lar bu dosya yerine
// gerçek tool component'lerine çevrilecek (batch by batch).

import { useEffect } from 'react';
import { OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, COLORS, FONTS } from '@/tokens';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ToolStub({ onClose, toolName = 'Tool' }) {
  const { language } = useLanguage();

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={OVERLAY_BASE} role="dialog">
      <div style={OVERLAY_HEADER}>
        <span style={OVERLAY_TITLE}>{toolName}</span>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = COLORS.offWhite;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = CLOSE_BTN.background;
            e.currentTarget.style.color = COLORS.silver;
          }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.78rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: COLORS.gold,
          }}
        >
          Migration · Faz 4 · Yapım Aşamasında
        </div>

        <h1
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: COLORS.offWhite,
            margin: 0,
          }}
        >
          {toolName}
        </h1>

        <p
          style={{
            color: COLORS.silver,
            maxWidth: '480px',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {language === 'tr'
            ? 'Bu araç Next.js mimarisine taşınıyor. Migration batch\'leri ilerledikçe gerçek içerikle değişecek.'
            : 'This tool is being migrated to the Next.js architecture. Real content will appear as migration batches progress.'}
        </p>

        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: '1.75rem',
            color: COLORS.gold,
            marginTop: '16px',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </main>
    </div>
  );
}
