import KavimlerAtlasiRoute from './KavimlerAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/kavim',
    title: 'Kavimler Atlası',
    description: 'Kur',
  });
}

export default function Page() {
  return <KavimlerAtlasiRoute />;
}
