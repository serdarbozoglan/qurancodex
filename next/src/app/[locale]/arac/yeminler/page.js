import KuranYeminleriRoute from './KuranYeminleriRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/yeminler',
    title: 'Kur',
    description: 'Allah',
  });
}

export default function Page() {
  return <KuranYeminleriRoute />;
}
