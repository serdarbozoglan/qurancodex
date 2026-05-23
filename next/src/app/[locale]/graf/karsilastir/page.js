import SurahComparatorRoute from './SurahComparatorRoute';

export const metadata = {
  title: "Sure Karşılaştırıcı",
  description: "İki sureyi yan yana karşılaştır — uzunluk, dönem, ortak temalar, tekrar eden ifadeler.",
};

export default function Page() {
  return <SurahComparatorRoute />;
}
