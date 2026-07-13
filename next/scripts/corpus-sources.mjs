// ─── Corpus Sources Registry ─────────────────────────────────────────────────
// RAG Semantik Concierge için hangi content'in embed edileceğini tanımlar.
// Yeni content type geldiğinde buraya entry eklenir → build-corpus.mjs
// otomatik pickup eder.

import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../src/lib/surahNames.js';
//
// Her source:
//   type: string           — item type (verse, article, atlas-*, tool)
//   file: string           — public/ altındaki JSON file path
//   dir: string            — public/ altındaki klasör (glob)
//   pattern: string        — dosya pattern (dir modu için)
//   exclude: string[]      — atlanacak dosyalar
//   extract: (data) => []  — data'dan item array'i çıkarma logic'i
//   fields: { ... }        — item'dan hangi field'lar alınacak
//   textBuilder: (item) => — text field'ından embedding için string üretimi
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_SOURCES = [
  // ─── Ayetler — 6236 verse
  {
    type: 'verse',
    file: 'public/verse-graph-bgem3.json',
    extract: (data) => (Array.isArray(data) ? data : Object.values(data)),
    buildItem: (v) => ({
      id: `verse:${v.id}`,
      type: 'verse',
      surah: v.surah,
      ayah: v.ayah,
      // Kaynakta v.surahName Arapça ("الأعراف"), v.surahNameEn Latin. TR yok.
      // Canonical TR/EN transliteration için surahNames.js map'i kullanılır —
      // concierge hydrate'de item.surahName direkt render edilir (TR display).
      // NOT: searchText'te ORİJİNAL v.surahName (Arapça) korunur → embedding
      // hash'i değişmez, re-embed gerekmez.
      surahName: SURAH_NAMES_TR[v.surah - 1] || v.surahName,
      surahNameEn: SURAH_NAMES_EN[v.surah - 1] || v.surahNameEn,
      textTr: v.turkish || '',
      textEn: v.english || '',
      arabic: v.arabic || '',
      // Search text: sûre + ayet + Türkçe/İngilizce metin
      searchTextTr: `${v.surahName || ''} ${v.surah}:${v.ayah}. ${v.turkish || ''}`,
      searchTextEn: `${v.surahNameEn || ''} ${v.surah}:${v.ayah}. ${v.english || ''}`,
    }),
  },

  // ─── Tefekkür yazıları — 33 makale
  // Body extraction: article.sections içindeki text alanlarını birleştir.
  // Toplam text daha zengin → semantic search recall'u artar.
  {
    type: 'article',
    dir: 'public/tefekkur/',
    pattern: /\.json$/,
    exclude: ['_index.json'],
    buildItem: (article) => {
      // Extract text from article body sections (varies by template)
      const extractSectionsText = (lang) => {
        const parts = [];
        const sections = article.sections || article.content || [];
        for (const s of (Array.isArray(sections) ? sections : [])) {
          if (typeof s === 'string') parts.push(s);
          if (s.title && s[`title${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`title${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`text${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`text${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`body${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`body${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`content${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`content${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`summary${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`summary${lang === 'tr' ? 'Tr' : 'En'}`]);
          // Nested paragraphs
          if (Array.isArray(s.paragraphs)) {
            for (const p of s.paragraphs) {
              if (typeof p === 'string') parts.push(p);
              else if (p[`text${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(p[`text${lang === 'tr' ? 'Tr' : 'En'}`]);
            }
          }
        }
        return parts.join(' ').slice(0, 3000); // cap at ~3000 chars per lang (roughly 750 tokens)
      };

      const bodyTr = extractSectionsText('tr');
      const bodyEn = extractSectionsText('en');

      return {
        id: `article:${article.slug}`,
        type: 'article',
        slug: article.slug,
        titleTr: article.titleTr || '',
        titleEn: article.titleEn || '',
        category: article.category || '',
        tldrTr: article.tldrTr || '',
        tldrEn: article.tldrEn || '',
        readingMinutes: article.readingMinutes || null,
        // Search text: başlık + tldr + body sections + keywords
        searchTextTr: `${article.titleTr || ''}. ${article.tldrTr || ''} ${bodyTr}`.trim(),
        searchTextEn: `${article.titleEn || ''}. ${article.tldrEn || ''} ${bodyEn}`.trim(),
      };
    },
  },

  // ─── Kavim Atlas — 16 kavim
  {
    type: 'atlas-kavim',
    file: 'public/kavimler.json',
    extract: (data) => data.nations || [],
    buildItem: (item) => ({
      id: `atlas-kavim:${item.id}`,
      type: 'atlas-kavim',
      subId: item.id,
      titleTr: item.nameTr || '',
      titleEn: item.nameEn || '',
      arabic: item.arabic || '',
      // Card display fields — hydrate karta özet aktarır
      descTr: item.summaryTr || item.helakTr || '',
      descEn: item.helakEn || '',
      prophetTr: item.prophetTr || '',
      prophetEn: item.prophetEn || '',
      searchTextTr: `${item.nameTr || ''} kavmi (${item.arabic || ''}). Peygamberi: ${item.prophetTr || 'belirtilmemiş'}. Helâk sebebi: ${item.helakTr || ''}. Durumu: ${item.status || ''}.`,
      searchTextEn: `${item.nameEn || ''} people (${item.arabic || ''}). Prophet: ${item.prophetEn || 'unspecified'}. Destruction: ${item.helakEn || ''}. Status: ${item.status || ''}.`,
    }),
  },

  // ─── Kıssa Atlas — Peygamber kıssaları (4 major prophets)
  {
    type: 'atlas-kissa',
    file: 'public/kissa-atlas.json',
    extract: (data) => data.prophets || [],
    buildItem: (item) => {
      const scenesTextTr = (item.scenes || []).slice(0, 5).map(s => s.titleTr || s.summaryTr || '').filter(Boolean).join('. ');
      const scenesTextEn = (item.scenes || []).slice(0, 5).map(s => s.titleEn || s.summaryEn || '').filter(Boolean).join('. ');
      const firstSceneTr = (item.scenes || [])[0]?.summaryTr || (item.scenes || [])[0]?.titleTr || '';
      const firstSceneEn = (item.scenes || [])[0]?.summaryEn || (item.scenes || [])[0]?.titleEn || '';
      return {
        id: `atlas-kissa:${item.id}`,
        type: 'atlas-kissa',
        subId: item.id,
        titleTr: item.nameTr || '',
        titleEn: item.nameEn || '',
        arabic: item.nameAr || '',
        descTr: firstSceneTr ? `${item.surahCount || 0} sûrede: ${firstSceneTr}`.slice(0, 160) : '',
        descEn: firstSceneEn ? `In ${item.surahCount || 0} suras: ${firstSceneEn}`.slice(0, 160) : '',
        searchTextTr: `${item.nameTr || ''} kıssası (${item.nameAr || ''}). ${item.surahCount || 0} sûrede geçer. Sahneler: ${scenesTextTr}`,
        searchTextEn: `Story of ${item.nameEn || ''} (${item.nameAr || ''}). Appears in ${item.surahCount || 0} suras. Scenes: ${scenesTextEn}`,
      };
    },
  },

  // ─── Esma-i Hüsna — 114 isim
  {
    type: 'atlas-esma',
    file: 'public/esma-frekans.json',
    extract: (data) => data.isimler || [],
    buildItem: (item) => ({
      id: `atlas-esma:${item.okunus || item.isim}`,
      type: 'atlas-esma',
      subId: item.okunus || item.isim,
      titleTr: item.isim || '',
      titleEn: item.okunus || item.isim || '',
      arabic: item.arapca || '',
      kuranda_gecis_sayisi: item.kuranda_gecis_sayisi || 0,
      descTr: (item.anlam || '').slice(0, 160),
      descEn: (item.anlam_en || item.anlam || '').slice(0, 160),
      searchTextTr: `${item.isim || ''} (${item.arapca || ''}), okunuşu ${item.okunus || ''}. ${item.anlam || ''}. ${item.aciklama || ''} Kategori: ${item.kategori_etiket || item.kategori || ''}.`,
      searchTextEn: `${item.okunus || ''} (${item.arapca || ''}). ${item.anlam || ''} — a name/attribute of God. Category: ${item.kategori_etiket || item.kategori || ''}.`,
    }),
  },

  // ─── Kur'ani Dualar — 77 dua
  {
    type: 'atlas-dua',
    file: 'public/dua-verses.json',
    extract: (data) => data.duas || [],
    buildItem: (item) => ({
      id: `atlas-dua:${item.id}`,
      type: 'atlas-dua',
      subId: item.id,
      surah: item.surah,
      ayah: item.ayah,
      category: item.category,
      prophetTr: item.prophet_tr || '',
      prophetEn: item.prophet_en || '',
      arabic: item.arabic || '',
      // Card display fields — dua'nın kendi meali kısa özet olarak kullanılır.
      // Dua'lar zaten kısa (~15-30 kelime) olduğu için tam meal kullanılabilir.
      descTr: (item.tr || '').slice(0, 200),
      descEn: (item.en || '').slice(0, 200),
      searchTextTr: `Dua: ${item.tr || ''} — ${item.prophet_tr || 'genel'} duası (${item.surah}:${item.ayah}). Kategori: ${item.category || ''}.`,
      searchTextEn: `Prayer: ${item.en || ''} — from ${item.prophet_en || 'general'} (${item.surah}:${item.ayah}). Category: ${item.category || ''}.`,
    }),
  },

  // ─── Kavramlar (Concept Graph) — 65 kavram
  // NOT: /graf/kavram sayfası şu an URL param ile auto-select desteklemiyor.
  // Bu yüzden anchorVerses[0]'ı item'da tutuyoruz — hydrate katmanı bu ayete
  // yönlendirir (kavram sayfası yerine doğrudan ilgili ayete).
  {
    type: 'atlas-kavram',
    file: 'public/concept-graph.json',
    extract: (data) => data.concepts || [],
    buildItem: (item) => {
      const anchors = (item.anchorVerses || []).join(', ');
      const keywords = (item.keywords || []).join(', ');
      return {
        id: `atlas-kavram:${item.id}`,
        type: 'atlas-kavram',
        subId: item.id,
        titleTr: item.tr || '',
        titleEn: item.en || '',
        arabic: item.ar || '',
        group: item.group || '',
        anchorVerse: (item.anchorVerses || [])[0] || null,
        // Card display: kategori + anahtar kelimelerden özet cümle
        descTr: item.group ? `${item.group}${keywords ? ' · ' + keywords.slice(0, 100) : ''}` : keywords.slice(0, 140),
        descEn: item.group ? `${item.group}${keywords ? ' · ' + keywords.slice(0, 100) : ''}` : keywords.slice(0, 140),
        searchTextTr: `${item.tr || ''} (${item.ar || ''}) — ${keywords}. Ana ayetler: ${anchors}. Kategori: ${item.group || ''}.`,
        searchTextEn: `${item.en || ''} (${item.ar || ''}) — ${keywords}. Anchor verses: ${anchors}. Group: ${item.group || ''}.`,
      };
    },
  },
];

// ─── Tool Catalog (statik registry) ──────────────────────────────────────────
// Site'deki 30+ tool sayfasının semantic profili. Concierge bunları öner ki
// user "kavim" arayınca /atlas/kissa yerine /atlas/kavim önerilsin.
export const TOOL_CATALOG = [
  { route: '/atlas/kissa', titleTr: 'Kıssa Atlası', titleEn: 'Atlas of Narratives', descTr: 'Peygamber kıssaları: kavim, dönem, tema, ibret.', descEn: 'Prophetic narratives: peoples, era, theme, lesson.', keywords: ['peygamber', 'kissa', 'kavim', 'ibret', 'nuh', 'ibrahim', 'musa', 'isa', 'yusuf', 'yunus'] },
  { route: '/atlas/kavim', titleTr: 'Kavim Atlası', titleEn: 'Atlas of Peoples', descTr: 'Kur\'an\'da bahsi geçen kavimler: Ad, Semud, Medyen, Sebe, Firavun halkı, Lut kavmi.', descEn: 'Peoples mentioned in the Quran: Ad, Thamud, Madyan, Saba, Pharaoh, Lot.', keywords: ['kavim', 'ad', 'semud', 'medyen', 'sebe', 'firavun', 'ashab', 'lut'] },
  { route: '/atlas/doga', titleTr: 'Tabiat Atlası', titleEn: 'Atlas of Nature', descTr: 'Kevnî ayetler: hayvan, bitki, gök cisimleri, bilimsel işaretler, doğa gözlemleri.', descEn: 'Cosmic verses: fauna, flora, celestial bodies, scientific signs, natural observations.', keywords: ['tabiat', 'doga', 'hayvan', 'bitki', 'gök', 'bilim', 'astronomi', 'evren'] },
  { route: '/atlas/insan-psikolojisi', titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'Kur\'an\'da nefs, kalp, korku, kaygı, iyileşme, sosyal yalnızlık.', descEn: 'Psychology in the Quran: nafs, heart, fear, anxiety, healing, isolation.', keywords: ['psikoloji', 'nefs', 'kalp', 'korku', 'kaygi', 'iyilesme', 'travma'] },
  { route: '/atlas/insan-tanimi', titleTr: 'İnsan Tanımı', titleEn: 'Definition of Human', descTr: 'İnsan nedir? Nefs, fıtrat, halife, imtihan boyutları.', descEn: 'What is a human? Nafs, fitrah, khalifah, trial dimensions.', keywords: ['insan', 'nefs', 'fitrat', 'halife', 'imtihan'] },
  { route: '/atlas/kadinlar', titleTr: 'Kadınlar Atlası', titleEn: 'Women in the Quran', descTr: 'Kur\'an\'da adı geçen ve portresi çizilen kadınlar: Meryem, Musa\'nın annesi, Firavun\'un karısı Asiye.', descEn: 'Women portrayed in the Quran: Mary, Moses\' mother, Asiya wife of Pharaoh.', keywords: ['kadin', 'meryem', 'asiye', 'sarah', 'hacer'] },
  { route: '/atlas/kiraat', titleTr: 'Kıraat Atlası', titleEn: 'Recitation Traditions', descTr: '7 Mütevatir kıraat: Nafi, İbn Kesir, Ebu Amr, İbn Amir, Asım, Hamza, Kisai.', descEn: 'The 7 canonical recitations: Nafi, Ibn Kathir, Abu Amr, Ibn Amir, Asim, Hamza, Kisai.', keywords: ['kiraat', 'tecvid', 'nafi', 'asim', 'hamza', 'okuma-turleri'] },
  { route: '/atlas/mesel', titleTr: 'Meseller Atlası', titleEn: 'Parables Atlas', descTr: 'Kur\'an\'daki mesel örnekleri: örümcek ağı, iki adam, Zulkarneyn.', descEn: 'Quranic parables: spider web, two men, Dhulqarnayn.', keywords: ['mesel', 'analoji', 'metafor', 'temsil', 'örnek'] },
  { route: '/atlas/munafik', titleTr: 'Münâfık Profili', titleEn: 'Hypocrite Profile', descTr: 'Nifak psikolojisi, klasik tefsirde münafık tipolojisi.', descEn: 'Psychology of hypocrisy, hypocrite typology in classical tafsir.', keywords: ['münafik', 'nifak', 'ikiyuzluluk'] },
  { route: '/atlas/munasebat', titleTr: 'Münâsebât Atlası', titleEn: 'Coherence Atlas', descTr: 'Sûreler ve ayetler arasındaki tematik bağlantılar.', descEn: 'Thematic connections between suras and verses.', keywords: ['münasebat', 'tenasub', 'baglanti', 'butunluk'] },
  { route: '/atlas/nefs-mertebeleri', titleTr: 'Nefs Mertebeleri', titleEn: 'Stages of the Self', descTr: 'Nefs-i emmare, levvame, mülhime, mutmainne, râzıye, marziyye, kâmile.', descEn: 'Ammara, lawwama, mulhima, mutmainna, radhiyya, mardhiyya, kamila.', keywords: ['nefs', 'mertebe', 'emmare', 'levvame', 'mutmainne', 'tasavvuf'] },
  { route: '/atlas/peygamber', titleTr: 'Peygamber Atlası', titleEn: 'Prophets Atlas', descTr: '25 peygamber: nesep zinciri, kavim, mucize, zaman/mekan haritası.', descEn: '25 prophets: genealogy, people, miracles, time/place map.', keywords: ['peygamber', 'nebi', 'resul', 'mucize', 'nesep', 'ibrahim', 'musa', 'isa', 'muhammed'] },
  { route: '/atlas/sunnetullah', titleTr: 'Sünnetullah Atlası', titleEn: 'Divine Laws Atlas', descTr: 'Allah\'ın değişmez yasaları: tekrar, sebep-sonuç, tarih döngüleri.', descEn: 'Immutable divine laws: repetition, causality, historical cycles.', keywords: ['sunnetullah', 'yasa', 'kanun', 'tekrar', 'dongu'] },
  { route: '/atlas/ibadetler', titleTr: 'İbadetler Mimarisi', titleEn: 'Architecture of Worship', descTr: 'Kur\'ani ibadet terimleri: zikir, secde, rükû, dua, oruç, zekat.', descEn: 'Quranic worship terminology: dhikr, sujud, ruku, dua, fasting, zakat.', keywords: ['ibadet', 'zikir', 'secde', 'ruku', 'namaz', 'oruc', 'zekat', 'hac'] },
  { route: '/atlas/furuk', titleTr: 'Fürûk Atlası', titleEn: 'Distinctions Atlas', descTr: 'Yakın ama farklı kavramlar: sabır-tahammül, hikmet-ilim, korku-haşyet.', descEn: 'Close but distinct concepts: sabr-tahammul, hikmah-ilm, khawf-khashyah.', keywords: ['furuk', 'ayirim', 'kavram-farki'] },

  { route: '/arac/esma-frekans', titleTr: 'Esmâ Frekans Analizi', titleEn: 'Divine Names Frequency', descTr: '99 Esmâ-i Hüsnâ: geçiş sayıları, sûre yoğunlukları, mana kümelenmeleri.', descEn: '99 names: occurrence counts, sura density, meaning clusters.', keywords: ['esma', 'isim', 'rahman', 'rahim', 'allah', 'sifat'] },
  { route: '/arac/dualar', titleTr: 'Kur\'anî Dualar', titleEn: 'Quranic Prayers', descTr: 'Kur\'an\'da geçen dua örnekleri: peygamber duaları, tematik dua koleksiyonu.', descEn: 'Prayers in the Quran: prophetic prayers, thematic collection.', keywords: ['dua', 'niyaz', 'yakariş', 'istigfar'] },
  { route: '/arac/dua-dili', titleTr: 'Dua Dili', titleEn: 'Language of Dua', descTr: 'Kur\'an dualarının dilsel yapısı: hitap, istek, muhataplık.', descEn: 'Linguistic structure of Quranic prayers: address, request, addressee.', keywords: ['dua-dili', 'hitap', 'muhatab'] },
  { route: '/arac/bilimsel-isaretler', titleTr: 'Bilimsel İşaretler', titleEn: 'Scientific Signs', descTr: 'Demir, genişleyen evren, deniz bariyeri, embriyoloji ayetleri.', descEn: 'Iron, expanding universe, ocean barrier, embryology verses.', keywords: ['bilim', 'demir', 'evren', 'embriyo', 'deniz'] },
  { route: '/arac/mukattaa', titleTr: 'Huruf-i Mukattaâ', titleEn: 'Mukattaʿāt Letters', descTr: '14 mukattaa harfi, 29 sûre açılışı, dilsel şifre.', descEn: '14 mukattaʿāt letters, 29 sura openings, linguistic cipher.', keywords: ['mukattaa', 'huruf', 'sifre', 'harfler'] },
  { route: '/arac/kiyamet', titleTr: 'Kıyâmet Sahneleri', titleEn: 'Judgment Day Scenes', descTr: 'Ölüm sonrası, berzah, hesap günü, cennet, cehennem.', descEn: 'After death, barzakh, day of reckoning, heaven, hell.', keywords: ['kiyamet', 'olum', 'ahiret', 'berzah', 'hesap'] },
  { route: '/arac/cennet-cehennem', titleTr: 'Cennet & Cehennem', titleEn: 'Heaven & Hell', descTr: 'Cennet ve cehennem tasvirleri, sahneler, kavramsal harita.', descEn: 'Descriptions of paradise and hell, scenes, conceptual map.', keywords: ['cennet', 'cehennem', 'firdevs', 'cahim'] },
  { route: '/arac/melekler', titleTr: 'Melekler', titleEn: 'Angels', descTr: 'Cebrail, Mikail, İsrafil, Azrail, hafaza melekleri.', descEn: 'Gabriel, Michael, Israfil, Azrael, guardian angels.', keywords: ['melek', 'cebrail', 'mikail', 'israfil', 'azrail'] },
  { route: '/arac/iblis-seytan', titleTr: 'İblis & Şeytan', titleEn: 'Iblis & Satan', descTr: 'İblis\'in düşüşü, vesvese kanalları, klasik tipoloji.', descEn: 'Fall of Iblis, whisper channels, classical typology.', keywords: ['iblis', 'seytan', 'vesvese', 'nifak'] },
  { route: '/arac/koruma-zinciri', titleTr: 'Kur\'an\'ın Korunması', titleEn: 'Preservation of the Quran', descTr: 'İsnad zinciri, hafaza, Birmingham elyazması, koruma metodolojisi.', descEn: 'Chain of transmission, huffaz, Birmingham manuscript, preservation.', keywords: ['koruma', 'isnad', 'hafiz', 'hifz', 'birmingham'] },
  { route: '/arac/retorik', titleTr: 'Kur\'an Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Tezad, istiare, teşbih, iltifât, belağat sanatları.', descEn: 'Antithesis, metaphor, simile, iltifāt, rhetorical arts.', keywords: ['belagat', 'retorik', 'istiare', 'tesbih', 'iltifat'] },
  { route: '/arac/retorik-sorular', titleTr: 'Retorik Sorular', titleEn: 'Rhetorical Questions', descTr: 'İstifhâm-ı inkârî, irşâdî, tevbîhî, taaccübî — 4 alt kategoride Kur\'ani sorular.', descEn: 'Istifham inkari, irshadi, tawbikhi, taʿajjubi — 4 subcategories of Quranic questions.', keywords: ['soru', 'retorik', 'istifham', 'inkari'] },
  { route: '/arac/renkler', titleTr: 'Kur\'an\'ın Renkleri', titleEn: 'Colors of the Quran', descTr: 'Kur\'an\'da geçen fiziksel ve metafizik renkler: beyaz, yeşil, kırmızı, siyah, sarı.', descEn: 'Physical and metaphysical colors: white, green, red, black, yellow.', keywords: ['renk', 'yesil', 'beyaz', 'siyah', 'kirmizi'] },
  { route: '/arac/ritim', titleTr: 'İmkansız Ritim', titleEn: 'Impossible Rhythm', descTr: 'Şiir mi düzyazı mı? 16 vezin analizi, prozodi.', descEn: 'Poetry or prose? 16 meter analysis, prosody.', keywords: ['ritim', 'vezin', 'prozodi', 'siir'] },
  { route: '/arac/halka-kompozisyon', titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Farrin (2014) çerçevesi: kürsel simetri, ayna yapıları.', descEn: 'Farrin (2014) framework: ring symmetry, mirror structures.', keywords: ['halka', 'simetri', 'ring', 'yapisal'] },
  { route: '/arac/ilk-son-kelimeler', titleTr: 'İlk-Son Kelimeler', titleEn: 'First-Last Words', descTr: 'Sûrelerin ilk ve son kelimeleri arasındaki linguistic örüntüler.', descEn: 'Linguistic patterns between first and last words of suras.', keywords: ['ilk-son', 'kelime', 'baslangic', 'bitiş'] },
  { route: '/arac/buyruklar', titleTr: 'Kur\'anî Buyruklar', titleEn: 'Quranic Commands', descTr: 'Emir kipindeki ayetler, ilahi buyruklar, imperatif dili.', descEn: 'Verses in imperative mood, divine commands.', keywords: ['emir', 'buyruk', 'imperatif'] },
  { route: '/arac/sebebi-nuzul', titleTr: 'Sebeb-i Nüzûl', titleEn: 'Occasions of Revelation', descTr: 'Ayetlerin iniş sebepleri: Ashab-ı Kiram\'ın soruları, olaylar.', descEn: 'Reasons for verse revelation: questions and events of Companions.', keywords: ['sebeb-nuzul', 'inis-sebebi', 'ashab'] },
  { route: '/arac/muhataplar', titleTr: 'Muhataplar', titleEn: 'Addressees', descTr: 'Kur\'an kimlere hitap eder? Ey iman edenler, ey insanlar, ey ehli kitap.', descEn: 'Whom does the Quran address? Believers, humanity, People of the Book.', keywords: ['muhatab', 'hitap', 'ey-iman', 'ey-insanlar'] },
  { route: '/arac/kurani-tani', titleTr: 'Kur\'an\'ı Tanı', titleEn: 'Get to Know the Quran', descTr: 'Kur\'an\'ın kısa portresi: kaç sûre, ayet, mucize, tarihçe.', descEn: 'Brief portrait of the Quran: sura count, verses, miracles, history.', keywords: ['tani', 'giris', 'temel'] },
  { route: '/arac/tekrar-anatomi', titleTr: 'Tekrarların Anatomisi', titleEn: 'Anatomy of Repetition', descTr: 'Kur\'an\'da tekrar edilen ifadeler ve hikmetleri.', descEn: 'Repeated phrases in the Quran and their wisdom.', keywords: ['tekrar', 'iterasyon', 'nakarat'] },
  { route: '/arac/alti-konu', titleTr: 'Altı Ana Konu', titleEn: 'Six Main Topics', descTr: 'Kur\'an\'ın 6 ana teması: tevhid, nübüvvet, ahiret, adalet, dua, ibadet.', descEn: 'Six main themes: tawhid, prophethood, afterlife, justice, prayer, worship.', keywords: ['ana-tema', 'tevhid', 'nubuvvet', 'ahiret'] },

  { route: '/graf/ayet', titleTr: 'Ayet Grafı 3D', titleEn: '3D Verse Graph', descTr: '6236 ayet 3D uzayda semantik komşuluk haritası (BGE-M3).', descEn: '6236 verses in 3D semantic neighborhood map (BGE-M3).', keywords: ['graf', 'ayet-baglanti', '3d', 'semantik'] },
  { route: '/graf/kavram', titleTr: 'Kavram Grafı', titleEn: 'Concept Graph', descTr: 'Kur\'anî kavramlar arasındaki bağlantılar, kategoriler, hiyerarşi.', descEn: 'Connections between Quranic concepts, categories, hierarchy.', keywords: ['kavram-baglanti', 'concept', 'hiyerarsi'] },

  { route: '/tefekkur', titleTr: 'Tefekkür Yazıları', titleEn: 'Reflection Essays', descTr: 'Felsufi\'nin uzun yazıları: sûre tahlilleri, semantik kökler, epistemoloji.', descEn: 'Long essays by Felsufi: sura analyses, semantic roots, epistemology.', keywords: ['tefekkur', 'makale', 'yazi', 'sufist', 'felsufi'] },
];
