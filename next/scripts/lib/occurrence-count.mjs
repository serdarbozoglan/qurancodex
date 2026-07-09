// Occurrence count — root-based veya searchTerms tabanlı sayım.
// Spec §5.2 — kök vs kelime formu ayrımı şeffaf sunulur.
//
// Kök tabanlı sayım: Kur'ân'daki ayetlerin `roots` field'ı üzerinden (varsa).
// Verse-graph-bgem3.json bu field'ı taşımıyor olabilir — fallback: searchTerms.
//
// SearchTerms tabanlı: Her ayet Arapça metnini normalize ederek substring match.

import { cleanArabicForDisplay } from './arabic-normalize.mjs';

export function countByRoot(verses, root) {
  // root: "ص ل و" formatında (3-4 harf, boşluk ayraç)
  const rootNorm = root.replace(/\s+/g, '');
  let count = 0;
  const hits = [];
  for (const v of verses) {
    const verseRoots = v.roots ?? [];
    if (verseRoots.some(r => String(r).replace(/\s+/g, '') === rootNorm)) {
      count++;
      hits.push({ surah: v.surah, ayah: v.ayah });
    }
  }
  return { value: count, hits, method: 'root-based' };
}

export function countBySearchTerms(verses, searchTerms) {
  // searchTerms: ["الصَّلَاة", "بِالصَّلَاة", ...]
  // Her verse'in Arapça metnini normalize edip substring match.
  const normalizedTerms = searchTerms.map(t => cleanArabicForDisplay(t));
  let count = 0;
  const hits = [];
  for (const v of verses) {
    const rawAr = v.arabic ?? v.arapca ?? v.text ?? '';
    const text = cleanArabicForDisplay(rawAr);
    if (!text) continue;
    if (normalizedTerms.some(t => t && text.includes(t))) {
      count++;
      hits.push({ surah: v.surah, ayah: v.ayah });
    }
  }
  return { value: count, hits, method: 'search-terms' };
}

// Dispatcher — occurrenceCount.method'a göre uygun fonksiyonu çağır.
export function countOccurrence(verses, spec) {
  if (!spec) return null;
  const { method, root, searchTerms } = spec;
  if (method === 'root-based' && root) {
    const r = countByRoot(verses, root);
    // Fallback: verse-graph roots taşımıyorsa 0 döner; searchTerms varsa onu dene.
    if (r.value === 0 && searchTerms?.length) {
      const s = countBySearchTerms(verses, searchTerms);
      return { ...s, method: 'search-terms-fallback', fallbackReason: 'verse-graph roots field yok' };
    }
    return r;
  }
  if (method === 'search-terms' && searchTerms) {
    return countBySearchTerms(verses, searchTerms);
  }
  return null;
}
