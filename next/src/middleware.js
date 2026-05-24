// ─── Middleware — Faz 5 locale routing ───────────────────────────────────────
// Tüm istekleri locale-prefixed URL'lere yönlendirir:
//   /                → /tr (veya Accept-Language'a göre /en)
//   /atlas/kissa     → /tr/atlas/kissa (default locale)
//   /tr/atlas/kissa  → pass-through
//   /en/atlas/kissa  → pass-through
//
// Asset ve API path'leri eşleştirme dışında bırakıldı (matcher config).

import { NextResponse } from 'next/server';

const SUPPORTED = ['tr', 'en'];
const DEFAULT = 'tr';

// Türk-Kur'an sitesi için DEFAULT her zaman Türkçe.
// İngilizce browser kullanan kullanıcılar otomatik /en'e redirect EDİLMEZ;
// onlar manuel olarak Navbar'daki TR/EN switch'i ile dil değiştirir.
// (Önceki davranış: Accept-Language header'a göre browser-locale redirect
// — bu Türkiye'deki en/en-US browser ayarlı kullanıcılar için yanlış UX'di.)

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Zaten locale-prefix'li mi?
  const hasLocale = SUPPORTED.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Locale-prefix yoksa DEFAULT (tr) ile redirect.
  const newUrl = new URL(`/${DEFAULT}${pathname === '/' ? '' : pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Static asset'ler + API + Next.js internals + dynamic image routes'u atla.
  // opengraph-image|twitter-image: Next.js dosya-konvansiyonu route'ları
  // (auto-routes that serve PNG); locale-prefix uygulanmamalı.
  matcher: [
    '/((?!_next|api|kuran-proxy|fonts|tafsir|corpus|meal-cache|audio|amthal|icons|favicon|opengraph-image|twitter-image|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
