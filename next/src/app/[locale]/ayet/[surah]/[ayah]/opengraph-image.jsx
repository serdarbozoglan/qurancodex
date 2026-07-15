// ─── Per-Verse OpenGraph Image (2026-07-15 #174) ─────────────────────────
// Verse share URL'i (`/tr/ayet/2/255`) WhatsApp/Twitter'a paylaşıldığında
// bu OG kartı unfurl olur. Sadece surah adı + verse ref + brand (verse text
// edge runtime'da fetch pahalı — verse metni için VerseShareRoute page göster).
// ─────────────────────────────────────────────────────────────────────────

import { ImageResponse } from 'next/og';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '@/lib/surahNames';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex';

export default async function Image({ params }) {
  const { surah, ayah, locale } = await params;
  const s = parseInt(surah, 10);
  const a = parseInt(ayah, 10);
  const isEn = locale === 'en';
  const valid = !Number.isNaN(s) && !Number.isNaN(a) && s >= 1 && s <= 114 && a >= 1;
  const nameTr = valid ? SURAH_NAMES_TR[s - 1] : "Kur'an";
  const nameEn = valid ? SURAH_NAMES_EN[s - 1] : 'Quran';
  const surahName = isEn ? nameEn : nameTr;
  const ref = valid ? `${s}:${a}` : '?:?';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)',
          color: '#e8e6e3',
          padding: '60px',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            color: '#d4a574',
            fontSize: 22,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 40,
            fontWeight: 600,
          }}
        >
          {isEn ? "The Holy Qur'an · Verse" : "Kur'ân-ı Kerîm · Ayet"}
        </div>

        {/* Bismillah ornament */}
        <div
          style={{
            fontSize: 72,
            color: '#d4a574',
            opacity: 0.85,
            marginBottom: 24,
          }}
        >
          ﷽
        </div>

        {/* Filigree divider */}
        <div
          style={{
            width: 220,
            height: 2,
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 42,
          }}
        />

        {/* Surah name + reference (BIG) */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: 'center',
            color: '#e8e6e3',
            marginBottom: 20,
            maxWidth: 1080,
            letterSpacing: '-0.01em',
          }}
        >
          {surahName}
        </div>

        {/* Verse number */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 300,
            color: '#d4a574',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}
        >
          {ref}
        </div>

        {/* Bottom-left brand + bottom-right URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 60,
            color: '#d4a574',
            fontSize: 24,
            letterSpacing: '0.18em',
            fontWeight: 600,
          }}
        >
          QURAN CODEX
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 60,
            color: '#94a3b8',
            opacity: 0.6,
            fontSize: 20,
            letterSpacing: '0.18em',
          }}
        >
          qurancodex.com
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
