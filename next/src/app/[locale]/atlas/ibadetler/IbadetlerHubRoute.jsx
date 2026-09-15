'use client';
import { useState, useEffect } from 'react';
import IbadetlerHub from '@/components/IbadetlerHub';
import { useLanguage } from '@/i18n/LanguageContext';

// `hubData` artik SUNUCUDAN prop olarak gelir (bkz. page.js). Eskiden burada
// fetch ediliyordu; ilk HTML bos kaliyor ve kullanici once "Yukleniyor..."
// goruyordu. Yukleniyor ekrani da bu yuzden kaldirildi: veri ilk render'da
// hazir.
export default function IbadetlerHubRoute({ hubData }) {
  const { language } = useLanguage();
  // §14.1 — sunucuda ve istemcide ayni baslangic degeri; hidrasyon uyusmazligi
  // olmasin diye olcum mount sonrasi yapilir.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return <IbadetlerHub hubData={hubData} language={language} isMobile={isMobile} />;
}
