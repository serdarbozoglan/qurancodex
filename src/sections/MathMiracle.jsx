import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

export default function MathMiracle() {
  const { t } = useLanguage();
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
                  <div className="flex-1 text-center">
                    <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
                      {pair.conceptA}
                    </p>
                    <AnimatedCounter
                      target={pair.countA}
                      className="text-3xl md:text-4xl text-gold"
                    />
                  </div>

                  {/* Equals sign */}
                  <div className="flex-shrink-0">
                    <span className="text-gold/40 text-2xl font-body">=</span>
                  </div>

                  {/* Right concept */}
                  <div className="flex-1 text-center">
                    <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
                      {pair.conceptB}
                    </p>
                    <AnimatedCounter
                      target={pair.countB}
                      className="text-3xl md:text-4xl text-soft-emerald"
                    />
                  </div>
                </div>
              ) : (
                /* Single concept */
                <div className="text-center">
                  <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
                    {pair.conceptA}
                  </p>
                  <AnimatedCounter
                    target={pair.countA}
                    className="text-3xl md:text-4xl text-gold"
                  />
                </div>
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
          <div className="text-center">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
              {seaLand.seaLabel}
            </p>
            <AnimatedCounter
              target={seaLand.seaCount || 32}
              className="text-4xl md:text-5xl text-sky-blue"
            />
          </div>
          <span className="text-gold/40 text-3xl font-body">+</span>
          <div className="text-center">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-2 font-body">
              {seaLand.landLabel}
            </p>
            <AnimatedCounter
              target={seaLand.landCount || 13}
              className="text-4xl md:text-5xl text-soft-emerald"
            />
          </div>
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
