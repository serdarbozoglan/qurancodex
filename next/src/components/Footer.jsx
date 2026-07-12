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
        {/* Brand logo — sayfa altı imza.
            Full primary logo (8-fold star + girih + wordmark + tagline).
            footer.title h3'ü duplikasyon olduğu için silindi. PNG'nin içsel
            padding'i doğal boşluk sağlar; ek negative margin methodology
            paragrafını image DOM kutusunun içine sokup overlap yaratıyordu
            (2026-07-12 fix). */}
        <div className="flex justify-center">
          <img
            src="/logo-full.png"
            alt="QuranCodex — Hidden Architecture of the Quran"
            width="340"
            height="340"
            style={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              // PNG içindeki beyaz tagline ("HIDDEN ARCHITECTURE OF THE QURAN")
              // deep-navy background üzerinde düşük kontrastla gömülü; brightness
              // + contrast bump ile okunabilir hale getirilir. Gold wordmark
              // zaten parlak — %10 brightness yükselmesi mark ve gold rengi
              // rahatsız etmiyor (2026-07-12 fix).
              filter: 'brightness(1.15) contrast(1.1)',
            }}
          />
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
