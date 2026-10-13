#!/usr/bin/env node
// ─── assert-fresh-server — canlı denetimlerden ÖNCE sunucu sağlaması ───────
//
// NE DOĞRULAR: sunucunun verdiği HTML'in referans ettiği her `/_next/static/`
// varlığı gerçekten sunuluyor mu. Ayakta duran bir süreç, artık diskte
// olmayan chunk adlarını referans eden HTML sunduğunda bu denetim kırmızı
// yanar.
//
// NEDEN EKLENDİ: 11-12 Ekim 2026'da kontrast denetimi 12 sayfanın 11'inde
// "HATA" alıp yalnız 1 sayfayı ölçtüğü hâlde "gerçek ihlal: 0 · taban
// korundu" diye YEŞİL rapor verdi. Kapı hiçbir şey ölçmeden geçti. Sunucuyu
// yeniden başlatınca aynı denetim 12/12 temiz ölçtü. Yani sorun sayfalarda
// değil sunucu sürecindeydi; hata ise ÖLÇÜMÜN KENDİSİNİ sessizce boşa
// çıkardı. Bu betik o yanlış yeşili baştan keser.
//
// ⚠ NE DOĞRULAMAZ: hangi süreç bozuksa onun SEBEBİNİ. Açıkça denendi ve
// ÇÜRÜTÜLDÜ: "`next start` açıkken `npm run build` çalıştırmak sunucuyu
// bozar" varsayımı. Kaynak dosyası değiştirilip sunucu ayaktayken yeniden
// derlendi; sunucu yeni chunk adlarını sunmaya devam etti, 80/80 varlık
// erişilebilirdi. Next.js 16 manifesti istek anında okuyor. Yukarıdaki
// vakanın mekanizması bu ortamda İZOLE EDİLEMEDİ — bilinen tek kesin
// tetikleyici, portu tutan ESKİ bir sürecin (EADDRINUSE yüzünden yenisi hiç
// başlamaz) artık var olmayan chunk'ları referans etmesi. Betik sebebi değil
// BELİRTİYİ ölçer; teşhis için yeterli, açıklama olarak değil.
//
//   node scripts/assert-fresh-server.mjs          # /tr ve /en
//   BASE_URL=http://localhost:3210 node scripts/assert-fresh-server.mjs
// ────────────────────────────────────────────────────────────────────────────

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ROUTES = ['/tr', '/en'];

let bad = 0;
let checked = 0;
let unreachable = false;

for (const r of ROUTES) {
  let html;
  try {
    const res = await fetch(BASE + r);
    if (!res.ok) { console.log(`  ✗ ${r} → HTTP ${res.status}`); bad++; continue; }
    html = await res.text();
  } catch (e) {
    console.log(`  ✗ ${r} → sunucuya ulaşılamadı (${e.message})`);
    unreachable = true;
    bad++;
    continue;
  }

  const assets = [...new Set([...html.matchAll(/["'(](\/_next\/static\/[^"')]+)["')]/g)].map((m) => m[1]))];
  for (const a of assets) {
    checked++;
    try {
      const res = await fetch(BASE + a, { method: 'HEAD' });
      if (!res.ok) { console.log(`  ✗ ${r} → ${a} HTTP ${res.status}`); bad++; }
    } catch {
      console.log(`  ✗ ${r} → ${a} istek başarısız`);
      bad++;
    }
  }
}

console.log(`\n─── SUNUCU TAZELİĞİ ${'─'.repeat(42)}`);
if (!bad) {
  console.log(`  ✓ ${checked} statik varlık sunuluyor — sunucu bu derlemeyle uyumlu\n`);
  process.exit(0);
}
if (unreachable) {
  console.log(`  ✗ ${BASE} yanıt vermiyor — canlı denetimler çalışan bir sunucu ister.`);
  console.log('      npm run build && npm run start\n');
} else {
  console.log(`  ✗ ${bad} varlık eksik (${checked} denendi).`);
  console.log('    Ayaktaki sunucu bu derlemeye ait DEĞİL: `next start` açıkken');
  console.log('    `npm run build` çalıştırılmış. Canlı denetimler bu hâlde yanlış');
  console.log('    sonuç verir. Sunucuyu yeniden başlat:');
  console.log('      lsof -ti:3000 | xargs kill -9 && npm run start\n');
}
process.exit(1);
