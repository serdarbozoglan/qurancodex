import ConceptGraphRoute from './ConceptGraphRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/kavram',
    title: 'Kavram Grafiği',
    description: 'Anahtar Kur',
  });
}

export default function Page() {
  return <ConceptGraphRoute />;
}
