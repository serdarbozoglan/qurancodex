import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

export default function SoundArchitecture() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="sounds" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('soundArchitecture.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('soundArchitecture.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('soundArchitecture.intro')}
      </motion.p>

      {/* Two-Column Split: Punishment vs Mercy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Punishment (Left - Red) */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-l-4 border-soft-red"
        >
          <h3 className="font-display text-xl font-bold text-soft-red mb-3">
            {t('soundArchitecture.punishment.title')}
          </h3>
          <p className="text-silver text-sm leading-relaxed mb-4 font-body">
            {t('soundArchitecture.punishment.description')}
          </p>

          {/* Example sura */}
          <div className="glass-card p-4 mb-4">
            <p className="text-soft-red text-xs uppercase tracking-[0.2em] mb-1 font-body">
              {t('soundArchitecture.punishment.suraLabel')}
            </p>
            <p className="text-off-white/80 text-sm font-body">
              {t('soundArchitecture.punishment.sura')}
            </p>
          </div>

          {/* Percentage bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs font-body mb-1">
              <span className="text-silver">
                {t('soundArchitecture.punishment.barLabel')}
              </span>
              <span className="text-soft-red font-semibold">71%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-soft-red/70 h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '71%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Sound visualization - jagged */}
          <div className="flex items-end justify-center gap-[2px] h-12 mt-4">
            {[8, 20, 12, 28, 6, 24, 14, 30, 10, 22, 8, 26, 16, 32, 12, 20, 8, 28, 14, 24].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-soft-red/50 rounded-sm"
                  style={{ height: `${h}px` }}
                />
              )
            )}
          </div>
        </motion.div>

        {/* Mercy (Right - Emerald) */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-l-4 border-soft-emerald"
        >
          <h3 className="font-display text-xl font-bold text-soft-emerald mb-3">
            {t('soundArchitecture.mercy.title')}
          </h3>
          <p className="text-silver text-sm leading-relaxed mb-4 font-body">
            {t('soundArchitecture.mercy.description')}
          </p>

          {/* Example sura */}
          <div className="glass-card p-4 mb-4">
            <p className="text-soft-emerald text-xs uppercase tracking-[0.2em] mb-1 font-body">
              {t('soundArchitecture.mercy.suraLabel')}
            </p>
            <p className="text-off-white/80 text-sm font-body">
              {t('soundArchitecture.mercy.sura')}
            </p>
          </div>

          {/* Percentage bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs font-body mb-1">
              <span className="text-silver">
                {t('soundArchitecture.mercy.barLabel')}
              </span>
              <span className="text-soft-emerald font-semibold">72%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-soft-emerald/70 h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '72%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Sound visualization - smooth */}
          <div className="flex items-end justify-center gap-[2px] h-12 mt-4">
            {[10, 14, 16, 18, 20, 18, 16, 18, 20, 22, 20, 18, 16, 18, 20, 18, 16, 14, 16, 18].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-soft-emerald/50 rounded-sm"
                  style={{ height: `${h}px` }}
                />
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Neuroscience paragraph */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-6 md:p-8 mb-8 border-l-4 border-gold"
      >
        <h3 className="font-display text-lg font-bold text-gold mb-3">
          {t('soundArchitecture.neuroscience.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed font-body">
          {t('soundArchitecture.neuroscience.description')}
        </p>
      </motion.div>

      {/* Closing statement */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white text-xl md:text-2xl font-display font-bold text-center leading-relaxed"
      >
        {t('soundArchitecture.closing')}
      </motion.p>
    </SectionWrapper>
  );
}
