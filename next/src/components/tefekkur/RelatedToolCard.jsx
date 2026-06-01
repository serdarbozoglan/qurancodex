'use client';

import Link from 'next/link';
import { COLORS, FONTS, RADIUS } from '../../tokens';

const TOOL_META = {
  'concept-graph':  { labelTr: 'Kavram Grafiği', labelEn: 'Concept Graph', path: '/graf/kavram', accent: COLORS.purple, descTr: 'Kavramlar arası ağ', descEn: 'Concept network' },
  'verse-graph':    { labelTr: 'Ayet Grafiği',   labelEn: 'Verse Graph',   path: '/graf/ayet',   accent: COLORS.gold,   descTr: 'Ayet semantik haritası', descEn: 'Verse semantic map' },
  'esma-frekans':   { labelTr: 'Esmâ-i Hüsnâ',  labelEn: 'The Beautiful Names',  path: '/arac/esma-frekans', accent: '#1D9E75', descTr: 'Allah\'ın kendini tanıtması', descEn: 'How God describes Himself' },
  'kissa-atlas':    { labelTr: 'Kıssa Atlası',   labelEn: 'Story Atlas',   path: '/atlas/kissa', accent: COLORS.gold,   descTr: 'Peygamber kıssaları', descEn: 'Prophet stories' },
  'semantik-map':   { labelTr: 'Semantik Harita',labelEn: 'Semantic Map',  path: '/graf/semantik', accent: '#3498db', descTr: '20 küme', descEn: '20 clusters' },
  'reading-mode':   { labelTr: 'Kur\'an\'ı Oku',  labelEn: 'Read Quran',    path: '/oku/1',       accent: COLORS.gold,   descTr: 'Reading Mode', descEn: 'Reading Mode' },
  'munafik-profili':{ labelTr: 'Münafık Profili',labelEn: 'Hypocrite',     path: '/atlas/munafik', accent: '#e74c3c', descTr: '12 psikolojik özellik', descEn: '12 psychological traits' },
  'nefs-mertebeleri': { labelTr: 'Nefs Mertebeleri', labelEn: 'Soul Stations', path: '/atlas/nefs-mertebeleri', accent: '#9b59b6', descTr: '7 mertebe', descEn: '7 stations' },
};

export default function RelatedToolCard({ tool, language }) {
  const meta = TOOL_META[tool];
  if (!meta) return null;
  const tr = language === 'tr';
  return (
    <Link
      href={`/${language}${meta.path}`}
      style={{
        display: 'block',
        padding: '16px 18px',
        background: `linear-gradient(180deg, ${meta.accent}10 0%, rgba(255,255,255,0.022) 65%)`,
        border: `1px solid ${meta.accent}33`,
        borderRadius: RADIUS.md,
        textDecoration: 'none',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = `${meta.accent}66`;
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.22), 0 0 18px ${meta.accent}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = `${meta.accent}33`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: meta.accent,
          boxShadow: `0 0 12px ${meta.accent}aa`,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
          color: meta.accent, textTransform: 'uppercase', fontFamily: FONTS.body,
        }}>
          {tr ? 'Araç' : 'Tool'}
        </span>
      </div>
      <div style={{
        fontSize: '0.96rem', fontWeight: 700,
        color: COLORS.offWhite, fontFamily: FONTS.body,
        marginBottom: '4px',
      }}>
        {tr ? meta.labelTr : meta.labelEn}
      </div>
      <div style={{
        fontSize: '0.78rem', color: COLORS.silver,
        fontFamily: FONTS.body, lineHeight: 1.5,
      }}>
        {tr ? meta.descTr : meta.descEn}
      </div>
    </Link>
  );
}
