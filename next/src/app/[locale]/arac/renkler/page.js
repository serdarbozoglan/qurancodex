import KuranRenkleriRoute from './KuranRenkleriRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/renkler',
    title: 'Kur',
    description: 'Beyaz, siyah, kırmızı, sarı, yeşil, mavi — Kur',
  });
}

export default function Page() {
  return <KuranRenkleriRoute />;
}
