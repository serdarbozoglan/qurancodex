'use client';

// ─── HifzPanel — Ezber arayüzü (iki durumlu) ────────────────────────────────
//
// Tasarım kararı (kullanıcı onayı 2026-08-02): tek bir kontrol kutusu değil,
// duruma göre iki ayrı yüzey.
//
//   KURULUM  → alt sayfa (bottom sheet). Ekranın altına yapışık, tam
//              genişlik, satır düzeni AYAR paneliyle aynı dilde, altta tam
//              genişlik birincil buton. Başlat'a basınca KAPANIR.
//   ÇALIŞMA  → ince şerit. Sadece durum + duraklat/durdur. Ezber sırasında
//              göz mushafta olur; kontrollerin görünmesine gerek yok.
//
// Neden değişti: önceki tek-kutu hâli (i) ayet metnini kapatıyordu,
// (ii) hiyerarşisi tersti — asıl eylem "Başlat" soluk görünürken bir ayar
// olan "Otomatik" baskındı, (iii) "geliştirici araç çubuğu" hissi veriyordu.
//
// Ses ve zamanlama ReadingMode + useHifzSession sorumluluğunda; bu bileşen
// saf sunum. Gündüz/gece renkleri `theme` ile dışarıdan gelir (CLAUDE.md §13.1).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../../tokens';
import { REPEAT_PRESETS } from '../../hooks/useHifzSession';
import HifzIcon from './HifzIcon';

const stepLabel = (step, tr) => {
  if (!step) return '';
  if (step.from === step.to) return tr ? `Ayet ${step.from}` : `Verse ${step.from}`;
  // Dikiş (blok bağı) blok içi birleştirmeden farklı bir iş yapar — iki bloğu
  // bağlar, tekrarı da sabittir. Etiketi ayrı olmazsa kullanıcı neden birden
  // 10 ayet çaldığını anlamaz.
  if (step.kind === 'seam') return tr ? `${step.from}–${step.to} bağlantı` : `${step.from}–${step.to} link`;
  // Kapanış — programın son adımı, aralığın tamamı.
  if (step.kind === 'final') return tr ? `${step.from}–${step.to} baştan sona` : `${step.from}–${step.to} full`;
  return tr ? `${step.from}–${step.to} birlikte` : `${step.from}–${step.to} together`;
};

