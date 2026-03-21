import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

function BesmeleWidget({ language }) {
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        setTimeout(() => setStep(1), 200);
        setTimeout(() => setStep(2), 900);
        setTimeout(() => setStep(3), 1700);
        setTimeout(() => setStep(4), 2400);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const tr = language === 'tr';

  return (
    <div ref={ref} className="glass-card-strong p-8 md:p-10 mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.25em]">
          {tr ? 'Besmele Dengesi' : 'Bismillah Balance'}
        </span>
      </div>

      {/* Arabic Bismillah */}
      <div className="text-center mb-8">
        <p
          className="font-display text-gold"
          style={{ fontFamily: 'Amiri, serif', fontSize: '1.7rem', lineHeight: 1.8, direction: 'rtl' }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-silver/50 text-xs font-body mt-1">
          {tr ? 'Bismillâhirrahmânirrahîm' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
        </p>
      </div>

      {/* 114 surah grid — small dots */}
      <div className="flex flex-wrap gap-[3px] justify-center mb-8 max-w-lg mx-auto">
        {Array.from({ length: 114 }, (_, i) => {
          const n = i + 1;
          const isTevbe = n === 9;
          const isNeml = n === 27;
          return (
            <div
              key={n}
              title={`Sure ${n}`}
              style={{
                width: '14px', height: '14px', borderRadius: '3px',
                transition: 'all 0.4s ease',
                background: isTevbe
                  ? 'rgba(231,76,60,0.7)'
                  : isNeml
                  ? 'rgba(212,165,116,0.9)'
                  : 'rgba(212,165,116,0.18)',
                border: isTevbe
                  ? '1px solid rgba(231,76,60,0.9)'
                  : isNeml
                  ? '1px solid rgba(212,165,116,0.7)'
                  : '1px solid rgba(212,165,116,0.06)',
                transform: (isTevbe || isNeml) ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
      <p className="text-center text-silver/40 text-xs font-body mb-8">
        {tr ? '114 sure — her kare bir sure' : '114 surahs — each square is one surah'}
      </p>

      {/* Equation steps */}
      <div className="max-w-sm mx-auto space-y-4">
        {/* Step 1: 114 surahs */}
        <div
          className="flex items-center justify-between glass-card px-5 py-3 transition-all duration-500"
          style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <span className="text-silver text-sm font-body">
            {tr ? 'Toplam sure sayısı' : 'Total surahs'}
          </span>
          <span className="text-off-white font-extrabold text-xl font-body">114</span>
        </div>

        {/* Step 2: Tevbe — no Bismillah */}
        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-500"
          style={{
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? 'translateY(0)' : 'translateY(12px)',
            background: 'rgba(231,76,60,0.08)',
            border: '1px solid rgba(231,76,60,0.25)',
          }}
        >
          <div>
            <p className="text-[#e74c3c] text-xs font-body uppercase tracking-wider mb-0.5">
              {tr ? 'Sure 9 · Tevbe · Besmele yok' : 'Surah 9 · At-Tawbah · No Bismillah'}
            </p>
            <p className="text-silver/60 text-xs font-body">
              {tr ? '→ 113 başlangıç besmelesi' : '→ 113 opening Bismillahs'}
            </p>
          </div>
          <span className="text-[#e74c3c] font-extrabold text-xl font-body">−1</span>
        </div>

        {/* Step 3: Naml — extra Bismillah */}
        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-500"
          style={{
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? 'translateY(0)' : 'translateY(12px)',
            background: 'rgba(212,165,116,0.08)',
            border: '1px solid rgba(212,165,116,0.25)',
          }}
        >
          <div>
            <p className="text-gold text-xs font-body uppercase tracking-wider mb-0.5">
              {tr ? 'Sure 27 · Neml · 27:30 · Sure içinde' : 'Surah 27 · An-Naml · 27:30 · Within verse'}
            </p>
            <p className="text-silver/60 text-xs font-body">
              {tr ? '→ Hz. Süleyman\'ın mektubu' : '→ Prophet Solomon\'s letter'}
            </p>
          </div>
          <span className="text-gold font-extrabold text-xl font-body">+1</span>
        </div>

        {/* Step 4: Result */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-500"
          style={{
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? 'translateY(0)' : 'translateY(12px)',
            background: 'rgba(212,165,116,0.12)',
            border: '1px solid rgba(212,165,116,0.4)',
          }}
        >
          <span className="text-gold font-body text-sm font-semibold">
            113 + 1
          </span>
          <span className="text-gold/50 font-body text-lg">=</span>
          <div className="text-right">
            <span className="text-gold font-extrabold text-3xl font-body">114</span>
            <span className="text-gold/60 text-sm font-body ml-2">✓</span>
          </div>
        </div>
      </div>

      <p className="text-silver/50 text-xs text-center mt-6 font-body italic max-w-sm mx-auto">
        {tr
          ? 'Tevbe suresindeki eksiklik, Neml suresinde karşılığını bulur. Denge korunur.'
          : 'The absence in At-Tawbah finds its counterpart in An-Naml. The balance is preserved.'}
      </p>
    </div>
  );
}

function openGraphSearch(term) {
  window.dispatchEvent(new CustomEvent('openVerseGraph', { detail: { search: term } }));
}

export default function MathMiracle() {
  const { t, language } = useLanguage();
  const pairs = t('mathMiracle.pairs') || [];
  const seaLand = t('mathMiracle.seaLand') || {};

  return (
    <SectionWrapper id="math" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('mathMiracle.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('mathMiracle.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('mathMiracle.intro')}
      </motion.p>

      {/* Counter Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {Array.isArray(pairs) &&
          pairs.map((pair, index) => (
            <motion.div
              key={index}
              variants={fadeUpItem}
              className="glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,165,116,0.15)]"
            >
              {pair.conceptB ? (
                /* Paired concepts */
                <div className="flex items-center justify-between gap-4">
                  {/* Left concept */}
                  <button
                    onClick={() => pair.searchA && openGraphSearch(pair.searchA)}
                    className="flex-1 text-center group cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                    title={pair.searchA ? `"${pair.conceptA}" ayetlerini haritada göster` : undefined}
                  >
                    <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body group-hover:text-gold transition-colors">
                      {pair.conceptA}
                    </p>
                    <AnimatedCounter
                      target={pair.countA}
                      className="text-3xl md:text-4xl text-gold"
                    />
                    {pair.searchA && <p className="text-gold/30 text-[0.6rem] mt-1 font-body group-hover:text-gold/60 transition-colors">↗ haritada ara</p>}
                  </button>

                  {/* Equals sign */}
                  <div className="flex-shrink-0">
                    <span className="text-gold/40 text-2xl font-body">=</span>
                  </div>

                  {/* Right concept */}
                  <button
                    onClick={() => pair.searchB && openGraphSearch(pair.searchB)}
                    className="flex-1 text-center group cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                    title={pair.searchB ? `"${pair.conceptB}" ayetlerini haritada göster` : undefined}
                  >
                    <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body group-hover:text-soft-emerald transition-colors">
                      {pair.conceptB}
                    </p>
                    <AnimatedCounter
                      target={pair.countB}
                      className="text-3xl md:text-4xl text-soft-emerald"
                    />
                    {pair.searchB && <p className="text-soft-emerald/30 text-[0.6rem] mt-1 font-body group-hover:text-soft-emerald/60 transition-colors">↗ haritada ara</p>}
                  </button>
                </div>
              ) : (
                /* Single concept */
                <button
                  onClick={() => pair.searchA && openGraphSearch(pair.searchA)}
                  className="w-full text-center group cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  title={pair.searchA ? `"${pair.conceptA}" ayetlerini haritada göster` : undefined}
                >
                  <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body group-hover:text-gold transition-colors">
                    {pair.conceptA}
                  </p>
                  <AnimatedCounter
                    target={pair.countA}
                    className="text-3xl md:text-4xl text-gold"
                  />
                  {pair.searchA && <p className="text-gold/30 text-[0.6rem] mt-1 font-body group-hover:text-gold/60 transition-colors">↗ haritada ara</p>}
                </button>
              )}

              {/* Note */}
              {pair.note && (
                <p className="text-off-white/50 text-xs text-center mt-4 font-body italic">
                  {pair.note}
                </p>
              )}
            </motion.div>
          ))}
      </div>

      {/* Sea / Land Ratio Card */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 mb-12"
      >
        <h3 className="font-display text-xl md:text-2xl font-bold text-gold mb-4">
          {seaLand.title}
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          <button onClick={() => openGraphSearch('deniz')} className="text-center group bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body group-hover:text-sky-blue transition-colors">
              {seaLand.seaLabel}
            </p>
            <AnimatedCounter
              target={seaLand.seaCount || 32}
              className="text-4xl md:text-5xl text-sky-blue"
            />
            <p className="text-sky-blue/30 text-[0.6rem] mt-1 font-body group-hover:text-sky-blue/60 transition-colors">↗ haritada ara</p>
          </button>
          <span className="text-gold/40 text-3xl font-body">+</span>
          <button onClick={() => openGraphSearch('kara')} className="text-center group bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body group-hover:text-soft-emerald transition-colors">
              {seaLand.landLabel}
            </p>
            <AnimatedCounter
              target={seaLand.landCount || 13}
              className="text-4xl md:text-5xl text-soft-emerald"
            />
            <p className="text-soft-emerald/30 text-[0.6rem] mt-1 font-body group-hover:text-soft-emerald/60 transition-colors">↗ haritada ara</p>
          </button>
          <span className="text-gold/40 text-3xl font-body">=</span>
          <div className="text-center">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
              {seaLand.totalLabel}
            </p>
            <span className="text-4xl md:text-5xl font-extrabold text-off-white font-body">
              45
            </span>
          </div>
        </div>

        {/* Ratio visualization */}
        <div className="w-full max-w-lg mx-auto">
          <div className="flex rounded-full overflow-hidden h-4 mb-3">
            <div
              className="bg-sky-blue/70 transition-all duration-1000"
              style={{ width: '71.1%' }}
            />
            <div
              className="bg-soft-emerald/70 transition-all duration-1000"
              style={{ width: '28.9%' }}
            />
          </div>
          <div className="flex justify-between text-xs font-body">
            <span className="text-sky-blue">71.1%</span>
            <span className="text-off-white/50">{seaLand.ratioNote}</span>
            <span className="text-soft-emerald">28.9%</span>
          </div>
        </div>
      </motion.div>

      {/* Besmele Balance Widget */}
      <motion.div variants={fadeUpItem}>
        <BesmeleWidget language={language} />
      </motion.div>

      {/* Closing */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl italic"
      >
        {t('mathMiracle.closing')}
      </motion.p>
    </SectionWrapper>
  );
}
