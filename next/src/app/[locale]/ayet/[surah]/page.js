// ─── /ayet/[surah] — eksik âyet segmenti (2026-08-16) ────────────────────
// Gerçek sayfa yalnızca /ayet/[surah]/[ayah]'ta var. Bu segment hiç
// page.js'e sahip olmadığı için Next.js'in markasız varsayılan 404'üne
// düşüyordu (site denetimi, 16 Ağustos 2026 — /tr/ayet/2 beyaz arkaplan,
// İngilizce metin, navbar yok). Bu dosya sûreyi doğrulayıp 1. âyete
// yönlendiriyor; geçersiz sûre numarası için notFound() ile [locale]'in
// kendi temalı not-found.jsx'i tetikleniyor.
import { redirect, notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { surah, locale } = await params;
  const s = parseInt(surah, 10);
  if (!Number.isInteger(s) || s < 1 || s > 114) notFound();
  redirect(`/${locale}/ayet/${s}/1`);
}
