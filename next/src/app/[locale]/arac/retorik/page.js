import KuranRetorigiRoute from './KuranRetorigiRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/retorik',
    title: 'Kur',
    description: 'Belâgat figürleri — tezad, istiare, teşbih, iltifât, sehl-i mümteni ve daha fazlası.',
  });
}

export default function Page() {
  return <KuranRetorigiRoute />;
}
