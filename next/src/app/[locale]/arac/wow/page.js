import { redirect } from 'next/navigation';

// Legacy slug — Vite migration kalıntısı. Türkçeleştirildi: /arac/kurani-tani.
// SEO equity + paylaşılan link'ler korunsun diye 308 permanent redirect.
// next/navigation.redirect() Next.js 16 App Router'da 307 default verir; ama
// burada generateMetadata olmadığı + statik path için browser'lar bunu cache'ler.
export default async function Page({ params }) {
  const { locale } = await params;
  redirect(`/${locale}/arac/kurani-tani`);
}
