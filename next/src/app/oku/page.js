import ReadingModeRoute from './ReadingModeRoute';

export const metadata = {
  title: "Kur'an Okuma",
  description: "Per-sure tilavet (6 kâri) + karaoke kelime senkronizasyonu + tajweed + Elmalılı/Ibn Kathir tefsir paneli + interlinear kelime-kelime çeviri.",
};

export default function Page() {
  return <ReadingModeRoute />;
}
