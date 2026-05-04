import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import { posLabel } from '../utils/corpusPos';

/**
 * WordPopover — Corpus Quran kelime detay paneli.
 * ReadingMode'da bir kelimeye tıklandığında alttan kayan modal olarak açılır.
 *
 * Veri kaynağı: Quranic Arabic Corpus (Kais Dukes, Leeds University)
 *               https://corpus.quran.com — akademik atıfla kullanım
 */
export default function WordPopover({ word, surah, ayah, onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const panelRef = useRef(null);

  // Escape kapatma
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!word) return null;

  const corpusUrl = `https://corpus.quran.com/wordmorphology.jsp?location=(${surah}:${ayah}:${word.idx})`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'wpFadeIn 0.18s ease-out',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1326',
          borderTop: `1px solid ${COLORS.softGoldAlpha25}`,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0`,
          width: '100%', maxWidth: '560px',
          maxHeight: '78vh', overflowY: 'auto',
          padding: '24px 22px 28px',
          fontFamily: FONTS.body,
          animation: 'wpSlideUp 0.22s cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.15)',
          margin: '0 auto 18px',
        }} />

        {/* Arabic word — büyük gösterim */}
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <p
            lang="ar" dir="rtl"
            style={{
              fontFamily: FONTS.quran, fontSize: '2.6rem',
              color: COLORS.softGold, lineHeight: 1.4,
              margin: 0,
            }}
          >
            {word.ar}
          </p>
          {word.translit && (
            <p style={{
              fontSize: '0.9rem', color: '#94a3b8',
              fontStyle: 'italic', margin: '4px 0 0',
            }}>
              {word.translit}
            </p>
          )}
        </div>

        {/* Verse ref */}
        <p style={{
          textAlign: 'center', fontSize: '0.7rem',
          color: '#64748b', margin: '8px 0 22px',
          letterSpacing: '0.06em',
        }}>
          {tr ? 'Sûre' : 'Surah'} {surah}:{ayah} · {tr ? 'Kelime' : 'Word'} {word.idx}
        </p>

        {/* Anlam */}
        {word.en && (
          <Row label={tr ? 'Birebir Anlam' : 'Literal Meaning'}>
            <span style={{ color: '#e8e6e3', fontSize: '0.95rem' }}>{word.en}</span>
          </Row>
        )}

        {/* Kök */}
        {word.root && (
          <Row label={tr ? 'Kök' : 'Root'}>
            <span lang="ar" dir="rtl" style={{
              fontFamily: FONTS.quran, fontSize: '1.4rem',
              color: COLORS.softGold,
            }}>
              {word.root}
            </span>
          </Row>
        )}

        {/* Lemma */}
        {word.lemma && (
          <Row label={tr ? 'Kök Kelime (lemma)' : 'Lemma'}>
            <span lang="ar" dir="rtl" style={{
              fontFamily: FONTS.quran, fontSize: '1.2rem',
              color: '#e8e6e3',
            }}>
              {word.lemma}
            </span>
          </Row>
        )}

        {/* POS */}
        {word.pos && (
          <Row label={tr ? 'Sözcük Türü' : 'Part of Speech'}>
            <span style={{
              display: 'inline-block', padding: '3px 10px',
              borderRadius: RADIUS.pillSm,
              background: 'rgba(120,168,255,0.10)',
              border: '1px solid rgba(120,168,255,0.30)',
              color: '#9ec1ff', fontSize: '0.82rem', fontWeight: 600,
            }}>
              {posLabel(word.pos, language)}
            </span>
            <span style={{
              fontSize: '0.7rem', color: '#475569',
              marginLeft: '8px', fontFamily: 'monospace',
            }}>
              {word.pos}
            </span>
          </Row>
        )}

        {/* Features */}
        {word.features && (
          <Row label={tr ? 'Gramer Özellikleri' : 'Grammatical Features'}>
            <span style={{
              color: '#94a3b8', fontSize: '0.85rem',
              fontStyle: 'italic', lineHeight: 1.55,
            }}>
              {word.features}
            </span>
          </Row>
        )}

        {/* Source band */}
        <div style={{
          marginTop: '24px', paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
        }}>
          <p style={{
            fontSize: '0.72rem', color: '#475569',
            margin: 0, lineHeight: 1.5,
          }}>
            {tr
              ? 'Kaynak: Quranic Arabic Corpus (Kais Dukes, Leeds Üniversitesi)'
              : 'Source: Quranic Arabic Corpus (Kais Dukes, Leeds University)'}
          </p>
          <a
            href={corpusUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '0.72rem', fontWeight: 600,
              color: COLORS.softGold,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px',
              border: `1px solid ${COLORS.softGoldAlpha35}`,
              borderRadius: RADIUS.sm,
              background: COLORS.softGoldAlpha08,
            }}
          >
            corpus.quran.com
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        {/* Close hint */}
        <p style={{
          textAlign: 'center', fontSize: '0.66rem',
          color: '#334155', marginTop: '18px',
        }}>
          Esc / {tr ? 'dışa tıklayarak kapat' : 'tap outside to close'}
        </p>
      </div>

      <style>{`
        @keyframes wpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wpSlideUp { from { transform: translateY(28px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '0.7rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        color: '#64748b',
      }}>
        {label}
      </span>
      <span style={{ textAlign: 'right' }}>
        {children}
      </span>
    </div>
  );
}
