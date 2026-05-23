import SunnetullahAtlasiRoute from './SunnetullahAtlasiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/sunnetullah',
    title: 'Sünnetullah Atlası',
    description: 'İlâhî yasa örüntüleri — toplumların yükseliş-çöküş sünnetleri; helâk eden ve yücelten ilkeler.',
  });
}

export default function Page() {
  return <SunnetullahAtlasiRoute />;
}
