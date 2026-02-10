import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

const layerBorderColors = [
  'border-l-gold',
  'border-l-soft-emerald',
  'border-l-sky-blue',
  'border-l-[#9b59b6]',
  'border-l-[#e67e22]',
  'border-l-soft-red',
  'border-l-[#1abc9c]',
];

const layerAccentColors = [
  'text-gold',
  'text-soft-emerald',
  'text-sky-blue',
  'text-[#9b59b6]',
  'text-[#e67e22]',
  'text-soft-red',
  'text-[#1abc9c]',
];

const layerBgHoverColors = [
  'hover:bg-gold/5',
  'hover:bg-soft-emerald/5',
  'hover:bg-sky-blue/5',
  'hover:bg-[#9b59b6]/5',
  'hover:bg-[#e67e22]/5',
  'hover:bg-soft-red/5',
  'hover:bg-[#1abc9c]/5',
];

export default function SevenLayers() {
  const { t } = useLanguage();
  const [expandedLayer, setExpandedLayer] = useState(null);
  const layers = t('sevenLayers.layers') || [];

  const toggleLayer = (index) => {
    setExpandedLayer(expandedLayer === index ? null : index);
  };

  return (
    <SectionWrapper id="layers" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('sevenLayers.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('sevenLayers.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
      >
        {t('sevenLayers.intro')}
      </motion.p>

      {/* Nur Ayeti verse with gold-glow */}
      <QuranVerse
        arabic={t('sevenLayers.verse.arabic')}
        translation={t('sevenLayers.verse.translation')}
        reference={t('sevenLayers.verse.reference')}
        className="gold-glow mb-12"
      />

      {/* Layer Accordion */}
      <div className="space-y-3 mb-10">
        {Array.isArray(layers) &&
          layers.map((layer, index) => (
            <motion.div
              key={index}
              variants={fadeUpItem}
              className={`glass-card border-l-4 ${
                layerBorderColors[index % layerBorderColors.length]
              } overflow-hidden transition-all duration-300 ${
                layerBgHoverColors[index % layerBgHoverColors.length]
              }`}
            >
              {/* Clickable header */}
              <button
                onClick={() => toggleLayer(index)}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
                aria-expanded={expandedLayer === index}
              >
                {/* Layer number */}
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-body font-bold text-sm ${
                    layerAccentColors[index % layerAccentColors.length]
                  } ${
                    layerBorderColors[index % layerBorderColors.length]
                  }`}
                >
                  {layer.number || index + 1}
                </span>

                {/* Title */}
                <h3
                  className={`flex-1 font-display text-lg font-bold ${
                    layerAccentColors[index % layerAccentColors.length]
                  }`}
                >
                  {layer.title}
                </h3>

                {/* Expand indicator */}
                <motion.span
                  className="text-silver/60 text-xl flex-shrink-0"
                  animate={{ rotate: expandedLayer === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  &#9662;
                </motion.span>
              </button>

              {/* Expandable description */}
              <AnimatePresence initial={false}>
                {expandedLayer === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.5rem] md:pl-[5rem]">
                      <p className="text-silver text-sm leading-relaxed font-body">
                        {layer.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </div>

      {/* Closing note */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl italic"
      >
        {t('sevenLayers.closing')}
      </motion.p>
    </SectionWrapper>
  );
}
