#!/usr/bin/env node
// ─── test-concierge.mjs — /sor regresyon listesi ────────────────────────────
//
// Neden var: 2026-10-21'de /sor sayfasının KENDİ önerdiği örnek soru yanlış
// cevap veriyordu ("Rahmân sûresinde aynı âyet kaç kez tekrar eder?" → sayı
// yok, nakarat âyeti listede yok, kapanış cümlesinde iç kayıt adı). Bu üç
// kusurun her biri burada kendi beklentisiyle yazılı; biri geri gelirse
// betik kırmızı yanar.
//
// Kullanım:
//   node scripts/test-concierge.mjs                 # canlı uç nokta (3100)
//   BASE_URL=http://localhost:3000 node scripts/test-concierge.mjs
//   node scripts/test-concierge.mjs --offline       # sunucu gerektirmez
//
// Canlı kip uç noktayı çağırır; uç nokta IP başına 20 istek/dakika sınırlı,
// bu yüzden liste kasıtlı olarak kısa (6 soru) ve istekler sırayla gider.
// Çevrim dışı kip yalnız ölçüm katmanını (sayı çözücü + sızıntı kalkanı)
// sınar: ağ, model ve bütçe devrede olmadığı için her yerde koşabilir.
// ────────────────────────────────────────────────────────────────────────────

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3100';
const OFFLINE = process.argv.includes('--offline');

// ── İç kayıt adı deseni. Kullanıcıya görünen metinde bunlardan biri geçerse
// §13.27 ihlali. Ön ek listesi korpus tiplerinden türetilmedi (betik korpusu
// yüklemek zorunda kalmasın diye) ama rapordaki vakayı ve kardeşlerini
// kapsıyor; gövde zorunlu olduğu için "tefsir: şöyle der" yakalanmaz.
const INTERNAL_ID = new RegExp(
  '(?<![\\w-])(?:surah-summary|article-section|atlas-[a-z-]+|sunnetullah-[a-z]+'
  + '|verse|tefsir|tool|article|pericope|elestirel|bilimsel-isaret|tarihsel-iz'
  + '|insan-yolculugu-stage|munasebat|sebeb-nuzul|dialogue|addressee|nuance-set'
  + '|neden-sonuc|kitap-kavrami|tefsir-ihtilaf|alan-disiplin|dua-peygamber'
  + '|risale-not|dua-dili-katman|kuran-sayi|iblis-adlandirma|furuk-aile)'
  + ':[A-Za-z0-9/#][^\\s,;)"\']*'
);

// Kullanıcıya görünen metin alanları. `id` ve `url` burada YOK: kimlik
// alanının kendisi iç kayıt adını taşır ve bu meşrudur, kural yalnız ekrana
// çıkan cümleleri korur.
const PROSE_FIELDS = new Set([
  'intro', 'closing', 'reason', 'headline', 'detail', 'note', 'linkLabel',
  'refLabel', 'title', 'description', 'text', 'excerpt', 'sectionTitle',
  'meaning', 'period', 'tldr', 'surahName', 'message', 'unit', 'source',
  'prophetName', 'prophet',
]);

function findLeaks(node, trail = '$', out = []) {
  if (typeof node === 'string') {
    const field = trail.split('.').pop().replace(/\[\d+\]$/, '');
    if (PROSE_FIELDS.has(field)) {
      const m = node.match(INTERNAL_ID);
      if (m) out.push({ at: trail, found: m[0], text: node });
    }
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => findLeaks(v, `${trail}[${i}]`, out));
    return out;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) findLeaks(v, `${trail}.${k}`, out);
  }
  return out;
}

// ── Regresyon listesi. Her satırda BEKLENEN şey yazılı.
const CASES = [
  {
    name: 'rahman-tekrar-tr',
    q: "Rahmân sûresinde aynı âyet kaç kez tekrar eder?",
    lang: 'tr',
    // Sayfanın kendi önerdiği örnek soru. Doğrulanmış gerçek: nakarat
    // 31 kez geçer, ilk geçişi 55:13.
    expect: {
      factValue: 31,
      factKind: 'verse-repeat',
      firstVerse: 'verse:55:13',
      introIncludes: '31',
      noInternalId: true,
    },
  },
  {
    name: 'rahman-repeat-en',
    q: 'How many times does the same verse repeat in Surah Ar-Rahman?',
    lang: 'en',
    expect: { factValue: 31, factKind: 'verse-repeat', firstVerse: 'verse:55:13', noInternalId: true },
  },
  {
    name: 'rahman-ayet-sayisi-tr',
    q: 'Rahmân sûresi kaç âyettir?',
    lang: 'tr',
    // Rahmân 78 âyet. Sayı sorusunun ikinci türü: sûrenin âyet sayısı.
    expect: { factValue: 78, factKind: 'verse-count', noInternalId: true },
  },
  {
    name: 'murselat-tekrar-tr',
    q: 'Mürselât sûresinde aynı âyet kaç kez tekrar eder?',
    lang: 'tr',
    // Aynı mekanizmanın ikinci sûrede de çalıştığının kanıtı: Mürselât'ın
    // nakaratı 10 kez, ilk geçişi 77:15.
    expect: { factValue: 10, factKind: 'verse-repeat', firstVerse: 'verse:77:15', noInternalId: true },
  },
  {
    name: 'sabir-tr',
    q: 'Sabır hakkında ayetler',
    lang: 'tr',
    // Sayı sorusu DEĞİL: ölçülmüş cevap paneli çıkmamalı, normal
    // yönlendirme davranışı sürmeli (en az bir âyet) ve metinde iç kayıt
    // adı bulunmamalı.
    expect: { noFact: true, minVerses: 1, noInternalId: true },
  },
  {
    name: 'musa-firavun-tr',
    q: "Mûsâ'nın Firavun'la karşılaşması",
    lang: 'tr',
    expect: { noFact: true, minResults: 1, noInternalId: true },
  },
];

