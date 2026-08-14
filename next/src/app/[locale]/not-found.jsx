'use client';

// ─── Locale seviyesinde 404 (2026-08-13, Z3c3'ün yan bulgusu) ──────────────
// Sitede yalnızca `/oku/[surah]/not-found.jsx` vardı; diğer TÜM 404'ler
// (`/tr/olmayan-sayfa`, yeni eklenen `/ayet/...` sınır kontrolü, geçersiz
// tefekkür slug'ı, olmayan peygamber id'si…) Next'in çıplak varsayılanına
// düşüyordu. Ölçüldü: `<html lang>` YOK, gövde yalnız site başlığı, navbar
// yok, çıkış bağlantısı yok ve İNGİLİZCE sayfada TÜRKÇE metin.
// Kontrol listesi §M tam olarak bunu soruyor: "Hata sayfası doğru dilde mi?"
//
// Bu dosya `[locale]/layout.js` içinde render olduğu için `lang`, navbar,
// footer ve dil bağlamı otomatik geliyor.

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '@/tokens';

export default function LocaleNotFound() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const loc = isEn ? 'en' : 'tr';

  const exits = [
    { href: `/${loc}`,     tr: 'Anasayfa',      en: 'Home',        primary: true },
    { href: `/${loc}/oku`, tr: "Kur'an'ı Oku",  en: 'Read Quran' },
    { href: `/${loc}/sor`, tr: 'Soru Sor',      en: 'Ask a Question' },
  ];

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px',
        textAlign: 'center',
      }}
    >
      {/* Dekoratif — ekran okuyucudan gizli (§9) */}
      <div
        style={{
          fontSize: '3.4rem',
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          marginBottom: '20px',
          opacity: 0.75,
        }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        لَا
      </div>

      <h1
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontFamily: FONTS.display,
          color: COLORS.offWhite,
          margin: '0 0 12px',
        }}
      >
        {isEn ? 'Page Not Found' : 'Sayfa Bulunamadı'}
      </h1>

      <p
        style={{
          color: COLORS.silver,
          fontSize: '1rem',
          maxWidth: '520px',
          margin: '0 0 32px',
          lineHeight: 1.65,
        }}
      >
        {isEn
          ? 'This address does not correspond to a page — the link may be broken, or the verse or content you requested may not exist.'
          : 'Bu adres bir sayfaya karşılık gelmiyor — bağlantı bozulmuş olabilir ya da istediğiniz âyet veya içerik mevcut değil.'}
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {exits.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            style={{
              padding: '11px 24px',
              borderRadius: RADIUS.pill,
              background: e.primary ? COLORS.gold : 'transparent',
              border: `1px solid ${e.primary ? COLORS.gold : COLORS.goldAlpha45}`,
              color: e.primary ? COLORS.cosmicBlack : COLORS.gold,
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {isEn ? e.en : e.tr}
          </Link>
        ))}
      </div>
    </div>
  );
}
