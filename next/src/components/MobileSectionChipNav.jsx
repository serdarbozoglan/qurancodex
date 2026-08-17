'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS } from '../tokens';

// Tüm breakpoint'lerde aktif section-chip nav. Önceden desktop'ta ChapterProgress
// (sol dikey dot-nav) kullanılıyordu; ama dot-nav label'ları hover'da fade-in
// olduğu için keşfedilebilirlik düşüktü. Tek bir chip-row pattern → mobile +
// desktop tutarlı UX, label'lar her zaman görünür.
// CHAPTERS — homepage section order ile birebir uyumlu olmalı. Aksi takdirde
// "atlandı mı?" UX hatası oluşur. Order: page.js render sırasını izler.
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

const DESKTOP_BREAKPOINT = 1024;
const CHIP_NAV_HEIGHT = 48; // chip-nav padding + chip yüksekliği approx.
const SCROLL_DURATION = 500; // ms — sabit süre (uzun mesafelerde de hızlı biter)

// ─── Navbar yüksekliği ARTIK ÖLÇÜLÜYOR, sabit değil ─────────────────────────
// 2026-08-13. Sabit `NAVBAR_HEIGHT = 62` idi ve gerçek yükseklikle tutmuyordu:
//   390px → navbar altı 69, raf üstü 62 →  7px örtüşme
//   1024px → navbar altı 93, raf üstü 62 → 31px ÖRTÜŞME
// 1024'te rafın üst şeridi tamamen navbarın (z-9999) altında kalıyor ve
// chip'lerin üst yarısı TIKLANAMIYORDU. Ölçüm: elementFromPoint rafın
// ortasında `NAV[aria-label="Main navigation"]` döndürüyordu.
const NAVBAR_FALLBACK = 62;
function measureNavbarBottom() {
  if (typeof document === 'undefined') return NAVBAR_FALLBACK;
  const nav = document.querySelector('nav[aria-label="Main navigation"]');
  if (!nav) return NAVBAR_FALLBACK;
  const b = nav.getBoundingClientRect().bottom;
  return b > 0 ? Math.round(b) : NAVBAR_FALLBACK;
}

