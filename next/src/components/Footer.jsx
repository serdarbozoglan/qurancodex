'use client';

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function Footer() {
  const { t, language } = useLanguage();

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
          {/* "Nefes alan" glow — Q-mark arkasında yavaş pulse eden altın hâle
              (2026-09-13). Animasyon .qc-brand-mark::before'da; prefers-reduced-
              motion'da durur. */}
          <span className="qc-brand-mark">
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width="120"
              height="120"
              style={{ display: 'block', width: '120px', height: '120px' }}
            />
          </span>
          <div className="flex flex-col items-center gap-2">
            <h3
              className="qc-wordmark"
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

        {/* ─── Meâl notu (2026-09-13, görsel güçlendirme) ───
            Kullanıcı isteği: meâller beşerî yorumdur, hiçbiri Arapça aslın tam
            karşılığı değildir. "Uyarı" değil "bilgilendirme/çerçeve" tonu.
            v2: sol hizalı bilgi satırından, ortalanmış tasarımlı bir "levha"ya
            yükseltildi — halkalı ikon rozeti + üst süsleme + altın eyebrow +
            başlık altı hairline. §13.24 (meâl = beşerî yorum katmanı) ile uyumlu.
            §13.26 kontrast: offWhiteAlpha78 (gövde), gold cc (eyebrow). */}
        <div className="mb-12">
          <div
            className="max-w-2xl mx-auto text-center"
            style={{
              position: 'relative',
              padding: '30px clamp(24px, 5vw, 44px) 28px',
              background:
                `radial-gradient(120% 100% at 50% 0%, ${COLORS.gold}12 0%, transparent 65%), linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.008) 100%)`,
              border: `1px solid ${COLORS.gold}2e`,
              borderRadius: '18px',
              boxShadow: `inset 0 1px 0 ${COLORS.gold}1f`,
            }}
          >
            {/* Üst kenarda ince altın hairline — levhayı "sayfa" gibi ambalajlar */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
                background: `linear-gradient(90deg, transparent, ${COLORS.gold}55, transparent)`,
              }}
            />
            {/* Halkalı açık-kitap ikon rozeti */}
            <div
              aria-hidden="true"
              style={{
                width: '48px', height: '48px', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                background: `radial-gradient(circle at 50% 35%, ${COLORS.gold}26, ${COLORS.gold}0d)`,
                border: `1px solid ${COLORS.gold}4d`,
                boxShadow: `0 0 22px ${COLORS.gold}1f`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 5.5C10.5 4.2 8.3 3.6 5.5 3.6c-.6 0-1 .4-1 1v12.4c0 .6.4 1 1 1 2.8 0 5 .6 6.5 1.9 1.5-1.3 3.7-1.9 6.5-1.9.6 0 1-.4 1-1V4.6c0-.6-.4-1-1-1-2.8 0-5 .6-6.5 1.9Z" stroke={COLORS.gold} strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M12 5.5v14.3" stroke={COLORS.gold} strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: `${COLORS.gold}d9`,
                marginBottom: '12px',
              }}
            >
              {t('footer.mealNoteTitle')}
            </div>
            {/* başlık altı hairline */}
            <span
              aria-hidden="true"
              style={{
                display: 'block', width: '34px', height: '2px', margin: '0 auto 16px',
                borderRadius: '2px',
                background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`,
              }}
            />
            <p
              style={{
                margin: '0 auto',
                maxWidth: '52ch',
                color: COLORS.offWhiteAlpha78,
                fontFamily: FONTS.body,
                fontSize: '0.92rem',
                lineHeight: 1.75,
                letterSpacing: '0.01em',
              }}
            >
              {t('footer.mealNote')}
            </p>
          </div>
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

        {/* KAYNAKLAR listesi kaldırıldı (2026-07-24): footer'ın tam bibliyografya
            dökmesi tekrar/gürültü yaratıyordu. Tam kategorize kaynakça artık kendi
            sayfasında (/kaynakca) — footer'daki "Kaynakça" nav linki oraya gider.
            Metodoloji cümlesi (footer.methodology) yukarıda korundu. */}

        {/* ─── Colophon closer + merkezi navigasyon (2026-07-24) ───
            Kapanış finial ornament (8-köşeli yıldız + iki-yön filigree)
            doğrudan merkezi navigasyonun üstünde → profesyonel colophon grubu.
            Yıldız Hakkında·Kaynakça'yı ortalar; linkler daha görünür. */}
        <div className="flex flex-col items-center gap-5 mb-10 mt-2">
          <div aria-hidden="true" className="flex items-center justify-center gap-4">
            <span className="block" style={{ width: 'clamp(56px, 11vw, 96px)', height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.35), rgba(212,165,116,0.15))' }} />
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
              <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="none" stroke="rgba(212, 165, 116, 0.6)" strokeWidth="0.8" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="1.6" fill="rgba(212, 165, 116, 0.4)" />
            </svg>
            <span className="block" style={{ width: 'clamp(56px, 11vw, 96px)', height: '1px', background: 'linear-gradient(to right, rgba(212,165,116,0.15), rgba(212,165,116,0.35), transparent)' }} />
          </div>
          <nav className="flex items-center gap-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
            <a href={`/${language}/hakkinda`} className="text-silver/80 hover:text-gold transition-colors">{language === 'en' ? 'About' : 'Hakkında'}</a>
            <span aria-hidden="true" className="text-gold/40" style={{ fontSize: '0.62rem' }}>✦</span>
            <a href={`/${language}/kaynakca`} className="text-silver/80 hover:text-gold transition-colors">{language === 'en' ? 'Bibliography' : 'Kaynakça'}</a>
            <span aria-hidden="true" className="text-gold/40" style={{ fontSize: '0.62rem' }}>✦</span>
            {/* Geri bildirim formu sol alttaki dugmede duruyordu ve baska
                hicbir yerden erisilemiyordu. Ayni formu buradan da ac. */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('qc:feedback-open'))}
              className="text-silver/80 hover:text-gold transition-colors"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', letterSpacing: 'inherit' }}
            >
              {language === 'en' ? 'Feedback' : 'Geri bildirim'}
            </button>
          </nav>
        </div>

        {/* Baseline — telif + iletişim (navigasyon yukarı taşındı) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-text-faint text-xs">
          <p>© 2026 — {t('footer.copyright')}</p>
          <div className="flex items-center gap-2">
            <span className="text-silver">qurancodex.com</span>
            <span aria-hidden="true" className="text-silver/25">·</span>
            <a href="mailto:info@qurancodex.com" className="text-text-faint hover:text-gold transition-colors">info@qurancodex.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
