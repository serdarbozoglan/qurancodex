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
      <div className="mq-box qc-hero-bg" style={{ borderBottom: `1px solid ${COLORS.gold}1a`, '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px", textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Besmele + çapa âyet (2026-09-13, kullanıcı: bu sayfaya da besmele ve
              âyet). Çapa Sâd 38:29 — "âyetlerini düşünsünler diye indirdiğimiz
              mübârek Kitap": alanına göre keşif = âyetler üzerinde tefekkür. */}
          <div className="mq-fs" dir="rtl" lang="ar" aria-label="Bismillāh" style={{
            fontFamily: FONTS.bismillah, '--fs-d': '2.6rem', '--fs-m': '2.2rem',
            color: COLORS.gold, opacity: 0.82, lineHeight: 1.2, marginBottom: '24px',
          }}>﷽</div>
          <p dir="rtl" lang="ar" className="mq-fs qc-verse-breathe" style={{
            fontFamily: FONTS.quran, color: COLORS.gold,
            '--fs-d': 'clamp(1.7rem, 4.2vw, 2.6rem)', '--fs-m': 'clamp(1.7rem, 4.2vw, 2.6rem)',
            lineHeight: 2.1, margin: '0 0 12px',
          }}>
            كِتَابٌ اَنْزَلْنَاهُ اِلَيْكَ مُبَارَكٌ لِيَدَّبَّرُوا اٰيَاتِهِ وَلِيَتَذَكَّرَ اُولُوا الْاَلْبَابِ
          </p>
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite, opacity: 0.95, fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 6px', maxWidth: 600 }}>
            {tr ? '"Bu, âyetlerini düşünsünler ve akıl sahipleri öğüt alsınlar diye sana indirdiğimiz mübârek bir Kitaptır."' : '"A blessed Book We have revealed to you, so that they may reflect on its verses and people of understanding may take heed."'}
          </p>
          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textFaint, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 28px' }}>— {tr ? 'Sâd 38:29' : 'Ṣād 38:29'}</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(270px, 100%), 1fr))', gap: 16 }}>
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
