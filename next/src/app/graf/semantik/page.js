import SemanticMapRoute from './SemanticMapRoute';

export const metadata = {
  title: "Semantik Harita",
  description: "Surelerin semantik kümeleri — UMAP projeksiyonuyla 2D görselleştirilmiş içerik akrabalığı.",
};

export default function Page() {
  return <SemanticMapRoute />;
}
