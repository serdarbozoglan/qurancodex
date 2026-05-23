import MeleklerRoute from './MeleklerRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/melekler',
    title: 'Melekler',
    description: 'Kur',
  });
}

export default function Page() {
  return <MeleklerRoute />;
}
