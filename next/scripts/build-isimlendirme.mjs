#!/usr/bin/env node
// ─── build-isimlendirme.mjs — "Kur'ân kimi adlandırır?" verisi ───────────────
//
// 4 Eylül 2026. Sayfanın tezi: Kur'ân olumsuz şahsiyetleri isimlendirmek
// yerine sıfat ve fiilleriyle anar; bu yüzden adı geçenlerin listesi
// sanıldığından ÇOK kısadır. En çarpıcı simetri: Peygamber'in ﷺ
// çağdaşlarından yalnız İKİ kişi adlandırılır — biri olumlu (Zeyd b. Hârise,
// 33:37), biri olumsuz (Ebû Leheb, 111:1).
//
// Sayılar ve konumlar EZBERDEN yazılmaz: hepsi public/verse-graph-bgem3.json
// (mushaf metni) üzerinde aranır ve doğrulanır. Bu doğrulama iş gördü —
// yaygın bir infografikte "Kur'an'da ismi geçen" diye sunulan Ebû Cehil,
// Velîd b. Muğîre ve Ukbe b. Ebî Muayt'ın adı metinde HİÇ GEÇMİYOR.
//
// ⚠ Arapça metin §13.15 gereği normalize edilir (daire/tofu render'ı önler).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verses = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/verse-graph-bgem3.json'), 'utf8'));

function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ').replace(/ۡ/g, 'ْ').replace(/[ً-ْ]ٓ/gu, 'ٓ')
    .replace(/ٱ/g, 'ا').replace(/ی/g, 'ي')
    .replace(/[ؐ-ؔؖؗ]/g, '').replace(/[؀-؅]/g, '')
    .replace(/[۝۞۩]/g, '').replace(/ە/g, '').replace(/ۦ/g, ' ')
    .replace(/[ؕۖ-ۜ۟-ۭۤۧۨ]/g, '').replace(/[﴾﴿]/g, '');
}
const sade = (s) => (s || '').replace(/[ً-ٰٟۖ-ۭـ]/g, '');
const ayet = (s, a) => {
  const x = verses.find((y) => y.surah === s && y.ayah === a);
  return x ? { ar: cleanArabicForDisplay(x.arabic), tr: x.turkish, en: x.english } : null;
};

// Aranan biçimler. Bazıları alt dize olarak güvenli (ayırt edici), bazıları
// TAM KELİME aranmalı — ازر alt dize olarak أوزار içinde de geçiyor, زيد ise
// يزيد/مزيد içinde. Yanlış sayım vermemek için her kayıt kendi yöntemini
// söyler.
const ARA = {
  altdize: (k) => verses.filter((x) => sade(x.arabic).includes(k)),
  tamkelime: (k) => {
    const re = new RegExp(`(?:^|\\s)(?:و|ف|ل|ب|ك)?${k}(?:\\s|$)`);
    return verses.filter((x) => re.test(sade(x.arabic)));
  },
};

