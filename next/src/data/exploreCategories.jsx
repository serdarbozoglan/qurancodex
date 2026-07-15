// ─── Explore categories data — single source of truth ────────────────────────
// Content discovery map shared by the Navbar "Keşfet" mega-menu and the
// homepage AllTopics grid. Both consumers iterate the same categories + items,
// so reordering in one place updates both automatically.
//
// Difference from tools.jsx:
//   - tools.jsx  → interactive analysis/visualization modules
//   - this file  → long-form content topics + a few overlay-only ones
//
// Each item has a `kind`:
//   - 'section' → scrollable long-form section in the homepage (uses target as DOM id)
//   - 'overlay' → opens an interactive module overlay (uses target as short name
//                  mapped in useQuranNav.OVERLAY_EVENTS)
//
// Order within each category is intentional and matches the user's spec
// (2026-04-10). Change it here, both consumers update.
//
// Icons are React components taking a `size` prop so the same data can drive
// both the compact 16px navbar dropdown and the 18px AllTopics cards.
// ─────────────────────────────────────────────────────────────────────────────

// ── Icons ────────────────────────────────────────────────────────────────────

const WaveIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h2M6 7v10M10 4v16M14 7v10M18 10v4M22 12h-2" />
  </svg>
);

const PulseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h3l3-9 3 18 3-9h6" />
  </svg>
);

const SpeakerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15 9a3 3 0 0 1 0 6" />
  </svg>
);

const LayersIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

// Linguistic / Mukattaa — orbit (atomic) icon: 3 elliptic orbits + nucleus
// Mukattaa harflerinin "Kur'an'ın dilsel DNA'sı" temasına uygun atomik görsel.
const LinguisticIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
  </svg>
);

const PaletteIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.477 2 12 2z" />
  </svg>
);

const ScrollIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const HandsIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 14V8a2 2 0 1 0-4 0M7 12V6a2 2 0 0 0-4 0v9c0 4 3 7 7 7h2a7 7 0 0 0 7-7V9a2 2 0 0 0-4 0M15 11V6a2 2 0 0 0-4 0" />
  </svg>
);

const ShieldIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Scroll2Icon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BrainIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

const GlobeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const StarIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ClockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LeafIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.4 19 19 0 0 1-.5 11.4A8 8 0 0 1 13 20" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

const FlameIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const TrumpetIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6v12l10-4V10z" />
    <path d="M12 10v4M16 8v8M20 6v12" />
  </svg>
);

const FeatherIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

// JourneyIcon — dikey timeline: 3 node + bağlayıcı çizgi. Ahiret Yolculuğu'nun
// kronolojik akış hub'ı olduğunu görsel olarak simgeler (sekerât → berzah → cennet/cehennem).
const JourneyIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    <path d="M9 8l3 -3l3 3" opacity="0.5" />
    <path d="M9 16l3 3l3 -3" opacity="0.5" />
  </svg>
);

const CompassIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const MaskIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
    <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// DevilIcon — stylized flame: İblis ateşten yaratıldı (Hicr 15:27, Sâd 38:76).
// Önceki boynuzlu-yüz motifi kaldırıldı (uygun değil).
const DevilIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5c1.6 3.2 4.8 5.4 4.8 9.4 0 3.6-2.4 6.6-4.8 6.6s-4.8-3-4.8-6.6c0-1.8 0.7-3 1.6-4.1" />
    <path d="M12 8c0.9 1.7 2.6 2.9 2.6 5.1 0 1.9-1.3 3.5-2.6 3.5s-2.6-1.6-2.6-3.5c0-1 0.4-1.6 0.9-2.2" />
  </svg>
);

// Landmark — antik sütunlar + zemin, arkeoloji / tarihsel medeniyet teması
const LandmarkIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="3 11 21 11 12 4" />
  </svg>
);

const LadderIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="2" x2="6" y2="22" />
    <line x1="18" y1="2" x2="18" y2="22" />
    <line x1="6" y1="6" x2="18" y2="6" />
    <line x1="6" y1="10" x2="18" y2="10" />
    <line x1="6" y1="14" x2="18" y2="14" />
    <line x1="6" y1="18" x2="18" y2="18" />
  </svg>
);

// İlk ve Son Kelimeler — bridge: iki dolgu nokta + bunları birleştiren arc/yay
// (sayfanın "ilk kelime ile son kelime arasındaki köprü" temasını semantik anlatır)
const BookendsIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="15" r="2.2" fill="currentColor" stroke="none" />
    <circle cx="19" cy="15" r="2.2" fill="currentColor" stroke="none" />
    <path d="M5 15 Q12 4 19 15" />
  </svg>
);

