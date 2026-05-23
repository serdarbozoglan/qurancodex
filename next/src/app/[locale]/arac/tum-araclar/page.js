import ToolsBrowserRoute from './ToolsBrowserRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/tum-araclar',
    title: 'Tüm Araçlar',
    description: 'Tüm interaktif araçların kapsamlı kataloğu — atlas, graf, utility tool',
  });
}

export default function Page() {
  return <ToolsBrowserRoute />;
}
