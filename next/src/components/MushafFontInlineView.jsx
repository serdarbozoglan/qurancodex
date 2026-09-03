'use client';

// ─── Mushaf Görünümü — KENDİ FONTUMUZLA (ReadingMode içine gömülü, PROTOTİP, 2026-08-20) ─
// Önceki HAYRAT GÖRSELİ tabanlı deneme (MushafInlineView.jsx, ENABLE_MUSHAF_IMAGE_MODE
// ile kapatıldı) yerine YÖN DEĞİŞTİ: telifli görsel hiç kullanılmıyor, gerçek mushaf
// satır kırılımları (public/mushaf-line-breaks.json — arka planda sayfa sayfa elle/
// görsel-karşılaştırmalı çıkarılıyor) sitenin kendi ShaykhHamdullah fontuyla render
// ediliyor. Kavram kanıtı kullanıcıya artifact olarak gösterildi ve onaylandı.
//
// Şu an yalnız veri çıkarımı tamamlanan sayfalar (bkz. mushaf-line-breaks.json'ın
// kendi anahtarları) kullanılabilir — kapsam dışı sayfa istenirse nazikçe uyarır.
// Bu dosya SADECE önizleme amaçlı, henüz ReadingMode'un asıl "Mushaf" sekmesine
// bağlanmadı (ENABLE_MUSHAF_IMAGE_MODE ile aynı temkin).

import { useState } from 'react';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../lib/surahNames';
import { COLORS, FONTS, SEMANTIC, RADIUS, TRANSITION } from '../tokens';
import lineBreaks from '../../public/mushaf-line-breaks.json';

const PAGE_KEYS = Object.keys(lineBreaks).map(Number).sort((a, b) => a - b);

const PlayIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);
const PauseIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const ChevronIcon = ({ dir }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

function VerseRow({ surah, ayah, language, theme }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(surah, ayah);
  const names = language === 'en' ? SURAH_NAMES_EN : SURAH_NAMES_TR;
  const label = `${names[surah - 1]} ${surah}:${ayah}`;

  return (
    <button
      onClick={toggle}
      disabled={failed}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '9px 12px', borderRadius: RADIUS.md,
        border: `1px solid ${playing ? COLORS.goldAlpha45 : theme.border}`,
        background: playing ? COLORS.goldAlpha15 : theme.rowBg,
        color: failed ? theme.faint : theme.text,
        cursor: failed ? 'default' : 'pointer',
        transition: TRANSITION.fast || 'all 0.15s',
        fontFamily: FONTS.body, fontSize: '0.8rem', textAlign: 'left',
      }}
    >
      <span aria-hidden="true" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '24px', height: '24px', borderRadius: '50%',
        background: playing ? COLORS.gold : theme.iconBg,
        color: playing ? COLORS.cosmicBlack : theme.muted, flexShrink: 0,
      }}>
        {loading ? '…' : playing ? <PauseIcon /> : <PlayIcon />}
      </span>
      <span>{label}</span>
      {failed && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: theme.faint }}>{language === 'en' ? 'unavailable' : 'sesli okuma yok'}</span>}
    </button>
  );
}

export default function MushafFontInlineView({ language, isMobile, dayMode }) {
  const [idx, setIdx] = useState(0);
  const page = PAGE_KEYS[idx];
  const data = lineBreaks[String(page)];

  const theme = dayMode
    ? { text: COLORS.mushafPaperText, muted: COLORS.mushafPaperMuted, faint: COLORS.mushafPaperFaint, border: 'rgba(120,90,40,0.18)', rowBg: 'rgba(120,90,40,0.04)', iconBg: 'rgba(120,90,40,0.08)' }
    : { text: SEMANTIC.textPrimary, muted: SEMANTIC.textMuted, faint: SEMANTIC.textFaint, border: SEMANTIC.textFaint + '22', rowBg: 'rgba(255,255,255,0.03)', iconBg: 'rgba(255,255,255,0.08)' };

  const goPrev = () => setIdx(i => Math.max(0, i - 1));
  const goNext = () => setIdx(i => Math.min(PAGE_KEYS.length - 1, i + 1));

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', padding: isMobile ? '16px 12px 60px' : '24px 16px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: theme.faint, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {language === 'en' ? 'Font prototype — no copyrighted image' : 'Font prototipi — telifli görsel yok'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <button onClick={goPrev} disabled={idx === 0} aria-label={language === 'en' ? 'Previous' : 'Önceki'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.muted, cursor: 'pointer', opacity: idx === 0 ? 0.35 : 1 }}>
              <ChevronIcon dir="left" />
            </button>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.76rem', color: theme.muted, minWidth: '70px', textAlign: 'center' }}>
              {language === 'en' ? 'Page' : 'Sayfa'} {page + 1}
            </span>
            <button onClick={goNext} disabled={idx === PAGE_KEYS.length - 1} aria-label={language === 'en' ? 'Next' : 'Sonraki'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.muted, cursor: 'pointer', opacity: idx === PAGE_KEYS.length - 1 ? 0.35 : 1 }}>
              <ChevronIcon dir="right" />
            </button>
          </div>
        </div>

        <div style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          padding: isMobile ? '28px 18px' : '40px 36px',
          marginBottom: '20px',
          background: dayMode ? COLORS.mushafPaperBg : 'rgba(255,255,255,0.02)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        }}>
          {data.lines.map((line, i) => (
            <div
              key={i}
              dir="rtl"
              lang="ar"
              className="mq-fs" style={{
                fontFamily: "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif",
                '--fs-d': '1.85rem', '--fs-m': '1.5rem',
                lineHeight: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                color: dayMode ? COLORS.paperSepiaLight : SEMANTIC.textPrimary,
                marginBottom: i === data.lines.length - 1 ? 0 : (isMobile ? '20px' : '28px'),
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {data.verses.map(([s, a]) => (
            <VerseRow key={`${s}:${a}`} surah={s} ayah={a} language={language} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
