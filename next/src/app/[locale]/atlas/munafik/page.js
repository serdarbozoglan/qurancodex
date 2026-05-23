import MunafikProfiliRoute from './MunafikProfiliRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/munafik',
    title: 'Münafık Profili',
    description: 'Münafıkların psikolojik portresi — 12 özellik, ayet referansları, klasik tefsir analizleri.',
  });
}

export default function Page() {
  return <MunafikProfiliRoute />;
}
