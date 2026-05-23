'use client';

// ─── Navbar (minimal Faz 4.0 versiyonu) ──────────────────────────────────────
// Vite'taki 1565-satırlık mega-menu state-machine Navbar route-based
// versiyonuyla değiştirildi. Şu an minimal:
//   - Logo (homepage link)
//   - Language switcher (TR/EN)
//   - "Kur'an'ı Oku" CTA (Faz 4'te /oku route'una bağlanacak)
//
// Mega-menü dropdown'ları (Keşfet, Araçlar) Vite'ta state-based overlay
// trigger'larıydı; Next.js'te tool'lar route'a dönüştükçe (Faz 4 batch'leri)
// burada Link tabanlı dropdown'lar tekrar açılır.
//
// Şimdilik tool keşfi için kullanıcı homepage'in discovery layer'ına
// (PathCards, AllTopics, ToolsHighlight) erişiyor.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS } from '@/tokens';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Ana menü"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? COLORS.panelBg : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${COLORS.glassBorderSoft}` : '1px solid transparent',
        transition: 'background 0.2s, border-color 0.2s, backdrop-filter 0.2s',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: '1.15rem',
            fontWeight: 700,
            color: COLORS.gold,
            letterSpacing: '0.02em',
          }}
        >
          QuranCodex
        </span>
      </Link>

      {/* Right side: language + read CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Language switcher — CLAUDE.md §13.13: navbar buttons height 32px */}
        <button
          onClick={toggleLanguage}
          aria-label={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
          style={{
            height: '32px',
            padding: '0 12px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: '6px',
            color: COLORS.offWhite,
            fontFamily: FONTS.body,
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        >
          {language === 'tr' ? 'EN' : 'TR'}
        </button>

        {/* "Kur'an'ı Oku" CTA — Faz 4'te /oku route'una bağlanacak;
            şimdilik # — ReadingMode taşınmadı */}
        <Link
          href="/oku"
          aria-label={t('hero.ctaRead') || (language === 'tr' ? "Kur'an'ı Oku" : 'Read the Quran')}
          style={{
            height: '32px',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0 16px',
            background: COLORS.gold,
            color: COLORS.cosmicBlack,
            fontFamily: FONTS.body,
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            borderRadius: '6px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.royalGold;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.gold;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {language === 'tr' ? "Kur'an'ı Oku" : 'Read'}
        </Link>
      </div>
    </nav>
  );
}
