import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const sources = t('footer.sources');

  return (
    <footer className="relative bg-cosmic-black border-t border-white/5 py-16 px-6">
      {/* Gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Title & methodology */}
        <div className="text-center mb-12">
          <h3 className="font-display text-gold text-xl mb-4">
            {t('footer.title')}
          </h3>
          <p className="text-silver text-sm max-w-2xl mx-auto leading-relaxed">
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
              sources.map((source, i) => (
                <li key={i} className="flex items-start gap-2 break-inside-avoid mb-2">
                  <span className="text-gold/60 mt-0.5 shrink-0">•</span>
                  <span>{source}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-silver/40 text-xs">
          <p>© 2026 — {t('footer.copyright')}</p>
          <p className="text-silver/30 text-xs">qurancodex.com</p>
          <p className="font-arabic text-sm text-gold/30" dir="rtl" lang="ar">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
}
