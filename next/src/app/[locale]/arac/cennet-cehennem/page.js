import CennetCehennemRoute from './CennetCehennemRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/cennet-cehennem',
    title: 'Cennet & Cehennem',
    description: 'Kur',
  });
}

export default function Page() {
  return <CennetCehennemRoute />;
}