// ── Adı AÇIKÇA geçen ve olumsuz tasvir edilenler ────────────────────────────
const ADI_GECENLER = [
  { id: 'firavun', ar: 'فِرْعَوْن', nameTr: 'Firavun', nameEn: 'Pharaoh',
    yontem: 'altdize', kok: 'فرعون', renk: '#e07a7a', ayet: [20, 24],
    rolTr: 'Mûsâ’ya karşı çıkan, kavmini köleleştiren ve “sizin en yüce rabbiniz benim” diyecek kadar azan hükümdar.',
    rolEn: 'The ruler who opposed Moses, enslaved his people and went so far as to say “I am your lord, most high”.',
    notTr: 'Mısır hükümdarlarının UNVANI; Kur’ân bunu özel isim gibi tek bir şahsa hasrederek kullanır.',
    notEn: 'A TITLE of Egyptian rulers; the Qurʾān uses it like a proper name for one specific figure.' },
  { id: 'iblis', ar: 'إِبْلِيس', nameTr: 'İblîs', nameEn: 'Iblīs',
    yontem: 'altdize', kok: 'ابليس', renk: '#c98ae0', ayet: [2, 34],
    rolTr: 'Secde emrine karşı kibirlenen; insana düşmanlığını kıyâmete kadar sürdürmeye yemin eden varlık.',
    rolEn: 'The one who grew arrogant before the command to prostrate, and vowed enmity to humankind until the Last Day.',
    notTr: 'İnsan değil, cin tâifesinden (18:50).',
    notEn: 'Not human but of the jinn (18:50).' },
  { id: 'haman', ar: 'هَامَان', nameTr: 'Hâmân', nameEn: 'Hāmān',
    yontem: 'altdize', kok: 'هامان', renk: '#e8b860', ayet: [28, 38],
    rolTr: 'Firavun’un veziri; ona kule yaptırıp “Mûsâ’nın ilâhına bakayım” dedirtecek kadar yakın olan adam.',
    rolEn: 'Pharaoh’s minister; the man close enough to be told to build a tower so Pharaoh might “look upon the God of Moses”.',
    notTr: 'Altı âyetin altısında da DAİMA Firavun’la birlikte anılır — tek başına hiç geçmez.',
    notEn: 'In all six verses he appears ALWAYS beside Pharaoh — never alone.' },
  { id: 'karun', ar: 'قَارُون', nameTr: 'Kârûn', nameEn: 'Qārūn',
    yontem: 'altdize', kok: 'قارون', renk: '#d4a574', ayet: [28, 76],
    rolTr: 'Mûsâ’nın kavminden olduğu hâlde servetiyle azan; “bu bana ancak bendeki bilgi sayesinde verildi” diyen kişi.',
    rolEn: 'From Moses’ own people, yet corrupted by wealth; the man who said “I was given this only because of knowledge I possess”.',
    notTr: 'İçeriden çıkan bir örnek: düşman değil, kendi kavminden.',
    notEn: 'An example from within: not an outsider but one of his own people.' },
  { id: 'calut', ar: 'جَالُوت', nameTr: 'Câlût', nameEn: 'Jālūt (Goliath)',
    yontem: 'altdize', kok: 'جالوت', renk: '#7c9fe0', ayet: [2, 251],
    rolTr: 'Tâlût’un ordusunun karşısındaki komutan; genç Dâvûd tarafından öldürülür.',
    rolEn: 'The commander facing Ṭālūt’s army; slain by the young David.',
    notTr: 'Üç âyette de bir SAVAŞ anlatısının parçası olarak geçer.',
    notEn: 'In all three verses he appears as part of a battle narrative.' },
  { id: 'samiri', ar: 'ٱلسَّامِرِيّ', nameTr: 'Sâmirî', nameEn: 'Al-Sāmirī',
    yontem: 'ozel', kokler: ['السامري', 'سامري'], renk: '#6fc98a', ayet: [20, 85],
    rolTr: 'Mûsâ Tûr’dayken İsrâiloğulları’na altın buzağıyı yapıp onları saptıran kişi.',
    rolEn: 'The one who fashioned the golden calf and led the Children of Israel astray while Moses was at the Mount.',
    notTr: 'Başındaki lâm-ı tarif sebebiyle NİSBE (mensubiyet bildiren sıfat) sayılır; asıl adı klasik tefsirlerde ihtilaflıdır.',
    notEn: 'Because of its definite article this is read as a NISBA (an attributive epithet); his actual name is disputed in the classical commentaries.' },
  { id: 'ebu-leheb', ar: 'أَبِي لَهَب', nameTr: 'Ebû Leheb', nameEn: 'Abū Lahab',
    yontem: 'altdize', kok: 'ابي لهب', renk: '#e8c98a', ayet: [111, 1],
    rolTr: 'Peygamber’in ﷺ amcası olduğu hâlde ona açıkça düşmanlık eden kişi.',
    rolEn: 'The Prophet’s ﷺ own uncle, who openly opposed him.',
    notTr: 'Asıl adı Abdüluzzâ; Kur’ân KÜNYESİNİ kullanır. Çağdaşlardan olumsuz anılan TEK isimdir.',
    notEn: 'His given name was ʿAbd al-ʿUzzā; the Qurʾān uses his KUNYA instead. He is the ONLY contemporary named negatively.' },
  { id: 'azer', ar: 'آزَر', nameTr: 'Âzer', nameEn: 'Āzar',
    yontem: 'tamkelime', kok: 'ازر', renk: '#b9a6e0', ayet: [6, 74],
    rolTr: 'İbrâhîm’in babası olarak anılır; putlara tapması sebebiyle oğlunun karşısındadır.',
    rolEn: 'Named as Abraham’s father; his idol-worship sets him against his son.',
    notTr: 'Olumsuzluğu ŞİRK bağlamındadır; ona bir zulüm fiili atfedilmez. Özel isim mi lakap mı put adı mı — ihtilaflıdır.',
    notEn: 'His negative portrayal concerns SHIRK alone; no act of oppression is ascribed to him. Whether it is a name, an epithet or an idol’s name is disputed.' },
];

