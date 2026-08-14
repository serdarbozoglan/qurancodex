import KutuphanemRoute from './KutuphanemRoute';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const tr = locale === 'tr';
  return {
    // Şablon zaten `| QuranCodex` ekliyor — elle sonek çift marka üretiyordu.
    title: tr ? 'Kütüphanem' : 'My Library',
    description: tr
      ? 'Kaydettiğiniz ayet, tefsir, makale ve atlas item\'ları.'
      : 'Your saved verses, tafsirs, articles, and atlas items.',
    robots: { index: false, follow: false }, // Private page — user-specific content
  };
}

export default function Page() {
  return <KutuphanemRoute />;
}
