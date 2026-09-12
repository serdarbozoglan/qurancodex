'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, RADIUS } from '@/tokens';
import ToolHeader from '@/components/ToolHeader';
import useNavbarOffset from '@/components/useNavbarOffset';
import LinkifyRefs from '@/components/LinkifyRefs';
import HeroGeometricBackground from '@/components/HeroGeometricBackground';
import { DISCIPLINE_BY_ID } from '@/data/disciplines';
import { routesForDiscipline } from '@/data/disciplineMap';
import { DISCIPLINE_CONTENT } from '@/data/disciplineContent';
import { disciplineIcon } from '@/data/disciplineIcons';
import { TOOL_CATALOG } from '@/data/toolCatalog';

const BY_ROUTE = Object.fromEntries(TOOL_CATALOG.map((t) => [t.route, t]));

function Eyebrow({ children, style }) {
  return (
    <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.78, ...style }}>
      {children}
    </div>
  );
}

// Küçük katman etiketi — "kesin" (âyet, altın) ve "beşerî" (yorum, nötr) ayrımı.
function LayerTag({ tone, children }) {
  const gold = tone === 'scripture';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: FONTS.body, fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: gold ? COLORS.gold : SEMANTIC.textFaint,
    }}>
      <span aria-hidden="true" style={{
        width: 7, height: 7, borderRadius: gold ? '50%' : 2,
        background: gold ? COLORS.gold : 'transparent',
        border: gold ? 'none' : `1px solid ${SEMANTIC.textFaint}`,
        opacity: gold ? 0.85 : 1, flexShrink: 0,
      }} />
      {children}
    </span>
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

  const themes = content?.themes || [];

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

      {/* ── Sinematik hero ────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, ${COLORS.gold}14 0%, transparent 100%)`, borderBottom: `1px solid ${COLORS.gold}1a`, padding: 'clamp(36px, 6vw, 58px) 20px clamp(32px, 5vw, 46px)', textAlign: 'center' }}>
        <HeroGeometricBackground patternOpacity={0.06} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: `${COLORS.gold}14`, border: `1px solid ${COLORS.gold}3d`, color: COLORS.gold, marginBottom: 18, boxShadow: `0 0 44px ${COLORS.gold}1f` }}>
            {disciplineIcon(slug, 31)}
          </div>
          <Eyebrow style={{ margin: '0 0 12px' }}>{tr ? 'Alanına Göre Keşfet' : 'Explore by Field'}</Eyebrow>
          <h1 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(1.75rem, 4.6vw, 2.55rem)', lineHeight: 1.15, margin: '0 0 6px' }}>
            {tr ? d.titleTr : d.titleEn}
          </h1>

          {content?.anchor && (
            <div style={{ position: 'relative', maxWidth: 660, margin: '24px auto 4px', padding: 'clamp(20px, 4vw, 30px) clamp(18px, 4vw, 34px)', background: `linear-gradient(180deg, ${COLORS.gold}12, ${COLORS.gold}05)`, border: `1px solid ${COLORS.gold}33`, borderRadius: RADIUS.lg, boxShadow: `0 0 60px ${COLORS.gold}0f inset` }}>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: COLORS.cosmicBlack, padding: '0 12px' }}>
                <LayerTag tone="scripture">{tr ? 'Çapa Âyet' : 'Anchor Verse'}</LayerTag>
              </div>
              <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: 'clamp(1.4rem, 3.7vw, 1.95rem)', lineHeight: 2.05, margin: '6px 0 14px', textShadow: `0 0 30px ${COLORS.gold}1f` }}>
                {content.anchor.ar}
              </p>
              <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite, fontSize: 'clamp(0.96rem, 1.7vw, 1.06rem)', lineHeight: 1.6, margin: '0 0 8px' }}>
                {tr ? content.anchor.trTr : content.anchor.trEn}
              </p>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.silver, opacity: 0.82 }}>
                — {content.anchor.ref}
              </div>
            </div>
          )}

          <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '1rem', lineHeight: 1.7, margin: '20px auto 0', maxWidth: 620 }}>
            {tr ? d.blurbTr : d.blurbEn}
          </p>
          <div style={{ width: 110, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`, margin: '22px auto 0' }} />
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver, opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, margin: '16px auto 0', maxWidth: 640 }}>
            {tr
              ? 'Kur\'an kesin hakikattir; bu alan ona yöneliş için bir bakış açısıdır, hakemi değildir.'
              : 'The Qur\'an is certain truth; this field is a vantage point for turning to it, not its arbiter.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', width: '100%', padding: 'clamp(28px, 4vw, 38px) 18px 72px', boxSizing: 'border-box' }}>
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

        {content && (
          <section style={{ margin: 0 }}>
            <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textPrimary, fontSize: '1.02rem', lineHeight: 1.9, margin: '0 0 24px' }}>
              {tr ? content.introTr : content.introEn}
            </p>

            {/* ── Katman efsanesi — kesin âyet / beşerî yorum görsel kodu ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', alignItems: 'center', padding: '13px 16px', margin: '0 0 28px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${COLORS.gold}1a`, borderRadius: RADIUS.md }}>
              <span style={{ fontFamily: FONTS.body, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: SEMANTIC.textFaint, marginInlineEnd: 4 }}>
                {tr ? 'Nasıl okunur' : 'How to read'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LayerTag tone="scripture">{tr ? 'Âyet' : 'Ayah'}</LayerTag>
                <span style={{ fontFamily: FONTS.body, fontSize: '0.76rem', color: SEMANTIC.textMuted }}>{tr ? 'kesin beyan' : 'certain declaration'}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LayerTag tone="human">{tr ? 'Yorum' : 'Reading'}</LayerTag>
                <span style={{ fontFamily: FONTS.body, fontSize: '0.76rem', color: SEMANTIC.textMuted }}>{tr ? 'beşerî katman (tefsir · akademik)' : 'human layer (exegesis · academic)'}</span>
              </span>
            </div>

            {/* ── Bölüm indeksi (numaralı, çapa-link) ────────────────────── */}
            {themes.length > 0 && (
              <nav aria-label={tr ? 'Temalar' : 'Themes'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10, margin: '0 0 34px' }}>
                {themes.map((th, i) => (
                  <a
                    key={i}
                    href={`#tema-${i}`}
                    className="alan-detay-nav-item"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', padding: '12px 14px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.gold}22`, borderRadius: RADIUS.md, color: SEMANTIC.textMuted }}
                  >
                    <span style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.15rem', color: COLORS.gold, opacity: 0.78, lineHeight: 1, flexShrink: 0, minWidth: 22 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: FONTS.body, fontSize: '0.86rem', fontWeight: 600, color: COLORS.offWhite, lineHeight: 1.35 }}>
                      {tr ? th.titleTr : th.titleEn}
                    </span>
                  </a>
                ))}
              </nav>
            )}

            {/* ── Temalar ─────────────────────────────────────────────────── */}
            {themes.map((th, i) => (
              <section
                key={i}
                id={`tema-${i}`}
                className="alan-detay-theme"
                style={{ position: 'relative', margin: '0 0 22px', padding: 'clamp(20px, 3vw, 26px) clamp(18px, 3vw, 26px)', background: 'rgba(255,255,255,0.028)', border: `1px solid ${COLORS.gold}22`, borderRadius: RADIUS.lg, overflow: 'hidden' }}
              >
                <span aria-hidden="true" style={{ position: 'absolute', top: 2, right: 14, fontFamily: FONTS.display, fontWeight: 800, fontSize: '3.4rem', color: COLORS.gold, opacity: 0.08, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18, paddingRight: 46 }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.14em', color: COLORS.gold, opacity: 0.78 }}>
                    {tr ? `TEMA ${String(i + 1).padStart(2, '0')}` : `THEME ${String(i + 1).padStart(2, '0')}`}
                  </span>
                </div>
                <h3 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: 'clamp(1.12rem, 2.4vw, 1.32rem)', fontWeight: 600, margin: '-8px 0 16px', paddingRight: 46, lineHeight: 1.25 }}>
                  {tr ? th.titleTr : th.titleEn}
                </h3>

                {/* Kesin katman — âyet(ler) */}
                {(th.verses || []).map((v, j) => (
                  <div key={j} style={{ position: 'relative', margin: '0 0 12px', padding: '15px 17px', background: `linear-gradient(180deg, ${COLORS.gold}0a, rgba(0,0,0,0.22))`, borderRadius: RADIUS.md, borderInlineEnd: `2px solid ${COLORS.gold}66` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <LayerTag tone="scripture">{tr ? 'Âyet' : 'Ayah'}</LayerTag>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, color: COLORS.gold, letterSpacing: '0.03em' }}>
                        <LinkifyRefs text={v.ref} />
                      </span>
                    </div>
                    {v.ar && (
                      <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: 'clamp(1.15rem, 2.9vw, 1.42rem)', lineHeight: 1.95, textAlign: 'right', margin: '0 0 10px' }}>
                        {v.ar}
                      </p>
                    )}
                    <div style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: SEMANTIC.textMuted, lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                      {tr ? v.glossTr : v.glossEn}
                    </div>
                  </div>
                ))}

                {/* Beşerî katman — tefsir */}
                {(tr ? th.tafsirTr : th.tafsirEn) && (
                  <div style={{ marginTop: 14, padding: '13px 16px', background: 'rgba(255,255,255,0.018)', borderInlineStart: `2px solid ${SEMANTIC.textFaint}`, borderRadius: `0 ${RADIUS.md}px ${RADIUS.md}px 0` }}>
                    <div style={{ marginBottom: 6 }}>
                      <LayerTag tone="human">{tr ? 'Tefsir · beşerî yorum' : 'Exegesis · human reading'}</LayerTag>
                    </div>
                    <p style={{ fontFamily: FONTS.body, fontSize: '0.83rem', color: SEMANTIC.textFaint, lineHeight: 1.65, margin: 0 }}>
                      {tr ? th.tafsirTr : th.tafsirEn}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* ── Güvence çağrısı ─────────────────────────────────────────── */}
            {(tr ? content.assuranceTr : content.assuranceEn) && (
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', margin: '10px 0 26px', padding: '18px 20px', background: `${COLORS.gold}0a`, border: `1px solid ${COLORS.gold}2e`, borderRadius: RADIUS.lg }}>
                <span aria-hidden="true" style={{ flexShrink: 0, color: COLORS.gold, opacity: 0.85, marginTop: 1 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <div>
                  <Eyebrow style={{ margin: '0 0 5px' }}>{tr ? 'Sınır ve Güvence' : 'Scope & Assurance'}</Eyebrow>
                  <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.94rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
                    {tr ? content.assuranceTr : content.assuranceEn}
                  </p>
                </div>
              </div>
            )}

            {(tr ? content.tafsirScopeTr : content.tafsirScopeEn) && (
              <p style={{ fontFamily: FONTS.body, fontSize: '0.76rem', color: SEMANTIC.textFaint, lineHeight: 1.62, margin: '0 0 30px' }}>
                {tr ? content.tafsirScopeTr : content.tafsirScopeEn}
              </p>
            )}

            {/* ── Akademik kaynaklar — grid kart ──────────────────────────── */}
            {(content.sources || []).length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Eyebrow style={{ margin: '0 0 6px' }}>{tr ? 'Akademik Kaynaklar' : 'Academic Sources'}</Eyebrow>
                {(tr ? content.sourcesNoteTr : content.sourcesNoteEn) && (
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.79rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 16px', maxWidth: 640 }}>
                    {tr ? content.sourcesNoteTr : content.sourcesNoteEn}
                  </p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {content.sources.map((s, i) => (
                    <div key={i} className="alan-detay-src" style={{ position: 'relative', padding: '15px 16px 15px 40px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${COLORS.gold}20`, borderRadius: RADIUS.md }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 15, top: 15, fontFamily: FONTS.display, fontWeight: 800, fontSize: '0.9rem', color: COLORS.gold, opacity: 0.78 }}>{i + 1}</span>
                      <div style={{ fontFamily: FONTS.body, fontSize: '0.86rem', color: COLORS.offWhite, fontWeight: 600, lineHeight: 1.4 }}>{s.author}</div>
                      <div style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.85rem', color: SEMANTIC.textMuted, lineHeight: 1.45, margin: '2px 0 4px' }}>{s.work}</div>
                      <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: SEMANTIC.textFaint, letterSpacing: '0.02em' }}>{`${s.pub}, ${s.year} · ${s.id}`}</div>
                      {(tr ? s.noteTr : s.noteEn) && (
                        <p style={{ fontFamily: FONTS.body, fontSize: '0.77rem', color: SEMANTIC.textFaint, lineHeight: 1.55, margin: '8px 0 0' }}>
                          {tr ? s.noteTr : s.noteEn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Bu alandaki araçlar ───────────────────────────────────────── */}
        {tools.length > 0 && (
          <div style={{ marginTop: content ? 44 : 0 }}>
            <Eyebrow style={{ margin: '0 0 6px' }}>{tr ? 'Bu Alandaki Araçlar' : 'Tools in This Field'}</Eyebrow>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: SEMANTIC.textFaint, lineHeight: 1.6, margin: '0 0 16px' }}>
              {tr
                ? `Bu kapıdan ${tools.length} araca ulaşılır; her biri sitenin ilgili derin sayfasına açılır.`
                : `${tools.length} tools open from this gateway; each leads to the site's related in-depth page.`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(244px, 1fr))', gap: 12 }}>
              {tools.map((t) => (
                <Link
                  key={t.route}
                  href={`/${language}${t.route}`}
                  className="alan-detay-tool"
                  style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', background: 'rgba(255,255,255,0.025)', border: `1px solid ${COLORS.gold}1f`, borderRadius: RADIUS.md, padding: '15px 16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.25 }}>
                      {tr ? t.titleTr : t.titleEn}
                    </span>
                    <span aria-hidden="true" style={{ color: COLORS.gold, opacity: 0.7, fontSize: '0.9rem', marginInlineStart: 'auto', flexShrink: 0 }}>→</span>
                  </div>
                  <div style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.79rem', lineHeight: 1.5, marginTop: 6 }}>
                    {tr ? t.descTr : t.descEn}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
