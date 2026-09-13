'use client';

// ─── ToolHero — §13.18 standart araç sayfası hero'su (paylaşılan) ────────────
//
// Referans: Dua Dili hero'su (CLAUDE.md §13.18 kanonik blok). Ölçüler oradan
// birebir alınmıştır: zemin yalnız `qc-hero-bg`, besmele 2.6/2.2rem ve altında
// 24px, çapa âyeti clamp(1.7rem, 4.2vw, 2.6rem) ve altında 12px.
//
// Hero çocuklarında `mq-box` KULLANILMAZ: kapsayıcı --pt-d/--pb-d gibi CSS
// değişkenlerini tanımlar ve bunlar miras alınır; `mq-box` taşıyan besmele o
// padding'i kendi kutusuna uygular ve kutu 50px yerine 142px olur (§13.18'de
// belgelenen hata sınıfı).
//
// Arapça metin ÇAĞIRAN sayfadan gelir ve verse-graph'tan enjekte edilmiştir;
// bu bileşen Arapça üretmez.

import { COLORS, FONTS, SEMANTIC } from '../tokens';

export default function ToolHero({
  language,
  ar,              // çapa âyeti (verse-graph'tan, temizlenmiş)
  trTr, trEn,      // âyetin anlam özeti
  refTr, refEn,    // "Şûrâ 42:30"
  whisperTr, whisperEn,
  eyebrowTr, eyebrowEn,
  titleTr, titleEn,
  subtitleTr, subtitleEn,
}) {
  const tr = language === 'tr';
  return (
    <div className="mq-box qc-hero-bg" style={{
      '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px",
      '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
      flexShrink: 0,
    }}>
      <div className="mq-fs" style={{
        '--fs-d': '2.6rem', '--fs-m': '2.2rem',
        color: COLORS.gold, opacity: 0.82,
        fontFamily: FONTS.bismillah,
        marginBottom: '24px', lineHeight: 1.2, textAlign: 'center',
      }} lang="ar" aria-label="Bismillāh">﷽</div>

      <p dir="rtl" lang="ar" className="qc-verse-breathe" style={{
        fontFamily: FONTS.quran,
        fontSize: 'clamp(1.7rem, 4.2vw, 2.6rem)',
        color: COLORS.gold,
        lineHeight: 2.1,
        margin: '0 auto 12px',
        maxWidth: '820px',
        textAlign: 'center',
      }}>{ar}</p>

      <p className="mq-fs" style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.offWhite,
        '--fs-d': '1.1rem', '--fs-m': '1rem',
        lineHeight: 1.6, maxWidth: '660px', margin: '0 auto 8px',
      }}>&quot;{tr ? trTr : trEn}&quot;</p>

      <p style={{
        color: SEMANTIC.textMuted, fontFamily: FONTS.body,
        fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 26px', textAlign: 'center',
      }}>— {tr ? refTr : refEn}</p>

      {(tr ? whisperTr : whisperEn) && (
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver,
          '--fs-d': '1.05rem', '--fs-m': '0.95rem',
          lineHeight: 1.8, maxWidth: '720px', margin: '0 auto 26px', opacity: 0.9,
        }}>{tr ? whisperTr : whisperEn}</p>
      )}

      <div aria-hidden="true" style={{
        width: '120px', height: '1px', margin: '0 auto 26px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)`,
      }} />

      <p style={{
        color: COLORS.gold, fontSize: '0.72rem', letterSpacing: '0.3em',
        textTransform: 'uppercase', opacity: 0.75, fontFamily: FONTS.body,
        fontWeight: 700, margin: '0 0 14px',
      }}>{tr ? eyebrowTr : eyebrowEn}</p>

      <h2 className="mq-fs" style={{
        fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
        '--fs-d': 'clamp(2.4rem, 4.2vw, 3.4rem)', '--fs-m': 'clamp(1.9rem, 8vw, 2.4rem)',
        lineHeight: 1.15, margin: '0 auto 12px', letterSpacing: '0.01em', maxWidth: '820px',
      }}>{tr ? titleTr : titleEn}</h2>

      {(tr ? subtitleTr : subtitleEn) && (
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.2rem)', '--fs-m': '1rem',
          lineHeight: 1.5, maxWidth: '680px', margin: '0 auto', opacity: 0.92,
        }}>{tr ? subtitleTr : subtitleEn}</p>
      )}
    </div>
  );
}
