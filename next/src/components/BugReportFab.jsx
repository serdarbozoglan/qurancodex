'use client';

// ─── BugReportFab — Sol alt floating "Sorun Bildir" button + Google Form modal ─
// Kullanıcı isteği (2026-07-12): görsel olarak iyi tasarlanmış bug/feedback
// bildirim sistemi. Google Forms backend (ücretsiz, unlimited, email
// notification native). Sol alt konum: sağ altta ScrollToTopFab çakışmaz.
//
// Google Form URL i18n'de tutulur: t('bugReport.formUrl'). Placeholder olarak
// başlar, kullanıcı gerçek Google Form embed URL'sini verdiğinde replace edilir.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS, FONTS } from '../tokens';

export default function BugReportFab() {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Ezber alt sayfası açıkken gizlen — tam genişlik sayfa bu FAB'ın üstüne
  // oturup ana butonu örtüyordu (mobil 390px, kullanıcı raporu 2026-08-02).
  //
  // CSS ile çözmeyi denedim ve ÇALIŞMADI: FAB'ın `display`i inline style'dan
  // geliyor, inline stil normal kuralı yener; `!important` da Turbopack'in
  // globals.css cache'i yüzünden tarayıcıya ulaşmadı. Durumu bileşenin kendi
  // okuması hem daha sağlam hem de test edilebilir.
  const [hifzSheetOpen, setHifzSheetOpen] = useState(false);
  useEffect(() => {
    const read = () => setHifzSheetOpen(document.body.dataset.hifzSheet === '1');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.body, { attributes: true, attributeFilter: ['data-hifz-sheet'] });
    return () => mo.disconnect();
  }, []);

  // ESC key closes modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Body scroll lock when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const label = language === 'tr' ? 'Sorun bildir' : 'Report a bug';

  // Google Form URL — placeholder ile başlar, i18n key üzerinden değiştirilir.
  // Prefill için query params destekli: ?entry.XXX=value formatı (kullanıcı form
  // yaratıp field ID'lerini verdikten sonra buraya eklenir).
  const formUrl = t('bugReport.formUrl') || 'https://docs.google.com/forms/d/e/PLACEHOLDER/viewform?embedded=true';

  return (
    <>
      {/* Floating trigger — sol alt, subtle */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label={label}
        title={label}
        // Ezber alt sayfası açıkken gizlenir — tam genişlik sayfa bu FAB'ın
        // üstüne oturuyor ve ana butonu örtüyor (globals.css kuralı).
        data-fab="bug-report"
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          left: '20px',
          width: '42px',
          height: '42px',
          borderRadius: RADIUS.full,
          background: COLORS.cosmicBlackAlpha55,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          color: COLORS.gold,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          zIndex: 50,
          display: hifzSheetOpen ? 'none' : 'flex',
          opacity: mounted ? 0.6 : 0,
          transition: 'opacity 0.25s ease-out, background 0.2s, transform 0.25s ease-out',
          boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = 'rgba(212,165,116,0.18)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.6';
          e.currentTarget.style.background = COLORS.cosmicBlackAlpha55;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onFocus={e => { e.currentTarget.style.opacity = '1'; }}
        onBlur={e => { e.currentTarget.style.opacity = '0.6'; }}
      >
        {/* Chat bubble + exclamation — "bir şey söyle" ikonu */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="12" y1="9" x2="12" y2="12" strokeWidth="2.4" />
          <circle cx="12" cy="15" r="0.6" fill="currentColor" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 10001,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              background: 'linear-gradient(180deg, #0d1b2a 0%, #0a0a1a 100%)',
              border: `1px solid ${COLORS.gold}33`,
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px ${COLORS.gold}0a`,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: `1px solid ${COLORS.gold}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexShrink: 0,
              background: `linear-gradient(180deg, ${COLORS.gold}08 0%, transparent 100%)`,
            }}>
              <div>
                <div style={{
                  color: `${COLORS.gold}cc`,
                  fontFamily: FONTS.body,
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}>
                  {language === 'tr' ? 'Geri Bildirim' : 'Feedback'}
                </div>
                <h3 style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: COLORS.offWhite,
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}>
                  {language === 'tr' ? 'Sorun veya öneri paylaş' : 'Share a bug or suggestion'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                aria-label={language === 'tr' ? 'Kapat' : 'Close'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${COLORS.gold}22`,
                  color: COLORS.gold,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = `${COLORS.gold}55`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = `${COLORS.gold}22`; }}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — Google Form iframe (beyaz bg — modal içinde ada) */}
            <div style={{
              flex: 1,
              overflow: 'hidden',
              background: '#fff',
              minHeight: '520px',
              position: 'relative',
            }}>
              {formUrl.includes('PLACEHOLDER') ? (
                /* Placeholder state — Google Form URL henüz set edilmedi */
                <div style={{
                  height: '100%',
                  minHeight: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 24px',
                  textAlign: 'center',
                  background: '#0a0a1a',
                  color: COLORS.silver,
                  fontFamily: FONTS.body,
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.6 }}>🚧</div>
                  <p style={{ margin: '0 0 8px', color: COLORS.offWhite, fontWeight: 600 }}>
                    {language === 'tr' ? 'Geri bildirim formu hazırlanıyor' : 'Feedback form under setup'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '360px', lineHeight: 1.5 }}>
                    {language === 'tr'
                      ? 'Şimdilik doğrudan e-posta atabilirsin:'
                      : 'For now, you can email directly:'}
                  </p>
                  <a
                    href="mailto:info@qurancodex.com?subject=QuranCodex%20Feedback"
                    style={{
                      marginTop: '16px',
                      color: COLORS.gold,
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '10px 20px',
                      border: `1px solid ${COLORS.gold}66`,
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                    }}
                  >
                    info@qurancodex.com
                  </a>
                </div>
              ) : (
                <iframe
                  src={formUrl}
                  title={label}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  style={{ border: 'none', width: '100%', height: '100%', minHeight: '520px' }}
                >
                  {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                </iframe>
              )}
            </div>

            {/* Footer whisper */}
            <div style={{
              padding: '10px 24px',
              borderTop: `1px solid ${COLORS.gold}11`,
              flexShrink: 0,
              background: `linear-gradient(0deg, ${COLORS.gold}05 0%, transparent 100%)`,
            }}>
              <p style={{
                color: COLORS.silverAlpha70,
                fontFamily: FONTS.body,
                fontSize: '0.7rem',
                margin: 0,
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}>
                {language === 'tr'
                  ? 'Google Forms üzerinden alınır. E-posta bırakırsan yanıt gelir.'
                  : 'Delivered via Google Forms. Leave your email for a reply.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
