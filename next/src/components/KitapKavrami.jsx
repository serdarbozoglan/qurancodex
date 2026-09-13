'use client';

// ─── KitapKavrami — Kur'ân Kendini Nasıl Tanımlar? ──────────────────────────
// #211 (2026-07-19) — Kur'ân'ın kendisi için kullandığı 10+ isim + sıfat:
// el-Kitâb, el-Furkân, ez-Zikr, el-Hüdâ, en-Nûr, eş-Şifâ, el-Beyân,
// et-Tibyân, el-Mev'iza, el-Mübîn. Her isim → işlev + Râgıb el-İsfahânî
// müfredâtından anlam katmanı. Editoryal: apolojetik değil, envanter.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import kitapKavramiDataStatic from '../../public/kitap-kavrami.json';
import HeroGeometricBackground from './HeroGeometricBackground';

export default function KitapKavrami() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data] = useState(kitapKavramiDataStatic);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      }
      titleTr="Kitap Kavramı"
      titleEn="Concept of the Book"
      subtitleTr="Kur'ân kendini nasıl tanımlar"
      subtitleEn="How the Quran names itself"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/insan-tanimi`, titleTr: 'İnsan Tanımı', titleEn: "Definition of the Human", descTr: "Kur'ân insanı nasıl tanımlar? Bu sayfanın ayna eşi.", descEn: "How does the Quran define the human? The mirror pair to this page." },
          { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: 'Hüdâ, nûr, zikr, hikmet: Kur\'ânî kavramların bağlantı haritası.', descEn: 'Hudā, nūr, dhikr, ḥikma: the connection map of Quranic concepts.' },
          { href: `/${language}/atlas/furuk`, titleTr: 'Furûk Atlası', titleEn: 'Furūq Atlas', descTr: "Yakın anlamlı kelime nüansları: beyân ↔ tibyân ↔ mübîn farkı.", descEn: 'Nuances between near-synonyms: the difference between bayān ↔ tibyān ↔ mubīn.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - var(--qc-nav-h, 84px))',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'var(--qc-nav-h, 84px)',
      }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const items = data.items || [];

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - var(--qc-nav-h, 84px))',
      paddingTop: 'var(--qc-nav-h, 84px)',
    }}>
      {TOOL_HEADER}

      {/* ─── Sinematik hero (§13.18) — 2026-09-13 görsel yükseltme ───
          Kullanıcı: sayfa görsel olarak zayıftı. Çapa âyet Bakara 2:2, çünkü
          Kur'ân'ın kendine verdiği iki ismi (el-Kitâb + Hüdâ) tek âyette taşır. */}
      <div style={{
        position: 'relative', overflow: 'hidden', textAlign: 'center',
        padding: 'clamp(48px, 7vw, 88px) 24px clamp(36px, 5vw, 56px)',
        borderBottom: `1px solid ${COLORS.gold}1f`,
        background: 'linear-gradient(180deg, rgba(212,165,116,0.08) 0%, transparent 100%)',
      }}>
        <HeroGeometricBackground />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <div className="mq-fs" dir="rtl" lang="ar" aria-label="Bismillāh" style={{
            fontFamily: FONTS.bismillah, '--fs-d': '2.6rem', '--fs-m': '2.2rem',
            color: COLORS.gold, opacity: 0.85, lineHeight: 1.2, marginBottom: '26px',
          }}>﷽</div>

          <p dir="rtl" lang="ar" className="mq-fs qc-verse-breathe" style={{
            fontFamily: FONTS.quran, color: COLORS.gold,
            '--fs-d': 'clamp(1.7rem, 4.2vw, 2.6rem)', '--fs-m': 'clamp(1.7rem, 4.2vw, 2.6rem)',
            lineHeight: 2.1, margin: '0 0 16px',
          }}>
            ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ
          </p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite,
            '--fs-d': '1.1rem', '--fs-m': '1rem', lineHeight: 1.6,
            maxWidth: '640px', margin: '0 auto 8px', opacity: 0.95,
          }}>
            {tr
              ? '"İşte bu Kitap; onda hiçbir şüphe yoktur; sakınanlar için bir yol göstericidir (hüdâ)."'
              : '"This is the Book about which there is no doubt, a guidance (hudā) for the God-conscious."'}
          </p>
          <p style={{
            fontFamily: FONTS.body, color: COLORS.silver, opacity: 0.7,
            fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
            margin: '0 0 30px',
          }}>— {tr ? 'Bakara 2:2' : 'Al-Baqara 2:2'}</p>

          <div style={{
            fontSize: '0.7rem', letterSpacing: '0.3em', color: COLORS.gold,
            textTransform: 'uppercase', fontWeight: 700, opacity: 0.75, marginBottom: '14px',
            fontFamily: FONTS.body,
          }}>{tr ? "KUR'ÂN KENDİNİ TANIMLAR" : 'THE QURAN NAMES ITSELF'}</div>
          <h1 className="mq-fs" style={{
            fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
            '--fs-d': 'clamp(2.2rem, 4vw, 3rem)', '--fs-m': 'clamp(1.8rem, 7vw, 2.3rem)',
            lineHeight: 1.15, margin: '0 0 14px', letterSpacing: '0.01em',
          }}>{tr ? 'Kitap Kavramı' : 'Concept of the Book'}</h1>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
            '--fs-d': 'clamp(1.05rem, 1.9vw, 1.22rem)', '--fs-m': '1rem',
            margin: '0 auto', maxWidth: '680px', opacity: 0.92, lineHeight: 1.5,
          }}>{tr ? 'Kur\'ân yalnızca "Kitap" değildir: kendine on ayrı isim verir, her isim ayrı bir okuma sözleşmesidir.' : 'The Quran is not merely "a Book": it gives itself ten distinct names, each a different covenant of reading.'}</p>

          {/* Stat strip */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0', marginTop: '30px' }}>
            {[
              { n: String((data.items || []).length), l: tr ? 'İSİM' : 'NAMES' },
              { n: String((data.items || []).length), l: tr ? 'İŞLEV' : 'FUNCTIONS' },
              { n: '4', l: tr ? 'KLASİK KAYNAK' : 'CLASSICAL SOURCES' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '0 clamp(16px, 4vw, 30px)', borderLeft: i > 0 ? `1px solid ${COLORS.gold}26` : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.display, fontSize: '1.7rem', fontWeight: 800, color: COLORS.gold, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.silver, marginTop: '8px', opacity: 0.8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="zf2-tool-hero-wrap" style={{ maxWidth: 1080, margin: '0 auto', paddingTop: 'clamp(32px, 5vw, 48px)' }}>

        {/* Framing paragraph */}
        <div className="zf2-tool-hero-card" style={{
          background: `linear-gradient(180deg, ${COLORS.gold}0d 0%, transparent 100%)`,
          border: `1px solid ${COLORS.gold}22`,
          borderRadius: 14,
          marginBottom: 40,
        }}>
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: 12,
            fontFamily: FONTS.body,
          }}>
            {tr ? '10 İsim, 10 İşlev' : '10 Names, 10 Functions'}
          </div>
          <p className="mq-fs" style={{
            fontFamily: FONTS.body,
            '--fs-d': '0.98rem', '--fs-m': '0.92rem',
            lineHeight: 1.75,
            color: COLORS.offWhite,
            margin: 0,
            opacity: 0.92,
          }}>
            {tr ? data.meta.principleTr : data.meta.principleEn}
          </p>
        </div>

        {/* Names grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map(item => (
            <NameCard
              key={item.id}
              item={item}
              tr={tr}
              language={language}
              isMobile={isMobile}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>

      {/* Sayfa-genel klasik kaynak */}
      <div className="zf2-tool-body-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'er-Râgıb el-İsfahânî',
              workTr: "el-Müfredât fî Garîbi\'l-Kurʾân",
              workEn: 'al-Mufradāt fī Gharīb al-Qurʾān',
              period: '?–1108 (İsfahan)',
              noteTr: "Kur'ân\'daki her kelimenin kök + türev + tam anlam yelpazesi. Kur'ân\'ın kendi isimleri için temel başvuru; beyân, tibyân, mübîn ayrımı buradan.",
              noteEn: "Root, derivation, and full meaning-spectrum of every word in the Quran. The foundational reference for the Quran\'s self-names; the distinction between bayān, tibyān, mubīn comes from here.",
            },
            {
              author: 'ez-Zerkeşî',
              workTr: "el-Burhân fî Ulûmi\'l-Kurʾân",
              workEn: 'al-Burhān fī ʿUlūm al-Qurʾān',
              period: '1344–1392 (Kahire)',
              noteTr: "Kur'ân ilimleri kompendyumu; Kur'ân\'ın esmâsı, sıfatları, isim çeşitliliği bahsi kapsamlı ele alınır.",
              noteEn: 'Compendium of Quranic sciences; systematically treats the names, attributes, and diversity of Quran\'s self-designations.',
            },
            {
              author: 'es-Süyûtî',
              workTr: "el-İtkān fî Ulûmi\'l-Kurʾân",
              workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
              period: '1445–1505 (Kahire)',
              noteTr: "Nev'i 17 'Kur'ân\'ın isim ve künyeleri' 55 farklı isim ve sıfatı listeler; klasik referansın en kapsamlısı.",
              noteEn: "Species 17, 'The names and epithets of the Quran', inventories 55 different names and attributes; the most comprehensive classical reference.",
            },
            {
              author: 'Gazâlî',
              workTr: "Cevâhirü\'l-Kurʾân",
              workEn: 'Jawāhir al-Qurʾān',
              period: '1058–1111',
              noteTr: "Kur'ân\'ı bir mücevher hazinesi olarak okur; nûr, şifâ, hüdâ gibi isimleri deneyimsel çerçevede işler.",
              noteEn: 'Reads the Quran as a jewel-treasure; treats names like nūr, shifāʾ, hudā within an experiential frame.',
            },
          ]}
        />
      </div>

      {RELATED_CTA}
    </div>
  );
}

// ─── NameCard — expandable Kur'ân self-descriptor ───────────────────────────
function NameCard({ item, tr, language, isMobile, expanded, onToggle }) {
  const short = tr ? item.shortTr : item.shortEn;
  const long  = tr ? item.longTr  : item.longEn;
  const title = tr ? item.titleTr : item.titleEn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="zf2-tool-chain-card"
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? `${COLORS.gold}55` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Bookmark button — top right */}
      <div
        style={{ position: 'absolute', top: 14, right: 14 }}
        onClick={e => e.stopPropagation()}
      >
        <BookmarkButton
          item={{
            id: `kitap-kavrami:${item.id}`,
            type: 'kitap-kavrami',
            title,
            subtitle: item.termAr,
            description: short.slice(0, 240),
            arabic: item.termAr,
            url: `/${language}/arac/kitap-kavrami#${item.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          all: 'unset', boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          paddingRight: 40,
        }}
      >
        {/* Arabic term — hero */}
        <div
          dir="rtl"
          lang="ar"
          className="mq-fs" style={{
            fontFamily: FONTS.quran,
            '--fs-d': '2.3rem', '--fs-m': '1.9rem',
            color: COLORS.gold,
            lineHeight: 1.5,
            textShadow: `0 0 20px ${COLORS.gold}22`,
            marginBottom: 8,
            textAlign: 'right',
          }}
        >
          {item.termAr}
        </div>

        {/* Title */}
        <h3 className="mq-fs" style={{
          fontFamily: FONTS.display,
          '--fs-d': '1.2rem', '--fs-m': '1.05rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 10px',
          lineHeight: 1.35,
        }}>
          {title}
        </h3>

        {/* Short */}
        <p className="mq-fs" style={{
          fontFamily: FONTS.body,
          '--fs-d': '0.92rem', '--fs-m': '0.88rem',
          lineHeight: 1.7,
          color: COLORS.silver,
          margin: 0,
          opacity: 0.9,
        }}>
          {short}
        </p>

        {/* Expand hint */}
        <div style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: COLORS.gold,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Detaylı Anlam' : 'Detailed Meaning')}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.gold}22`,
            }}>
              <p className="mq-fs" style={{
                fontFamily: FONTS.body,
                '--fs-d': '0.94rem', '--fs-m': '0.9rem',
                lineHeight: 1.85,
                color: COLORS.offWhite,
                margin: '0 0 20px',
                opacity: 0.92,
              }}>
                {long}
              </p>

              {/* Verses */}
              {item.verses && item.verses.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: COLORS.silver,
                    opacity: 0.78,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    {tr ? 'Anahtar Ayetler' : 'Key Verses'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {item.verses.map((v, i) => {
                      const [s, a] = v.split(':');
                      const ayah = (a || '1').split('-')[0];
                      return (
                        <Link
                          key={i}
                          href={`/${language}/ayet/${s}/${ayah}`}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 4,
                            background: `${COLORS.gold}18`,
                            color: COLORS.gold,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${COLORS.gold}18`; }}
                        >
                          {v}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
