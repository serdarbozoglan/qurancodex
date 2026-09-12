// ─── Rota → disiplin haritası ────────────────────────────────────────────────
// "Alanına Göre Keşfet" için araç rotalarının disiplinlere eşlenmesi. İlk id
// BİRİNCİL alandır; sonrakiler ikincil. Kural (taksonomi v2, gpt-6-astra
// REVIEW #1): uygunsa en fazla 3; zorunlu değil; başlık benzerliğine değil
// içeriğin gerçek kapsamına göre. Etiket = GEZİNME METADATASI, âyet anlamına
// delil DEĞİL. Bu harita ayrıca gpt-6-astra REVIEW #2'den geçer.
//
// gpt-6-astra düzeltmeleri uygulandı: Muhataplar→Liderlik (zayıf) kaldırıldı;
// Münâfık/İblis→Psikoloji ikincil; Kurban→İktisat düşürüldü; Fürûk→Hukuk
// (genel kavram aracı) kaldırıldı; Zaman Boyutları fizik/kozmolojiye zorlanmadı.

export const DISCIPLINE_MAP = {
  '/atlas/kissa':             ['tarih-medeniyet', 'sosyoloji-toplum'],
  '/atlas/kavim':             ['sosyoloji-toplum', 'tarih-medeniyet'],
  '/atlas/doga':              ['tabiat-afak'],
  '/atlas/insan-psikolojisi': ['psikoloji-nefs'],
  '/atlas/insan-tanimi':      ['psikoloji-nefs', 'iman-itikad'],
  '/atlas/kadinlar':          ['tarih-medeniyet'],
  '/atlas/kiraat':            ['kuran-ilimleri'],
  '/atlas/mesel':             ['dil-belagat'],
  '/atlas/munafik':           ['ahlak-karakter', 'psikoloji-nefs'],
  '/atlas/munasebat':         ['kuran-ilimleri', 'dil-belagat'],
  '/atlas/nefs-mertebeleri':  ['psikoloji-nefs'],
  '/atlas/peygamber':         ['tarih-medeniyet', 'liderlik-yonetim'],
  '/atlas/sunnetullah':       ['sosyoloji-toplum'],
  '/atlas/ibadetler':         ['maneviyat-ibadet'],
  '/atlas/ibadetler/namaz':   ['maneviyat-ibadet'],
  '/atlas/ibadetler/oruc':    ['maneviyat-ibadet', 'ahlak-karakter'],
  '/atlas/ibadetler/zekat':   ['maneviyat-ibadet', 'iktisat-ticaret'],
  '/atlas/ibadetler/hac':     ['maneviyat-ibadet'],
  '/atlas/ibadetler/kurban':  ['maneviyat-ibadet'],
  '/atlas/ibadetler/tovbe':   ['maneviyat-ibadet', 'ahlak-karakter'],
  '/atlas/ibadetler/zikir':   ['maneviyat-ibadet'],
  '/atlas/furuk':             ['dil-belagat'],
  '/atlas/fatiha':            ['dil-belagat', 'maneviyat-ibadet'],
  '/arac/esma-frekans':       ['dil-belagat', 'iman-itikad'],
  '/arac/dualar':             ['maneviyat-ibadet'],
  '/arac/dua-dili':           ['maneviyat-ibadet', 'dil-belagat'],
  '/arac/bilimsel-isaretler': ['tabiat-afak'],
  '/arac/mukattaa':           ['dil-belagat'],
  '/arac/kiyamet':            ['iman-itikad', 'maneviyat-ibadet'],
  '/atlas/ahiret-yolculugu':  ['iman-itikad', 'maneviyat-ibadet'],
  '/atlas/insan-yolculugu':   ['psikoloji-nefs', 'maneviyat-ibadet'],
  '/arac/yakin-anlamli-nuanslar': ['dil-belagat', 'psikoloji-nefs'],
  '/arac/cennet-cehennem':    ['iman-itikad', 'maneviyat-ibadet'],
  '/arac/melekler':           ['iman-itikad'],
  '/arac/iblis-seytan':       ['iman-itikad', 'psikoloji-nefs'],
  '/arac/koruma-zinciri':     ['tarih-medeniyet', 'kuran-ilimleri'],
  '/arac/retorik':            ['dil-belagat'],
  '/arac/retorik-sorular':    ['dil-belagat'],
  '/arac/renkler':            ['dil-belagat'],
  '/arac/ritim':              ['dil-belagat'],
  '/arac/halka-kompozisyon':  ['dil-belagat'],
  '/arac/ilk-son-kelimeler':  ['dil-belagat'],
  '/arac/buyruklar':          ['ahlak-karakter', 'adalet-hukuk'],
  '/arac/sebebi-nuzul':       ['kuran-ilimleri', 'tarih-medeniyet'],
  '/arac/muhataplar':         ['dil-belagat', 'sosyoloji-toplum'],
  '/arac/kurani-tani':        ['iman-itikad'],
  '/arac/tekrar-anatomi':     ['dil-belagat'],
  '/arac/alti-konu':          ['iman-itikad'],
  '/graf/ayet':               ['dil-belagat', 'kuran-ilimleri'],
  '/graf/kavram':             ['dil-belagat', 'kuran-ilimleri'],
  '/arac/ses-mimarisi':       ['dil-belagat'],
  '/arac/tarihsel-kanitlar':  ['tarih-medeniyet'],
  '/arac/zaman-boyutlari':    ['iman-itikad'],
  '/arac/yeminler':           ['dil-belagat'],
  '/arac/neden-sonuc':        ['ahlak-karakter', 'sosyoloji-toplum'],
  '/arac/kitap-kavrami':      ['kuran-ilimleri', 'iman-itikad'],
  '/arac/elestirel-cerceve':  ['iman-itikad', 'adalet-hukuk'],
  '/arac/isimlendirme':       ['dil-belagat'],
  '/arac/tefsir-ihtilaflari': ['kuran-ilimleri'],
  '/graf/kelime-isi':         ['dil-belagat'],
  '/graf/semantik':           ['dil-belagat'],
  '/graf/zaman':              ['kuran-ilimleri'],
  '/graf/karsilastir':        ['kuran-ilimleri', 'dil-belagat'],
  '/graf/diyalog':            ['dil-belagat'],
};

// disiplin id → o disipline düşen araç rotaları (birincil/ikincil ayırmadan)
export function routesForDiscipline(disciplineId) {
  return Object.entries(DISCIPLINE_MAP)
    .filter(([, ids]) => ids.includes(disciplineId))
    .map(([route]) => route);
}
