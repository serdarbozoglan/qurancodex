'use client';

// ─── HifzPanel — Ezber modu kontrol şeridi ──────────────────────────────────
// ReadingMode'un altına sabitlenen ince kontrol şeridi. Üç durumu var:
//
//   Boşta     : tekrar sayısı + otomatik ilerleme + "Başlat"
//   Çalışıyor : adım etiketi (Ayet 3 / 1–3 birlikte) + tekrar noktaları + Durdur
//   Geçiş     : "sıradaki …" + "Tekrarla" kaçışı  (adımlar arası ~2 sn)
//
// Ses ve zamanlama tamamen ReadingMode + useHifzSession sorumluluğunda; bu
// bileşen saf sunum. Gündüz/gece renkleri `theme` prop'u ile dışarıdan gelir
// (ReadingMode'un `C` nesnesinin alt kümesi) — bileşen kendi palet kararını
// vermez, CLAUDE.md §13.1.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../../tokens';
import { REPEAT_PRESETS } from '../../hooks/useHifzSession';
import HifzIcon from './HifzIcon';

// Adım etiketi: "Ayet 3" veya "1–3 birlikte"
function stepLabel(step, tr) {
  if (!step) return '';
  if (step.from === step.to) return tr ? `Ayet ${step.from}` : `Verse ${step.from}`;
  return tr ? `${step.from}–${step.to} birlikte` : `${step.from}–${step.to} together`;
}

