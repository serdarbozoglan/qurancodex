'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, RADIUS } from '@/tokens';
import ToolHeader from '@/components/ToolHeader';
import useNavbarOffset from '@/components/useNavbarOffset';
import LinkifyRefs from '@/components/LinkifyRefs';
import { DISCIPLINE_BY_ID } from '@/data/disciplines';
import { routesForDiscipline } from '@/data/disciplineMap';
import { DISCIPLINE_CONTENT } from '@/data/disciplineContent';
import { TOOL_CATALOG } from '@/data/toolCatalog';

const BY_ROUTE = Object.fromEntries(TOOL_CATALOG.map((t) => [t.route, t]));

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.8, margin: '0 0 12px' }}>
      {children}
    </div>
  );
}

export default function AlanDetay({ slug }) {
  const { language } = useLanguage();
  const tr = language !== 'en';
  useNavbarOffset(0, 62);

  const d = DISCIPLINE_BY_ID[slug];
  const content = DISCIPLINE_CONTENT[slug];
  const tools = routesForDiscipline(slug).map((r) => BY_ROUTE[r]).filter(Boolean);
  if (!d) return null;

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - var(--qc-nav-h, 84px))', display: 'flex', flexDirection: 'column', paddingTop: 'var(--qc-nav-h, 84px)' }}>
      <ToolHeader
        titleTr={d.titleTr}
        titleEn={d.titleEn}
        subtitleTr="Alanına Göre Keşfet"
        subtitleEn="Explore by Field"
        language={language}
        homeHref={`/${language}/alanlar`}
      />

      <div style={{ maxWidth: 860, margin: '0 auto', width: '100%', padding: '28px 16px 64px', boxSizing: 'border-box' }}>
        {/* Blurb */}
        <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 16px' }}>
          {tr ? d.blurbTr : d.blurbEn}
        </p>

        {/* §13.24 zorunlu üst-uyarı (tabiat-afak) */}
        {(tr ? d.warnTr : d.warnEn) && (
          <div style={{ background: `${COLORS.gold}14`, border: `1px solid ${COLORS.gold}33`, borderRadius: RADIUS.md, padding: '12px 16px', margin: '0 0 20px' }}>
            <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
              {tr ? d.warnTr : d.warnEn}
            </p>
          </div>
        )}

        {/* Disiplin notu (ör. psikoloji/iktisat nüansı) */}
        {(tr ? d.noteTr : d.noteEn) && (
          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textFaint, fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 24px', fontStyle: 'italic' }}>
            {tr ? d.noteTr : d.noteEn}
          </p>
        )}

        {/* B — kaynaklı çapa içeriği */}
        {content && (
          <section style={{ margin: '0 0 36px' }}>
            <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textPrimary, fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 24px' }}>
              {tr ? content.introTr : content.introEn}
            </p>

            {(content.themes || []).map((th, i) => (
              <div key={i} style={{ margin: '0 0 22px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.gold}1f`, borderRadius: RADIUS.md, borderLeft: `3px solid ${COLORS.gold}` }}>
                <h3 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.02rem', fontWeight: 600, margin: '0 0 12px' }}>
                  {tr ? th.titleTr : th.titleEn}
                </h3>
                {(th.verses || []).map((v, j) => (
                  <div key={j} style={{ margin: '0 0 10px' }}>
                    <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, color: COLORS.gold, margin: '0 0 2px' }}>
                      <LinkifyRefs text={v.ref} />
                    </div>
                    <div style={{ fontFamily: FONTS.body, fontSize: '0.86rem', color: SEMANTIC.textMuted, lineHeight: 1.6 }}>
                      {tr ? v.glossTr : v.glossEn}
                    </div>
                  </div>
                ))}
                {(tr ? th.tafsirTr : th.tafsirEn) && (
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '10px 0 0' }}>
                    {tr ? th.tafsirTr : th.tafsirEn}
                  </p>
                )}
              </div>
            ))}

            {(tr ? content.assuranceTr : content.assuranceEn) && (
              <p style={{ fontFamily: FONTS.body, fontSize: '0.84rem', color: SEMANTIC.textMuted, lineHeight: 1.65, margin: '0 0 20px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${COLORS.gold}1f`, borderRadius: RADIUS.md }}>
                {tr ? content.assuranceTr : content.assuranceEn}
              </p>
            )}

            {(tr ? content.tafsirScopeTr : content.tafsirScopeEn) && (
              <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 24px', fontStyle: 'italic' }}>
                {tr ? content.tafsirScopeTr : content.tafsirScopeEn}
              </p>
            )}

            {(content.sources || []).length > 0 && (
              <div style={{ marginTop: 20 }}>
                <SectionLabel>{tr ? 'Akademik Kaynaklar' : 'Academic Sources'}</SectionLabel>
                {(tr ? content.sourcesNoteTr : content.sourcesNoteEn) && (
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 12px' }}>
                    {tr ? content.sourcesNoteTr : content.sourcesNoteEn}
                  </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {content.sources.map((s, i) => (
                    <li key={i} style={{ fontFamily: FONTS.body, fontSize: '0.82rem', lineHeight: 1.55, color: SEMANTIC.textMuted }}>
                      <span style={{ color: COLORS.offWhite, fontWeight: 600 }}>{s.author}</span>
                      {', '}<span style={{ fontStyle: 'italic' }}>{s.work}</span>
                      {` — ${s.pub}, ${s.year} (${s.id}).`}
                      <span style={{ display: 'block', color: SEMANTIC.textFaint, fontSize: '0.78rem', marginTop: 2 }}>
                        {tr ? s.noteTr : s.noteEn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Araç vitrini */}
        <SectionLabel>{tr ? 'Bu Alandaki Araçlar' : 'Tools in This Field'}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {tools.map((t) => (
            <Link
              key={t.route}
              href={`/${language}${t.route}`}
              style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.gold}1f`, borderRadius: RADIUS.md, padding: '13px 15px' }}
            >
              <div style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>
                {tr ? t.titleTr : t.titleEn}
              </div>
              <div style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.78rem', lineHeight: 1.5 }}>
                {tr ? t.descTr : t.descEn}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
