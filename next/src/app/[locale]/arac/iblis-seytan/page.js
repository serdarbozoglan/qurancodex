import IblisSatanRoute from './IblisSatanRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/iblis-seytan',
    title: 'İblîs & Şeytan',
    description: 'Kur',
  });
}

export default function Page() {
  return <IblisSatanRoute />;
}
