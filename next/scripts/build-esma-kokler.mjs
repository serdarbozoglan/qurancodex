#!/usr/bin/env node
// ─── build-esma-kokler.mjs — 114 ismin kök haritası ─────────────────────────
//
// 5 Eylül 2026. public/esma-frekans.json'daki 114 ismin her biri için `anlam`
// ve `aciklama` alanları DOLU, ama sayfada hiç gösterilmiyordu. Kullanıcı
// tanımların kaynaklı olmasını istedi.
//
// Bu betik tanımları YAZMAZ — onlar zaten var. Yaptığı şey, tanımların
// ALTINA denetlenebilir bir zemin koymak: her ismin Arapça KÖKÜ.
//
// Kök bilgisi neden güvenli: kök, ismin yazımından okunabilir bir olgudur,
// yorum değil. Ve bu betik her kökü MEKANİK OLARAK DOĞRULAR — kökün harfleri
// ismin Arapça yazımında SIRAYLA geçmiyorsa build hata verip durur. Yani
// haritaya yanlış bir kök yazılırsa sessizce geçmez.
//
// Kapsam: mevcut esma-kokler.json 114 ismin yalnız 32'sini kapsıyordu.
// ────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isimler = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/esma-frekans.json'), 'utf8')).isimler;

// İsim → kök (üç/dört harfli). Kökler klasik sarf bilgisidir; her biri
// aşağıda ismin yazımına karşı doğrulanır.
const K = {
  'El-Hakk':'ح ق ق','El-Alîm':'ع ل م','Er-Rahîm':'ر ح م','El-Azîm':'ع ظ م','El-Azîz':'ع ز ز',
  'El-Hakîm':'ح ك م','El-Gafûr':'غ ف ر','El-Melik':'م ل ك','El-Veliyy':'و ل ي','Er-Rahmân':'ر ح م',
  'El-Hâdî':'ه د ي','El-Basîr':'ب ص ر','Es-Semî\'':'س م ع','El-Habîr':'خ ب ر','Er-Rezzâk':'ر ز ق',
  'El-Kebîr':'ك ب ر','Eş-Şehîd':'ش ه د','El-Ehad':'ا ح د','El-Kâdir':'ق د ر','El-Âhir':'ا خ ر',
  'El-Kerîm':'ك ر م','El-Gaffâr':'غ ف ر','El-Vekîl':'و ك ل','El-Ganî':'غ ن ي','El-Muğnî':'غ ن ي',
  'El-Berr':'ب ر ر','El-Hâlik':'خ ل ق','El-Hamîd':'ح م د','En-Nâfi\'':'ن ف ع','El-Halîm':'ح ل م',
  'El-Câmi\'':'ج م ع','Es-Selâm':'س ل م','El-Vâsi\'':'و س ع','Et-Tevvâb':'ت و ب','Eş-Şekûr':'ش ك ر',
  'En-Nûr':'ن و ر','El-Hakem':'ح ك م','El-Hafîz':'ح ف ظ','El-Kaviyy':'ق و ي','El-Vâlî':'و ل ي',
  'Er-Raûf':'ر ا ف','El-Bâsit':'ب س ط','El-Aliyy':'ع ل و','El-Bâis':'ب ع ث','El-Mümît':'م و ت',
  'El-Afüvv':'ع ف و','Ed-Dârr':'ض ر ر','El-Kahhâr':'ق ه ر','El-Mübdi\'':'ب د ا','El-Muîd':'ع و د',
  'El-Hayy':'ح ي ي','El-Fettâh':'ف ت ح','El-Latîf':'ل ط ف','Er-Râfi\'':'ر ف ع','El-Vâhid':'و ح د',
  'El-Mâni\'':'م ن ع','El-Bâkî':'ب ق ي','El-Adl':'ع د ل','Er-Rakîb':'ر ق ب','El-Vâris':'و ر ث',
  'El-Hasîb':'ح س ب','El-Mecîd':'م ج د','El-Mü\'min':'ا م ن','El-Vehhâb':'و ه ب','El-Vedûd':'و د د',
  'El-Metîn':'م ت ن','El-Muhyî':'ح ي ي','El-Kayyûm':'ق و م','El-Muktedir':'ق د ر','El-Müntekim':'ن ق م',
  'El-Muksit':'ق س ط','Er-Reşîd':'ر ش د','El-Kuddûs':'ق د س','El-Muiz':'ع ز ز','El-Celîl':'ج ل ل',
  'El-Muhsî':'ح ص ي','El-Muahhir':'ا خ ر','El-Evvel':'ا و ل','El-Bedî\'':'ب د ع','El-Müheymin':'ه م ن',
  'El-Cebbâr':'ج ب ر','El-Mütekebbir':'ك ب ر','El-Bâri\'':'ب ر ا','El-Musavvir':'ص و ر','El-Kâbid':'ق ب ض',
  'El-Hâfid':'خ ف ض','El-Müzill':'ذ ل ل','El-Mukît':'ق و ت','El-Mucîb':'ج و ب','Es-Samed':'ص م د',
  'Ez-Zâhir':'ظ ه ر','El-Bâtın':'ب ط ن','El-Müteâlî':'ع ل و','El-Vâcid':'و ج د','El-Mâcid':'م ج د',
  'El-Mukaddim':'ق د م','Es-Sabûr':'ص ب ر','En-Nasîr':'ن ص ر','El-Hallâk':'خ ل ق','El-Mevlâ':'و ل ي',
  'El-Fâtır':'ف ط ر',
};

