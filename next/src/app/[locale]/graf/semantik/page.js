import SemanticMapRoute from './SemanticMapRoute';

import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: '/graf/semantik',
    title: 'Semantik Harita',
    description: 'Surelerin semantik kümeleri — UMAP projeksiyonuyla 2D görselleştirilmiş içerik akrabalığı.',
  });
}

export default function Page() {
  return <SemanticMapRoute />;
}
