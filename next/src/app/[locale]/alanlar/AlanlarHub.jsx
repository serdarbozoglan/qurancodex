'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, RADIUS } from '@/tokens';
import ToolHeader from '@/components/ToolHeader';
import useNavbarOffset from '@/components/useNavbarOffset';
import { DISCIPLINES } from '@/data/disciplines';
import { routesForDiscipline } from '@/data/disciplineMap';

const CompassIcon = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export default function AlanlarHub() {
  const { language } = useLanguage();
  const tr = language !== 'en';
  useNavbarOffset(0, 62);

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - var(--qc-nav-h, 84px))', display: 'flex', flexDirection: 'column', paddingTop: 'var(--qc-nav-h, 84px)' }}>
      <ToolHeader
        icon={<CompassIcon />}
        titleTr="Alanına Göre Keşfet"
        titleEn="Explore by Field"
        subtitleTr="İlgi alanından Kur'an'a bir kapı"
        subtitleEn="A gateway to the Qur'an from your interest"
        language={language}
      />

      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '28px 16px 64px', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 760, margin: '0 0 10px' }}>
          {tr
            ? 'Her alan, sitedeki ilgili araç ve içerikleri bir araya getiren bir keşif kapısıdır.'
            : 'Each field is a discovery gateway that gathers the site\'s related tools and content.'}
        </p>
        <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textFaint, fontSize: '0.8rem', lineHeight: 1.6, maxWidth: 760, margin: '0 0 28px' }}>
          {tr
            ? 'Kur\'an kesin hakikattir; bu alanlar ona yöneliş için birer bakış açısıdır, hakemi değildir.'
            : 'The Qur\'an is certain truth; these fields are vantage points for turning to it, not its arbiter.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {DISCIPLINES.map((d) => {
            const count = routesForDiscipline(d.id).length;
            return (
              <Link
                key={d.id}
                href={`/${language}/alanlar/${d.id}`}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${COLORS.gold}22`,
                  borderRadius: RADIUS.lg, padding: '16px 18px',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>
                    {tr ? d.titleTr : d.titleEn}
                  </h2>
                  <span style={{ fontFamily: FONTS.body, color: COLORS.gold, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                    {count} {tr ? 'araç' : 'tools'}
                  </span>
                </div>
                <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.82rem', lineHeight: 1.6, margin: '8px 0 0' }}>
                  {tr ? d.blurbTr : d.blurbEn}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
