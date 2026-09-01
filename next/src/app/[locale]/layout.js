// Locale-scoped layout — Faz 5 URL-prefix routing.
// params.locale = 'tr' veya 'en' (middleware.js yalnızca bu ikisine izin verir).
// LanguageProvider initialLocale prop'unu URL'den alır; client'ta localStorage
// hydrate edilmez (hidrasyon mismatch yok).
//
// 2026-08-13 — bu dosya artık bir KÖK LAYOUT. `app/layout.js` kaldırıldı ve
// <html>/<body> buraya geldi; sebebi `<html lang>`in locale'i bilmesi.
// Öncesinde `lang="tr"` sabitti ve `/en` de Türkçe olarak sunuluyordu
// (ölçüldü: SSR lang="tr" → hydration sonrası lang="en"). Next.js 16 bunu
// ismen destekliyor: "The root layout can be under a dynamic segment ...
// with app/[lang]/layout.js" (docs .../file-conventions/layout.md:146).
// Ortak iskelet `app/_shell.jsx`'te — /admin kök layout'u ile paylaşılıyor.

import { notFound } from 'next/navigation';
import Shell, { sharedMetadata, sharedViewport } from '../_shell';
import { LanguageProvider } from '@/i18n/LanguageContext';
import MotionPrefs from '@/components/MotionPrefs';
import Navbar from '@/components/Navbar';
import InAppNavMarker from '@/components/InAppNavMarker';
import ScrollProgress from '@/components/ScrollProgress';
import BugReportFab from '@/components/BugReportFab';

const SUPPORTED_LOCALES = ['tr', 'en'];

export const metadata = sharedMetadata;
export const viewport = sharedViewport;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  // Next.js 16: params is now a Promise; await before destructuring
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <Shell lang={locale}>
      <a href="#main" className="skip-link">
        {locale === 'en' ? 'Skip to main content' : 'Ana içeriğe geç'}
      </a>
      <MotionPrefs>
      <LanguageProvider initialLocale={locale}>
        {/* PathProvider KALDIRILDI (2026-08-13). "Rehberli yol" özelliği ölüydü:
            PathCards hiçbir yerde render edilmiyordu (SixGates yerine geçmiş),
            ama provider HER SAYFADA mount olup sessionStorage okuyor ve olay
            dinleyicisi kuruyordu — sıfır kullanıcı değeri karşılığında bedel.
            Kürasyon arşivlendi: docs/arsiv/rehberli-yol-kurasyonu.md */}
        <>
          <InAppNavMarker />
          <ScrollProgress />
          <Navbar />
          {/* tabIndex={-1} ŞART — 2026-08-13 ölçümü:
              Skip link'e Enter'a basınca `location.hash` `#main` oluyordu ama
              odak <body>'ye düşüyordu, çünkü <main> odaklanabilir değildi.
              Kullanıcı "içeriğe geç" diyor, sonraki Tab yine en baştan
              başlıyordu — bağlantı işlevsizdi. */}
          <main id="main" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
          <BugReportFab />
        </>
      </LanguageProvider>
      </MotionPrefs>
    </Shell>
  );
}
