import KissaAtlasRoute from './KissaAtlasRoute';

export const metadata = {
  title: 'Kıssa Atlası',
  description: "Kur'an'daki kıssaların peygamberlere göre sahne-sahne atlası; her sahnenin sure haritası, hadise akışı ve ayet referansları.",
};

export default function Page() {
  return <KissaAtlasRoute />;
}
