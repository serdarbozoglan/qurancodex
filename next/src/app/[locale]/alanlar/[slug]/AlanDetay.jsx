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

function Eyebrow({ children, style }) {
  return (
    <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.78, ...style }}>
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

      {/* ── Premium hero band ─────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.gold}0f 0%, transparent 100%)`, borderBottom: `1px solid ${COLORS.gold}1a`, padding: '40px 20px 34px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Eyebrow style={{ margin: '0 0 14px' }}>{tr ? 'Alanına Göre Keşfet' : 'Explore by Field'}</Eyebrow>
          <h1 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(1.7rem, 4.6vw, 2.5rem)', lineHeight: 1.15, margin: '0 0 16px' }}>
            {tr ? d.titleTr : d.titleEn}
          </h1>
          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '1rem', lineHeight: 1.7, margin: '0 auto', maxWidth: 620 }}>
            {tr ? d.blurbTr : d.blurbEn}
          </p>
          <div style={{ width: 110, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`, margin: '22px auto 0' }} />
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver, opacity: 0.9, fontSize: '0.92rem', lineHeight: 1.6, margin: '18px auto 0', maxWidth: 640 }}>
            {tr
              ? 'Kur\'an kesin hakikattir; bu alan ona yöneliş için bir bakış açısıdır, hakemi değildir.'
              : 'The Qur\'an is certain truth; this field is a vantage point for turning to it, not its arbiter.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', width: '100%', padding: '30px 18px 68px', boxSizing: 'border-box' }}>
        {/* §13.24 zorunlu üst-uyarı */}
        {(tr ? d.warnTr : d.warnEn) && (
          <div style={{ background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}33`, borderRadius: RADIUS.md, padding: '14px 18px', margin: '0 0 22px' }}>
            <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
              {tr ? d.warnTr : d.warnEn}
            </p>
          </div>
        )}

        {/* Disiplin nüans notu */}
        {(tr ? d.noteTr : d.noteEn) && (
          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textFaint, fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 26px', fontStyle: 'italic' }}>
            {tr ? d.noteTr : d.noteEn}
          </p>
        )}

        {/* ── B — kaynaklı çapa içeriği ──────────────────────────────── */}
        {content && (
          <section style={{ margin: '0 0 40px' }}>
            <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textPrimary, fontSize: '1rem', lineHeight: 1.85, margin: '0 0 30px' }}>
              {tr ? content.introTr : content.introEn}
            </p>

            {(content.themes || []).map((th, i) => (
              <div key={i} style={{ position: 'relative', margin: '0 0 18px', padding: '20px 22px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.gold}22`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: 6, right: 16, fontFamily: FONTS.display, fontWeight: 800, fontSize: '2.6rem', color: COLORS.gold, opacity: 0.09, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.1rem', fontWeight: 600, margin: '0 0 14px', paddingRight: 40 }}>
                  {tr ? th.titleTr : th.titleEn}
                </h3>
                {(th.verses || []).map((v, j) => (
                  <div key={j} style={{ margin: '0 0 11px', paddingLeft: 14, borderLeft: `2px solid ${COLORS.gold}40` }}>
                    <div style={{ fontFamily: FONTS.body, fontSize: '0.74rem', fontWeight: 700, color: COLORS.gold, letterSpacing: '0.04em', margin: '0 0 3px' }}>
                      <LinkifyRefs text={v.ref} />
                    </div>
                    <div style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: SEMANTIC.textMuted, lineHeight: 1.65 }}>
                      {tr ? v.glossTr : v.glossEn}
                    </div>
                  </div>
                ))}
                {(tr ? th.tafsirTr : th.tafsirEn) && (
                  <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid ${COLORS.gold}14` }}>
                    <span style={{ fontFamily: FONTS.body, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.6 }}>
                      {tr ? 'Tefsir' : 'Exegesis'}
                    </span>
                    <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '4px 0 0' }}>
                      {tr ? th.tafsirTr : th.tafsirEn}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {(tr ? content.assuranceTr : content.assuranceEn) && (
              <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.9rem', color: COLORS.silver, lineHeight: 1.7, margin: '6px 0 22px', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${COLORS.gold}66`, borderRadius: `0 ${RADIUS.md}px ${RADIUS.md}px 0` }}>
                {tr ? content.assuranceTr : content.assuranceEn}
              </p>
            )}

            {(tr ? content.tafsirScopeTr : content.tafsirScopeEn) && (
              <p style={{ fontFamily: FONTS.body, fontSize: '0.76rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 26px' }}>
                {tr ? content.tafsirScopeTr : content.tafsirScopeEn}
              </p>
            )}

            {(content.sources || []).length > 0 && (
              <div style={{ marginTop: 26, padding: '20px 22px', background: `${COLORS.gold}0a`, border: `1px solid ${COLORS.gold}22`, borderRadius: RADIUS.lg }}>
                <Eyebrow style={{ margin: '0 0 6px' }}>{tr ? 'Akademik Kaynaklar' : 'Academic Sources'}</Eyebrow>
                {(tr ? content.sourcesNoteTr : content.sourcesNoteEn) && (
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 14px' }}>
                    {tr ? content.sourcesNoteTr : content.sourcesNoteEn}
                  </p>
                )}
                <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, counterReset: 'src' }}>
                  {content.sources.map((s, i) => (
                    <li key={i} style={{ fontFamily: FONTS.body, fontSize: '0.82rem', lineHeight: 1.55, color: SEMANTIC.textMuted, paddingLeft: 22, position: 'relative' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, color: COLORS.gold, opacity: 0.55, fontWeight: 700, fontSize: '0.72rem' }}>{i + 1}.</span>
                      <span style={{ color: COLORS.offWhite, fontWeight: 600 }}>{s.author}</span>
                      {', '}<span style={{ fontStyle: 'italic' }}>{s.work}</span>
                      {` — ${s.pub}, ${s.year} (${s.id}).`}
                      <span style={{ display: 'block', color: SEMANTIC.textFaint, fontSize: '0.77rem', marginTop: 2 }}>
                        {tr ? s.noteTr : s.noteEn}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        {/* ── Araç vitrini ──────────────────────────────────────────── */}
        <Eyebrow style={{ margin: '0 0 14px' }}>{tr ? 'Bu Alandaki Araçlar' : 'Tools in This Field'}</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {tools.map((t) => (
            <Link
              key={t.route}
              href={`/${language}${t.route}`}
              style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.gold}1f`, borderRadius: RADIUS.md, padding: '14px 16px', transition: 'border-color 0.15s, background 0.15s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '0.96rem', fontWeight: 600 }}>
                  {tr ? t.titleTr : t.titleEn}
                </span>
                <span aria-hidden="true" style={{ color: COLORS.gold, opacity: 0.7, fontSize: '0.9rem', marginInlineStart: 'auto' }}>→</span>
              </div>
              <div style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.78rem', lineHeight: 1.5, marginTop: 5 }}>
                {tr ? t.descTr : t.descEn}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
