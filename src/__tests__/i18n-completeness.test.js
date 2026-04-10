import { describe, it, expect } from 'vitest';
import tr from '../i18n/tr.json';
import en from '../i18n/en.json';

/**
 * i18n tr.json ↔ en.json anahtar eşleşmesi.
 * Bir dilde olup diğerinde olmayan anahtar → eksik çeviri → runtime'da undefined.
 */

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const k in obj) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (obj[k] !== null && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys.push(...flattenKeys(obj[k], path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

describe('i18n completeness', () => {
  const trKeys = new Set(flattenKeys(tr));
  const enKeys = new Set(flattenKeys(en));

  it('tr.json and en.json have the same key set', () => {
    const trOnly = [...trKeys].filter(k => !enKeys.has(k));
    const enOnly = [...enKeys].filter(k => !trKeys.has(k));
    expect(trOnly, `Keys only in tr.json: ${trOnly.slice(0, 10).join(', ')}`).toEqual([]);
    expect(enOnly, `Keys only in en.json: ${enOnly.slice(0, 10).join(', ')}`).toEqual([]);
  });

  it('neither file has empty string values', () => {
    const emptyTr = [...trKeys].filter(k => {
      const parts = k.split('.');
      let v = tr;
      for (const p of parts) v = v?.[p];
      return v === '';
    });
    expect(emptyTr, `Empty TR values: ${emptyTr.join(', ')}`).toEqual([]);
  });
});
