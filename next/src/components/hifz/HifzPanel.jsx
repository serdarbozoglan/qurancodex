'use client';

// ─── HifzPanel — Ezber modu kontrol çubuğu (Faz 1) ───────────────────────────
// ReadingMode'un altına sabitlenen ince kontrol şeridi. İki durumu var:
//
//   Boşta   : tekrar sayısı seçimi + "Başlat" (aktif ayet üzerinde çalışır)
//   Çalışıyor: ayet referansı + tekrar noktaları + "Durdur"
//
// Ses ve zamanlama tamamen ReadingMode + useHifzSession sorumluluğunda; bu
// bileşen saf sunum. Gündüz/gece renkleri `theme` prop'u ile dışarıdan gelir
// (ReadingMode'un `C` nesnesinin ilgili alt kümesi) — bileşen kendi palet
// kararını vermez, CLAUDE.md §13.1.
// ─────────────────────────────────────────────────────────────────────────────

import { COLORS, FONTS, RADIUS, TRANSITION } from '../../tokens';
import { REPEAT_PRESETS } from '../../hooks/useHifzSession';
import HifzIcon from './HifzIcon';

export default function HifzPanel({
  language,
  isMobile,
  theme,              // { bg, border, text, muted, gold }
  session,            // useHifzSession.session — null ise boşta
  repeat,
  onRepeatChange,
  activeVerse,        // üzerinde başlatılacak ayet (null ise başlat kapalı)
  available,          // karaoke destekli kârî + timing yüklü mü
  onStart,
  onStop,
  onClose,
}) {
  const tr = language === 'tr';
  const running = !!session;

  const label = {
    title:     tr ? 'Ezber' : 'Memorize',
    repeat:    tr ? 'Tekrar' : 'Repeat',
    start:     tr ? 'Başlat' : 'Start',
    stop:      tr ? 'Durdur' : 'Stop',
    close:     tr ? 'Ezber modunu kapat' : 'Close memorization mode',
    pickVerse: tr ? 'Bir ayet seç' : 'Select a verse',
    // Karaoke desteklemeyen kârîlerde ayet ayet mp3 zinciri kullanılır; A–B
    // döngüsü için gereken ms damgaları yoktur (bkz. RECITERS.quranComId).
    noReciter: tr ? 'Bu kârîde ezber modu yok — karaoke destekli bir kârî seç'
                  : 'Not available for this reciter — pick a karaoke-capable one',
  };

  const btnBase = {
    fontFamily: FONTS.body,
    fontSize: isMobile ? '0.72rem' : '0.76rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: RADIUS.sm,
    cursor: 'pointer',
    transition: `all ${TRANSITION.fast}`,
    padding: isMobile ? '7px 14px' : '8px 18px',
    lineHeight: 1,
  };

  return (
    <div
      role="region"
      aria-label={label.title}
      style={{
        // fixed — ReadingMode'un scroll container'ından bağımsız kalsın; TAHTA
        // katmanıyla aynı yaklaşım. zIndex 200 TAHTA canvas'ıyla eşit ki ders
        // sırasında çizim açıkken de erişilebilir olsun.
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: isMobile ? '12px' : '18px',
        zIndex: 201,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '10px' : '14px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 'calc(100vw - 24px)',
        padding: isMobile ? '9px 12px' : '10px 18px',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: RADIUS.chip,
        boxShadow: `0 10px 34px ${COLORS.panelShadow}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Başlık — ikon + etiket */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: theme.gold, flexShrink: 0 }}>
        <HifzIcon size={isMobile ? 14 : 16} />
        <span style={{
          fontFamily: FONTS.body, fontSize: isMobile ? '0.66rem' : '0.72rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          {label.title}
        </span>
      </span>

      <span aria-hidden style={{ width: '1px', height: '18px', background: theme.border, flexShrink: 0 }} />

      {running ? (
        <>
          {/* Hangi ayet — RTL karışmasın diye referans latin rakamlarla */}
          <span style={{
            fontFamily: FONTS.body, fontSize: isMobile ? '0.74rem' : '0.8rem',
            fontWeight: 600, color: theme.text, flexShrink: 0,
          }}>
            {session.surah}:{session.fromAyah}
          </span>

          {/* Tekrar noktaları — tamamlananlar dolu, kalanlar boş */}
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={session.target}
            aria-valuenow={session.count}
            aria-label={label.repeat}
          >
            {Array.from({ length: session.target }, (_, i) => (
              <span
                key={i}
                style={{
                  width: isMobile ? '7px' : '8px',
                  height: isMobile ? '7px' : '8px',
                  borderRadius: RADIUS.full,
                  background: i < session.count ? theme.gold : 'transparent',
                  border: `1px solid ${i < session.count ? theme.gold : theme.border}`,
                  transition: `background ${TRANSITION.fast}`,
                }}
              />
            ))}
          </span>

          <span style={{
            fontFamily: FONTS.body, fontSize: isMobile ? '0.7rem' : '0.75rem',
            fontWeight: 700, color: theme.muted, flexShrink: 0, fontVariantNumeric: 'tabular-nums',
          }}>
            {session.count}/{session.target}
          </span>

          <button
            onClick={onStop}
            style={{
              ...btnBase,
              color: theme.gold,
              background: 'transparent',
              border: `1px solid ${theme.gold}`,
            }}
          >
            {label.stop}
          </button>
        </>
      ) : (
        <>
          <span style={{
            fontFamily: FONTS.body, fontSize: isMobile ? '0.66rem' : '0.7rem',
            color: theme.muted, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
          }}>
            {label.repeat}
          </span>

          <span style={{ display: 'flex', gap: '4px' }}>
            {REPEAT_PRESETS.map(n => (
              <button
                key={n}
                onClick={() => onRepeatChange(n)}
                aria-pressed={repeat === n}
                style={{
                  fontFamily: FONTS.body,
                  fontSize: isMobile ? '0.72rem' : '0.76rem',
                  fontWeight: repeat === n ? 700 : 500,
                  width: isMobile ? '28px' : '32px',
                  height: isMobile ? '28px' : '30px',
                  borderRadius: RADIUS.sm,
                  cursor: 'pointer',
                  transition: `all ${TRANSITION.fast}`,
                  color: repeat === n ? theme.gold : theme.text,
                  background: repeat === n ? COLORS.goldAlpha15 : 'transparent',
                  border: `1px solid ${repeat === n ? theme.gold : theme.border}`,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {n}
              </button>
            ))}
          </span>

          <button
            onClick={onStart}
            disabled={!available || !activeVerse}
            title={!available ? label.noReciter : (!activeVerse ? label.pickVerse : undefined)}
            style={{
              ...btnBase,
              color: available && activeVerse ? COLORS.btnGoldText : theme.muted,
              background: available && activeVerse ? theme.gold : 'transparent',
              border: `1px solid ${available && activeVerse ? theme.gold : theme.border}`,
              cursor: available && activeVerse ? 'pointer' : 'not-allowed',
              opacity: available && activeVerse ? 1 : 0.55,
            }}
          >
            {label.start}
          </button>

          {/* Neden kapalı — buton disabled olduğunda sebebi görünür olmalı,
              title attribute mobilde erişilemez. */}
          {!available && (
            <span style={{
              fontFamily: FONTS.body, fontSize: '0.66rem', color: theme.muted,
              maxWidth: isMobile ? '100%' : '260px', lineHeight: 1.4,
            }}>
              {label.noReciter}
            </span>
          )}
        </>
      )}

      <button
        onClick={onClose}
        aria-label={label.close}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: RADIUS.full,
          background: 'transparent', border: `1px solid ${theme.border}`,
          color: theme.muted, cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
          flexShrink: 0,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
