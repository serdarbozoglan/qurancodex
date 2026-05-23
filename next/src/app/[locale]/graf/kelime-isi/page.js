import WordHeatmapRoute from './WordHeatmapRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/kelime-isi',
    title: 'Kelime Isı Haritası',
    description: 'Bir kelimenin Kur',
  });
}

export default function Page() {
  return <WordHeatmapRoute />;
}