// PrayerIcon — Mihrap kemer ikonu: İbadetlerin Kur'ânî Mimarisi.
const PrayerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 21V10a6 6 0 1 1 12 0v11" />
    <path d="M4 21h16" />
    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
  </svg>
);

// AddresseeIcon — "Ey iman edenler" — çift portre (muhatap sistemi).
const AddresseeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ── FEATURED explore item — İbadetlerin Kur'ânî Mimarisi ─────────────────────
// 2026-07-10: Bu content-flagship (8 sütun · 77 dua · 15 semantik terim).
// Önceden TARİH & İNSAN kolonunda item olarak yığın içinde kaybolyordu.
// Şimdi mega-menu'nun tepesinde full-width banner olarak render edilir
// (Araçlar dropdown'ının "Kur'an'ı Tanı" featured banner'ı pattern'ıyla parity).
// Consumer'lar (Navbar desktop + mobile drawer) bu export'u ayrı olarak import
// eder ve EXPLORE_CATEGORIES.items içinde tekrar göstermez.
export const FEATURED_EXPLORE_ITEM = {
  id:      'ibadetler',
  kind:    'overlay',
  target:  'ibadetler',
  icon:    PrayerIcon,
  titleTr: "İbadetlerin Kur'ânî Mimarisi",
  titleEn: "The Qur'anic Architecture of Worship",
  descTr:  "Kulluk · 8 sütun · Kur'an'ın kendi diliyle · 77 dua ekseni",
  descEn:  "Worship · 8 pillars · in the Qur'an's own words · 77-prayer axis",
};

// ── Categories ──────────────────────────────────────────────────────────────
// Order (2026-07-10 revision):
//   DİL & YAPI          — 6 item
//   RETORİK & DUA       — Yeminler → Retorik → Dua Dili → Muhatap Sistemi (4)
//   İNSAN & TOPLUM      — İnsan → Psikoloji → Nefis → İblis → Münâfık → Sünnetullah → Kavimler → Tarihsel (8)
//   KUR'AN'IN EVRENİ    — Kevni → Bilimsel → Zaman → Melekler → Kıyamet → Cennet (6)
//
// Change log:
//   - İbadetlerin Kur'ânî Mimarisi (flagship) çıkarıldı → FEATURED_EXPLORE_ITEM
//     olarak ayrı export edilir (mega-menu banner + mobile flagship banner).
//   - TARİH & İNSAN → İNSAN & TOPLUM olarak yeniden adlandırıldı (10 item'ın 8'i
//     içsel/toplumsal, "tarih" başlığı yanıltıcıydı).
//   - Muhatap Sistemi RETORİK & DUA'ya eklendi (Araçlar'da da kalır — reinforced
//     discovery); önceki 3 item / 10 item dengesizliğini kapatır (4/8).

