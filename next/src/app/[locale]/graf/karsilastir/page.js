import SurahComparatorRoute from './SurahComparatorRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/karsilastir',
    title: 'Sure Karşılaştırıcı',
    description: 'İki sureyi yan yana karşılaştır — uzunluk, dönem, ortak temalar, tekrar eden ifadeler.',
  });
}

export default function Page() {
  return <SurahComparatorRoute />;
}
