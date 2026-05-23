import DuaVersesRoute from './DuaVersesRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/dualar',
    title: 'Kur',
    description: 'Kur',
  });
}

export default function Page() {
  return <DuaVersesRoute />;
}