export const EXPLORE_CATEGORIES = [
  {
    id: 'language',
    titleTr: 'DİL & YAPI',
    titleEn: 'LANGUAGE & STRUCTURE',
    items: [
      {
        id:     'linguistic',
        kind:   'section',
        target: 'mukattaa-card',
        icon:   WaveIcon,
        titleTr: 'Dilsel DNA',            titleEn: 'Linguistic DNA',
        descTr: '14 gizemli harf ve şifresi',
        descEn: '14 mysterious letters & their code',
      },
      // Ses (harf-fonetik) → Ritim (cümle-fasıla) sırası mikro→makro akışı için
      // ters çevrildi (2026-07-15 audit).
      {
        id:     'sounds',
        kind:   'section',
        target: 'ses-card',
        icon:   SpeakerIcon,
        titleTr: 'Ses Mimarisi',          titleEn: 'Sound Architecture',
        descTr: 'Sert ve yumuşak ünsüzler',
        descEn: 'Hard and soft consonants',
      },
      {
        id:     'rhythm',
        kind:   'section',
        target: 'ritim-card',
        icon:   PulseIcon,
        titleTr: 'İmkansız Ritim',        titleEn: 'Impossible Rhythm',
        descTr: 'Ne şiir ne düzyazı',
        descEn: 'Neither poetry nor prose',
      },
      {
        id:     'hidden-architecture',
        kind:   'section',
        target: 'halka-card',
        icon:   LayersIcon,
        titleTr: 'Yapısal Mimari',        titleEn: 'Hidden Architecture',
        descTr: 'Halka kompozisyon ve simetri',
        descEn: 'Ring composition & symmetry',
      },
      {
        id:     'ilkSon',
        kind:   'overlay',
        target: 'ilkSon',
        icon:   BookendsIcon,
        titleTr: 'İlk ve Son Kelimeler',  titleEn: 'First and Last Words',
        descTr: '114 sûre · açılış ↔ kapanış deseni',
        descEn: '114 surahs · opening ↔ closing pattern',
      },
      {
        id:     'renkler',
        kind:   'overlay',
        target: 'renkler',
        icon:   PaletteIcon,
        titleTr: "Kur'an'ın Renkleri",    titleEn: 'Colors of the Quran',
        descTr: '~80 ayet · 11 renk evreni',
        descEn: '~80 verses · 11 color domains',
      },
    ],
  },
  {
    id: 'rhetoric',
    titleTr: 'RETORİK & DUA',
    titleEn: 'RHETORIC & PRAYER',
    // 2026-07-15 audit sıralama: genel çerçeve (Retoriği) → hedef (Muhatap) →
    // özel retorik türleri (Yeminler, Dua). Umbrella → alt-tür akışı.
    items: [
      {
        id:     'rhetoric',
        kind:   'section',
        target: 'retorik-card',
        icon:   ScrollIcon,
        titleTr: "Kur'an'ın Retoriği",    titleEn: 'Quranic Rhetoric',
        descTr: 'İltifât, takdîm-tehîr, fâsıla',
        descEn: 'Iltifāt, syntactic shifts, cadence',
      },
      {
        id:     'addressee-system',
        kind:   'overlay',
        target: 'addresseeSystem',
        icon:   AddresseeIcon,
        titleTr: 'Muhatap Sistemi',       titleEn: 'Addressee System',
        descTr: "'Ey iman edenler' — kim, ne zaman?",
        descEn: "'O you who believe' — who, when?",
      },
      {
        id:     'yeminler',
        kind:   'overlay',
        target: 'yeminler',
        icon:   ShieldIcon,
        titleTr: "Kur'an'ın Yeminleri",   titleEn: 'Quranic Oaths',
        descTr: 'Vâv-ı kasem · 40+ yemin',
        descEn: 'Wāw al-qasam · 40+ oaths',
      },
      {
        id:     'dua-language',
        kind:   'section',
        target: 'dua-card',
        icon:   HandsIcon,
        titleTr: 'Dua Dili',              titleEn: 'Language of Prayer',
        descTr: 'Yakarışın gramatik kalıbı',
        descEn: 'The grammar of supplication',
      },
    ],
  },
  {
    // 2026-07-10 revizyonu: 'İNSAN & TOPLUM'. Önceki adı 'TARİH & İNSAN'dı;
    // 10 item'ın 8'i iç dünya/toplum (Sünnetullah, İblis, Münâfık dahil), sadece
    // 2'si tarih (Kavimler, Tarihsel Kanıtlar) — başlıkla içerik uyumsuzdu.
    // İbadetler kolondan çıkarıldı → FEATURED_EXPLORE_ITEM (mega-menu banner).
    id: 'history',
    titleTr: 'İNSAN & TOPLUM',
    titleEn: 'THE HUMAN & SOCIETY',
    items: [
      // Sıra: iç dünya (insan tanımı → psikoloji → nefs → iç düşman → dış davranış)
      // → topluma (sünnetullah → kavimler → tarihsel kanıtlar)
      {
        id:     'human-definition',
        kind:   'section',
        target: 'insan-tanimi-card',
        icon:   UserIcon,
        titleTr: "Kur'an'da İnsan",       titleEn: 'The Human in the Quran',
        descTr: 'Nefs, kalp, ruh',
        descEn: 'Nafs, qalb, rūḥ',
      },
      {
        id:     'psychology',
        kind:   'section',
        target: 'psikoloji-card',
        icon:   BrainIcon,
        titleTr: 'İnsan Psikolojisi',     titleEn: 'Human Psychology',
        descTr: "Kur'an'ın iç dünya haritası",
        descEn: 'The Quran on the inner world',
      },
      {
        id:     'nefis',
        kind:   'overlay',
        target: 'nefis',
        icon:   LadderIcon,
        titleTr: 'Nefis Mertebeleri',     titleEn: 'Stations of the Self',
        descTr: '3 Kur\'ânî + 4 tasavvufî basamak',
        descEn: '3 Qur\'anic + 4 Sufi stations',
      },
      {
        id:     'iblisSatan',
        kind:   'overlay',
        target: 'iblisSatan',
        icon:   DevilIcon,
        titleTr: "Kur'an'da İblis / Şeytan", titleEn: 'Iblis / Satan in the Quran',
        descTr: 'Yedi sûrede aynı sahne · kibrin başlangıcı',
        descEn: 'Same scene in seven surahs · the origin of pride',
      },
      {
        id:     'munafik',
        kind:   'overlay',
        target: 'munafik',
        icon:   MaskIcon,
        titleTr: 'Münâfık Profili',       titleEn: 'The Hypocrite Profile',
        descTr: '7 psikolojik davranış deseni',
        descEn: '7 psychological behavioral patterns',
      },
      {
        id:     'sunnetullah',
        kind:   'overlay',
        target: 'sunnetullah',
        icon:   CompassIcon,
        titleTr: 'Sünnetullah',           titleEn: 'Sunnatullāh',
        descTr: "Allah'ın değişmez kanunları · 6 ayet",
        descEn: "God's unchanging laws · 6 verses",
      },
      {
        id:     'kavimler',
        kind:   'overlay',
        target: 'kavimler',
        icon:   GlobeIcon,
        titleTr: 'Kavimler Atlası',       titleEn: 'Nations Atlas',
        descTr: 'Âd, Semûd, Lût · 14 kavim',
        descEn: 'ʿĀd, Thamūd, Lot · 14 nations',
      },
      {
        id:     'history',
        kind:   'section',
        target: 'tarih-card',
        icon:   LandmarkIcon,
        titleTr: 'Tarihsel Kanıtlar',     titleEn: 'Historical Proof',
        descTr: 'Firavun, Haman, Roma',
        descEn: 'Pharaoh, Haman, Rome',
      },
    ],
  },
  {
    id: 'cosmos',
    titleTr: "KUR'AN'IN EVRENİ",
    titleEn: "THE QURAN'S COSMOS",
    items: [
      {
        id:     'kevni',
        kind:   'overlay',
        target: 'kevni',
        icon:   LeafIcon,
        titleTr: 'Kevni Ayetler',         titleEn: 'Cosmic Signs',
        descTr: 'Tabiat atlası · ~200 ayet',
        descEn: 'Nature atlas · ~200 verses',
      },
      {
        id:     'science',
        kind:   'section',
        target: 'bilimsel-card',
        icon:   StarIcon,
        titleTr: 'Bilimsel İşaretler',    titleEn: 'Scientific Signs',
        descTr: 'Demir, embriyo, denizler',
        descEn: 'Iron, embryo, oceans',
      },
      {
        id:     'zaman',
        kind:   'overlay',
        target: 'zaman',
        icon:   ClockIcon,
        titleTr: 'Zaman Boyutları',       titleEn: 'Dimensions of Time',
        descTr: '6 zaman boyutu · ilahî vs insan zamanı',
        descEn: '6 time scales · divine vs human time',
      },
      {
        id:     'melekler',
        kind:   'overlay',
        target: 'melekler',
        icon:   FeatherIcon,
        titleTr: 'Melekler',              titleEn: 'Angels',
        descTr: 'Cebrail · Mikail · görevler',
        descEn: 'Gabriel · Michael · their roles',
      },
      {
        id:     'ahiretYolculugu',
        kind:   'overlay',
        target: 'ahiretYolculugu',
        icon:   JourneyIcon,
        titleTr: 'Âhiret Yolculuğu',      titleEn: 'The Afterlife Journey',
        descTr: 'Sekerât → berzah → mahşer → cennet/cehennem',
        descEn: 'Death throes → barzakh → gathering → heaven/hell',
      },
      {
        id:     'kiyamet',
        kind:   'overlay',
        target: 'kiyamet',
        icon:   TrumpetIcon,
        titleTr: 'Kıyamet Sahneleri',     titleEn: 'Scenes of Resurrection',
        descTr: 'Sûr · diriliş · hesap',
        descEn: 'Trumpet · resurrection · reckoning',
      },
      {
        id:     'cennet',
        kind:   'overlay',
        target: 'cennet',
        icon:   FlameIcon,
        titleTr: 'Cennet & Cehennem',     titleEn: 'Heaven & Hell',
        descTr: 'İki nihai mekânın haritası',
        descEn: 'Map of the two ultimate realms',
      },
    ],
  },
];
