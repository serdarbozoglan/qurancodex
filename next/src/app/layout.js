import { Inter, Playfair_Display } from 'next/font/google';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { PathProvider } from '@/contexts/PathContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://qurancodex.com'),
  title: {
    default: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    template: '%s | QuranCodex',
  },
  description: "Kur'an'ın gizli mimarisini, sayısal mucizesini, dilsel DNA'sını ve halka kompozisyonunu interaktif görsellerle keşfedin.",
  applicationName: 'QuranCodex',
  authors: [{ name: 'QuranCodex' }],
  keywords: ['Kuran', 'tefsir', 'ayet', 'sure', 'kıssa', 'mucize', 'dilsel analiz', 'halka kompozisyon', 'ring composition'],
  openGraph: {
    type: 'website',
    siteName: 'QuranCodex',
    title: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    description: "Kur'an'ın gizli mimarisini interaktif görsellerle keşfedin.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <LanguageProvider>
          <PathProvider>
            {children}
          </PathProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
