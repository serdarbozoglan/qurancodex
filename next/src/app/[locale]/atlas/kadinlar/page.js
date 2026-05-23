import KadinlarAtlasiRoute from './KadinlarAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/kadinlar',
    title: 'Kadınlar Atlası',
    description: 'Kur',
  });
}

export default function Page() {
  return <KadinlarAtlasiRoute />;
}