const IconClose = ({ size = 12 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconPause = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const IconPlay = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5l11 7-11 7z" />
  </svg>
);

export default function HifzPanel({
  language, isMobile, theme,
  session, repeat, onRepeatChange, auto, onAutoChange,
  activeVerse, available,
  // Başlangıç âyeti SEÇİLEBİLİR olmalı — önceden yalnız okunur bir metindi ve
  // değeri sayfada bir âyete tıklamaya bağlıydı; panelden değiştirilemiyordu
  // (kullanıcı 2026-08-26: "ezber modunda başlangıç ayetini seçemiyorum...
  // hatta sûre de seçilebilmeli"). Sûre + âyet birlikte seçilir.
  surahNames = [], surahAyahCounts = [], currentSurah, onPickStart,
  onStart, onStop, onPause, onResume, onRepeatStep, onClose,
}) {
  const tr = language === 'tr';
  const [showHelp, setShowHelp] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const [pickSurah, setPickSurah] = useState(currentSurah || 1);
  const running = !!session;
  const phase = session?.phase;

  const L = {
    title:   tr ? 'Ezber' : 'Memorize',
    repeat:  tr ? 'Tekrar sayısı' : 'Repetitions',
    auto:    tr ? 'Otomatik ilerleme' : 'Auto-advance',
    startAt: tr ? 'Başlangıç' : 'Start from',
    pickSurah: tr ? 'Sûre' : 'Surah',
    pickAyah:  tr ? 'Âyet' : 'Verse',
    pickHint:  tr ? 'Başlangıç âyetini seç' : 'Choose the starting verse',
    start:   tr ? 'Başlat' : 'Start',
    stop:    tr ? 'Durdur' : 'Stop',
    pause:   tr ? 'Duraklat' : 'Pause',
    resume:  tr ? 'Devam et' : 'Resume',
    again:   tr ? 'Tekrarla' : 'Again',
    next:    tr ? 'Sıradaki' : 'Next',
    paused:  tr ? 'Duraklatıldı' : 'Paused',
    close:   tr ? 'Ezber modunu kapat' : 'Close memorization mode',
    help:    tr ? 'Nasıl çalışır?' : 'How it works',
    pick:    tr ? 'Başlatmak için bir ayete dokun' : 'Tap a verse to begin',
    loading: tr ? 'Sûre yükleniyor…' : 'Loading surah…',
    step:    tr ? 'adım' : 'step',
    autoOn:  tr ? 'Açık' : 'On',
    autoOff: tr ? 'Kapalı' : 'Off',
  };

  const HELP = tr ? [
    ['Ne yapar', 'Seçtiğin ayeti belirlediğin sayıda tekrar tekrar dinletir.'],
    ['Kartopu', 'Ayet 1 ×5 → Ayet 2 ×5 → 1–2 birlikte ×5 → Ayet 3 ×5 → 1–3 birlikte ×5 … Ezberin zor kısmı ayetleri birbirine bağlamaktır; birleştirme adımları bunun içindir.'],
    ['Bloklar', 'Beşer ayetlik bloklar hâlinde ilerler. Blok dolunca sonraki bloğa geçer.'],
    ['Bağlantı', 'Her blok bitince o blok bir öncekiyle birlikte 2 kez çalınır (ör. 6–10 bitince 1–10 bağlantı). Blok dikişi ezberde en çok unutulan yerdir; bu adım onu kapatır.'],
    ['Kapanış', 'Program biterken tüm aralık baştan sona 3 kez okunur. Dikişler komşu blokları bağlar; kapanış ise ezberin bütününü tek akışta sınar. Çok uzun aralıklarda (20 ayetten fazla) eklenmez.'],
    ['"adım 5/38" ne demek', 'Program adımını gösterir, ayet numarasını değil. Her ayetin kendi adımı vardır, üstüne birleştirme, bağlantı ve kapanış adımları eklenir. A\'lâ 19 ayet → 38 adım.'],
    ['Geçişlerde', 'Her adım arasında kısa bir süre durur. O anda "Tekrarla"ya basarsan aynı adımı baştan çalar.'],
    ['Kârî', 'Tüm kârîlerde çalışır. Ezberde kelime kelime vurgu yoktur — ayet ayet ses dosyaları kullanılır, böylece ayet sonları temiz kesilir.'],
  ] : [
    ['What it does', 'Repeats the verse you selected as many times as you choose.'],
    ['Snowball', 'Verse 1 ×5 → Verse 2 ×5 → 1–2 together ×5 → Verse 3 ×5 → 1–3 together ×5 … The hard part of memorising is linking verses; the joining steps are for that.'],
    ['Blocks', 'Advances in blocks of five verses, then moves to the next block.'],
    ['Link', 'When a block ends it is played twice together with the previous one (e.g. after 6–10 comes the 1–10 link). The seam between blocks is where memory fails most; this step closes it.'],
    ['Closing', 'As the plan ends, the whole range is recited from start to finish 3 times. Links join neighbouring blocks; the closing tests the whole memorisation in one flow. It is omitted for very long ranges (over 20 verses).'],
    ['What "step 5/38" means', 'It is the position in the plan, not a verse number. Each verse has its own step, plus the joining, link and closing steps. Al-A\'la has 19 verses → 38 steps.'],
    ['Between steps', 'Pauses briefly between steps. Press "Again" during that pause to redo the step.'],
    ['Reciter', 'Works with every reciter. Word-level highlighting is off here — it plays per-verse files so verse endings stay clean.'],
  ];

  // ── Ortak kabuk ───────────────────────────────────────────────────────────
  const surface = {
    background: theme.bg,
    border: `1px solid ${theme.border}`,
    boxShadow: `0 -8px 40px ${COLORS.panelShadow}`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  };

  const shell = (children, variant) => (
    <div
      role="region"
      aria-label={L.title}
      style={{
        position: 'fixed',
        zIndex: 201,
        // Alt sayfa ekranın altına YAPIŞIK (mobilde tam genişlik); şerit
        // yüzer ve dar kalır. İkisi de thumb-reach bölgesinde.
        ...(variant === 'sheet'
          ? {
            // ReadingMode'da transform'lu bir ata var; `position:fixed` viewport
            // yerine ona göre çözülüyor (390px ekranda containing block 384px).
            // `100vw` denendi: genişlik doğru ama kutu 3px sola taşıp sağda
            // 3px boşluk bırakıyordu (asimetrik). left/right:0 containing
            // block'u tam doldurur — her iki yanda eşit ~3px, taşma yok.
            left: 0, right: 0, margin: isMobile ? 0 : '0 auto',
            bottom: 0,
            width: isMobile ? 'auto' : '440px',
            borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0`,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }
          : {
            left: '50%', transform: 'translateX(-50%)',
            bottom: isMobile ? 'max(14px, env(safe-area-inset-bottom, 14px))' : '18px',
            width: isMobile ? 'calc(100vw - 20px)' : 'auto',
            maxWidth: 'calc(100vw - 20px)',
            borderRadius: RADIUS.pill,
          }),
        ...surface,
      }}
    >
      {children}
    </div>
  );

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '12px', padding: isMobile ? '13px 16px' : '13px 18px',
    borderTop: `1px solid ${theme.border}`,
  };
  const rowLabel = {
    fontFamily: FONTS.body, fontSize: '0.85rem', color: theme.text, fontWeight: 500,
  };

  // ── ÇALIŞMA / GEÇİŞ / DURAKLATILDI — ince şerit ──────────────────────────
  if (running) {
    const inGap = phase === 'gap';
    const isPaused = phase === 'paused';
    const iconBtn = (extra = {}) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '32px', height: '32px', borderRadius: RADIUS.full, flexShrink: 0,
      background: 'transparent', border: `1px solid ${theme.border}`,
      color: theme.muted, cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
      ...extra,
    });

    return shell(
      <div className="mq-box" style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '14px',
        '--pt-d': "8px", '--pt-m': "12px", '--pr-d': "10px", '--pr-m': "12px", '--pb-d': "8px", '--pb-m': "12px", '--pl-d': "16px", '--pl-m': "18px",
      }}>
        <span aria-hidden style={{ color: theme.gold, display: 'flex', flexShrink: 0 }}>
          <HifzIcon size={15} />
        </span>

        {inGap ? (
          <>
            <span style={{
              fontFamily: FONTS.body, fontSize: isMobile ? '0.76rem' : '0.82rem',
              color: theme.text, flex: 1, minWidth: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {L.next}: <strong style={{ color: theme.gold }}>{stepLabel(session.next, tr)}</strong>
            </span>
            <button
              onClick={onRepeatStep}
              aria-label={tr ? 'Tekrarla — bu adımı baştan çal' : 'Again — replay this step'}
              style={{
                fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '7px 13px', borderRadius: RADIUS.pill, flexShrink: 0,
                color: theme.gold, background: COLORS.goldAlpha15,
                border: `1px solid ${theme.gold}`, cursor: 'pointer',
                transition: `all ${TRANSITION.fast}`,
              }}
            >
              ↺ {L.again}
            </button>
          </>
        ) : (
          <>
            {/* Hangi adım + kaçıncı tekrar — tek satır, okunur hiyerarşi */}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
              <span style={{
                fontFamily: FONTS.body, fontSize: isMobile ? '0.98rem' : '0.9rem',
                fontWeight: 700, color: theme.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {stepLabel({ from: session.fromAyah, to: session.toAyah, kind: session.kind }, tr)}
                {isPaused && <span style={{ color: theme.muted, fontWeight: 500 }}> · {L.paused}</span>}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '8px' }}>
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '4px' }}
                  role="progressbar"
                  aria-valuemin={0} aria-valuemax={session.target} aria-valuenow={session.count}
                  aria-label={tr ? 'Tekrar' : 'Repeat'}
                  aria-valuetext={tr
                    ? `${session.count}/${session.target} tekrar tamamlandı`
                    : `${session.count} of ${session.target} repetitions done`}
                >
                  {Array.from({ length: session.target }, (_, i) => (
                    <span key={i} style={{
                      width: isMobile ? '8px' : '6px', height: isMobile ? '8px' : '6px', borderRadius: RADIUS.full,
                      background: i < session.count ? theme.gold : 'transparent',
                      border: `1px solid ${i < session.count ? theme.gold : theme.border}`,
                      transition: `background ${TRANSITION.fast}`,
                    }} />
                  ))}
                </span>
                <span
                  title={tr
                    ? `Kartopu programında ${session.stepIndex + 1}. adım (toplam ${session.stepCount}). Adım sayısı ayet sayısından fazladır: her ayetin kendi adımı vardır, üstüne birleştirme adımları eklenir.`
                    : `Step ${session.stepIndex + 1} of ${session.stepCount} in the plan. There are more steps than verses: each verse has its own step, plus the joining steps.`}
                  style={{ fontFamily: FONTS.body, fontSize: isMobile ? '0.8rem' : '0.68rem', color: theme.muted, whiteSpace: 'nowrap' }}
                >
                  {L.step} {session.stepIndex + 1}/{session.stepCount}
                </span>
              </span>
            </span>

            <button
              onClick={isPaused ? onResume : onPause}
              aria-label={isPaused ? L.resume : L.pause}
              title={isPaused ? L.resume : L.pause}
              style={iconBtn({ color: theme.gold, borderColor: theme.gold, background: COLORS.goldAlpha15 })}
            >
              {isPaused ? <IconPlay /> : <IconPause />}
            </button>
          </>
        )}

        <button onClick={onStop} aria-label={L.stop} title={L.stop} style={iconBtn()}>
          <IconClose size={13} />
        </button>
      </div>,
      'strip',
    );
  }

  // ── KURULUM — alt sayfa ───────────────────────────────────────────────────
  const canStart = available && !!activeVerse;

  return shell(
    <>
      {/* Tutamaç — sayfanın sürüklenebilir hissini verir (mobil kalıbı) */}
      {isMobile && (
        <div aria-hidden style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
          <span style={{ width: '36px', height: '4px', borderRadius: RADIUS.pill, background: theme.border }} />
        </div>
      )}

      {/* Başlık */}
      <div className="mq-box" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "18px", '--pl-m': "16px",
      }}>
        <span aria-hidden style={{ color: theme.gold, display: 'flex' }}><HifzIcon size={16} /></span>
        <span style={{
          fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.gold, flex: 1,
        }}>
          {L.title}
        </span>
        <button
          onClick={() => setShowHelp(v => !v)}
          aria-label={L.help} aria-expanded={showHelp} title={L.help}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px', borderRadius: RADIUS.full, flexShrink: 0,
            background: showHelp ? COLORS.goldAlpha15 : 'transparent',
            border: `1px solid ${showHelp ? theme.gold : theme.border}`,
            color: showHelp ? theme.gold : theme.muted,
            fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', transition: `all ${TRANSITION.fast}`, lineHeight: 1,
          }}
        >?</button>
        <button
          onClick={onClose} aria-label={L.close} title={L.close}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px', borderRadius: RADIUS.full, flexShrink: 0,
            background: 'transparent', border: `1px solid ${theme.border}`,
            color: theme.muted, cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
          }}
        ><IconClose /></button>
      </div>

      {/* Yardım — ayrı yüzen kutu değil, sayfanın İÇİNDE */}
      {showHelp && (
        <div style={{
          ...rowStyle, display: 'block', maxHeight: '40vh', overflowY: 'auto',
          background: COLORS.goldAlpha04,
        }}>
          {HELP.map(([k, v]) => (
            <div key={k} style={{ marginBottom: '10px' }}>
              <div style={{ color: theme.text, fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, marginBottom: '3px' }}>{k}</div>
              <div style={{ color: theme.muted, fontFamily: FONTS.body, fontSize: '0.78rem', lineHeight: 1.55 }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tekrar sayısı */}
      <div style={rowStyle}>
        <span style={rowLabel}>{L.repeat}</span>
        <span style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {REPEAT_PRESETS.map(n => (
            <button
              key={n}
              onClick={() => onRepeatChange(n)}
              aria-pressed={repeat === n}
              style={{
                fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: repeat === n ? 700 : 500,
                width: '38px', height: '34px', borderRadius: RADIUS.sm, cursor: 'pointer',
                transition: `all ${TRANSITION.fast}`, fontVariantNumeric: 'tabular-nums',
                color: repeat === n ? COLORS.btnGoldText : theme.text,
                background: repeat === n ? theme.gold : 'transparent',
                border: `1px solid ${repeat === n ? theme.gold : theme.border}`,
              }}
            >{n}</button>
          ))}
        </span>
      </div>

      {/* Otomatik ilerleme — anahtar */}
      <div style={rowStyle}>
        <span style={rowLabel}>{L.auto}</span>
        <button
          onClick={() => onAutoChange(!auto)}
          role="switch"
          aria-checked={auto}
          aria-label={L.auto}
          style={{
            position: 'relative', width: '50px', height: '30px', flexShrink: 0,
            borderRadius: RADIUS.pill, cursor: 'pointer',
            background: auto ? theme.gold : 'transparent',
            border: `1px solid ${auto ? theme.gold : theme.border}`,
            transition: `all ${TRANSITION.base}`,
          }}
        >
          <span style={{
            position: 'absolute', top: '3px', left: auto ? '23px' : '3px',
            width: '22px', height: '22px', borderRadius: RADIUS.full,
            background: auto ? COLORS.btnGoldText : theme.muted,
            transition: `left ${TRANSITION.base}`,
          }} />
        </button>
      </div>

      {/* Başlangıç âyeti — tıklanabilir; sûre + âyet birlikte seçilir. */}
      <div style={{ ...rowStyle, flexWrap: 'wrap', rowGap: '10px' }}>
        <span style={rowLabel}>{L.startAt}</span>
        <button
          onClick={() => { setPickSurah(currentSurah || 1); setPickOpen(o => !o); }}
          disabled={running}
          title={L.pickHint}
          aria-expanded={pickOpen}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
            color: activeVerse ? theme.gold : theme.muted,
            background: 'transparent', border: 'none', padding: 0,
            cursor: running ? 'default' : 'pointer', opacity: running ? 0.6 : 1,
          }}
        >
          <span>
            {activeVerse
              ? `${surahNames[activeVerse.surah - 1] || activeVerse.surah} ${activeVerse.surah}:${activeVerse.ayah}`
              : '—'}
          </span>
          {!running && (
            <span style={{
              fontSize: '0.6rem', opacity: 0.75, display: 'inline-flex',
              transform: pickOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: `transform ${TRANSITION.fast}`,
            }}>▾</span>
          )}
        </button>

        {pickOpen && !running && (() => {
          // Yerel `select` görünümü panelin geri kalanıyla uyumsuzdu; native
          // ok işareti kaldırılıp (appearance:none) altın bir chevron ve
          // panelin kendi yüzey/kenarlık renkleri kullanılıyor. Native
          // `select` KORUNDU — mobilde işletim sisteminin kendi tekerlek
          // seçicisini açtığı ve klavye/ekran okuyucu desteği hazır geldiği
          // için özel bir açılır listeden daha sağlam.
          const chevron = encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" fill="none" stroke="${theme.gold}" stroke-width="1.6" stroke-linecap="round"/></svg>`
          );
          const fieldBg = theme.fieldBg || theme.bg;
          const fieldBorder = theme.fieldBorder || theme.border;
          const field = {
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
            padding: '10px 30px 10px 12px', borderRadius: RADIUS.md,
            border: `1px solid ${fieldBorder}`,
            background: `url("data:image/svg+xml,${chevron}") no-repeat right 11px center, ${fieldBg}`,
            color: theme.fieldText || theme.text,
            fontFamily: FONTS.body, fontSize: '0.85rem',
            fontWeight: 600, cursor: 'pointer', outline: 'none',
            transition: `border-color ${TRANSITION.fast}, background-color ${TRANSITION.fast}`,
          };
          const cap = {
            display: 'block', fontFamily: FONTS.body, fontSize: '0.6rem',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: theme.muted, marginBottom: '5px',
          };
          const focus = (e) => {
            e.currentTarget.style.borderColor = theme.gold;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.gold}22`;
          };
          const blur = (e) => {
            e.currentTarget.style.borderColor = fieldBorder;
            e.currentTarget.style.boxShadow = 'none';
          };
          return (
            <div style={{
              flexBasis: '100%', display: 'flex', gap: '10px', alignItems: 'flex-end',
              padding: '14px', borderRadius: RADIUS.lg || RADIUS.md,
              border: `1px solid ${theme.border}`,
              background: theme.fieldHover || 'transparent',
            }}>
              <label style={{ flex: 1, minWidth: 0 }}>
                <span style={cap}>{L.pickSurah}</span>
                <select
                  aria-label={L.pickSurah}
                  value={pickSurah}
                  onChange={(e) => setPickSurah(Number(e.target.value))}
                  onFocus={focus} onBlur={blur}
                  style={{ ...field, width: '100%' }}
                >
                  {surahNames.map((nm, idx) => (
                    <option key={idx + 1} value={idx + 1}>{idx + 1}. {nm}</option>
                  ))}
                </select>
              </label>
              <label style={{ width: '104px', flexShrink: 0 }}>
                <span style={cap}>{L.pickAyah}</span>
                <select
                  aria-label={L.pickAyah}
                  defaultValue=""
                  onChange={(e) => {
                    const ayah = Number(e.target.value);
                    if (!ayah) return;
                    onPickStart && onPickStart(pickSurah, ayah);
                    setPickOpen(false);
                  }}
                  onFocus={focus} onBlur={blur}
                  style={{ ...field, width: '100%' }}
                >
                  <option value="">—</option>
                  {Array.from({ length: surahAyahCounts[pickSurah - 1] || 0 }, (_, k) => (
                    <option key={k + 1} value={k + 1}>{k + 1}</option>
                  ))}
                </select>
              </label>
            </div>
          );
        })()}
      </div>

      {/* Birincil eylem — tam genişlik, tereddütsüz */}
      <div className="mq-box" style={{ '--pt-d': "14px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "18px", '--pl-d': "18px", '--pl-m': "16px", borderTop: `1px solid ${theme.border}` }}>
        <button
          onClick={onStart}
          disabled={!canStart}
          style={{
            width: '100%', height: '48px', borderRadius: RADIUS.chip,
            fontFamily: FONTS.body, fontSize: '0.86rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: canStart ? COLORS.btnGoldText : theme.muted,
            background: canStart ? theme.gold : 'transparent',
            border: `1px solid ${canStart ? theme.gold : theme.border}`,
            cursor: canStart ? 'pointer' : 'not-allowed',
            transition: `all ${TRANSITION.fast}`,
          }}
        >
          {L.start}
        </button>
        {!canStart && (
          <div style={{
            marginTop: '9px', textAlign: 'center',
            fontFamily: FONTS.body, fontSize: '0.74rem', color: theme.muted,
          }}>
            {available ? L.pick : L.loading}
          </div>
        )}
      </div>
    </>,
    'sheet',
  );
}
