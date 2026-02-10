import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

const layerColors = [
  'text-gold border-gold',           // A
  'text-soft-emerald border-soft-emerald', // B
  'text-sky-blue border-sky-blue',    // C
  'text-gold border-gold gold-glow',  // D (center)
  'text-sky-blue border-sky-blue',    // C'
  'text-soft-emerald border-soft-emerald', // B'
  'text-gold border-gold',           // A'
];

const layerBgColors = [
  'bg-gold/5',
  'bg-soft-emerald/5',
  'bg-sky-blue/5',
  'bg-gold/10',
  'bg-sky-blue/5',
  'bg-soft-emerald/5',
  'bg-gold/5',
];

const layerLabels = ['A', 'B', 'C', 'D', "C'", "B'", "A'"];

export default function HiddenSymmetry() {
  const { t } = useLanguage();
  const layers = t('hiddenSymmetry.fatiha.layers') || [];

  return (
    <SectionWrapper id="symmetry" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('hiddenSymmetry.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('hiddenSymmetry.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('hiddenSymmetry.intro')}
      </motion.p>

      {/* Fatiha Ring Visualization */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-6 md:p-10 mb-12"
      >
        <h3 className="font-display text-xl md:text-2xl font-bold text-gold mb-2 text-center">
          {t('hiddenSymmetry.fatiha.title')}
        </h3>
        <p className="text-silver text-sm text-center mb-8 font-body">
          {t('hiddenSymmetry.fatiha.subtitle')}
        </p>

        <div className="relative max-w-2xl mx-auto">
          {/* Mirror connecting lines */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px hidden md:block">
            {/* A-A' connection */}
            <svg
              className="absolute left-0 w-8 opacity-20"
              style={{ top: '7%', height: '86%' }}
              viewBox="0 0 32 100"
              preserveAspectRatio="none"
            >
              <path
                d="M16,0 C32,25 32,75 16,100"
                fill="none"
                stroke="#d4a574"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </svg>
            {/* B-B' connection */}
            <svg
              className="absolute left-0 w-6 opacity-20"
              style={{ top: '21%', height: '58%' }}
              viewBox="0 0 24 100"
              preserveAspectRatio="none"
            >
              <path
                d="M12,0 C24,25 24,75 12,100"
                fill="none"
                stroke="#2ecc71"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </svg>
            {/* C-C' connection */}
            <svg
              className="absolute left-0 w-4 opacity-20"
              style={{ top: '35%', height: '30%' }}
              viewBox="0 0 16 100"
              preserveAspectRatio="none"
            >
              <path
                d="M8,0 C16,25 16,75 8,100"
                fill="none"
                stroke="#3498db"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </svg>
          </div>

          {/* Layer list */}
          <div className="space-y-3 md:pl-12">
            {Array.isArray(layers) &&
              layers.map((layer, index) => {
                const isCenter = index === 3;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUpItem}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                      layerBgColors[index] || ''
                    } ${isCenter ? 'glass-card-strong scale-[1.02]' : 'glass-card'}`}
                    style={
                      isCenter
                        ? {
                            marginLeft: '0px',
                            marginRight: '0px',
                          }
                        : {
                            marginLeft: `${Math.abs(index - 3) * 0}px`,
                          }
                    }
                  >
                    {/* Label badge */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-body font-bold text-sm ${layerColors[index]}`}
                    >
                      {layerLabels[index]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-body font-semibold text-sm mb-1 ${
                          layerColors[index]?.split(' ')[0] || 'text-off-white'
                        }`}
                      >
                        {layer.label}
                      </p>
                      <p className="text-off-white/70 text-sm font-body leading-relaxed">
                        {layer.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Mirror indicators */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="text-gold text-xs font-body">A = A'</span>
            <span className="text-silver/30">|</span>
            <span className="text-soft-emerald text-xs font-body">B = B'</span>
            <span className="text-silver/30">|</span>
            <span className="text-sky-blue text-xs font-body">C = C'</span>
          </div>
        </div>
      </motion.div>

      {/* 70% Stat Card */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 text-center mb-10"
      >
        <p className="text-silver text-xs uppercase tracking-[0.3em] mb-3 font-body">
          {t('hiddenSymmetry.stat.label')}
        </p>
        <div className="flex items-center justify-center gap-2">
          <AnimatedCounter
            target={70}
            suffix="%"
            className="text-5xl md:text-7xl text-gold"
          />
        </div>
        <p className="text-off-white/70 text-sm mt-4 font-body max-w-md mx-auto leading-relaxed">
          {t('hiddenSymmetry.stat.description')}
        </p>
      </motion.div>

      {/* Closing */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl italic"
      >
        {t('hiddenSymmetry.closing')}
      </motion.p>
    </SectionWrapper>
  );
}