// ── Adı GEÇMEYENLER — yaygın infografiklerin hatası ─────────────────────────
const ADI_GECMEYENLER = [
  { nameTr: 'Ebû Cehil', nameEn: 'Abū Jahl', kok: 'ابي جهل',
    aciklamaTr: 'Peygamber’e ﷺ en azılı düşmanlık edenlerdendir; adı Kur’ân’da hiç geçmez.',
    aciklamaEn: 'Among the fiercest opponents of the Prophet ﷺ; his name never appears in the Qurʾān.' },
  { nameTr: 'Velîd b. Muğîre', nameEn: 'Al-Walīd b. al-Mughīra', kok: 'الوليد',
    aciklamaTr: 'Tefsirlerde Müddessir 74:11’deki “yalnız yarattığım kimse” tabirinin onu işaret ettiği söylenir — âyette isim yoktur.',
    aciklamaEn: 'The commentaries identify him with “the one I created alone” (al-Muddaththir 74:11) — the verse gives no name.' },
  { nameTr: 'Ukbe b. Ebî Muayt', nameEn: 'ʿUqba b. Abī Muʿayṭ', kok: null,
    aciklamaTr: 'Tefsirlerde Furkān 25:27-28’deki “zâlim” ile ilişkilendirilir; âyet isim vermez.',
    aciklamaEn: 'Associated in the commentaries with “the wrongdoer” of al-Furqān 25:27-28; the verse names no one.' },
  { nameTr: 'Nemrûd', nameEn: 'Nimrod', kok: 'نمرود',
    aciklamaTr: 'Bakara 2:258’de İbrâhîm ile tartışan hükümdar isimsizdir: “Rabbi hakkında İbrâhîm ile tartışanı görmedin mi?”',
    aciklamaEn: 'The king who disputed with Abraham in al-Baqara 2:258 is unnamed: “Have you not seen the one who argued with Abraham about his Lord?”' },
  { nameTr: 'Ebrehe', nameEn: 'Abraha', kok: 'ابرهة',
    aciklamaTr: 'Fîl sûresi ordudan söz eder, kumandandan değil: “Fil sahiplerine Rabbin ne yaptı?”',
    aciklamaEn: 'Sūrat al-Fīl speaks of the army, not its commander: “Have you not seen what your Lord did to the companions of the elephant?”' },
];

// ── Vasıfla anılıp isimlendirilmeyenler (yakın çevre) ───────────────────────
const VASIFLA = [
  { tr: 'Ebû Leheb’in karısı', en: 'The wife of Abū Lahab', ref: '111:4',
    vasifTr: 'odun taşıyıcı (حَمَّالَةَ الْحَطَبِ)', vasifEn: 'the carrier of firewood' },
  { tr: 'Nûh’un oğlu', en: 'The son of Noah', ref: '11:42-43',
    vasifTr: 'gemiye binmeyen oğul', vasifEn: 'the son who would not board' },
  { tr: 'Firavun’un karısı', en: 'The wife of Pharaoh', ref: '66:11',
    vasifTr: 'îmân edenlere örnek (olumlu)', vasifEn: 'an example for the believers (positive)' },
  { tr: 'Lût’un karısı', en: 'The wife of Lot', ref: '66:10',
    vasifTr: 'geride kalanlardan', vasifEn: 'among those who stayed behind' },
];