// ── Çevrim dışı kip: ölçüm katmanını doğrudan sına
async function runOffline() {
  const { resolveDirectAnswer } = await import(
    path.join(ROOT, 'src/app/api/concierge/direct-answer.js')
  );
  const { findInternalId, sanitizeProse } = await import(
    path.join(ROOT, 'src/lib/concierge-hydrate.js')
  );
  let fail = 0;

  for (const c of CASES) {
    const fact = resolveDirectAnswer(c.q, c.lang);
    const problems = [];
    if (c.expect.noFact) {
      if (fact) problems.push(`sayı cevabı beklenmiyordu, geldi: ${fact.value}`);
    } else {
      if (!fact) problems.push('sayı cevabı gelmedi');
      else {
        if (fact.value !== c.expect.factValue) problems.push(`sayı ${fact.value}, beklenen ${c.expect.factValue}`);
        if (fact.kind !== c.expect.factKind) problems.push(`tür ${fact.kind}, beklenen ${c.expect.factKind}`);
        if (c.expect.firstVerse && fact.verseId !== c.expect.firstVerse) {
          problems.push(`âyet ${fact.verseId}, beklenen ${c.expect.firstVerse}`);
        }
        const leaks = findLeaks({ headline: fact.headline, detail: fact.detail, note: fact.note, linkLabel: fact.linkLabel, refLabel: fact.refLabel });
        if (leaks.length) problems.push(`iç kayıt adı: ${leaks[0].found}`);
      }
    }
    report(c.name, problems);
    if (problems.length) fail++;
  }

  // Sızıntı kalkanı: rapordaki cümle aynen verildiğinde atılmalı.
  const dirty = 'Sorunuza tam cevap için surah-summary:55 kaynağında sûrenin detaylı haritasını inceleyiniz.';
  const shieldProblems = [];
  if (!findInternalId(dirty)) shieldProblems.push('kalkan kimliği hiç görmedi');
  const cleaned = sanitizeProse(dirty, 'test');
  if (findInternalId(cleaned)) shieldProblems.push(`temizlenmiş metinde hâlâ kimlik var: ${cleaned}`);
  const keep = 'Rahmân sûresi 78 âyettir. Tefsir: Elmalılı bu âyeti açıklar.';
  if (sanitizeProse(keep, 'test') !== keep) shieldProblems.push('temiz cümleyi yanlışlıkla attı');
  report('sizinti-kalkani', shieldProblems);
  if (shieldProblems.length) fail++;

  return fail;
}

// ── Canlı kip: uç noktayı çağır
async function ask(q, lang) {
  const res = await fetch(`${BASE_URL}/api/concierge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, lang }),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function runLive() {
  let fail = 0;
  for (const c of CASES) {
    const problems = [];
    const { status, body } = await ask(c.q, c.lang);
    if (status !== 200 || !body) {
      problems.push(`HTTP ${status} ${body ? JSON.stringify(body).slice(0, 160) : ''}`);
      report(c.name, problems);
      fail++;
      continue;
    }
    const r = body.response || {};
    const fact = r.fact;

    if (c.expect.noFact && fact) problems.push(`sayı cevabı beklenmiyordu, geldi: ${fact.value}`);
    if (c.expect.factValue !== undefined) {
      if (!fact) problems.push('sayı cevabı gelmedi');
      else {
        if (fact.value !== c.expect.factValue) problems.push(`sayı ${fact.value}, beklenen ${c.expect.factValue}`);
        if (fact.kind !== c.expect.factKind) problems.push(`tür ${fact.kind}, beklenen ${c.expect.factKind}`);
      }
    }
    if (c.expect.firstVerse) {
      const first = r.verses?.[0]?.id;
      if (first !== c.expect.firstVerse) problems.push(`ilk âyet ${first || 'yok'}, beklenen ${c.expect.firstVerse}`);
    }
    if (c.expect.introIncludes && !String(r.intro || '').includes(c.expect.introIncludes)) {
      problems.push(`giriş cümlesinde "${c.expect.introIncludes}" yok: ${r.intro}`);
    }
    if (c.expect.minVerses && (r.verses?.length || 0) < c.expect.minVerses) {
      problems.push(`âyet sayısı ${r.verses?.length || 0} < ${c.expect.minVerses}`);
    }
    if (c.expect.minResults) {
      const total = (r.verses?.length || 0) + (r.atlases?.length || 0)
        + (r.tools?.length || 0) + (r.articles?.length || 0) + (r.tafsirs?.length || 0);
      if (total < c.expect.minResults) problems.push(`toplam sonuç ${total} < ${c.expect.minResults}`);
    }
    if (c.expect.noInternalId) {
      const leaks = findLeaks(body);
      for (const l of leaks) problems.push(`iç kayıt adı ${l.at}: ${l.found}`);
    }
    report(c.name, problems, body.cached ? 'önbellek' : 'taze');
    if (problems.length) fail++;
  }
  return fail;
}

function report(name, problems, note) {
  const tag = problems.length ? 'KIRMIZI' : 'GEÇTİ  ';
  console.log(`${tag} ${name}${note ? ` (${note})` : ''}`);
  for (const p of problems) console.log(`        · ${p}`);
}

const failures = OFFLINE ? await runOffline() : await runLive();
console.log('');
console.log(OFFLINE ? 'kip: çevrim dışı (ölçüm katmanı)' : `kip: canlı — ${BASE_URL}`);
console.log(failures ? `${failures} vaka kırmızı` : `${CASES.length + (OFFLINE ? 1 : 0)} vakanın hepsi geçti`);
process.exit(failures ? 1 : 0);
