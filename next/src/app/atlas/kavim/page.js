import KavimlerAtlasiRoute from './KavimlerAtlasiRoute';

export const metadata = {
  title: 'Kavimler Atlası',
  description: "Kur'an'da geçen kavimler — Âd, Semûd, Lût kavmi ve diğerleri — coğrafi konum, helak sebebi ve ayet referanslarıyla.",
};

export default function Page() {
  return <KavimlerAtlasiRoute />;
}
