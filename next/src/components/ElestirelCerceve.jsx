'use client';

// ─── ElestirelCerceve — Eleştirel Çerçeve / Hard Questions ──────────────────
// #190/#207 (2026-07-18) — Kur'ân'a yöneltilen içeriden + dışarıdan zorlu
// sorulara dengeli akademik çerçeve. Amaç savunma değil — sorunun kendisini
// görmek; klasik tefsir + modern akademiyi yan yana koymak; kapatılmış cevap
// değil süregelen bir okuma sunmak. Kesinlik iddiası yok.
// ─────────────────────────────────────────────────────────────────────────────

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
import elestirelDataStatic from '../../public/elestirel-cerceve.json';

export default function ElestirelCerceve() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data] = useState(elestirelDataStatic);
  const [activeCat, setActiveCat] = useState('all');
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
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
      titleTr="Eleştirel Çerçeve"
      titleEn="Critical Frame"
      subtitleTr="Zorlu sorulara dengeli okuma"
      subtitleEn="Balanced reading for hard questions"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/sor`, titleTr: 'RAG Concierge (/sor)', titleEn: 'RAG Concierge (/sor)', descTr: 'Bir sorunun cevabını Kur\'ân kaynaklarında ara — semantik + keyword.', descEn: 'Search a question\'s answer in Quranic sources — semantic + keyword.' },
          { href: `/${language}/atlas/munasebat`, titleTr: 'Münâsebât Atlası', titleEn: 'Munāsabāt Atlas', descTr: 'Sûreler-arası klasik bağlar — Bikâî geleneği.', descEn: 'Classical inter-sūrah ties — the Bikāʿī tradition.' },
          { href: `/${language}/arac/muhataplar`, titleTr: 'Muhatap Sistemi', titleEn: 'Addressee System', descTr: 'Ayetin kime hitap ettiği — bağlamsal okumanın temeli.', descEn: 'Whom the verse addresses — the base of contextual reading.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
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

  const categories = data.categories || [];
  const questions = data.questions || [];
  const filteredQuestions = activeCat === 'all'
    ? questions
    : questions.filter(q => q.category === activeCat);
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {TOOL_HEADER}

      <div className="zf2-tool-hero-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Framing paragraph — bu tool'un ne olduğunu net söyleyen editoryal not */}
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
            {tr ? 'Editoryal Not' : 'Editorial Note'}
          </div>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.92rem' : '0.98rem',
            lineHeight: 1.75,
            color: COLORS.offWhite,
            margin: 0,
            opacity: 0.92,
          }}>
            {tr ? data.meta.principleTr : data.meta.principleEn}
          </p>
        </div>

        {/* Category filter chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
        }}>
          <FilterChip
            active={activeCat === 'all'}
            onClick={() => setActiveCat('all')}
            color={COLORS.gold}
          >
            {tr ? 'Tümü' : 'All'} · {questions.length}
          </FilterChip>
          {categories.map(cat => {
            const count = questions.filter(q => q.category === cat.id).length;
            return (
              <FilterChip
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
                color={cat.color}
              >
                {tr ? cat.tr : cat.en} · {count}
              </FilterChip>
            );
          })}
        </div>

        {/* Question list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredQuestions.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              tr={tr}
              language={language}
              isMobile={isMobile}
              cat={catMap[q.category]}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </div>
      </div>

      {/* Klasik + modern kaynak çatısı — sayfa-genel */}
      <div className="zf2-tool-body-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'Fazlur Rahman',
              workTr: 'İslâm ve Modernite',
              workEn: 'Islam and Modernity',
              period: '1982 (Chicago UP)',
              noteTr: 'Maksadî (amaç-odaklı) yorum çerçevesi — hükmün tarihsel bağlamı ile çağdaş uygulaması arasındaki mesafeyi işaret eden modern klasik.',
              noteEn: 'Maqāṣid-based interpretive frame — modern classic pointing to the distance between a ruling\'s historical context and contemporary application.',
            },
            {
              author: 'Khaled Abou El Fadl',
              workTr: 'Vasat İslâm',
              workEn: 'The Search for Beauty in Islam',
              period: '2006',
              noteTr: 'Klasik hukuk ile çağdaş etik arasında entelektüel dürüst bir köprü kurar — hem eleştirel hem imanî.',
              noteEn: 'Builds an intellectually honest bridge between classical law and contemporary ethics — both critical and faithful.',
            },
            {
              author: 'Jonathan A. C. Brown',
              workTr: 'Kur\'ân\'ı Yanlış Alıntılamak',
              workEn: 'Misquoting Muhammad',
              period: '2014 (Oneworld)',
              noteTr: 'İslâmî metin geleneğinin nasıl aktarıldığını + çağdaş yanlış anlamalarını akademik olarak çözümler.',
              noteEn: 'Academically analyzes how the Islamic textual tradition is transmitted + contemporary misreadings.',
            },
            {
              author: 'Ziauddin Sardar',
              workTr: 'Kur\'ân\'ı Okumak',
              workEn: 'Reading the Qur\'an',
              period: '2011 (Oxford UP)',
              noteTr: 'Modern eleştirel Kur\'ân okuması — apolojetik değil bir okumadır; entelektüel dürüstlük vurgulu.',
              noteEn: 'Modern critical Quranic reading — not apologetic but a reading; emphasizes intellectual honesty.',
            },
          ]}
        />
      </div>

      {RELATED_CTA}
    </div>
  );
}

// ─── FilterChip ─────────────────────────────────────────────────────────────
function FilterChip({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? `${color}88` : 'rgba(255,255,255,0.1)'}`,
        background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
        color: active ? color : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ─── QuestionCard — expandable answer ───────────────────────────────────────
