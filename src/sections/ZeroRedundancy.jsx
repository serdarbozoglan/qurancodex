import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';
import { COLORS, FONTS } from '../tokens';

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
          borderRadius: '50%',
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
          width: '220px', padding: '10px 12px',
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('zeroRedundancy.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
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


      {/* ── Comparison Section ── */}
      <motion.div variants={fadeUpItem} className="mb-10">
        <h3 className="font-display text-lg font-bold text-off-white mb-2">
          {t('zeroRedundancy.comparisonTitle')}
        </h3>
        <p style={{
          color: 'rgba(148,163,184,0.5)', fontSize: '0.78rem',
          fontFamily: FONTS.body, marginBottom: 20,
        }}>
          {language === 'tr'
            ? 'Karşılaştırılabilir uzunlukta metinlerde gereksiz tekrar oranı'
            : 'Unnecessary repetition rate in texts of comparable length'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quran Card — hero treatment */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(0,0,0,0.1) 100%)',
            border: '1px solid rgba(212,165,116,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: 100, height: 100, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,165,116,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, position: 'relative' }}>
              {/* Icon */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.25)',
                color: COLORS.gold, flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  color: COLORS.gold, fontWeight: 700, fontSize: '0.95rem',
                  fontFamily: FONTS.body,
                }}>
                  {t('zeroRedundancy.comparison.quran.label')}
                </span>
              </div>
              {/* Percentage badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(212,165,116,0.15)',
                border: '1px solid rgba(212,165,116,0.3)',
                borderRadius: 20, padding: '4px 14px',
                flexShrink: 0,
              }}>
                <span style={{
                  color: COLORS.gold, fontSize: '0.95rem', fontWeight: 700,
                  fontFamily: FONTS.body,
                }}>~0%</span>
              </div>
            </div>
            {/* Bar */}
            <div style={{
              height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden', position: 'relative',
            }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '1%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                style={{
                  height: '100%', borderRadius: 3, minWidth: 8,
                  background: `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.gold}aa 100%)`,
                  boxShadow: '0 0 12px rgba(212,165,116,0.4)',
                }}
              />
            </div>
            {t('zeroRedundancy.comparison.quran.note') && (
              <p style={{
                color: 'rgba(148,163,184,0.7)', fontSize: '0.78rem',
                fontFamily: FONTS.body, marginTop: 10, lineHeight: 1.55,
              }}>
                ℹ {t('zeroRedundancy.comparison.quran.note')}
              </p>
            )}
          </div>

          {/* Shakespeare Card */}
          <div style={{
            padding: '16px 24px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)',
                color: COLORS.silver, flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <span style={{
                color: 'rgba(232,230,227,0.7)', fontWeight: 600, fontSize: '0.92rem',
                fontFamily: FONTS.body, flex: 1,
              }}>
                {t('zeroRedundancy.comparison.shakespeare.label')}
              </span>
              <span style={{
                color: COLORS.silver, fontSize: '0.95rem', fontWeight: 700,
                fontFamily: FONTS.body,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 20, padding: '4px 14px',
                flexShrink: 0,
              }}>5-10%</span>
            </div>
            <div style={{
              height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '10%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: `linear-gradient(90deg, ${COLORS.silver} 0%, ${COLORS.silver}80 100%)`,
                }}
              />
            </div>
          </div>

          {/* Bible Card */}
          <div style={{
            padding: '16px 24px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)',
                color: COLORS.silver, flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                </svg>
              </div>
              <span style={{
                color: 'rgba(232,230,227,0.7)', fontWeight: 600, fontSize: '0.92rem',
                fontFamily: FONTS.body, flex: 1,
              }}>
                {t('zeroRedundancy.comparison.bible.label')}
              </span>
              <span style={{
                color: COLORS.silver, fontSize: '0.95rem', fontWeight: 700,
                fontFamily: FONTS.body,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 20, padding: '4px 14px',
                flexShrink: 0,
              }}>15-20%</span>
            </div>
            <div style={{
              height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '20%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: `linear-gradient(90deg, ${COLORS.silver} 0%, ${COLORS.silver}60 100%)`,
                }}
              />
            </div>
            {t('zeroRedundancy.comparison.bible.note') && (
              <p style={{
                color: 'rgba(148,163,184,0.45)', fontSize: '0.72rem',
                fontFamily: FONTS.body, marginTop: 10, lineHeight: 1.5,
              }}>
                ℹ {t('zeroRedundancy.comparison.bible.note')}
              </p>
            )}
          </div>
        </div>

        {t('zeroRedundancy.comparisonNote') && (
          <p style={{
            color: 'rgba(148,163,184,0.35)', fontSize: '0.7rem',
            fontFamily: FONTS.body, marginTop: 14,
            lineHeight: 1.6, fontStyle: 'italic',
          }}>
            * {t('zeroRedundancy.comparisonNote')}
          </p>
        )}
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
    </SectionWrapper>
  );
}
