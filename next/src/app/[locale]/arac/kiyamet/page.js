import KiyametSahneleriRoute from './KiyametSahneleriRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/kiyamet',
    title: 'Kıyamet Sahneleri',
    description: 'Kıyamet günü ve sonrası — 7 fazlı sahneler: ön belirtiler, sûr, haşr, hesap, kitap, mizan, sırat.',
  });
}

export default function Page() {
  return <KiyametSahneleriRoute />;
}
