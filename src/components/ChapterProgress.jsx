import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

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

export default function ChapterProgress() {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  // Visibility: hidden while the user is in the discovery zone
  // (hero / path-cards / all-topics / tools-highlight). Becomes visible
  // only after the user scrolls into the long-form content layer, i.e.
  // once the first CHAPTERS entry's top crosses the trigger line.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const TRIGGER = window.innerHeight * 0.35; // 35% from top of viewport

      // ── Visibility check ──────────────────────────────────────────────
      // Use the first long-form section's top as the gate. Once it has
      // scrolled past the trigger line, the user is officially in the
      // long-form zone and the progress dots should appear.
      const firstChapterEl = document.getElementById(CHAPTERS[0].id);
      const inLongForm = firstChapterEl
        ? firstChapterEl.getBoundingClientRect().top <= TRIGGER
        : false;
      setVisible(inLongForm);

      if (!inLongForm) return; // no need to compute active section

      // ── Active section: the one that contains the trigger line ────────
      // For each chapter, check if rect.top <= TRIGGER < rect.bottom.
      // The first match wins (sections don't overlap). This is more
      // accurate than the previous "closest top to trigger" heuristic,
      // which would mis-highlight when sections had very different heights.
      let activeIdNew = null;
      for (const { id } of CHAPTERS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= TRIGGER && r.bottom > TRIGGER) {
          activeIdNew = id;
          break;
        }
      }
      if (activeIdNew) setActiveId(activeIdNew);
    }

    update(); // run on mount
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        // Hidden while in the discovery zone (hero / path-cards / all-topics
        // / tools-highlight). Fade in once the user reaches the long-form
        // content layer. opacity + pointer-events keeps it in the DOM so
        // scroll listeners stay attached without remounting.
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }}
      className="hidden lg:flex"
      aria-hidden={!visible}
    >
      {CHAPTERS.map((chapter, i) => {
        const isActive = activeId === chapter.id;
        const isHovered = hoveredId === chapter.id;
        const label = language === 'tr' ? chapter.labelTr : chapter.labelEn;

        return (
          <div
            key={chapter.id}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            {/* Label tooltip */}
            <div
              style={{
                position: 'absolute',
                left: '22px',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: isActive ? '#d4a574' : '#64748b',
                background: 'rgba(10,10,26,0.92)',
                border: `1px solid ${isActive ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '6px',
                padding: '3px 8px',
                pointerEvents: 'none',
                opacity: isHovered || isActive ? 1 : 0,
                transform: isHovered || isActive ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
            >
              {i + 1}. {label}
            </div>

            {/* Dot */}
            <button
              onClick={() => scrollTo(chapter.id)}
              onMouseEnter={() => setHoveredId(chapter.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={label}
              style={{
                width: isActive ? '10px' : '7px',
                height: isActive ? '10px' : '7px',
                borderRadius: '50%',
                background: isActive ? '#d4a574' : 'rgba(148,163,184,0.35)',
                border: `1px solid ${isActive ? '#d4a574' : 'rgba(148,163,184,0.2)'}`,
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease',
                boxShadow: isActive ? '0 0 8px rgba(212,165,116,0.5)' : 'none',
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
