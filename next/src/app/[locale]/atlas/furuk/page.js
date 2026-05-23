import FurukAtlasiRoute from './FurukAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/furuk',
    title: 'Füruk Atlası',
    description: 'Eş anlamlı kabul edilen Kur',
  });
}

export default function Page() {
  return <FurukAtlasiRoute />;
}
