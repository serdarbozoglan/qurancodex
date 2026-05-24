// Locale-scoped layout — Faz 5 URL-prefix routing.
// params.locale = 'tr' veya 'en' (middleware.js yalnızca bu ikisine izin verir).
// LanguageProvider initialLocale prop'unu URL'den alır; client'ta localStorage
// hydrate edilmez (hidrasyon mismatch yok).

import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { PathProvider } from '@/contexts/PathContext';
import Navbar from '@/components/Navbar';

const SUPPORTED_LOCALES = ['tr', 'en'];

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
    <>
      <a href="#main" className="skip-link">
        {locale === 'en' ? 'Skip to main content' : 'Ana içeriğe geç'}
      </a>
      <LanguageProvider initialLocale={locale}>
        <PathProvider>
          <Navbar />
          <main id="main">{children}</main>
        </PathProvider>
      </LanguageProvider>
    </>
  );
}
