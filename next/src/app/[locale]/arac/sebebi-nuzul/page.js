import SebebiNuzulRoute from './SebebiNuzulRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/sebebi-nuzul',
    title: 'Sebeb-i Nüzûl',
    description: 'Ayetlerin iniş sebepleri — tarihsel olaylar, sorular, bağlamlar; klasik tefsir kaynaklarına dayalı.',
  });
}

export default function Page() {
  return <SebebiNuzulRoute />;
}
