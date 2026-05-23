import EsmaFrekansRoute from './EsmaFrekansRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/esma-frekans',
    title: 'Esma',
    description: 'Allah',
  });
}

export default function Page() {
  return <EsmaFrekansRoute />;
}
