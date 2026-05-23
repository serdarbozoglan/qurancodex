import AddresseeSystemRoute from './AddresseeSystemRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/arac/muhataplar',
    title: 'Muhataplar Sistemi',
    description: 'Kur',
  });
}

export default function Page() {
  return <AddresseeSystemRoute />;
}
