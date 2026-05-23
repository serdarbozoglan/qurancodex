import VerseGraphRoute from './VerseGraphRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/ayet',
    title: 'Ayet Grafiği',
    description: '6236 ayetin semantik benzerlik grafiği — bgem3 embeddings + 3D force-graph; tıklanan ayetin komşularını gör.',
  });
}

export default function Page() {
  return <VerseGraphRoute />;
}
