import ZamanBoyutlariRoute from './ZamanBoyutlariRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/zaman-boyutlari',
    title: 'Zaman Boyutları',
    description: 'Kur',
  });
}

export default function Page() {
  return <ZamanBoyutlariRoute />;
}