function QuestionCard({ q, tr, language, isMobile, cat, expanded, onToggle }) {
  const short = tr ? q.shortResponseTr : q.shortResponseEn;
  const long  = tr ? q.longResponseTr  : q.longResponseEn;
  const title = tr ? q.titleTr : q.titleEn;
  const catColor = cat?.color || COLORS.gold;

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
        border: `1px solid ${expanded ? `${catColor}55` : 'rgba(255,255,255,0.08)'}`,
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
            id: `elestirel:${q.id}`,
            type: 'elestirel',
            title,
            subtitle: tr ? cat?.tr : cat?.en,
            description: short.slice(0, 240),
            url: `/${language}/arac/elestirel-cerceve#${q.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          paddingRight: 40,
        }}
      >
        {/* Category chip */}
        <div style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 4,
          background: `${catColor}22`,
          color: catColor,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {tr ? cat?.tr : cat?.en}
        </div>

        {/* Question title */}
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.05rem' : '1.2rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 12px',
          lineHeight: 1.35,
        }}>
          {title}
        </h3>

        {/* Short response */}
        <p style={{
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.88rem' : '0.92rem',
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
          color: catColor,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Detaylı Okuma' : 'Detailed Reading')}</span>
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
              borderTop: `1px solid ${catColor}22`,
            }}>
              {/* Long response */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.9rem' : '0.94rem',
                lineHeight: 1.85,
                color: COLORS.offWhite,
                margin: '0 0 20px',
                opacity: 0.92,
              }}>
                {long}
              </p>

              {/* Verses referenced */}
              {q.verses && q.verses.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: COLORS.silver,
                    opacity: 0.78,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    {tr ? 'Referans Ayetler' : 'Referenced Verses'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.verses.map((v, i) => (
                      <Link
                        key={i}
                        href={`/${language}/ayet/${v.replace(/[-:].*/, '')}/${v.split(':')[1]?.split('-')[0] || '1'}`}
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
                    ))}
                  </div>
                </div>
              )}

              {/* Classical + Modern sources side-by-side */}
              <div className="zf2-tool-compare-grid" style={{
                display: 'grid',
                gap: 16,
                marginBottom: 16,
              }}>
                {q.classicalSources && q.classicalSources.length > 0 && (
                  <SourceBlock
                    tr={tr}
                    labelTr="Klasik Kaynaklar"
                    labelEn="Classical Sources"
                    sources={q.classicalSources}
                    color={COLORS.gold}
                  />
                )}
                {q.modernSources && q.modernSources.length > 0 && (
                  <SourceBlock
                    tr={tr}
                    labelTr="Modern Akademi"
                    labelEn="Modern Academia"
                    sources={q.modernSources}
                    color="#22d3ee"
                  />
                )}
              </div>

              {/* Related tools */}
              {q.relatedTools && q.relatedTools.length > 0 && (
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
                    {tr ? 'İlgili Araçlar' : 'Related Tools'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.relatedTools.map((t, i) => (
                      <Link
                        key={i}
                        href={t.href.replace('{lang}', language)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: COLORS.silver,
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = `${COLORS.gold}18`;
                          e.currentTarget.style.color = COLORS.gold;
                          e.currentTarget.style.borderColor = `${COLORS.gold}44`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.color = COLORS.silver;
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                      >
                        {tr ? t.titleTr : t.titleEn} →
                      </Link>
                    ))}
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

// ─── SourceBlock — classical or modern sources ──────────────────────────────
function SourceBlock({ tr, labelTr, labelEn, sources, color }) {
  return (
    <div>
      <div style={{
        fontSize: '0.62rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color,
        opacity: 0.85,
        fontWeight: 700,
        marginBottom: 10,
      }}>
        {tr ? labelTr : labelEn}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sources.map((s, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: `${color}0d`,
            border: `1px solid ${color}22`,
            borderRadius: 8,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: s.noteTr ? 6 : 0,
            }}>
              <span style={{ color, fontWeight: 700, fontSize: '0.82rem' }}>{s.author}</span>
              <span style={{ color: COLORS.silver, fontStyle: 'italic', fontSize: '0.78rem' }}>
                {tr ? s.workTr : (s.workEn || s.workTr)}
              </span>
              {s.period && (
                <span style={{ color: COLORS.silver, opacity: 0.78, fontSize: '0.7rem' }}>
                  · {s.period}
                </span>
              )}
            </div>
            {s.noteTr && (
              <p style={{
                margin: 0,
                fontSize: '0.78rem',
                lineHeight: 1.6,
                color: COLORS.silver,
                opacity: 0.88,
              }}>
                {tr ? s.noteTr : (s.noteEn || s.noteTr)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
