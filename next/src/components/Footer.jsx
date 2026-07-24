'use client';

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function Footer() {
  const { t, language } = useLanguage();
  const sources = t('footer.sources');

  return (
    <footer
      className="relative bg-cosmic-black border-t border-white/5 py-16 px-6"
      style={{
        // ─── ATMOSFER: P7 (2026-07-21) — Colophon vignette ───
        // Footer'ın altına doğru hafif altın "kapanış sıcaklığı" — ilk baskı
        // mushafların son sayfasındaki "tamamlandı Elhamdulillah" ambiansı.
        // Cosmic-black üzerine radial hint (%3), palet aynı.
        backgroundImage:
          'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(212, 165, 116, 0.03) 0%, transparent 60%)',
      }}
    >
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

        {/* ═══ DESTEK CALLOUT — GEÇİCİ KALDIRILDI 2026-07-12 ═══
            Kullanıcı isteği: "hemen kaldıralım ama kodu comment out yap".
            i18n footer.support.* keyleri intact — reactivate için: bu bloğu
            uncomment + Navbar (❤ Destek button) + Conclusion (whisper CTA)
            aynı anda uncomment.
            Stripe URL'ler i18n'de aktif (test edilmiş, verify pending değil).

        <div id="support" className="mb-12" style={{ scrollMarginTop: '80px' }}>
          <div
            className="max-w-xl mx-auto text-center"
            style={{
              padding: '32px 28px',
              background: `linear-gradient(180deg, ${COLORS.gold}0d 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${COLORS.gold}2e`,
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                color: `${COLORS.gold}cc`,
                fontFamily: FONTS.body,
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {t('footer.support.eyebrow') || (t('footer.copyright') && '❤')}
            </div>
            <h4
              style={{
                fontFamily: FONTS.display,
                fontWeight: 700,
                fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)',
                color: COLORS.offWhite,
                margin: '0 0 12px',
                letterSpacing: '-0.01em',
              }}
            >
              {t('footer.support.title')}
            </h4>
            <p
              style={{
                color: COLORS.silver,
                fontFamily: FONTS.body,
                fontSize: '0.86rem',
                lineHeight: 1.65,
                margin: '0 0 22px',
                maxWidth: '460px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {t('footer.support.description')}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <a
                href={t('footer.support.monthlyUrl') || 'https://buy.stripe.com/PLACEHOLDER_MONTHLY'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: `${COLORS.gold}1a`,
                  border: `1px solid ${COLORS.gold}66`,
                  borderRadius: '999px',
                  padding: '11px 22px',
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; e.currentTarget.style.borderColor = `${COLORS.gold}aa`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${COLORS.gold}1a`; e.currentTarget.style.borderColor = `${COLORS.gold}66`; }}
              >
                <span>{t('footer.support.monthlyBtn')}</span>
                <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>→</span>
              </a>
              <a
                href={t('footer.support.onetimeUrl') || 'https://buy.stripe.com/PLACEHOLDER_ONETIME'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: `1px solid ${COLORS.gold}44`,
                  borderRadius: '999px',
                  padding: '11px 22px',
                  color: `${COLORS.gold}dd`,
                  fontFamily: FONTS.body,
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}11`; e.currentTarget.style.borderColor = `${COLORS.gold}88`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${COLORS.gold}44`; }}
              >
                <span>{t('footer.support.onetimeBtn')}</span>
                <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>→</span>
              </a>
            </div>
          </div>
        </div>
        ═══ DESTEK CALLOUT END ═══ */}

        {/* Sources — Auditor #4 (2026-07-21): glass → parşömen.
            Colophon = kağıt olmalı, cam değil. glass-card (blur+beyaz cam)
            yerine altın-hairline + hafif altın-tint parşömen zemin. */}
        <div
          className="p-8 mb-12"
          style={{
            background: 'linear-gradient(180deg, rgba(212, 165, 116, 0.025), rgba(212, 165, 116, 0.012))',
            border: '1px solid rgba(212, 165, 116, 0.18)',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 40px rgba(212, 165, 116, 0.02)',
          }}
        >
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

        {/* ─── ATMOSFER: P7 — Colophon closure ornament (2026-07-21) ───
            İlk baskı mushafların son sayfasındaki finial ornament: iki-yön
            filigree + 8-köşeli yıldız. CardSeam'in colophon-varyantı; kaynakça
            ile copyright arasında "sayfa kapanışı" ipucu. Palet: sadece altın. */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-4 mb-8 mt-2"
        >
          <span
            className="block"
            style={{
              width: 'clamp(60px, 12vw, 100px)',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.35), rgba(212,165,116,0.15))',
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.7 }}
          >
            <path
              d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z"
              fill="none"
              stroke="rgba(212, 165, 116, 0.6)"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1.6" fill="rgba(212, 165, 116, 0.4)" />
          </svg>
          <span
            className="block"
            style={{
              width: 'clamp(60px, 12vw, 100px)',
              height: '1px',
              background: 'linear-gradient(to right, rgba(212,165,116,0.15), rgba(212,165,116,0.35), transparent)',
            }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-silver/75 text-xs">
          <p>© 2026 — {t('footer.copyright')}</p>
          <div className="flex items-center gap-3 text-xs">
            <a href={`/${language}/hakkinda`} className="text-silver/60 hover:text-gold transition-colors">{language === 'en' ? 'About' : 'Hakkında'}</a>
            <span className="text-silver/30">·</span>
            <a href={`/${language}/kaynakca`} className="text-silver/60 hover:text-gold transition-colors">{language === 'en' ? 'Bibliography' : 'Kaynakça'}</a>
          </div>
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
