import DiyalogAgiRoute from './DiyalogAgiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/diyalog',
    title: 'Diyalog Ağı',
    description: 'Kur',
  });
}

export default function Page() {
  return <DiyalogAgiRoute />;
}
