'use client';

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function Footer() {
  const { t } = useLanguage();
  const sources = t('footer.sources');

  return (
    <footer className="relative bg-cosmic-black border-t border-white/5 py-16 px-6">
      {/* Gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Brand imza — Q-mark image + HTML wordmark + HTML tagline.
            Önceden logo-full.png içine gömülü tagline ("HIDDEN ARCHITECTURE...")
            yarı-transparent beyaz olarak kaynaktan zayıf renderleniyordu;
            brightness/contrast filter yetmedi. Q-mark'ı ayrı image, wordmark
            ve tagline'ı HTML text olarak yazınca tam CSS kontrolü + dil-aware
            + okunabilir kontrast (2026-07-12 fix). */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <img
            src="/logo-mark.png"
            alt=""
            aria-hidden="true"
            width="120"
            height="120"
            style={{ display: 'block', width: '120px', height: '120px' }}
          />
          <div className="flex flex-col items-center gap-2">
            <h3
              style={{
                fontFamily: FONTS.display,
                fontWeight: 400,
                fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                color: COLORS.gold,
                letterSpacing: '0.2em',
                margin: 0,
                lineHeight: 1,
              }}
            >
              QURANCODEX
            </h3>
            <p
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.68rem',
                color: COLORS.offWhiteAlpha78,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                margin: 0,
                opacity: 0.85,
              }}
            >
              {t('footer.tagline') || "Hidden Architecture of the Quran"}
            </p>
          </div>
        </div>

        {/* Methodology — Hero baseline body color (offWhite/78) instead of
            silver, so footer reads warm rather than cool-gray. */}
        <div className="text-center mb-12">
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: COLORS.offWhiteAlpha78,
              fontFamily: FONTS.body,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
            }}
          >
            {t('footer.methodology')}
          </p>
        </div>

        {/* Sources */}
        <div className="glass-card p-8 mb-12">
          <h4 className="text-off-white font-body font-semibold mb-4 text-xs uppercase tracking-[0.2em]">
            {t('footer.sourcesTitle')}
          </h4>
          <ul className="text-silver text-sm space-y-2 leading-relaxed columns-1 md:columns-2 gap-8">
            {Array.isArray(sources) &&
              sources.map((source, i) => {
                const name = typeof source === 'object' ? source.name : source;
                const section = typeof source === 'object' ? source.section : null;
                const link = typeof source === 'object' ? source.link : null;
                return (
                  <li key={i} className="flex items-start gap-2 break-inside-avoid mb-2">
                    <span className="text-gold/60 mt-0.5 shrink-0">•</span>
                    <span>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gold hover:underline hover:decoration-gold/30 hover:underline-offset-[3px] hover:decoration-1 transition-colors"
                        >
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                      {section && (
                        <span className="text-silver/75 text-xs ml-1.5">· {section}</span>
                      )}
                      {source.note && (
                        <span className="block text-silver/75 text-xs italic mt-0.5 leading-relaxed">
                          ⚠ {source.note}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-silver/75 text-xs">
          <p>© 2026 — {t('footer.copyright')}</p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-silver/80 text-xs">qurancodex.com</span>
            <a
              href="mailto:info@qurancodex.com"
              className="text-silver/60 hover:text-gold transition-colors text-xs"
            >
              info@qurancodex.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
