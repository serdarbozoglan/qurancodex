'use client';
// Paylaşılan sekme ikon seti (§13.19 ikon kuralı). stroke=currentColor → tab'ın
// aktif/pasif rengine uyar. tabIcon('name') bir <svg/> döndürür.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', width: 15, height: 15, viewBox: '0 0 24 24', 'aria-hidden': true };

const ICONS = {
  users: <svg {...P}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4.5-5.8" /></svg>,
  alert: <svg {...P}><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>,
  layers: <svg {...P}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5M3 17l9 5 9-5" /></svg>,
  map: <svg {...P}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></svg>,
  compare: <svg {...P}><path d="M7 4v16M17 4v16" /><path d="M4 8l3-4 3 4M14 16l3 4 3-4" /></svg>,
  book: <svg {...P}><path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z" /><path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" /></svg>,
  bookOpen: <svg {...P}><path d="M12 6C10 4 6 4 4 5v13c2-1 6-1 8 1 2-2 6-2 8-1V5c-2-1-6-1-8 1z" /><path d="M12 7v13" /></svg>,
  clock: <svg {...P}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>,
  star: <svg {...P}><path d="M12 3l2.3 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.7-.5z" /></svg>,
  scale: <svg {...P}><path d="M12 3v18M7 21h10M5 6h14M7 6l-3 6a3 3 0 0 0 6 0zM17 6l-3 6a3 3 0 0 0 6 0z" /></svg>,
  route: <svg {...P}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6" /></svg>,
  folder: <svg {...P}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
  grid: <svg {...P}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  megaphone: <svg {...P}><path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M14 8a5 5 0 0 1 0 8" /></svg>,
  help: <svg {...P}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4 2c0 1.5-2 2-2 3M12 17h.01" /></svg>,
  info: <svg {...P}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>,
  person: <svg {...P}><circle cx="12" cy="7" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>,
  heart: <svg {...P}><path d="M12 20s-7-4.4-9.3-8.6A5.2 5.2 0 0 1 12 5a5.2 5.2 0 0 1 9.3 6.4C19 15.6 12 20 12 20z" /></svg>,
  list: <svg {...P}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  stairs: <svg {...P}><path d="M3 20h4v-4h4v-4h4V8h4V4" /></svg>,
};

export function tabIcon(name) {
  return ICONS[name] || null;
}
