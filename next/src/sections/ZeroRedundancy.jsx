'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import Link from 'next/link';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';
import { COLORS, FONTS, RADIUS } from '../tokens';

// Hover/tap tooltip anchored to bottom-right of its container (card must be position:relative)
function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false);
  if (!text) return null;
  return (
    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        aria-label="Info"
        style={{
          background: 'rgba(212,165,116,0.10)',
          border: '1px solid rgba(212,165,116,0.25)',
          borderRadius: RADIUS.full,
          width: '22px', height: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(212,165,116,0.7)',
          fontSize: '0.65rem', fontWeight: 700, lineHeight: 1,
          transition: 'all 0.15s',
        }}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        ℹ
      </button>
      {visible && (
        <div style={{
          position: 'absolute', bottom: '28px', right: 0,
          // Mobile-fit: cap at 220px but never exceed viewport minus
          // a 32px gutter (16px each side). Prevents off-screen clip.
          width: 'min(220px, calc(100vw - 32px))',
          padding: '10px 12px',
          background: 'rgba(8,10,26,0.97)',
          border: '1px solid rgba(212,165,116,0.2)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          color: 'rgba(148,163,184,0.8)',
          fontSize: '0.72rem', lineHeight: 1.6,
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

export default function ZeroRedundancy() {
  const { t, language } = useLanguage();
  const mosesExamples = t('zeroRedundancy.mosesExamples') || [];

  const refrainExamples = [
    {
      surah: language === 'tr' ? 'Rahman (55)' : 'Ar-Rahman (55)',
      count: '31',
      context: language === 'tr'
        ? 'Her seferinde farklı bir nimetin ardından geliyor'
        : 'Follows a different blessing each time',
      color: COLORS.softEmerald,
      icon: (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
    {
      surah: language === 'tr' ? 'Mürselat (77)' : 'Al-Mursalat (77)',
      count: '10',
      context: language === 'tr'
        ? 'Her yeni azap sahnesinin ardından yineleniyor'
        : 'Repeated after each new scene of judgment',
      color: COLORS.softRed,
      icon: (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      ),
    },
    {
      surah: language === 'tr' ? 'Kamer (54)' : 'Al-Qamar (54)',
      count: '4',
      context: language === 'tr'
        ? 'Her helak edilen kavmin hikayesinin ardından'
        : 'After each destroyed nation\'s story',
      color: COLORS.skyBlue,
      icon: (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ),
    },
  ];

  return (
    <SectionWrapper id="redundancy" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('zeroRedundancy.badge')}
        </span>
      </motion.div>

      {/* Title — Hero parity */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display font-bold text-off-white mt-4 mb-8"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {t('zeroRedundancy.title')}
      </motion.h2>

      {/* Intro — Hero parity */}
      <motion.p
        variants={fadeUpItem}
        className="font-body max-w-3xl mb-12"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('zeroRedundancy.intro')}
      </motion.p>

      {/* Refrain vs Redundancy — addresses the "but some verses literally repeat" objection */}
      <motion.div variants={fadeUpItem} className="glass-card p-6 md:p-8 mb-12 border-l-4 border-gold/40">
        <h3 className="font-display text-lg md:text-xl font-bold text-off-white mb-3">
          {language === 'tr'
            ? '"Ama bazı ayetler birebir tekrar ediyor" — Haklı bir itiraz'
            : '"But some verses repeat word-for-word" — A fair objection'}
        </h3>
        <p className="text-silver text-base leading-relaxed mb-6">
          {language === 'tr'
            ? 'Rahman Sûresi\'nde aynı ayet 31 kez geçiyor. Mürselat\'ta 10 kez, Kamer\'de 4 kez. Bunlar gerçek, literal tekrarlardır — inkâr edilemez.'
            : 'In Surah Rahman, the same verse appears 31 times. In Al-Mursalat 10 times, in Al-Qamar 4 times. These are real, literal repetitions — undeniable.'}
        </p>

        {/* Three examples — each card gets its own accent color + icon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {refrainExamples.map((ex, i) => (
            <div
              key={i}
              style={{
                background: `${ex.color}08`,
                border: `1px solid ${ex.color}25`,
                borderTop: `3px solid ${ex.color}60`,
                borderRadius: '12px',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Top row: icon + surah name + count badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: `${ex.color}15`, border: `1px solid ${ex.color}30`,
                    color: ex.color, flexShrink: 0,
                  }}>
                    {ex.icon}
                  </span>
                  <span style={{
                    fontFamily: FONTS.body, fontSize: '0.88rem',
                    fontWeight: 600, color: ex.color, lineHeight: 1.2,
                  }}>
                    {ex.surah}
                  </span>
                </div>
                {/* Count badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'baseline', gap: '2px',
                  padding: '4px 12px', borderRadius: '999px',
                  background: `${ex.color}18`, border: `1px solid ${ex.color}35`,
                  fontFamily: FONTS.body, fontWeight: 800,
                  fontSize: '1.1rem', color: ex.color, flexShrink: 0,
                  lineHeight: 1,
                }}>
                  {ex.count}
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7 }}>×</span>
                </span>
              </div>
              {/* Context description */}
              <p style={{
                fontFamily: FONTS.body, fontSize: '0.76rem',
                color: COLORS.silver, lineHeight: 1.55, margin: 0,
              }}>
                {ex.context}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5 space-y-3">
          <p className="text-silver text-base leading-relaxed">
            {language === 'tr'
              ? 'Fark şu: Redundancy, aynı bağlamda, hiçbir ek anlam katmadan tekrar etmektir. Bu ayetlerde bağlam her seferinde değişiyor — farklı bir nimet, farklı bir azap sahnesi, farklı bir kavim. Refren aynı, ama her seferinde farklı bir şeyi soruyor ya da farklı bir gerçeği pekiştiriyor.'
              : 'The difference: Redundancy is repeating in the same context with no added meaning. In these verses, the context shifts each time — a different blessing, a different scene, a different destroyed nation. The refrain is the same, but each time it addresses something new.'}
          </p>
          <p className="text-silver text-base leading-relaxed">
            {language === 'tr' ? (
              <>
                Klasik Arap belagatı bu tekniği 1.000 yıl önce <strong className="text-gold/80">tekrîr</strong> <span lang="ar" style={{ fontFamily: FONTS.quran }}>(تكرير)</span> olarak sistematize etmiş, birden fazla işlevini (te'kîd, tafhîm, istis'âr…) ayırt etmişti — Zerkeşî, <em>el-Burhân fî Ulûmi'l-Kur'an</em> (14. yy). Modern edebiyat aynı yapıyı yüzyıllar sonra "anafora" veya "refrein" olarak yeniden adlandırdı. Beatles'ın "Let it be" nakaratı gereksiz mi? Bir avukatın her delil için "Bu delile ne diyeceksiniz?" sorusunu tekrarlaması boş mu? Hayır — birikimli bir etki yaratıyor.
              </>
            ) : (
              <>
                Classical Arabic rhetoric had systematized this technique a thousand years ago as <strong className="text-gold/80">takrīr</strong> <span lang="ar" style={{ fontFamily: FONTS.quran }}>(تكرير)</span>, distinguishing multiple functions (ta'kīd, tafhīm, istis'ār…) — al-Zarkashī, <em>al-Burhān fī 'Ulūm al-Qur'ān</em> (14th c.). Modern literature later renamed the same structure "anaphora" or "refrain." Is the Beatles' "Let it be" chorus redundant? Is a lawyer's repeated "What do you say to this evidence?" for each piece of evidence unnecessary? No — it creates a cumulative effect.
              </>
            )}
          </p>
          <p className="text-gold/80 text-base font-semibold leading-relaxed">
            {language === 'tr'
              ? 'Kur\'an\'daki tekrarlar, bilgi teorisindeki "gereksiz tekrar" değil — retorik amplifikasyon, yapısal menteşe ve psikolojik içselleştirme mekanizmasıdır.'
              : 'The Quran\'s repetitions are not "redundancy" in the information-theory sense — they are rhetorical amplification, structural hinges, and psychological internalization.'}
          </p>
        </div>
      </motion.div>

      {/* Moses Examples Grid */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <h3 className="font-display text-xl font-bold text-off-white">
            {t('zeroRedundancy.mosesTitle')}
          </h3>
          {language === 'en' && (
            <span className="text-xs font-body text-silver/50 italic">
              ℹ (AS) = <em>Alayhis Salaam</em> — peace be upon him
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(mosesExamples) &&
            mosesExamples.map((example, index) => (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className="glass-card p-5 border-t-2 border-gold/30 hover:border-gold transition-colors duration-300"
              >
                <p className="text-gold text-sm font-body font-semibold mb-2">
                  {example.sura}
                </p>
                <p className="text-off-white/70 text-sm font-body leading-relaxed">
                  {example.theme}
                </p>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Visual separator between Moses grid and stats */}
      <div className="border-t border-white/10 mb-12" />

      {/* Stats Row — 4 equal-height cards */}
      {/* InfoTooltip is a sibling to StatCard (not a child), so it never affects card height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
        {/* Card 1 — no tooltip */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.totalWords.label')}
            value={t('zeroRedundancy.stats.totalWords.value')}
            description={t('zeroRedundancy.stats.totalWords.description')}
            glowColor="gold"
            className="h-full"
          />
        </div>

        {/* Card 2 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.uniqueRoots.label')}
            value={t('zeroRedundancy.stats.uniqueRoots.value')}
            description={t('zeroRedundancy.stats.uniqueRoots.description')}
            glowColor="emerald"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.uniqueRoots.tooltip')} />
        </div>

        {/* Card 3 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.uniqueWords.label')}
            value={t('zeroRedundancy.stats.uniqueWords.value')}
            description={t('zeroRedundancy.stats.uniqueWords.description')}
            glowColor="blue"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.uniqueWords.tooltip')} />
        </div>

        {/* Card 4 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.hapax.label')}
            value={t('zeroRedundancy.stats.hapax.value')}
            description={t('zeroRedundancy.stats.hapax.description')}
            glowColor="gold"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.hapax.tooltip')} />
        </div>
      </div>


      {/* ── İ'câz / Belâgat Section ──
          Replaces the previous Quran/Shakespeare/Bible bar-chart comparison
          with a classical takrīr-bahsi framing. Sources sit inside each card
          (Zerkeşî, Suyûtî, Râzî, İbn Âşûr, TDV İslâm Ansiklopedisi). The
          older comparison was methodologically unsourced and unintentionally
          polemical; this block stays inside the classical Islamic tradition
          and replies to the question "is Quranic repetition a flaw or a
          design?" with direct citations to the i'câz literature itself. */}
      <motion.div variants={fadeUpItem} className="mb-10">
        <h3 className="font-display text-xl md:text-2xl font-bold text-off-white mb-3">
          {t('zeroRedundancy.icaz.intro.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed max-w-3xl mb-8">
          {t('zeroRedundancy.icaz.intro.body')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Card 1 — Zerkeşî / Suyûtî müstakil bahis */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 14,
            background: 'rgba(212,165,116,0.04)',
            border: '1px solid rgba(212,165,116,0.18)',
            borderLeft: '4px solid rgba(212,165,116,0.55)',
          }}>
            <h4 style={{
              color: COLORS.gold, fontWeight: 700, fontSize: '1.1rem',
              fontFamily: FONTS.body, marginBottom: 14,
            }}>
              {t('zeroRedundancy.icaz.card1.title')}
            </h4>
            <p style={{
              color: COLORS.offWhite, fontSize: '1rem',
              fontFamily: FONTS.body, lineHeight: 1.75, marginBottom: 14,
            }}>
              {t('zeroRedundancy.icaz.card1.body')}
            </p>
            <p style={{
              color: 'rgba(232,230,227,0.85)', fontSize: '1rem',
              fontFamily: FONTS.body, lineHeight: 1.75,
            }}>
              {t('zeroRedundancy.icaz.card1.body2')}
            </p>
            <p style={{
              color: 'rgba(148,163,184,0.6)', fontSize: '0.78rem',
              fontFamily: FONTS.body, marginTop: 16, fontStyle: 'italic',
            }}>
              {t('zeroRedundancy.icaz.card1.source')}
            </p>
          </div>

          {/* Card 2 — Üç klasik tekrir işlevi */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h4 style={{
              color: COLORS.gold, fontWeight: 700, fontSize: '1.1rem',
              fontFamily: FONTS.body, marginBottom: 12,
            }}>
              {t('zeroRedundancy.icaz.card2.title')}
            </h4>
            <p style={{
              color: COLORS.silver, fontSize: '0.95rem',
              fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 18,
            }}>
              {t('zeroRedundancy.icaz.card2.lead')}
            </p>
            {/* Three function sub-blocks — each with a distinct accent colour
                so they read as parallel structures rather than running prose. */}
            {(() => {
              const functions = t('zeroRedundancy.icaz.card2.functions') || [];
              const accents = [
                { color: COLORS.gold,         tint: 'rgba(212,165,116,0.10)', border: 'rgba(212,165,116,0.30)' },
                { color: COLORS.skyBlue,      tint: 'rgba(52,152,219,0.10)',  border: 'rgba(52,152,219,0.30)' },
                { color: COLORS.softEmerald,  tint: 'rgba(46,204,113,0.10)',  border: 'rgba(46,204,113,0.30)' },
              ];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {functions.map((fn, i) => {
                    const a = accents[i] || accents[0];
                    return (
                      <div key={fn.name} style={{
                        padding: '14px 18px',
                        borderRadius: 10,
                        background: a.tint,
                        border: `1px solid ${a.border}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                          <span style={{ color: a.color, fontWeight: 700, fontSize: '1.05rem', fontFamily: FONTS.body }}>
                            {fn.name}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.85rem', fontFamily: FONTS.body }}>
                            {fn.subtitle}
                          </span>
                        </div>
                        <p style={{
                          color: COLORS.offWhite, fontSize: '0.95rem',
                          fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 10,
                        }}>
                          {fn.desc}
                        </p>
                        <p style={{
                          color: 'rgba(232,230,227,0.78)', fontSize: '0.92rem',
                          fontFamily: FONTS.body, lineHeight: 1.7,
                          paddingLeft: 14, borderLeft: `2px solid ${a.border}`,
                          fontStyle: 'italic',
                        }}>
                          {fn.example}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <p style={{
              color: 'rgba(148,163,184,0.6)', fontSize: '0.78rem',
              fontFamily: FONTS.body, marginTop: 16, fontStyle: 'italic',
            }}>
              {t('zeroRedundancy.icaz.card2.source')}
            </p>
          </div>

          {/* Card 3 — Kıssaların çoklu anlatımı */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h4 style={{
              color: COLORS.gold, fontWeight: 700, fontSize: '1.1rem',
              fontFamily: FONTS.body, marginBottom: 14,
            }}>
              {t('zeroRedundancy.icaz.card3.title')}
            </h4>
            <p style={{
              color: COLORS.offWhite, fontSize: '1rem',
              fontFamily: FONTS.body, lineHeight: 1.75, marginBottom: 14,
            }}>
              {t('zeroRedundancy.icaz.card3.body')}
            </p>
            <p style={{
              color: 'rgba(232,230,227,0.85)', fontSize: '1rem',
              fontFamily: FONTS.body, lineHeight: 1.75,
            }}>
              {t('zeroRedundancy.icaz.card3.body2')}
            </p>
            <p style={{
              color: 'rgba(148,163,184,0.6)', fontSize: '0.78rem',
              fontFamily: FONTS.body, marginTop: 16, fontStyle: 'italic',
            }}>
              {t('zeroRedundancy.icaz.card3.source')}
            </p>
          </div>
        </div>

        {/* Outro paragraph */}
        <p style={{
          color: 'rgba(212,165,116,0.9)', fontSize: '1.05rem',
          fontFamily: FONTS.body, fontStyle: 'italic',
          lineHeight: 1.75, marginTop: 24,
          maxWidth: '48rem',
        }}>
          {t('zeroRedundancy.icaz.outro')}
        </p>
      </motion.div>

      {/* Zemahseri Quote */}
      <motion.blockquote
        variants={fadeUpItem}
        className="glass-card p-8 md:p-10 border-l-4 border-gold"
      >
        <p className="text-gold/90 text-lg md:text-xl italic font-display leading-relaxed mb-4">
          {t('zeroRedundancy.zemahseriQuote')}
        </p>
        <cite className="text-silver text-sm not-italic block font-body">
          — {t('zeroRedundancy.zemahseriAttribution')}
        </cite>
      </motion.blockquote>

      {/* ── Cross-tool CTA strip — 3 refrain sûresi ──────────────────────── */}
      <motion.div variants={fadeUpItem} className="mt-10">
        <div className="text-center mb-5">
          <span className="font-body uppercase tracking-[0.24em] text-xs" style={{ color: COLORS.gold, opacity: 0.7 }}>
            {language === 'tr' ? 'Daha Derine — İlgili Sûreler' : 'Go Deeper — Related Suras'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { surahNum: 55, titleTr: 'Rahmân Sûresi (55)', titleEn: 'Sura ar-Raḥmān (55)', descTr: '"Fe-bi-eyyi âlâ\'i Rabbikumâ tukezzibân" — aynı ayet 31 kez. Her tekrar farklı bir nimet için.', descEn: '"Fa-bi-ayyi ālāʾi rabbikumā tukadhdhibān" — the same verse 31 times. Each repetition follows a different blessing.' },
            { surahNum: 77, titleTr: 'Mürselât Sûresi (77)', titleEn: 'Sura al-Mursalāt (77)', descTr: '"Veylun yevmeizin lil-mukezzibîn" — 10 kez tekrar; her tekrar farklı bir uyarı bağlamında.', descEn: '"Waylun yawmaʾidhin lil-mukadhdhibīn" — 10 repetitions, each anchored to a different warning.' },
            { surahNum: 54, titleTr: 'Kamer Sûresi (54)', titleEn: 'Sura al-Qamar (54)', descTr: '"Velekad yessernel-Kur\'âne lizzikri fe hel min muddekir" — 4 kez; her kıssayı kapatan didaktik mühür.', descEn: '"Wa-laqad yassarnā l-Qurʾāna li-dh-dhikri fa-hal min muddakir" — 4 repetitions, each closing a sealing didactic call.' },
          ].map((tt, i) => (
            <motion.div
              key={tt.surahNum}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/${language}/oku/${tt.surahNum}`}
                className="block rounded-xl p-5 h-full transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${COLORS.gold}33`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}1a 0%, rgba(255,255,255,0.04) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}33`;
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-body font-bold text-base" style={{ color: COLORS.gold, margin: 0 }}>
                    {language === 'tr' ? tt.titleTr : tt.titleEn}
                  </h4>
                  <span style={{ color: COLORS.gold, opacity: 0.7 }}>→</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: COLORS.silver, margin: 0 }}>
                  {language === 'tr' ? tt.descTr : tt.descEn}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
