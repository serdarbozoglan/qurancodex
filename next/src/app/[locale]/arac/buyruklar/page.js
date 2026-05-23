import QuranCommandsRoute from './QuranCommandsRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/buyruklar',
    title: 'Kur',
    description: 'İmperatif fiiller — namaz, oruç, zekât, hac, adâlet, sabır, tevbe ve diğer ilâhî buyruklar.',
  });
}

export default function Page() {
  return <QuranCommandsRoute />;
}
