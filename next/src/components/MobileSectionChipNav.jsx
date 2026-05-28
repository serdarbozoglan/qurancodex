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
const CHIP_NAV_HEIGHT = 48; // chip-nav padding + chip yüksekliği approx.
const SCROLL_OFFSET = NAVBAR_HEIGHT + CHIP_NAV_HEIGHT + 12; // section üst kenarına nefes
const SCROLL_DURATION = 500; // ms — sabit süre (uzun mesafelerde de hızlı biter)

// Custom RAF-based smooth scroll. Native scrollIntoView({behavior:'smooth'})
// Safari/iOS'ta uzun mesafelerde yavaş + bouncy çalışıyor — kullanıcı "ucuyor"
// hissi yaşıyor. RAF + sabit 500ms ile mesafe ne olursa olsun tutarlı süre.
function smoothScrollTo(targetY, duration = SCROLL_DURATION) {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    window.scrollTo(0, targetY);
    return;
  }
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();
  // ease-in-out cubic
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

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

  // Aktif chip'i yatay scroll rail içinde ortaya çek. scrollIntoView KULLANMA —
  // Safari/Chrome'da `inline:'center'` parent container'ı kaydırırken window'u
  // da kaydırabiliyor; chip-click sırasındaki custom window smooth-scroll ile
  // çakışıp "önce yukarı sonra aşağı" davranışı yaratıyordu. Manuel
  // rail.scrollTo({left}) ile sadece rail içinde yatay kayar, window dokunulmaz.
  useEffect(() => {
    if (!activeId) return;
    const chip = chipRefs.current[activeId];
    const rail = railRef.current;
    if (!chip || !rail) return;
    const chipCenter = chip.offsetLeft + chip.offsetWidth / 2;
    const railCenter = rail.clientWidth / 2;
    rail.scrollTo({
      left: Math.max(0, chipCenter - railCenter),
      behavior: 'smooth',
    });
  }, [activeId]);

  if (!isTouch) return null;

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(0, elTop - SCROLL_OFFSET);
    smoothScrollTo(targetY);
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
