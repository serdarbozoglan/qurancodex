import VerseGraphRoute from './VerseGraphRoute';

export const metadata = {
  title: 'Ayet Grafiği',
  description: "6236 ayetin semantik benzerlik grafiği — bgem3 embeddings + 3D force-graph; tıklanan ayetin komşularını gör.",
};

export default function Page() {
  return <VerseGraphRoute />;
}
