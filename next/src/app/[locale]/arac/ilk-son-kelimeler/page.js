import IlkSonKelimelerRoute from './IlkSonKelimelerRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/ilk-son-kelimeler',
    title: 'İlk & Son Kelimeler',
    description: '114 sûrenin ilk ve son kelimeleri — tematik halka, başlangıç-bitiş simetrisi.',
  });
}

export default function Page() {
  return <IlkSonKelimelerRoute />;
}
