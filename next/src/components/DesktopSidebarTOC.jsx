'use client';

// ─── DesktopSidebarTOC ─────────────────────────────────────────────────────────
// Premium desktop scroll-story navigation. Sol kenarda vertical TOC; sadece
// ≥1280px ekranlarda gösterilir (küçük ekranlarda MobileSectionChipNav devam
// eder). Hero geçince fade-in; sticky position; IntersectionObserver ile
// aktif chapter highlight.
//
// Pattern: bordered list with subtle gold accent. Aktif item: gold dot +
// brighter text. Hover: subtle underline + offset. Modern premium reader
// pattern (Medium, Apple News).

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

// CHAPTERS — homepage section order ile birebir uyumlu olmalı. Eksik bölüm
// olursa visitor "atlandı mı?" hissi yaşar (UX hatası).
// Order: page.js dosyasındaki render sırasını birebir takip eder.
const CHAPTERS = [
  { id: 'mukattaa-card',       labelTr: 'Dilsel DNA',           labelEn: 'Linguistic DNA'          },
  { id: 'ritim-card',          labelTr: 'İmkansız Ritim',       labelEn: 'Impossible Rhythm'       },
  { id: 'retorik-card',        labelTr: "Kur'an'ın Retoriği",   labelEn: "Quran's Rhetoric"        },
  { id: 'ses-card',            labelTr: 'Ses Mimarisi',         labelEn: 'Sound Architecture'      },
  { id: 'halka-card',          labelTr: 'Yapısal Mimari',       labelEn: 'Structural Architecture' },
  { id: 'tekrar-card',         labelTr: 'Sıfır Gereksizlik',    labelEn: 'Zero Redundancy'         },
  { id: 'bilimsel-card',       labelTr: 'Bilimsel İşaretler',   labelEn: 'Scientific Signs'        },
  { id: 'tarih-card',          labelTr: 'Tarihsel İzler',    labelEn: 'Historical Traces'        },
  { id: 'koruma-card',         labelTr: 'Yaşayan Koruma',       labelEn: 'Living Preservation'     },
  { id: 'dua-card',            labelTr: 'Dua Dili',             labelEn: 'Language of Prayer'      },
  { id: 'alti-konu-card',      labelTr: 'Öne Çıkanlar',         labelEn: 'Highlights'              },
  { id: 'allah-kendini-tanitir', labelTr: 'Esmâ Köprüsü',       labelEn: 'Names Bridge'            },
  { id: 'insan-tanimi-card',   labelTr: 'İnsan Tanımı',         labelEn: 'Human Definition'        },
  { id: 'psikoloji-card',      labelTr: 'İnsan Psikolojisi',    labelEn: 'Human Psychology'        },
  { id: 'conclusion',          labelTr: 'Sonuç',                labelEn: 'Conclusion'              },
];

const NAVBAR_HEIGHT = 62;
const SHOW_BREAKPOINT = 1280; // sadece desktop wide+

export default function DesktopSidebarTOC() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [show, setShow] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // Viewport check — sadece ≥1280px göster
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= SHOW_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll-trigger: ilk chapter görünür hale gelince + Hero geçilince
  useEffect(() => {
    function update() {
      const TRIGGER = window.innerHeight * 0.35;
      const firstEl = document.getElementById(CHAPTERS[0].id);
      const inLongForm = firstEl
        ? firstEl.getBoundingClientRect().top <= TRIGGER
        : false;
      setShow(inLongForm);
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
      setActiveId(activeNew);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!isWide) return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (NAVBAR_HEIGHT + 16);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label={tr ? 'Bölüm navigasyonu' : 'Chapter navigation'}
      // ─── inert ŞART — 2026-08-13 ölçümü ─────────────────────────────────
      // Raf görünmezken `opacity: 0` + `pointerEvents: none` ile fare için
      // kapalıydı ama KLAVYE İÇİN AÇIKTI: 16 düğmenin 16'sı da `tabbable`.
      // Klavye kullanıcısı içeriğe varmadan görünmeyen duraklarda geziniyordu.
      inert={!show || undefined}
      aria-hidden={!show || undefined}
      style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 30,
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
        maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + 48}px)`,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {/* Eyebrow — aynı zamanda "başa dön".
          2026-08-13: ayrı bir yüzen <ScrollToTopFab> vardı ve raf ile aynı anda
          ekranda duruyordu. Uzun anlatı sayfalarında dünya standardı (Apple ürün
          sayfaları, editoryal long-form) breakpoint başına TEK kalıcı gezinme
          ögesidir; "başa dön" o ögenin İÇİNDE durur, yanında ikinci bir düğme
          olarak değil. Rafın ilk maddesi `mukattaa-card` — yani hero'ya dönüş
          yolu yoktu; bu başlık artık o yolu veriyor. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={tr ? 'Sayfa başına dön' : 'Back to top'}
        title={tr ? 'Sayfa başına dön' : 'Back to top'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          opacity: 0.55,
          marginBottom: '14px',
          fontFamily: FONTS.body,
          paddingLeft: '12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.18s, transform 0.18s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.55';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '0.8rem', lineHeight: 1 }}>↑</span>
        {tr ? 'Bölümler' : 'Chapters'}
      </button>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {CHAPTERS.map(({ id, labelTr, labelEn }) => {
          const isActive = id === activeId;
          return (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 12px 7px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderLeft: `2px solid ${isActive ? COLORS.gold : 'transparent'}`,
                  color: isActive ? COLORS.gold : 'rgba(232,230,227,0.55)',
                  fontFamily: FONTS.body,
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.18s, border-color 0.18s, transform 0.18s, opacity 0.18s',
                  opacity: isActive ? 1 : 0.85,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(232,230,227,0.9)';
                    e.currentTarget.style.borderLeftColor = 'rgba(212,165,116,0.4)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(232,230,227,0.55)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: isActive ? COLORS.gold : 'transparent',
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 8px ${COLORS.gold}99` : 'none',
                    transition: 'background 0.18s, box-shadow 0.18s',
                  }}
                />
                {tr ? labelTr : labelEn}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
