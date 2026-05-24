'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS } from '../tokens';

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const TRIGGER = window.innerHeight * 0.35;

      const firstChapterEl = document.getElementById(CHAPTERS[0].id);
      const inLongForm = firstChapterEl
        ? firstChapterEl.getBoundingClientRect().top <= TRIGGER
        : false;
      setVisible(inLongForm);

      if (!inLongForm) return;

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

    update();
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
            <div
              style={{
                position: 'absolute',
                left: '22px',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: isActive ? COLORS.gold : COLORS.slate500,
                background: COLORS.panelBg,
                border: `1px solid ${isActive ? COLORS.goldAlpha25 : COLORS.glassBgStrong}`,
                borderRadius: RADIUS.sm,
                padding: '3px 8px',
                pointerEvents: 'none',
                opacity: isHovered || isActive ? 1 : 0,
                transform: isHovered || isActive ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
            >
              {i + 1}. {label}
            </div>

            <button
              onClick={() => scrollTo(chapter.id)}
              onMouseEnter={() => setHoveredId(chapter.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={label}
              style={{
                width: isActive ? '10px' : '7px',
                height: isActive ? '10px' : '7px',
                borderRadius: RADIUS.full,
                background: isActive ? COLORS.gold : COLORS.silverAlpha40,
                border: `1px solid ${isActive ? COLORS.gold : COLORS.silverAlpha12}`,
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease',
                boxShadow: isActive ? `0 0 8px ${COLORS.goldAlpha45}` : 'none',
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
