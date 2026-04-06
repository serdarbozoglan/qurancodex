import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

/* ── 6 featured tools ────────────────────────────────────────────────── */
const FEATURED = [
  {
    id: 'ayet-haritasi',
    titleTr: 'Ayet Haritası',   titleEn: 'Verse Map',
    descTr: '6.236 ayeti uzayda gör', descEn: 'See 6,236 verses in 3D space',
    event: 'openVerseGraph',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="5" cy="6" r="2.5"/><circle cx="14" cy="4" r="1.5"/>
        <circle cx="20" cy="10" r="3"/><circle cx="8" cy="16" r="2"/>
        <circle cx="18" cy="19" r="1.5"/><circle cx="3" cy="19" r="1"/>
        <circle cx="12" cy="12" r="1"/>
      </svg>
    ),
  },
  {
    id: 'kissa-atlasi',
    titleTr: 'Kıssa Atlası',    titleEn: 'Story Atlas',
    descTr: '4 peygamber — hangi surede hangi sahne?', descEn: '4 prophets — which scene in which surah?',
    event: 'openKissaAtlas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'kiraat-atlasi',
    titleTr: 'Kıraat Atlası',   titleEn: 'Qirāʾāt Atlas',
    descTr: '10 imam · 20 râvî · coğrafi dağılım', descEn: '10 readers · 20 transmitters · geographic spread',
    event: 'openKiraatAtlas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'sebeb-i-nuzul',
    titleTr: 'Sebeb-i Nüzul',   titleEn: 'Occasions of Revelation',
    descTr: 'Olay→ayet & ayet→olay · çift yönlü arama', descEn: 'Event→verse & verse→event · bidirectional',
    event: 'openSebebNuzul',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
      </svg>
    ),
  },
  {
    id: 'mesel-atlasi',
    titleTr: 'Mesel & Temsil Atlası', titleEn: 'Parables & Metaphors Atlas',
    descTr: '~50 mesel · 7 imge evreni · nûr-zulumât', descEn: '~50 parables · 7 imagery domains · light-darkness',
    event: 'openMeselAtlas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>
      </svg>
    ),
  },
  {
    id: 'dua-ayetleri',
    titleTr: 'Dua Ayetleri',    titleEn: 'Prayer Verses',
    descTr: "Kur'an'dan 50 seçilmiş dua", descEn: '50 selected supplications from the Quran',
    event: 'openDuaVerses',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
];

export default function ToolsShowcase() {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const openTool = (eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const openExploreMenu = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('openExploreMenu')), 600);
  };

  const openToolsMenu = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('openToolsMenu')), 600);
  };

  return (
    <SectionWrapper id="tools-showcase" noPadding className="py-[30px] px-6 md:px-12 lg:px-16">
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {language === 'tr' ? 'ARAÇLAR' : 'TOOLS'}
        </span>
      </motion.div>

      {/* Subtitle */}
      <motion.p variants={fadeUpItem}
        className="text-silver text-sm font-body mt-2 mb-8"
      >
        {language === 'tr' ? 'İnteraktif analiz ve keşif araçları' : 'Interactive analysis & exploration tools'}
      </motion.p>

      {/* Card grid */}
      <motion.div variants={fadeUpItem} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '10px' : '14px',
      }}>
        {FEATURED.map(tool => (
          <button
            key={tool.id}
            onClick={() => openTool(tool.event)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: isMobile ? '14px 16px' : '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              minHeight: '44px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
          >
            <span style={{ color: 'rgba(212,165,116,0.7)', flexShrink: 0 }}>
              {tool.icon}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <span style={{
                color: '#e8e6e3',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
              }}>
                {language === 'tr' ? tool.titleTr : tool.titleEn}
              </span>
              <span style={{
                color: '#94a3b8',
                fontSize: '0.78rem',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {language === 'tr' ? tool.descTr : tool.descEn}
              </span>
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── Discovery closing layer ─────────────────────────────────── */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center', marginTop: '32px' }}>
        {/* Title */}
        <h3 className="font-display font-bold text-gold mb-4"
          style={{ fontSize: 'clamp(17px, 3.5vw, 22px)' }}>
          {language === 'tr' ? 'Henüz yüzeyi gördünüz' : "You've only seen the surface"}
        </h3>

        {/* Stat chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {[
            { num: '25+', label: language === 'tr' ? 'araç' : 'tools' },
            { num: '8',   label: language === 'tr' ? 'keşif bölümü' : 'discovery sections' },
            { num: '6.236', label: language === 'tr' ? 'ayet' : 'verses' },
            { num: '114', label: language === 'tr' ? 'sure' : 'surahs' },
          ].map((s, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(212,165,116,0.07)',
                border: '1px solid rgba(212,165,116,0.2)',
                fontSize: '13px',
              }}>
              <span className="font-body font-bold text-gold">{s.num}</span>
              <span className="text-silver">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={openExploreMenu}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(212,165,116,0.55)',
              background: 'transparent',
              color: '#d4a574',
            }}
            whileHover={{ background: 'rgba(212,165,116,0.1)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {language === 'tr' ? 'Keşfet' : 'Discover'}
          </motion.button>
          <motion.button
            onClick={openToolsMenu}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid #d4a574',
              background: '#d4a574',
              color: '#08091a',
            }}
            whileHover={{ boxShadow: '0 0 28px rgba(212,165,116,0.35)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {language === 'tr' ? 'Araçlar' : 'Tools'}
          </motion.button>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