export default function HifzPanel({
  language,
  isMobile,
  theme,              // { bg, border, text, muted, gold }
  session,            // useHifzSession.session — null ise boşta
  repeat,
  onRepeatChange,
  auto,
  onAutoChange,
  activeVerse,        // üzerinde başlatılacak ayet (null ise başlat kapalı)
  available,          // karaoke destekli kârî + timing yüklü mü
  onStart,
  onStop,
  onRepeatStep,       // geçiş penceresindeki "Tekrarla" kaçışı
  onClose,
}) {
  const tr = language === 'tr';
  const [showHelp, setShowHelp] = useState(false);
  const running = !!session;
  const inGap = session?.phase === 'gap';

  const L = {
    title:     tr ? 'Ezber' : 'Memorize',
    repeat:    tr ? 'Tekrar' : 'Repeat',
    auto:      tr ? 'Otomatik' : 'Auto',
    start:     tr ? 'Başlat' : 'Start',
    stop:      tr ? 'Durdur' : 'Stop',
    again:     tr ? 'Tekrarla' : 'Again',
    next:      tr ? 'Sıradaki' : 'Next',
    close:     tr ? 'Ezber modunu kapat' : 'Close memorization mode',
    help:      tr ? 'Nasıl çalışır?' : 'How it works',
    pickVerse: tr ? 'Önce bir ayet seç' : 'Select a verse first',
    autoTitle: tr
      ? 'Açık: bir adım bitince sıradakine kendiliğinden geçer. Kapalı: her adımdan sonra durur.'
      : 'On: moves to the next step automatically. Off: stops after each step.',
    // Karaoke desteklemeyen kârîlerde ayet ayet mp3 zinciri kullanılır; A–B
    // döngüsü için gereken ms damgaları yoktur (bkz. RECITERS.quranComId).
    noReciter: tr ? 'Bu kârîde ezber modu yok — ♪ işaretli bir kârî seç'
                  : 'Not available for this reciter — pick one marked ♪',
  };

  const HELP = tr ? [
    ['Ne yapar', 'Seçtiğin ayeti belirlediğin sayıda tekrar tekrar dinletir.'],
    ['Kartopu', 'Ayet 1 ×5 → Ayet 2 ×5 → 1–2 birlikte ×5 → Ayet 3 ×5 → 1–3 birlikte ×5 … Ezberin zor kısmı ayetleri birbirine bağlamaktır; birleştirme adımları bunun içindir.'],
    ['Bloklar', 'Beşer ayetlik bloklar hâlinde ilerler. Blok dolunca sonraki bloğa geçer.'],
    ['"adım 5/34" ne demek', 'Program adımını gösterir, ayet numarasını değil. Adım sayısı ayet sayısından fazladır: her ayetin kendi adımı vardır, üstüne birleştirme adımları eklenir. A\'lâ 19 ayet → 34 adım.'],
    ['Geçişlerde', 'Her adım arasında iki saniye durur. O anda "Tekrarla"ya basarsan aynı adımı baştan çalar — henüz oturmadıysa.'],
    ['Kârî', 'Kelime takibi olan (♪) kârîlerde çalışır. Kârîyi üstteki menüden değiştirebilirsin.'],
  ] : [
    ['What it does', 'Repeats the verse you selected as many times as you choose.'],
    ['Snowball', 'Verse 1 ×5 → Verse 2 ×5 → 1–2 together ×5 → Verse 3 ×5 → 1–3 together ×5 … The hard part of memorising is linking verses; the joining steps are for that.'],
    ['Blocks', 'Advances in blocks of five verses, then moves to the next block.'],
    ['What "step 5/34" means', 'It is the position in the plan, not a verse number. There are more steps than verses: each verse has its own step, plus the joining steps. Al-A\'la has 19 verses → 34 steps.'],
    ['Between steps', 'Pauses two seconds between steps. Press "Again" during that pause to redo the step.'],
    ['Reciter', 'Works with reciters that have word timing (♪). Change the reciter from the menu above.'],
  ];

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
  const canStart = available && !!activeVerse;

  return (
    <div
      role="region"
      aria-label={L.title}
      style={{
        // fixed — ReadingMode'un scroll container'ından bağımsız; TAHTA
        // katmanıyla aynı yaklaşım, ders sırasında çizim açıkken de erişilir.
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        // Mobilde global BugReportFab (fixed, bottom:20px left:20px, ~44px)
        // şeridin sol ucuyla çakışıyor. Panel tam genişlik olduğu için yana
        // kaçamıyoruz — FAB'ın üstüne çıkıyoruz. Masaüstünde şerit dar ve
        // ortalı olduğu için çakışma yok, 18px kalıyor.
        bottom: isMobile ? '76px' : '18px',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '8px',
        // Mobilde SABİT tam genişlik. `auto` bırakılırsa fixed konumlu kutu
        // içeriğine göre büzülür (390px ekranda 192px ölçüldü) ve her şey dar
        // bir sütuna sarar — okunaksız, ayet metnini de kötü kapatır.
        // Masaüstünde içerik kadar genişlik doğru davranış.
        width: isMobile ? 'calc(100vw - 16px)' : 'auto',
        maxWidth: 'calc(100vw - 16px)',
      }}
    >
      {/* ── Yardım baloncuğu — şeridin ÜSTÜNDE ─────────────────────────── */}
      {showHelp && (
        <div
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: RADIUS.chip,
            boxShadow: `0 10px 34px ${COLORS.panelShadow}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: isMobile ? '14px 16px' : '16px 20px',
            maxWidth: isMobile ? '100%' : '520px',
            maxHeight: '46vh',
            overflowY: 'auto',
          }}
        >
          <div style={{
            color: theme.gold, fontFamily: FONTS.body, fontSize: '0.68rem',
            fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {L.help}
          </div>
          {HELP.map(([k, v]) => (
            <div key={k} style={{ marginBottom: '9px' }}>
              <div style={{
                color: theme.text, fontFamily: FONTS.body, fontSize: '0.76rem',
                fontWeight: 700, marginBottom: '2px',
              }}>{k}</div>
              <div style={{
                color: theme.muted, fontFamily: FONTS.body, fontSize: '0.76rem',
                lineHeight: 1.55,
              }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Kontrol şeridi ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '13px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: isMobile ? '10px' : '8px',
        padding: isMobile ? '10px 12px' : '10px 18px',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: RADIUS.chip,
        boxShadow: `0 10px 34px ${COLORS.panelShadow}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: theme.gold, flexShrink: 0 }}>
          <HifzIcon size={isMobile ? 14 : 16} />
          <span style={{
            fontFamily: FONTS.body, fontSize: isMobile ? '0.66rem' : '0.72rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            {L.title}
          </span>
        </span>

        <button
          onClick={() => setShowHelp(v => !v)}
          aria-label={L.help}
          aria-expanded={showHelp}
          title={L.help}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '20px', height: '20px', borderRadius: RADIUS.full, flexShrink: 0,
            background: showHelp ? COLORS.goldAlpha15 : 'transparent',
            border: `1px solid ${showHelp ? theme.gold : theme.border}`,
            color: showHelp ? theme.gold : theme.muted,
            fontFamily: FONTS.body, fontSize: '0.7rem', fontWeight: 700,
            cursor: 'pointer', transition: `all ${TRANSITION.fast}`, lineHeight: 1,
          }}
        >?</button>

        <span aria-hidden style={{ width: '1px', height: '18px', background: theme.border, flexShrink: 0 }} />

        {running ? (
          <>
            {/* Adım etiketi — "Ayet 3" veya "1–3 birlikte" */}
            <span style={{
              fontFamily: FONTS.body, fontSize: isMobile ? '0.74rem' : '0.8rem',
              fontWeight: 700, color: inGap ? theme.muted : theme.text, flexShrink: 0,
            }}>
              {stepLabel({ from: session.fromAyah, to: session.toAyah }, tr)}
            </span>

            {/* Program içindeki konum — "adım" etiketi ZORUNLU. Etiketsiz
                "5/34" ayet numarası gibi okunuyordu; A'lâ 19 ayet olduğu için
                kullanıcı "34 ayet mi var?" diye takılıyordu (rapor 2026-07-31).
                34 = 19 tek ayet + 15 birleştirme adımı. */}
            <span
              title={tr
                ? `Kartopu programında ${session.stepIndex + 1}. adım (toplam ${session.stepCount}). Adım sayısı ayet sayısından fazladır: her ayet için bir tek-ayet adımı, ayrıca birleştirme adımları vardır.`
                : `Step ${session.stepIndex + 1} of ${session.stepCount} in the snowball plan. There are more steps than verses: each verse gets its own step, plus the joining steps.`}
              style={{
                fontFamily: FONTS.body, fontSize: '0.66rem', color: theme.muted,
                flexShrink: 0, opacity: 0.85, whiteSpace: 'nowrap',
              }}
            >
              {tr ? 'adım' : 'step'}{' '}
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {session.stepIndex + 1}/{session.stepCount}
              </span>
            </span>

            {inGap ? (
              <>
                {/* Geçiş penceresi — sıradaki adım + kaçış */}
                {session.next && (
                  <span style={{
                    fontFamily: FONTS.body, fontSize: isMobile ? '0.7rem' : '0.75rem',
                    color: theme.gold, flexShrink: 0,
                  }}>
                    → {L.next}: {stepLabel(session.next, tr)}
                  </span>
                )}
                <button
                  onClick={onRepeatStep}
                  style={{ ...btnBase, color: theme.gold, background: COLORS.goldAlpha15, border: `1px solid ${theme.gold}` }}
                >
                  ↺ {L.again}
                </button>
              </>
            ) : (
              <>
                {/* Tekrar noktaları — tamamlananlar dolu */}
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={session.target}
                  aria-valuenow={session.count}
                  aria-label={L.repeat}
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
              </>
            )}

            <button
              onClick={onStop}
              style={{ ...btnBase, color: theme.gold, background: 'transparent', border: `1px solid ${theme.gold}` }}
            >
              {L.stop}
            </button>
          </>
        ) : (
          <>
            <span style={{
              fontFamily: FONTS.body, fontSize: isMobile ? '0.66rem' : '0.7rem',
              color: theme.muted, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
            }}>
              {L.repeat}
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

            {/* Otomatik ilerleme anahtarı */}
            <button
              onClick={() => onAutoChange(!auto)}
              aria-pressed={auto}
              title={L.autoTitle}
              style={{
                ...btnBase,
                padding: isMobile ? '7px 10px' : '8px 12px',
                fontWeight: auto ? 700 : 500,
                color: auto ? theme.gold : theme.muted,
                background: auto ? COLORS.goldAlpha15 : 'transparent',
                border: `1px solid ${auto ? theme.gold : theme.border}`,
              }}
            >
              {auto ? '✓ ' : ''}{L.auto}
            </button>

            <button
              onClick={onStart}
              disabled={!canStart}
              title={!available ? L.noReciter : (!activeVerse ? L.pickVerse : undefined)}
              style={{
                ...btnBase,
                color: canStart ? COLORS.btnGoldText : theme.muted,
                background: canStart ? theme.gold : 'transparent',
                border: `1px solid ${canStart ? theme.gold : theme.border}`,
                cursor: canStart ? 'pointer' : 'not-allowed',
                opacity: canStart ? 1 : 0.55,
              }}
            >
              {L.start}
            </button>

            {/* Buton neden kapalı — title mobilde erişilemez, metin olarak da göster */}
            {!canStart && (
              <span style={{
                fontFamily: FONTS.body, fontSize: '0.66rem', color: theme.muted,
                maxWidth: isMobile ? '100%' : '250px', lineHeight: 1.4,
              }}>
                {available ? L.pickVerse : L.noReciter}
              </span>
            )}
          </>
        )}

        <button
          onClick={onClose}
          aria-label={L.close}
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
    </div>
  );
}
