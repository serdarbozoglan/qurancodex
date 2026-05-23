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

function detectLocale(request) {
  const acceptLang = request.headers.get('Accept-Language') || '';
  // Naive parse: ilk match'i al
  for (const lang of acceptLang.split(',')) {
    const code = lang.split(';')[0].trim().toLowerCase();
    const base = code.split('-')[0];
    if (SUPPORTED.includes(base)) return base;
  }
  return DEFAULT;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Zaten locale-prefix'li mi?
  const hasLocale = SUPPORTED.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Locale-prefix ekle, redirect
  const locale = detectLocale(request);
  const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Static asset'ler + API + Next.js internals'i atla
  matcher: ['/((?!_next|api|fonts|tafsir|corpus|meal-cache|audio|amthal|icons|favicon|.*\\..*).*)'],
};
