'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS } from '../tokens';

// CHAPTERS = ChapterProgress (desktop dot-nav) ile aynı sıra ve id'ler.
// Mobil + tablet için chip-row, ≥1024px'te ChapterProgress dikey dot-nav kullanılır.
const CHAPTERS = [
  { id: 'linguistic',          labelTr: 'Dilsel DNA',           labelEn: 'Linguistic DNA'          },
  { id: 'rhythm',              labelTr: 'İmkansız Ritim',       labelEn: 'Impossible Rhythm'       },
  { id: 'sounds',              labelTr: 'Ses Mimarisi',         labelEn: 'Sound Architecture'      },
  { id: 'hidden-architecture', labelTr: 'Yapısal Mimari',       labelEn: 'Structural Architecture' },
  { id: 'science',             labelTr: 'Bilimsel İşaretler',   labelEn: 'Scientific Signs'        },
  { id: 'history',             labelTr: 'Tarihsel Kanıtlar',    labelEn: 'Historical Proof'        },
  { id: 'preservation',        labelTr: 'Yaşayan Koruma',       labelEn: 'Living Preservation'     },
  { id: 'redundancy',          labelTr: 'Sıfır Gereksizlik',    labelEn: 'Zero Redundancy'         },
  { id: 'highlights',          labelTr: 'Öne Çıkanlar',         labelEn: 'Highlights'              },
  { id: 'human-definition',    labelTr: 'İnsan Tanımı',         labelEn: 'Human Definition'        },
  { id: 'psychology',          labelTr: 'İnsan Psikolojisi',    labelEn: 'Human Psychology'        },
  { id: 'conclusion',          labelTr: 'Sonuç',                labelEn: 'Conclusion'              },
];

const TABLET_BREAKPOINT = 1024;
const NAVBAR_HEIGHT = 62; // Navbar scrolled-state (py-3) ~56px + 6px nefes (görsel ayrım)

export default function MobileSectionChipNav() {
  const { language } = useLanguage();
  const [isTouch, setIsTouch] = useState(false); // < 1024px (mobil + tablet)
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const railRef = useRef(null);
  const chipRefs = useRef({});

  useEffect(() => {
    const check = () => setIsTouch(window.innerWidth < TABLET_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isTouch) return;
    function update() {
      const TRIGGER = window.innerHeight * 0.35;
      const firstEl = document.getElementById(CHAPTERS[0].id);
      const inLongForm = firstEl
        ? firstEl.getBoundingClientRect().top <= TRIGGER
        : false;
      setVisible(inLongForm);
      if (!inLongForm) return;

      let activeNew = null;
      for (const { id } of CHAPTERS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= TRIGGER && r.bottom > TRIGGER) {
          activeNew = id;
          break;
        }
      }
      if (activeNew) setActiveId(activeNew);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isTouch]);

  // Aktif chip'i yatay scroll rail içinde ortaya çek (görünmüyorsa).
  useEffect(() => {
    if (!activeId || !chipRefs.current[activeId]) return;
    chipRefs.current[activeId].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeId]);

  if (!isTouch) return null;

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav
      aria-label={language === 'tr' ? 'Bölüm gezintisi' : 'Section navigation'}
      style={{
        position: 'fixed',
        top: `${NAVBAR_HEIGHT}px`,
        left: 0,
        right: 0,
        zIndex: 30,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
        background: 'rgba(10,10,26,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      }}
    >
      <div
        ref={railRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '11px 14px 13px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        // iOS Safari'de scrollbar gizleme için ekstra CSS gerekebilir;
        // şu an scrollbarWidth + msOverflowStyle ile çoğu tarayıcıda gizli.
        // Padding asymmetric (11/13) — overflowY:hidden ile birlikte chip üst
        // kenarının clip görünmesini engeller; alignItems:center butonu rail içinde merkezler.
      >
        {CHAPTERS.map((ch, i) => {
          const isActive = activeId === ch.id;
          const label = language === 'tr' ? ch.labelTr : ch.labelEn;
          return (
            <button
              key={ch.id}
              ref={(el) => { chipRefs.current[ch.id] = el; }}
              onClick={() => scrollTo(ch.id)}
              aria-current={isActive ? 'location' : undefined}
              style={{
                flexShrink: 0,
                padding: '7px 13px',
                borderRadius: RADIUS.pill,
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                border: `1px solid ${isActive ? COLORS.goldAlpha25 : COLORS.glassBorderSoft}`,
                color: isActive ? COLORS.gold : COLORS.silver,
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'background 0.18s, border 0.18s, color 0.18s',
              }}
              className="qc-focus-ring"
            >
              {i + 1}. {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
