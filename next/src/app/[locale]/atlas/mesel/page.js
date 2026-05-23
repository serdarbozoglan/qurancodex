import MeselAtlasiRoute from './MeselAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/mesel',
    title: 'Mesel Atlası',
    description: 'Kur',
  });
}

export default function Page() {
  return <MeselAtlasiRoute />;
}
