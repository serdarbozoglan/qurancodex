import KissaAtlasRoute from './KissaAtlasRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/kissa',
    title: 'Kıssa Atlası',
    description: 'Kur',
  });
}

export default function Page() {
  return <KissaAtlasRoute />;
}
