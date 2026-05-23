import ConceptGraphRoute from './ConceptGraphRoute';

export const metadata = {
  title: "Kavram Grafiği",
  description: "Anahtar Kur'ânî kavramların (rahmet, takvâ, hidayet, vs.) ayet bulutu içindeki dağılımı ve bağlantıları.",
};

export default function Page() {
  return <ConceptGraphRoute />;
}
