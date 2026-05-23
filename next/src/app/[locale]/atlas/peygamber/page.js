import ProphetAtlasRoute from './ProphetAtlasRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/peygamber',
    title: 'Peygamberler Atlası',
    description: '25 peygamber — kronoloji, soy zinciri, gönderildikleri kavim, kıssa sahneleri ve sure haritası.',
  });
}

export default function Page() {
  return <ProphetAtlasRoute />;
}