// Custom RAF-based smooth scroll. Native scrollIntoView({behavior:'smooth'})
// Safari/iOS'ta uzun mesafelerde yavaş + bouncy çalışıyor.
//
// KRİTİK: globals.css'te `html { scroll-behavior: smooth }` global ayarlı —
// window.scrollTo(0, Y) çağrısı bu CSS yüzünden **kendi başına da** smooth
// animate eder. Bizim RAF her frame'de yeni Y verirken global smooth scroll
// da animate ederse iki engine çakışır → "önce X'e gidip sonra Y'ye dönme"
// jitter'ı. Her scrollTo çağrısında `behavior: 'instant'` ile global CSS'i
// bypass ederek bunu engelliyoruz.
function smoothScrollTo(targetY, duration = SCROLL_DURATION) {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
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
    window.scrollTo({ top: startY + distance * ease(t), left: 0, behavior: 'instant' });
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function MobileSectionChipNav() {
  const { language } = useLanguage();
  // isDesktop yalnızca responsive styling için (chip padding/font/gap).
  // Component her breakpoint'te render olur — visibility scroll-trigger'a bağlı.
  // EXCEPT: ≥1280px geniş ekranlarda DesktopSidebarTOC devreye girer; o yüzden
  // chip nav otomatik gizlenir (premium feedback: çift navigasyon yorucu).
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(null);
  // SSR'de ölçüm yok — fallback ile başlar, mount'ta gerçek değere oturur.
  const [navbarBottom, setNavbarBottom] = useState(NAVBAR_FALLBACK);
  const railRef = useRef(null);
  const chipRefs = useRef({});

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
      setIsWideDesktop(window.innerWidth >= 1280);
      setNavbarBottom(measureNavbarBottom());
    };
    check();
    window.addEventListener('resize', check);

    // Navbar scroll'da kompaktlaşıyor (1024px'te 108 → 93) ve bu bir CSS
    // geçişi. Ölçüm zamanlaması iki kez yanlış çıktı, ikisi de ölçülerek
    // görüldü:
    //   1) Sabit 62 → 1024'te 31px ÖRTÜŞME, chip'lerin üst yarısı tıklanamıyor
    //   2) Sadece scroll olayında ölçmek → olay geçiş BAŞLAMADAN tetikleniyor,
    //      eski (108) değer okunuyor, sonra bir daha scroll gelmezse 15px
    //      BOŞLUK kalıcı kalıyor
    // Bu yüzden hem scroll'da hem de geçiş bittikten sonra ölçüyoruz.
    let settle;
    const onScroll = () => {
      setNavbarBottom(measureNavbarBottom());
      clearTimeout(settle);
      settle = setTimeout(() => setNavbarBottom(measureNavbarBottom()), 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(settle);
    };
  }, []);

  useEffect(() => {
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
  }, []);

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

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    // Ölçülen navbar + raf yüksekliği + nefes payı
    const targetY = Math.max(0, elTop - (measureNavbarBottom() + CHIP_NAV_HEIGHT + 12));
    smoothScrollTo(targetY);
  }

  // ≥1280px geniş ekran → DesktopSidebarTOC takes over, chip gizle.
  if (isWideDesktop) return null;

  return (
    <nav
      aria-label={language === 'tr' ? 'Bölüm gezintisi' : 'Section navigation'}
      // ─── inert ŞART — 2026-08-13 ölçümü ─────────────────────────────────
      // Raf görünmezken `opacity: 0` + `pointerEvents: none` ile fare için
      // kapalıydı ama KLAVYE İÇİN AÇIKTI: 16 düğmenin 16'sı da `tabbable`.
      // Klavye kullanıcısı sayfanın içeriğine varmadan görünmeyen 16 durakta
      // geziniyordu. `inert` hem odağı hem erişilebilirlik ağacını kapatır.
      inert={!visible || undefined}
      aria-hidden={!visible || undefined}
      style={{
        position: 'fixed',
        top: `${navbarBottom}px`,
        left: 0,
        right: 0,
        zIndex: 30,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
        background: COLORS.cosmicBlackAlpha85,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      }}
    >
      {/* "Başa dön" — rafın İÇİNDE ama kaydırma alanının DIŞINDA sabit.
          2026-08-13: bu iş ayrı bir yüzen <ScrollToTopFab>'daydı; sağ altta
          içeriğin (mobilde kart CTA'larının) üzerine biniyordu ve raf ile aynı
          anda ekranda duruyordu. Uzun anlatı sayfalarında dünya standardı
          breakpoint başına TEK kalıcı gezinme ögesidir. Kaydırma alanının
          dışında çünkü raf yatay kayınca ilk chip gözden kaybolurdu. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          maxWidth: isDesktop ? '1280px' : '100%',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={() => smoothScrollTo(0)}
          aria-label={language === 'tr' ? 'Sayfa başına dön' : 'Back to top'}
          title={language === 'tr' ? 'Sayfa başına dön' : 'Back to top'}
          className="qc-focus-ring"
          style={{
            flexShrink: 0,
            alignSelf: 'center',
            marginLeft: isDesktop ? '24px' : '14px',
            marginRight: isDesktop ? '10px' : '8px',
            width: '30px',
            height: '30px',
            borderRadius: RADIUS.full,
            background: 'transparent',
            border: `1px solid ${COLORS.goldAlpha25}`,
            color: COLORS.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: 0,
            opacity: 0.75,
            transition: 'opacity 0.18s, background 0.18s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = COLORS.goldAlpha15;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span aria-hidden="true">↑</span>
        </button>

      <div
        ref={railRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isDesktop ? '8px' : '6px',
          padding: isDesktop ? '12px 24px 14px 0' : '11px 14px 13px 0',
          flex: 1,
          minWidth: 0,
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
                padding: isDesktop ? '8px 16px' : '7px 13px',
                borderRadius: RADIUS.pill,
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                border: `1px solid ${isActive ? COLORS.goldAlpha25 : COLORS.glassBorderSoft}`,
                color: isActive ? COLORS.gold : COLORS.silver,
                fontFamily: "'Inter', sans-serif",
                fontSize: isDesktop ? '0.78rem' : '0.72rem',
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
        {/* 2026-08-17 — site denetimi: raf yatay kaydırma gerektiriyor,
            ipucu yoktu. Rafın kendi arkaplanı (cosmicBlackAlpha85 + blur)
            düz olduğu için hedef renk aynı token — ProofSection'daki
            gradyan-uyumsuzluğu seam hatası burada tekrarlanmaz. */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '28px',
          background: `linear-gradient(90deg, transparent, ${COLORS.cosmicBlackAlpha85})`,
          pointerEvents: 'none',
        }} />
      </div>
    </nav>
  );
}
