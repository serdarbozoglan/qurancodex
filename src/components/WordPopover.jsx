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
    .replace(/[\u06D6-\u06DC\u06DF\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB-\u06ED]/g, '');
}

// Sûre adı haritası — şimdilik sadece prototip kapsamı (Fâtiha). Genişletme: 114 sûre.
const SURAH_NAMES = {
  1: { tr: 'Fâtiha', en: 'Al-Fatiha' },
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
export default function WordPopover({ word, surah, ayah, onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const panelRef = useRef(null);

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
        background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'wpFadeIn 0.18s ease-out',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #0f1530 0%, #0a1024 100%)',
          borderTop: `1px solid ${COLORS.softGoldAlpha35}`,
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
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
            background: 'rgba(255,255,255,0.18)',
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
              color: COLORS.softGold,
              lineHeight: 1.45,
              margin: 0,
              textShadow: `0 0 36px ${COLORS.softGoldAlpha25}`,
            }}
          >
            {cleanForPopover(word.ar)}
          </p>
          {word.translit && (
            <p style={{
              fontSize: '0.95rem', color: '#94a3b8',
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
              fontSize: '0.7rem',
              color: COLORS.softGoldAlpha60,
              margin: 0,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
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
              color: isMakki(surah) ? '#f7c873' : '#7dd3fc',
              background: isMakki(surah) ? 'rgba(247,200,115,0.10)' : 'rgba(125,211,252,0.10)',
              border: `1px solid ${isMakki(surah) ? 'rgba(247,200,115,0.32)' : 'rgba(125,211,252,0.32)'}`,
            }}>
              {isMakki(surah) ? 'Mekkî' : 'Medenî'}
            </span>
          </div>
        </div>

        {/* SECTION — Anlam (Meaning) */}
        {(hasTr || hasEn) && (
          <Section title={tr ? 'Anlam' : 'Meaning'}>
            {hasTr && (
              <Field label={tr ? 'Türkçe' : 'Turkish'} primary>
                {word.tr}
              </Field>
            )}
            {hasEn && (
              <Field label={tr ? 'İngilizce' : 'English'}>
                <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>{word.en}</span>
              </Field>
            )}
          </Section>
        )}

        {/* SECTION — Köken (Etymology) */}
        {(word.root || word.lemma) && (
          <Section title={tr ? 'Köken' : 'Etymology'}>
            {word.root && (
              <Field label={tr ? 'Kök' : 'Root'}>
                <span lang="ar" dir="rtl" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.7rem',
                  color: COLORS.softGold,
                  letterSpacing: '0.06em',
                }}>
                  {cleanForPopover(word.root)}
                </span>
              </Field>
            )}
            {word.lemma && (
              <Field label={tr ? 'Kök Kelime' : 'Lemma'}>
                <span lang="ar" dir="rtl" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.6rem',
                  color: '#e8e6e3',
                }}>
                  {cleanForPopover(word.lemma)}
                </span>
              </Field>
            )}
          </Section>
        )}

        {/* SECTION — Gramer (Grammar) */}
        {(word.pos || hasFeatures || hasFeaturesTr) && (
          <Section title={tr ? 'Gramer' : 'Grammar'}>
            {word.pos && (
              <Field label={tr ? 'Sözcük Türü' : 'Part of Speech'}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px',
                  borderRadius: RADIUS.pillSm,
                  background: 'rgba(120,168,255,0.12)',
                  border: '1px solid rgba(120,168,255,0.32)',
                  color: '#9ec1ff', fontSize: '0.85rem', fontWeight: 600,
                  letterSpacing: '0.02em',
                }}>
                  {posLabel(word.pos, language)}
                </span>
                <span style={{
                  fontSize: '0.7rem', color: '#475569',
                  marginLeft: '10px', fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}>
                  {word.pos}
                </span>
              </Field>
            )}
            {hasFeaturesTr && tr && (
              <Field label="Özellikler" primary>
                {word.featuresTr}
              </Field>
            )}
            {hasFeatures && (
              <Field label={tr ? 'Detay (akademik)' : 'Detail'}>
                <span style={{
                  fontStyle: 'italic',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  lineHeight: 1.55,
                }}>
                  {word.features}
                </span>
              </Field>
            )}
          </Section>
        )}

        {/* SOURCE BAND */}
        <div style={{
          padding: '18px 28px 22px',
          background: 'rgba(0,0,0,0.18)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '0.62rem', color: COLORS.softGoldAlpha55,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 600, margin: '0 0 4px',
            }}>
              {tr ? 'Akademik Kaynak' : 'Academic Source'}
            </p>
            <p style={{
              fontSize: '0.78rem', color: '#94a3b8',
              margin: 0, lineHeight: 1.5,
            }}>
              Quranic Arabic Corpus<br />
              <span style={{ color: '#64748b' }}>
                Kais Dukes · {tr ? 'Leeds Üniversitesi' : 'Leeds University'}
              </span>
            </p>
          </div>
          <a
            href={corpusUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem', fontWeight: 600,
              color: COLORS.softGold,
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
              onClick={() => { onClose(); window.dispatchEvent(new CustomEvent(cta.event, cta.detail ? { detail: cta.detail } : undefined)); }}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: COLORS.softGoldAlpha75,
                background: 'rgba(255,255,255,0.04)',
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
function Section({ title, children }) {
  return (
    <div style={{ padding: '16px 28px 6px' }}>
      <p style={{
        fontSize: '0.62rem',
        color: COLORS.softGoldAlpha55,
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
function Field({ label, children, primary }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '0.72rem',
        color: '#64748b',
        fontWeight: 500,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        textAlign: 'right',
        color: primary ? '#e8e6e3' : '#94a3b8',
        fontSize: primary ? '0.98rem' : '0.88rem',
        fontWeight: primary ? 500 : 400,
        lineHeight: 1.5,
      }}>
        {children}
      </span>
    </div>
  );
}
