import WordHeatmapRoute from './WordHeatmapRoute';

export const metadata = {
  title: "Kelime Isı Haritası",
  description: "Bir kelimenin Kur'an boyunca dağılımı — sure × ayet ısı haritası ve frekans dağılımı.",
};

export default function Page() {
  return <WordHeatmapRoute />;
}
