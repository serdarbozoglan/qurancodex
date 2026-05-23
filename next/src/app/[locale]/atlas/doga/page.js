import DogaAtlasiRoute from './DogaAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/doga',
    title: 'Doğa Atlası',
    description: 'Kur',
  });
}

export default function Page() {
  return <DogaAtlasiRoute />;
}