// Terkip hâlindeki isimler — tek köke indirgenmez; belirleyici kelimesinin
// kökü verilir ve bu AÇIKÇA işaretlenir.
const TERKIP = {
  'Allah': null,
  'Zü\'l-Celâli ve\'l-İkrâm':'ج ل ل','Mâlikü\'l-Mülk':'م ل ك','Rabbü\'l-Âlemîn':'ر ب ب',
  'Şedîdü\'l-İkâb':'ع ق ب','Zü\'l-Fadli\'l-Azîm':'ف ض ل','Hayru\'r-Râzıkîn':'ر ز ق',
  'Erhamü\'r-Râhimîn':'ر ح م','Hayru\'l-Hâkimîn':'ح ك م','Ahkemü\'l-Hâkimîn':'ح ك م',
  'Zü\'r-Rahme':'ر ح م','Bedîu\'s-Semâvât':'ب د ع','Hayru\'l-Gâfirîn':'غ ف ر',
};

const sade = (s) => (s || '').replace(/[ً-ٰٟۖ-ۭـ]/g, '').replace(/\s/g, '');
// hemze biçimleri ve elif türevleri tek harfe indirgenir (kök eşlemesi için)
const norm = (s) => sade(s).replace(/[أإآٱ]/g, 'ا').replace(/[ؤئ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');

// Kökün harfleri, ismin yazımında SIRAYLA geçiyor mu?
//
// İlk sürüm harfleri düz aradı ve 13 ismi reddetti. Hepsi GERÇEK bir sarf
// olayıydı, harita hatası değil — kontrolün eksiğiydi:
//
//   İDGAM (şedde): çift radikal tek harfle yazılır.
//     الحق <- ح ق ق · البر <- ب ر ر · الحي <- ح ي ي · المعز <- ع ز ز
//     المذل <- ذ ل ل · الضار <- ض ر ر · رب <- ر ب ب
//   İ'LÂL (illetli kök): و / ي / ا birbirine döner ya da düşer.
//     المميت <- م و ت (و düşer) · المعيد <- ع و د (و->ي) · العلي <- ع ل و
//     المقيت <- ق و ت · المجيب <- ج و ب · المتعالي <- ع ل و
//
// Kontrol bu ikisini TANIYACAK hâle getirildi; gevşetilmedi. Sağlam
// (illetsiz) radikaller hâlâ yazımda bulunmak ZORUNDA — yanlış bir kök yine
// yakalanır. Hangi ismin hangi istisnaya dayandığı çıktıda raporlanır.
const ILLETLI = new Set(['و', 'ي', 'ا']);

function dogrula(kok, arapca) {
  const harfler = kok.split(/\s+/).filter(Boolean).map(norm);
  const metin = norm(arapca);
  const izin = [];
  let i = 0;
  for (let k = 0; k < harfler.length; k++) {
    const h = harfler[k];
    let idx = metin.indexOf(h, i);
    if (idx === -1 && k > 0 && harfler[k - 1] === h) { izin.push('idgam'); continue; }
    if (idx === -1 && ILLETLI.has(h)) {
      for (const alt of ILLETLI) {
        const j = metin.indexOf(alt, i);
        if (j !== -1) { idx = j; break; }
      }
      if (idx === -1) { izin.push('illet-dusmesi'); continue; }
      izin.push('illet-donusmesi');
    }
    if (idx === -1) return { ok: false, izin };
    i = idx + 1;
  }
  return { ok: true, izin: [...new Set(izin)] };
}

const cikti = [];
const hatalar = [];
for (const x of isimler) {
  const terkipMi = Object.prototype.hasOwnProperty.call(TERKIP, x.isim);
  const kok = terkipMi ? TERKIP[x.isim] : K[x.isim];
  if (kok === undefined) { hatalar.push(`${x.isim}: kök haritada YOK`); continue; }
  let izin = [];
  if (kok) {
    const d = dogrula(kok, x.arapca);
    if (!d.ok) {
      hatalar.push(`${x.isim}: "${kok}" koku "${sade(x.arapca)}" yaziminda sirayla gecmiyor`);
      continue;
    }
    izin = d.izin;
  }
  cikti.push({
    isim: x.isim, isimEn: x.isim_en, arapca: x.arapca,
    kok, kokArabic: kok ? kok.replace(/\s/g, '') : null,
    terkip: terkipMi && kok !== null,
    dogrulandi: kok ? true : null,
    sarfIzni: izin.length ? izin : null,
  });
}

if (hatalar.length) {
  console.error(`  ❌ ${hatalar.length} kök doğrulanamadı:`);
  hatalar.forEach((h) => console.error('     ' + h));
  process.exit(1);
}

const kokSayisi = new Set(cikti.filter((c) => c.kok).map((c) => c.kok)).size;
fs.writeFileSync(path.join(ROOT, 'public/esma-kok-haritasi.json'),
  JSON.stringify({
    meta: {
      isimSayisi: cikti.length,
      kokluIsim: cikti.filter((c) => c.kok).length,
      farkliKok: kokSayisi,
      terkipIsim: cikti.filter((c) => c.terkip).length,
      dogrulama: 'her kökün harfleri, ismin Arapça yazımında sırayla geçtiği MEKANİK olarak doğrulandı; geçmezse build durur',
      generatedBy: 'scripts/build-esma-kokler.mjs',
    },
    isimler: cikti,
  }, null, 2) + '\n');

console.log(`  ${cikti.length} isim · ${cikti.filter((c) => c.kok).length} köklü · ${kokSayisi} farklı kök · ${cikti.filter((c) => c.terkip).length} terkip`);
console.log(`  dogrulama: ${cikti.filter((c) => c.dogrulandi).length}/${cikti.filter((c) => c.kok).length} kok yazimda sirayla bulundu`);
const izinli = cikti.filter((c) => c.sarfIzni);
console.log(`  sarf istisnasina dayanan: ${izinli.length}`);
izinli.forEach((c) => console.log(`     ${c.isim.padEnd(20)} ${c.kok.padEnd(9)} ${c.sarfIzni.join(', ')}`));
console.log('  📌 public/esma-kok-haritasi.json');
