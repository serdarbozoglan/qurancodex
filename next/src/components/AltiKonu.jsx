'use client';

// ─── AltiKonu — Tool sayfası WRAPPER ────────────────────
// Anasayfa Highlights section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import Highlights from '../sections/Highlights';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function AltiKonu({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        }
        titleTr="Altı Konu, Altı Sır"
        titleEn="Six Topics, Six Secrets"
        subtitleTr="Prefrontal · parmak izi · modüler anlatı · ..."
        subtitleEn="Prefrontal · fingerprint · modular narrative · ..."
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: FONTS.bismillah,
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 12px',
            textShadow: `0 0 22px ${COLORS.gold}1f`,
          }}
        >
          اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا
        </p>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65,
          maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          "{tr ? "Hâlâ Kur'an üzerinde derin derin düşünmüyorlar mı? Yoksa kalpler kilitli mi?" : "Will they not then ponder upon the Quran? Or are there locks upon their hearts?"}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginBottom: '24px',
        }}>— {tr ? "Muhammed 47:24" : "Muḥammad 47:24"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Altı Konu, Altı Sır" : "Six Topics, Six Secrets"}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Prefrontal · parmak izi · modüler anlatı · ..." : "Prefrontal · fingerprint · modular narrative · ..."}
        </p>
      </div>

      {/* Anasayfa Highlights section AYNEN — memory no-downgrade guarantee */}
      <Highlights />

      {/* CrossToolCTA — 6 konu insanı, kâinatı, anlatıyı, zamanı, sesi ve
          adı ilgilendirir; okuyucu ilgili derinlemesine tool'lara yönlendirilir. */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '0 16px 80px' : '0 32px 100px' }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            {
              href: `/${language}/atlas/insan-tanimi`,
              titleTr: "Kur'an'da İnsan",
              titleEn: 'The Human in the Quran',
              descTr: 'Nefs, kalp, ruh, akıl — insanın çok-boyutlu tanımı.',
              descEn: 'Nafs, qalb, rūḥ, ʿaql — the multi-dimensional definition of the human.',
            },
            {
              href: `/${language}/atlas/insan-psikolojisi`,
              titleTr: 'İnsan Psikolojisi',
              titleEn: 'Human Psychology',
              descTr: "Kur'an'ın iç dünya haritası — 7 psikolojik davranış deseni.",
              descEn: "The Quran's inner-world map — 7 psychological behavior patterns.",
            },
            {
              href: `/${language}/graf/kavram`,
              titleTr: 'Kavram Ağı',
              titleEn: 'Concept Network',
              descTr: '65 kavramın Kur\'an içindeki bağlantı haritası.',
              descEn: 'Network map of 65 Quranic concepts.',
            },
          ]}
        />
      </div>
    </div>
  );
}
