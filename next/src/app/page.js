import { COLORS, FONTS } from '@/tokens';

// Migration placeholder — Faz 3'te Hero + scroll-story section'lar bu sayfaya
// taşınacak. Şimdilik bu sayfa Tailwind v4 + tokens.js + KFGQPC font + i18n
// boundary'sinin hep birlikte çalıştığını gösteren minimum bir doğrulama.

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: COLORS.cosmicBlack, color: COLORS.offWhite }}
    >
      <div
        className="mb-6 text-xs uppercase tracking-[0.3em]"
        style={{ color: COLORS.gold }}
      >
        Migration · Faz 3 başlangıç
      </div>

      <h1
        className="mb-6 text-5xl font-black md:text-6xl"
        style={{ fontFamily: FONTS.display, color: COLORS.offWhite }}
      >
        QuranCodex
      </h1>

      <p
        className="mb-10 max-w-xl text-lg leading-relaxed"
        style={{ color: COLORS.silver }}
      >
        Kur'an-ı Kerim'in Görünmeyen Mimarisi — Next.js 16 App Router'a geçiş
        süreci devam ediyor. Bu sayfa tokens, fontlar ve design system'in
        yeni stack'te doğru taşındığını doğrular.
      </p>

      <p
        dir="rtl"
        lang="ar"
        className="mt-4 text-4xl md:text-5xl"
        style={{ fontFamily: FONTS.quran, color: COLORS.gold }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      <div
        className="mt-12 text-xs"
        style={{ color: COLORS.silverAlpha70 }}
      >
        Next.js 16.2.6 · React 19 · Tailwind v4 · KFGQPC
      </div>
    </main>
  );
}
