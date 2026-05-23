import MunasebatAtlasiRoute from './MunasebatAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/munasebat',
    title: 'Münasebât Atlası',
    description: 'Sureler arası ve sure içi belagi/temasal bağlantılar — Razi geleneği — sıralama incelemesi.',
  });
}

export default function Page() {
  return <MunasebatAtlasiRoute />;
}
