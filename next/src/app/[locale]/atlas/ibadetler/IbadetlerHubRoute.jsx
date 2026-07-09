'use client';
import { useState, useEffect } from 'react';
import IbadetlerHub from '@/components/IbadetlerHub';
import { useLanguage } from '@/i18n/LanguageContext';

export default function IbadetlerHubRoute() {
  const { language } = useLanguage();
  const [hubData, setHubData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    fetch('/ibadetler/hub.json')
      .then(r => r.json())
      .then(setHubData)
      .catch(err => console.error('[IbadetlerHubRoute] fetch failed:', err));
    return () => window.removeEventListener('resize', h);
  }, []);

  if (!hubData) return null;
  return <IbadetlerHub hubData={hubData} language={language} isMobile={isMobile} />;
}
