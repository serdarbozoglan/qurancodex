'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, RADIUS } from '@/tokens';
import ToolHeader from '@/components/ToolHeader';
import useNavbarOffset from '@/components/useNavbarOffset';
import { DISCIPLINES } from '@/data/disciplines';
import { routesForDiscipline } from '@/data/disciplineMap';
import { disciplineIcon } from '@/data/disciplineIcons';

export default function AlanlarHub() {
  const { language } = useLanguage();
  const tr = language !== 'en';
  useNavbarOffset(0, 62);

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - var(--qc-nav-h, 84px))', display: 'flex', flexDirection: 'column', paddingTop: 'var(--qc-nav-h, 84px)' }}>
      <ToolHeader
        titleTr="Alanına Göre Keşfet"
        titleEn="Explore by Field"
        subtitleTr="İlgi alanından Kur'an'a bir kapı"
        subtitleEn="A gateway to the Qur'an from your interest"
        language={language}
      />

      {/* ── Premium hero ─────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.gold}0f 0%, transparent 100%)`, borderBottom: `1px solid ${COLORS.gold}1a`, padding: 'clamp(36px, 6vw, 52px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.78, marginBottom: 14 }}>
            {tr ? '12 Disiplin Kapısı' : '12 Discipline Gateways'}
          </div>
          <h1 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(1.7rem, 4.8vw, 2.6rem)', lineHeight: 1.14, margin: '0 0 16px' }}>
            {tr ? "Kendi alanından Kur'an'a bir kapı" : "A gateway to the Qur'an from your own field"}
          </h1>
          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '1rem', lineHeight: 1.7, margin: '0 auto', maxWidth: 620 }}>
            {tr ? 'Her alan, sitedeki ilgili âyet, tefsir ve araçları bir araya getiren bir keşif kapısıdır.' : 'Each field is a discovery gateway gathering the site\'s related verses, exegesis and tools.'}
          </p>
          <div style={{ width: 110, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`, margin: '20px auto 0' }} />
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver, opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, margin: '16px auto 0', maxWidth: 620 }}>
            {tr ? 'Kur\'an kesin hakikattir; bu alanlar ona yöneliş için birer bakış açısıdır, hakemi değildir.' : 'The Qur\'an is certain truth; these fields are vantage points for turning to it, not its arbiter.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', padding: 'clamp(26px, 4vw, 40px) 16px 64px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
          {DISCIPLINES.map((d) => {
            const count = routesForDiscipline(d.id).length;
            return (
              <Link
                key={d.id}
                href={`/${language}/alanlar/${d.id}`}
                className="alan-card"
                style={{
                  display: 'flex', flexDirection: 'column', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.028)',
                  border: `1px solid ${COLORS.gold}26`,
                  borderRadius: RADIUS.lg, padding: '20px 20px 18px',
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: '50%', background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}2e`, color: COLORS.gold, flexShrink: 0 }}>
                    {disciplineIcon(d.id, 22)}
                  </span>
                  <span style={{ fontFamily: FONTS.body, color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.02em', background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}26`, borderRadius: RADIUS.pill, padding: '3px 10px', flexShrink: 0 }}>
                    {count} {tr ? 'araç' : 'tools'}
                  </span>
                </div>
                <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.18rem', margin: '0 0 8px', fontWeight: 600, lineHeight: 1.2 }}>
                  {tr ? d.titleTr : d.titleEn}
                </h2>
                <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
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
