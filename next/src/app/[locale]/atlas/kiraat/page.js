import KiraatAtlasiRoute from './KiraatAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/kiraat',
    title: 'Kıraat Atlası',
    description: 'On kanonik kıraat — Hafs, Verş, Kalun, Duri, vs. — farklılıklar, ravileri ve coğrafi yayılımı.',
  });
}

export default function Page() {
  return <KiraatAtlasiRoute />;
}
