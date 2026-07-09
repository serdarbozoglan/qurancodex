'use client';
import { useState, useEffect } from 'react';
import IbadetlerPillar from '@/components/IbadetlerPillar';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ZekatRoute() {
  const { language } = useLanguage();
  const [pillarData, setPillarData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    fetch('/ibadetler/zekat.json')
      .then(r => r.json())
      .then(setPillarData)
      .catch(err => console.error('[ZekatRoute] fetch failed:', err));
    return () => window.removeEventListener('resize', h);
  }, []);

  if (!pillarData) return null;
  return <IbadetlerPillar pillarData={pillarData} language={language} isMobile={isMobile} />;
}
