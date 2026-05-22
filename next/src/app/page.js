// Migration home — Batch 1 wiring:
// - SectionWrapper + AnimatedCounter + LivingPreservation taşındı
// - Footer taşındı
// Batch 2'de Hero + ParticleBackground, Batch 3'te diğer scroll-story.

import LivingPreservation from '@/sections/LivingPreservation';
import Footer from '@/components/Footer';
import { COLORS, FONTS } from '@/tokens';

export default function Home() {
  return (
    <>
      {/* Geçici hero — Batch 2'de Hero component'i ile değişecek */}
      <header
        className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
        style={{ background: COLORS.cosmicBlack, color: COLORS.offWhite }}
      >
        <div
          className="mb-6 text-xs uppercase tracking-[0.3em]"
          style={{ color: COLORS.gold }}
        >
          Migration · Faz 3.2 — Batch 1
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
          Sections taşınıyor — aşağıda LivingPreservation section'ı + Footer.
        </p>
        <p
          dir="rtl"
          lang="ar"
          className="text-4xl md:text-5xl"
          style={{ fontFamily: FONTS.quran, color: COLORS.gold }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </header>

      {/* Real section migrated from Vite */}
      <LivingPreservation />

      <Footer />
    </>
  );
}
