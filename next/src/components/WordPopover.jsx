'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import { posLabel } from '../utils/corpusPos';

// Büyük puntoda KFGQPC bazı Uthmani karakterleri kötü render ediyor
// (örn. U+06EA asar kasrası → tofu/circle). Popover gösteriminde standart Unicode'a normalize.
function cleanForPopover(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u06E1/g, '\u0652')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/[\u06D6-\u06DC\u06DF\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB-\u06ED]/g, '')
    // Leeds Quranic Arabic Corpus encoding artifacts (@, #, _) used as
    // morphological / sajda markers in the source data. They have no
    // Arabic typography meaning and would render as literal ASCII glyphs
    // beside the word (e.g. 'تَعُولُوا@'). Same strip rule as cleanArabic.
    .replace(/[@#_]/g, '');
}

// Sûre adı haritası — Türkçe transliteration + standart İngilizce (114 sûre).
const SURAH_NAMES = {
  1:{tr:'Fâtiha',en:'Al-Fatiha'},2:{tr:'Bakara',en:'Al-Baqarah'},3:{tr:'Âl-i İmrân',en:'Aal-E-Imran'},
  4:{tr:'Nisâ',en:'An-Nisa'},5:{tr:'Mâide',en:'Al-Maidah'},6:{tr:'En\'âm',en:'Al-Anaam'},
  7:{tr:'A\'râf',en:'Al-Araf'},8:{tr:'Enfâl',en:'Al-Anfal'},9:{tr:'Tevbe',en:'At-Tawbah'},
  10:{tr:'Yûnus',en:'Yunus'},11:{tr:'Hûd',en:'Hud'},12:{tr:'Yûsuf',en:'Yusuf'},
  13:{tr:'Ra\'d',en:'Ar-Rad'},14:{tr:'İbrâhim',en:'Ibrahim'},15:{tr:'Hicr',en:'Al-Hijr'},
  16:{tr:'Nahl',en:'An-Nahl'},17:{tr:'İsrâ',en:'Al-Isra'},18:{tr:'Kehf',en:'Al-Kahf'},
  19:{tr:'Meryem',en:'Maryam'},20:{tr:'Tâhâ',en:'Taha'},21:{tr:'Enbiyâ',en:'Al-Anbiya'},
  22:{tr:'Hac',en:'Al-Hajj'},23:{tr:'Mü\'minûn',en:'Al-Muminun'},24:{tr:'Nûr',en:'An-Nur'},
  25:{tr:'Furkân',en:'Al-Furqan'},26:{tr:'Şuarâ',en:'Ash-Shuara'},27:{tr:'Neml',en:'An-Naml'},
  28:{tr:'Kasas',en:'Al-Qasas'},29:{tr:'Ankebût',en:'Al-Ankabut'},30:{tr:'Rûm',en:'Ar-Rum'},
  31:{tr:'Lokmân',en:'Luqman'},32:{tr:'Secde',en:'As-Sajdah'},33:{tr:'Ahzâb',en:'Al-Ahzab'},
  34:{tr:'Sebe\'',en:'Saba'},35:{tr:'Fâtır',en:'Fatir'},36:{tr:'Yâ-Sîn',en:'Ya-Sin'},
  37:{tr:'Sâffât',en:'As-Saffat'},38:{tr:'Sâd',en:'Sad'},39:{tr:'Zümer',en:'Az-Zumar'},
  40:{tr:'Mü\'min',en:'Ghafir'},41:{tr:'Fussilet',en:'Fussilat'},42:{tr:'Şûrâ',en:'Ash-Shura'},
  43:{tr:'Zuhruf',en:'Az-Zukhruf'},44:{tr:'Duhân',en:'Ad-Dukhan'},45:{tr:'Câsiye',en:'Al-Jathiyah'},
  46:{tr:'Ahkâf',en:'Al-Ahqaf'},47:{tr:'Muhammed',en:'Muhammad'},48:{tr:'Feth',en:'Al-Fath'},
  49:{tr:'Hucurât',en:'Al-Hujurat'},50:{tr:'Kâf',en:'Qaf'},51:{tr:'Zâriyât',en:'Adh-Dhariyat'},
  52:{tr:'Tûr',en:'At-Tur'},53:{tr:'Necm',en:'An-Najm'},54:{tr:'Kamer',en:'Al-Qamar'},
  55:{tr:'Rahmân',en:'Ar-Rahman'},56:{tr:'Vâkıa',en:'Al-Waqiah'},57:{tr:'Hadîd',en:'Al-Hadid'},
  58:{tr:'Mücâdele',en:'Al-Mujadilah'},59:{tr:'Haşr',en:'Al-Hashr'},60:{tr:'Mümtehine',en:'Al-Mumtahanah'},
  61:{tr:'Saf',en:'As-Saf'},62:{tr:'Cum\'a',en:'Al-Jumuah'},63:{tr:'Münâfikûn',en:'Al-Munafiqun'},
  64:{tr:'Teğâbun',en:'At-Taghabun'},65:{tr:'Talâk',en:'At-Talaq'},66:{tr:'Tahrîm',en:'At-Tahrim'},
  67:{tr:'Mülk',en:'Al-Mulk'},68:{tr:'Kalem',en:'Al-Qalam'},69:{tr:'Hâkka',en:'Al-Haqqah'},
  70:{tr:'Meâric',en:'Al-Maarij'},71:{tr:'Nûh',en:'Nuh'},72:{tr:'Cin',en:'Al-Jinn'},
  73:{tr:'Müzzemmil',en:'Al-Muzzammil'},74:{tr:'Müddessir',en:'Al-Muddathir'},75:{tr:'Kıyâme',en:'Al-Qiyamah'},
  76:{tr:'İnsân',en:'Al-Insan'},77:{tr:'Mürselât',en:'Al-Mursalat'},78:{tr:'Nebe\'',en:'An-Naba'},
  79:{tr:'Nâziât',en:'An-Naziat'},80:{tr:'Abese',en:'Abasa'},81:{tr:'Tekvîr',en:'At-Takwir'},
  82:{tr:'İnfitâr',en:'Al-Infitar'},83:{tr:'Mutaffifîn',en:'Al-Mutaffifin'},84:{tr:'İnşikâk',en:'Al-Inshiqaq'},
  85:{tr:'Burûc',en:'Al-Buruj'},86:{tr:'Târık',en:'At-Tariq'},87:{tr:'A\'lâ',en:'Al-Ala'},
  88:{tr:'Ğâşiye',en:'Al-Ghashiyah'},89:{tr:'Fecr',en:'Al-Fajr'},90:{tr:'Beled',en:'Al-Balad'},
  91:{tr:'Şems',en:'Ash-Shams'},92:{tr:'Leyl',en:'Al-Lail'},93:{tr:'Duhâ',en:'Ad-Dhuha'},
  94:{tr:'İnşirah',en:'Ash-Sharh'},95:{tr:'Tîn',en:'At-Tin'},96:{tr:'Alak',en:'Al-Alaq'},
  97:{tr:'Kadr',en:'Al-Qadr'},98:{tr:'Beyyine',en:'Al-Bayyinah'},99:{tr:'Zilzâl',en:'Az-Zalzalah'},
  100:{tr:'Âdiyât',en:'Al-Adiyat'},101:{tr:'Kâri\'a',en:'Al-Qariah'},102:{tr:'Tekâsür',en:'At-Takathur'},
  103:{tr:'Asr',en:'Al-Asr'},104:{tr:'Hümeze',en:'Al-Humazah'},105:{tr:'Fîl',en:'Al-Fil'},
  106:{tr:'Kureyş',en:'Quraysh'},107:{tr:'Mâûn',en:'Al-Maun'},108:{tr:'Kevser',en:'Al-Kawthar'},
  109:{tr:'Kâfirûn',en:'Al-Kafirun'},110:{tr:'Nasr',en:'An-Nasr'},111:{tr:'Tebbet',en:'Al-Masad'},
  112:{tr:'İhlâs',en:'Al-Ikhlas'},113:{tr:'Felak',en:'Al-Falaq'},114:{tr:'Nâs',en:'An-Nas'},
};

// Mekkî/Medenî sınıflandırması — Hafs an Asim standardı (29 Medenî, kalanı Mekkî)
const MADANI = new Set([
  2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49,
  55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110,
]);
const isMakki = (surah) => !MADANI.has(surah);

/**
 * WordPopover — Corpus Quran kelime detay paneli.
 * Profesyonel düzen: bilingual (TR + EN), gruplandırılmış sections, büyük Arapça.
 *
 * Veri kaynağı: Quranic Arabic Corpus (Kais Dukes, Leeds University)
 *               https://corpus.quran.com — akademik atıfla kullanım
 */
export default function WordPopover({ word, surah, ayah, onClose, dayMode = false }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const panelRef = useRef(null);

  // Palette — light cream parchment (day) vs deep navy (night). Day mode
  // mirrors the verse compare modal (named as the reference): same warm
  // paper tones, label gold #9a7838, and deep-ink body text #1f1908.
  const C = dayMode
    ? {
        backdrop: 'rgba(20,12,4,0.55)',
        panelBg: '#faf6ed',
        panelBorderTop: 'rgba(180,140,80,0.45)',
        panelBorderSide: 'rgba(180,140,80,0.22)',
        textPrimary: '#1f1908',
        textSecondary: '#3a2814',
        textMuted: '#6a5638',
        divider: 'rgba(180,140,80,0.18)',
        sectionLabel: '#9a7838',
        valueArabicBg: 'rgba(212,165,116,0.06)',
        gold: '#9a7838',
        goldSoft: 'rgba(212,165,116,0.05)',
        emerald: '#1a7a4c',
        emeraldSoft: 'rgba(26,122,76,0.12)',
        emeraldBorder: 'rgba(26,122,76,0.42)',
        chipBg: 'rgba(212,165,116,0.05)',
        chipText: '#1f1908',
      }
    : {
        backdrop: 'rgba(0,0,0,0.62)',
        panelBg: 'linear-gradient(180deg, #0f1530 0%, #0a1024 100%)',
        panelBorderTop: COLORS.softGoldAlpha35,
        panelBorderSide: 'rgba(255,255,255,0.07)',
        textPrimary: '#e8e6e3',
        textSecondary: '#cdc6bb',
        textMuted: '#94a3b8',
        divider: 'rgba(255,255,255,0.08)',
        sectionLabel: COLORS.softGoldAlpha60,
        valueArabicBg: 'rgba(255,255,255,0.04)',
        gold: COLORS.softGold,
        goldSoft: 'rgba(212,165,116,0.18)',
        emerald: '#2ecc71',
        emeraldSoft: 'rgba(46,204,113,0.12)',
        emeraldBorder: 'rgba(46,204,113,0.35)',
        chipBg: 'rgba(120,168,255,0.12)',
        chipText: '#9ec1ff',
      };

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!word) return null;

  const corpusUrl = `https://corpus.quran.com/wordmorphology.jsp?location=(${surah}:${ayah}:${word.idx})`;
  const surahName = SURAH_NAMES[surah] ? (tr ? SURAH_NAMES[surah].tr : SURAH_NAMES[surah].en) : `Sûre ${surah}`;

  const hasTr = !!word.tr;
  const hasEn = !!word.en;
  const hasFeaturesTr = !!word.featuresTr;
  const hasFeatures = !!word.features;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: C.backdrop, backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'wpFadeIn 0.18s ease-out',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: C.panelBg,
          borderTop: `1px solid ${C.panelBorderTop}`,
          borderLeft: `1px solid ${C.panelBorderSide}`,
          borderRight: `1px solid ${C.panelBorderSide}`,
          borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0`,
          width: '100%', maxWidth: '600px',
          maxHeight: '88vh', overflowY: 'auto',
          padding: 0,
          fontFamily: FONTS.body,
          animation: 'wpSlideUp 0.24s cubic-bezier(0.2,0.8,0.2,1)',
          boxShadow: '0 -24px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drag handle */}
        <div style={{ paddingTop: '12px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '40px', height: '4px', borderRadius: '2px',
            background: C.divider,
          }} />
        </div>

        {/* HEADER — Arabic word + transliteration + reference */}
        <div style={{
          padding: '14px 28px 22px',
          textAlign: 'center',
          borderBottom: `1px solid ${COLORS.softGoldAlpha15}`,
        }}>
          <p
            lang="ar" dir="rtl"
            style={{
              fontFamily: FONTS.quran,
              fontSize: '3rem',
              color: C.gold,
              lineHeight: 1.45,
              margin: 0,
              textShadow: `0 0 36px ${COLORS.softGoldAlpha25}`,
            }}
          >
            {cleanForPopover(word.ar)}
          </p>
          {word.translit && (
            <p style={{
              fontSize: '0.95rem', color: C.textMuted,
              fontStyle: 'italic', margin: '6px 0 0',
              letterSpacing: '0.02em',
            }}>
              {word.translit}
            </p>
          )}
          <div style={{
            margin: '14px 0 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <p style={{
              fontSize: '0.72rem',
              // Use palette gold (full opacity) — soft-gold-60 was too faded
              // on the cream day-mode bg, making the breadcrumb illegible.
              color: C.gold,
              margin: 0,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              {surahName} · {tr ? 'Âyet' : 'Verse'} {ayah} · {tr ? 'Kelime' : 'Word'} {word.idx}
            </p>
            <span style={{
              display: 'inline-block',
              padding: '2px 9px',
              borderRadius: RADIUS.pillSm,
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              // Site-wide convention (RevelationTimeline.jsx, IlkSonKelimeler.jsx,
              // SebebiNuzul.jsx): Mekkî = royal gold #c9a227, Medenî = emerald
              // #2ecc71. Day-mode emerald uses a slightly darker shade for
              // readable contrast on cream background.
              color: isMakki(surah) ? '#c9a227' : (dayMode ? '#1a7a4c' : '#2ecc71'),
              background: isMakki(surah) ? 'rgba(201,162,39,0.12)' : (dayMode ? 'rgba(26,122,76,0.10)' : 'rgba(46,204,113,0.12)'),
              border: `1px solid ${isMakki(surah) ? 'rgba(201,162,39,0.40)' : (dayMode ? 'rgba(26,122,76,0.40)' : 'rgba(46,204,113,0.40)')}`,
            }}>
              {isMakki(surah) ? 'Mekkî' : 'Medenî'}
            </span>
          </div>
        </div>

        {/* SECTION — Anlam (Meaning). Corpus gloss '*' means the word
            inherits its meaning from the preceding word group (typical
            for grammatical particles like cer harfi + isim chains).
            Show an em dash instead of the raw asterisk to communicate
            this without exposing data-encoding internals. */}
        {(hasTr || hasEn) && (
          <Section title={tr ? 'Anlam' : 'Meaning'} C={C}>
            {hasTr && (
              <Field label={tr ? 'Türkçe' : 'Turkish'} primary C={C}>
                {word.tr === '*'
                  ? <span style={{ color: C.textMuted, fontStyle: 'italic' }}>{tr ? 'önceki kelimeyle bağlı' : 'linked to previous word'}</span>
                  : word.tr}
              </Field>
            )}
            {hasEn && (
              <Field label={tr ? 'İngilizce' : 'English'} C={C}>
                <span style={{ fontStyle: 'italic', color: C.textMuted }}>
                  {word.en === '*' ? '—' : word.en}
                </span>
              </Field>
            )}
          </Section>
        )}

        {/* SECTION — Köken (Etymology) */}
        {(word.root || word.lemma) && (
          <Section title={tr ? 'Köken' : 'Etymology'} C={C}>
            {word.root && (
              <Field label={tr ? 'Kök' : 'Root'} C={C}>
                <span lang="ar" dir="rtl" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.7rem',
                  color: C.gold,
                  letterSpacing: '0.06em',
                }}>
                  {cleanForPopover(word.root)}
                </span>
              </Field>
            )}
            {word.lemma && (
              <Field label={tr ? 'Kök Kelime' : 'Lemma'} C={C}>
                <span lang="ar" dir="rtl" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.6rem',
                  color: C.textPrimary,
                }}>
                  {cleanForPopover(word.lemma)}
                </span>
              </Field>
            )}
          </Section>
        )}

        {/* SECTION — Gramer (Grammar) */}
        {(word.pos || hasFeatures || hasFeaturesTr) && (
          <Section title={tr ? 'Gramer' : 'Grammar'} C={C}>
            {word.pos && (
              <Field label={tr ? 'Sözcük Türü' : 'Part of Speech'} C={C}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px',
                  borderRadius: RADIUS.pillSm,
                  background: C.chipBg,
                  border: '1px solid rgba(120,168,255,0.32)',
                  color: C.chipText, fontSize: '0.85rem', fontWeight: 600,
                  letterSpacing: '0.02em',
                }}>
                  {posLabel(word.pos, language)}
                </span>
                <span style={{
                  fontSize: '0.7rem', color: C.textMuted,
                  marginLeft: '10px', fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}>
                  {word.pos}
                </span>
              </Field>
            )}
            {hasFeaturesTr && tr && (
              <Field label="Özellikler" primary C={C}>
                {word.featuresTr}
              </Field>
            )}
            {hasFeatures && (
              <Field label={tr ? 'Detay (akademik)' : 'Detail'} C={C}>
                <span style={{
                  fontStyle: 'italic',
                  color: C.textMuted,
                  fontSize: '0.85rem',
                  lineHeight: 1.55,
                }}>
                  {word.features}
                </span>
              </Field>
            )}
          </Section>
        )}

        {/* SOURCE BAND — palette-aware: warm gold-tinted wash in day mode,
            soft dark overlay in night mode. Was hardcoded rgba(0,0,0,0.18)
            which rendered as a dirty gray band on the cream day-mode bg. */}
        <div style={{
          padding: '18px 28px 22px',
          background: dayMode ? 'rgba(212,165,116,0.10)' : 'rgba(0,0,0,0.18)',
          borderTop: `1px solid ${C.divider}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '0.62rem', color: C.sectionLabel,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 600, margin: '0 0 4px',
            }}>
              {tr ? 'Akademik Kaynak' : 'Academic Source'}
            </p>
            <p style={{
              fontSize: '0.78rem', color: C.textSecondary,
              margin: 0, lineHeight: 1.5,
            }}>
              Quranic Arabic Corpus<br />
              <span style={{ color: C.textMuted }}>
                Kais Dukes · {tr ? 'Leeds Üniversitesi' : 'Leeds University'}
              </span>
            </p>
          </div>
          <a
            href={corpusUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem', fontWeight: 600,
              color: C.gold,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px',
              border: `1px solid ${COLORS.softGoldAlpha40}`,
              borderRadius: RADIUS.md,
              background: COLORS.softGoldAlpha08,
              transition: 'all 0.15s',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.softGoldAlpha15; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLORS.softGoldAlpha08; }}
          >
            corpus.quran.com
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        {/* Cross-page CTA — Atlas ekosistem bağlantıları */}
        <div style={{
          padding: '12px 28px 16px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { event: 'openConceptGraph', labelTr: 'Kavram Ağı',     labelEn: 'Concept Graph' },
            { event: 'openHeatmap',      labelTr: 'Kelime Sıklığı', labelEn: 'Word Frequency' },
            { event: 'openVerseGraph',   labelTr: 'Ayet Haritası',  labelEn: 'Verse Map', detail: { search: `${surah}:${ayah}` } },
          ].map(cta => (
            <button
              key={cta.event}
              onClick={() => {
                // Preserve the current word so Navbar can re-open this popover
                // when the user backs out of the target overlay (parity with
                // returnToConcept / returnToWow patterns, CLAUDE.md §13.12).
                const wordRestore = { word, surah, ayah };
                const detail = { ...(cta.detail || {}), returnToWord: true, wordRestore };
                onClose();
                window.dispatchEvent(new CustomEvent(cta.event, { detail }));
              }}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: COLORS.softGoldAlpha75,
                background: C.valueArabicBg,
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: RADIUS.pillSm,
                padding: '5px 11px',
                cursor: 'pointer',
                fontFamily: FONTS.body,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = COLORS.softGold; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.softGoldAlpha75; }}
            >
              ↗ {tr ? cta.labelTr : cta.labelEn}
            </button>
          ))}
        </div>

        {/* Close hint */}
        <p style={{
          textAlign: 'center', fontSize: '0.66rem',
          color: '#334155', padding: '4px 0 16px', margin: 0,
        }}>
          Esc · {tr ? 'dışa tıklayarak kapat' : 'tap outside to close'}
        </p>
      </div>

      <style>{`
        @keyframes wpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wpSlideUp { from { transform: translateY(32px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

// ── Reusable section ──────────────────────────────────────────────────────────
// Accepts the C palette so labels swap between day and night themes.
function Section({ title, children, C }) {
  return (
    <div style={{ padding: '16px 28px 6px' }}>
      <p style={{
        fontSize: '0.62rem',
        color: C ? C.sectionLabel : COLORS.softGoldAlpha55,
        margin: '0 0 12px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}>
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

// ── Reusable field row ────────────────────────────────────────────────────────
// Accepts the C palette. In day mode, primary values use deep-ink text
// (#1f1908) for legibility; in night mode, light off-white. Non-primary
// values use the muted color in both themes.
function Field({ label, children, primary, C }) {
  const labelColor = C ? C.textMuted : '#64748b';
  const valuePrimary = C ? C.textPrimary : '#e8e6e3';
  const valueMuted = C ? C.textMuted : '#94a3b8';
  const dividerColor = C ? C.divider : 'rgba(255,255,255,0.04)';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '8px 0',
      borderBottom: `1px solid ${dividerColor}`,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '0.72rem',
        color: labelColor,
        fontWeight: 500,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        textAlign: 'right',
        color: primary ? valuePrimary : valueMuted,
        fontSize: primary ? '0.98rem' : '0.88rem',
        fontWeight: primary ? 500 : 400,
        lineHeight: 1.5,
      }}>
        {children}
      </span>
    </div>
  );
}
