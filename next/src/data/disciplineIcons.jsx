// Disiplin ikonları — hub + detay sayfasının ortak kullandığı sade çizgi-ikonlar.
// stroke="currentColor": renk ve boyut çağıran tarafından verilir (esneklik +
// tek kaynak). aria-hidden — dekoratif.

const PATHS = {
  'iman-itikad':      <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1L12 16.6 5.7 21l2.3-7.1-6-4.5h7.6z" />,
  'psikoloji-nefs':   <><path d="M9.5 3a3.5 3.5 0 0 0-3.5 3.5c0 .5.1 1 .3 1.4A3 3 0 0 0 5 12a3 3 0 0 0 2 2.8V17a3 3 0 0 0 5.5 1.6" /><path d="M12 3.5A3.5 3.5 0 0 1 19 6c0 .6-.2 1.2-.4 1.7A3 3 0 0 1 17 14v3a2.5 2.5 0 0 1-5 0V3.5z" /></>,
  'ahlak-karakter':   <path d="M12 21s-7-4.4-9.3-8.6A5.2 5.2 0 0 1 12 6a5.2 5.2 0 0 1 9.3 6.4C19 16.6 12 21 12 21z" />,
  'liderlik-yonetim': <path d="M3 8l4 3 5-6 5 6 4-3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />,
  'adalet-hukuk':     <path d="M12 3v18M7 21h10M4 7h16M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z" />,
  'sosyoloji-toplum': <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4.5-5.8" /></>,
  'iktisat-ticaret':  <><circle cx="12" cy="12" r="8" /><path d="M12 7v10M9.5 9.2A2.2 2.2 0 0 1 12 8c1.2 0 2 .7 2 1.6 0 2.4-4 1.2-4 3.6 0 1 .9 1.8 2 1.8a2.2 2.2 0 0 0 2.5-1.2" /></>,
  'dil-belagat':      <><path d="M7 8h6M7 12h4" /><path d="M21 12a8 8 0 0 1-8 8H4l3-3A8 8 0 1 1 21 12z" /></>,
  'kuran-ilimleri':   <><path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z" /><path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" /></>,
  'tarih-medeniyet':  <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  'maneviyat-ibadet': <><path d="M12 2C9 5 9 8 12 10c3-2 3-5 0-8z" /><path d="M4 21v-6a8 8 0 0 1 16 0v6" /><path d="M4 21h16M12 11v10" /></>,
  'tabiat-afak':      <><circle cx="12" cy="9" r="3.2" /><path d="M12 2v1.5M12 14.5V16M19 9h-1.5M6.5 9H5M16.9 4.1l-1 1M8.1 12.9l-1 1M16.9 13.9l-1-1M8.1 5.1l-1-1" /><path d="M3 21h18" /></>,
};

export function disciplineIcon(id, size = 22) {
  const inner = PATHS[id];
  if (!inner) return null;
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {inner}
    </svg>
  );
}
