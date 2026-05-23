import NefisMertebeleriRoute from './NefisMertebeleriRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/atlas/nefs-mertebeleri',
    title: 'Nefs Mertebeleri',
    description: '7 nefs mertebesi — emmare, levvâme, mülhime, mutmainne, râziye, marziyye, kâmile.',
  });
}

export default function Page() {
  return <NefisMertebeleriRoute />;
}
