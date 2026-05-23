import WowFactsRoute from './WowFactsRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/wow',
    title: 'Şaşırtıcı Olgular',
    description: 'Modern bilimle örtüşen Kur',
  });
}

export default function Page() {
  return <WowFactsRoute />;
}
