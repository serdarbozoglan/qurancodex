// ─── toolRoutes.js — event adı → route eşlemesi (TEK OTORİTE) ───────────────
//
// Vite döneminde araçlar overlay'di ve `window.dispatchEvent(new
// CustomEvent('openXyz'))` ile açılıyordu. Next.js göçünde (§16.5) hepsi tam
// sayfa route'a dönüştü; Navbar bu haritayla event adlarını route'a çevirip
// `router.push` yapıyor.
//
// 2026-08-13: Harita Navbar.jsx içinde yerel bir `const`tu, bu yüzden
// ToolsBrowser (yani `/arac/tum-araclar` sayfası) ona erişemiyordu ve HÂLÂ
// `dispatchEvent` çağırıyordu. 23 event'ten 17'sinin dinleyicisi kalmadığı için
// o sayfada araç kartlarına tıklamak SESSİZCE hiçbir şey yapmıyordu — hata da
// vermiyordu. Harita buraya taşındı; iki tüketici de aynı kaynağı kullanıyor.
//
// Yeni bir araç route'u eklenince buraya da eklenmeli — aksi halde ToolsBrowser
// o aracı açamaz.
// ────────────────────────────────────────────────────────────────────────────

export const TOOL_ROUTES = {
  openWowFacts:        '/arac/kurani-tani',
  openVerseGraph:      '/graf/ayet',
  openHeatmap:         '/graf/kelime-isi',
  openRevelationOrder: '/graf/zaman',
  openProphetAtlas:    '/atlas/peygamber',
  openConceptGraph:    '/graf/kavram',
  openKissaAtlas:      '/atlas/kissa',
  openSurahComparator: '/graf/karsilastir',
  openSurahCommands:   '/arac/buyruklar',
  openDuaVerses:       '/arac/dualar',
  openAddresseeSystem: '/arac/muhataplar',
  openEsmaFrekans:     '/arac/esma-frekans',
  openKiraatAtlas:     '/atlas/kiraat',
  openDiyalogAgi:      '/graf/diyalog',
  openMeselAtlas:      '/atlas/mesel',
  openSebebNuzul:      '/arac/sebebi-nuzul',
  openFurukAtlasi:     '/atlas/furuk',
  openMunasebatAtlasi: '/atlas/munasebat',
  openIblisSatan:      '/arac/iblis-seytan',
  openKadinlarAtlasi:  '/atlas/kadinlar',
  openIlkSonKelimeler: '/arac/ilk-son-kelimeler',
  // #207 #208 #211 (2026-07-19) — Yeni 3 tool route mapping
  openElestirelCerceve: '/arac/elestirel-cerceve',
  openNedenSonuc:      '/arac/neden-sonuc',
  openKitapKavrami:    '/arac/kitap-kavrami',
  // #210 (2026-07-21) — Yakın Anlamlı Nüanslar
  openYakinAnlamliNuanslar: '/arac/yakin-anlamli-nuanslar',

  // 2026-08-13 (Z3b) — haritada KARŞILIĞI OLMAYAN üç event daha bulundu.
  // Bu üçü hiç eşlenmediği için `PsychologySection` ve `CennetCehennem`
  // butonları tıklanınca SESSİZCE hiçbir şey yapmıyordu (ölçüldü: URL
  // değişmiyor, konsol hatası da yok).
  openNefisMertebeleri: '/atlas/nefs-mertebeleri',
  openNatureAtlas:      '/atlas/doga',
  // `openQuranCommands` ↔ `openSurahCommands`: aynı sayfaya iki ad takılmış.
  // İkisi de korunuyor, yoksa eski çağrı yerleri tekrar ölür.
  openQuranCommands:    '/arac/buyruklar',
};

// Bir event adının route karşılığını verir; eşleşme yoksa null.
export function routeForToolEvent(eventName) {
  return TOOL_ROUTES[eventName] || null;
}
