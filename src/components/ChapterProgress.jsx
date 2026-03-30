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

  useEffect(() => {
    const TRIGGER = window.innerHeight * 0.35; // 35% from top of viewport

    function update() {
      let bestId = null;
      let bestDist = Infinity;

      CHAPTERS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Distance of section top from the trigger line (positive = below trigger, negative = above)
        const dist = Math.abs(rect.top - TRIGGER);
        // Only consider sections that have their top in the upper 2/3 of viewport
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      });

      if (bestId) setActiveId(bestId);
    }

    update(); // run on mount
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
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
      }}
      className="hidden lg:flex"
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
