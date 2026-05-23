import ReadingModeRoute from './ReadingModeRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/oku',
    title: 'Kur',
    description: 'Per-sure tilavet (6 kâri) + karaoke kelime senkronizasyonu + tajweed + Elmalılı/Ibn Kathir tefsir paneli + interlinear kelime-kelime çeviri.',
  });
}

export default function Page() {
  return <ReadingModeRoute />;
}