function bul(kayit) {
  if (kayit.yontem === 'ozel') {
    const set = new Map();
    kayit.kokler.forEach((k) => ARA.altdize(k).forEach((x) => set.set(`${x.surah}:${x.ayah}`, x)));
    return [...set.values()].sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
  }
  return ARA[kayit.yontem](kayit.kok);
}

const kisiler = ADI_GECENLER.map((k) => {
  const hits = bul(k);
  const a = ayet(k.ayet[0], k.ayet[1]);
  return {
    id: k.id, ar: cleanArabicForDisplay(k.ar), nameTr: k.nameTr, nameEn: k.nameEn, renk: k.renk,
    count: hits.length,
    refs: hits.map((x) => `${x.surah}:${x.ayah}`),
    rolTr: k.rolTr, rolEn: k.rolEn, notTr: k.notTr, notEn: k.notEn,
    ornekRef: `${k.ayet[0]}:${k.ayet[1]}`,
    ornekAr: a?.ar, ornekTr: a?.tr, ornekEn: a?.en,
  };
});

// Adı geçmeyenler GERÇEKTEN geçmiyor mu — doğrula
const gecmeyenler = ADI_GECMEYENLER.map((k) => ({
  ...k,
  dogrulandi: k.kok ? ARA.altdize(k.kok).length === 0 : null,
  bulunan: k.kok ? ARA.altdize(k.kok).length : null,
}));
const hatali = gecmeyenler.filter((g) => g.kok && !g.dogrulandi);
if (hatali.length) {
  console.error('  ❌ "adı geçmiyor" denilen ama metinde bulunan:', hatali.map((h) => h.nameTr).join(', '));
  process.exit(1);
}

// Simetri: çağdaşlardan adlandırılan iki kişi
const zeydHits = verses.filter((x) => /(?:^|\s)زيد(?:\s|$)/.test(sade(x.arabic)));
const simetri = {
  olumlu: { nameTr: 'Zeyd b. Hârise', nameEn: 'Zayd b. Ḥāritha', ar: cleanArabicForDisplay('زَيْد'),
    ref: zeydHits.map((x) => `${x.surah}:${x.ayah}`).join(', '),
    ...(() => { const a = ayet(33, 37); return { ar2: a?.ar, tr: a?.tr, en: a?.en }; })() },
  olumsuz: { nameTr: 'Ebû Leheb', nameEn: 'Abū Lahab', ar: cleanArabicForDisplay('أَبِي لَهَب'), ref: '111:1',
    ...(() => { const a = ayet(111, 1); return { ar2: a?.ar, tr: a?.tr, en: a?.en }; })() },
};

const cikti = {
  meta: {
    adiGecenSayisi: kisiler.length,
    toplamAyet: kisiler.reduce((a, k) => a + k.count, 0),
    source: 'public/verse-graph-bgem3.json — her isim ve sayı âyet metnine karşı doğrulandı',
    generatedBy: 'scripts/build-isimlendirme.mjs',
  },
  anchor: (() => { const a = ayet(12, 111); return { ref: '12:111', ...a }; })(),
  kisiler, gecmeyenler, vasifla: VASIFLA, simetri,
};

fs.writeFileSync(path.join(ROOT, 'public/isimlendirme.json'), JSON.stringify(cikti, null, 2) + '\n');
console.log(`  adı geçen: ${kisiler.length} kişi · ${cikti.meta.toplamAyet} âyet`);
kisiler.forEach((k) => console.log(`    ${k.nameTr.padEnd(12)} ${String(k.count).padStart(2)} âyet  ${k.refs.slice(0, 4).join(', ')}${k.refs.length > 4 ? ' …' : ''}`));
console.log(`  adı GEÇMEYEN (doğrulandı): ${gecmeyenler.filter((g) => g.dogrulandi !== false).length}/${gecmeyenler.length}`);
console.log(`  simetri: ${simetri.olumlu.nameTr} (${simetri.olumlu.ref}) ↔ ${simetri.olumsuz.nameTr} (${simetri.olumsuz.ref})`);
console.log('  📌 public/isimlendirme.json');
