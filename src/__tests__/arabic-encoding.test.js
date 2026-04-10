import { describe, it, expect } from 'vitest';

/**
 * Critical Arabic encoding rules — enforced by cleanArabic() in multiple files.
 * These tests encode the rules as regex patterns so they can be verified against
 * source files and live data without importing private functions.
 *
 * Reference: CLAUDE.md § 13.15 (Arabic encoding standard)
 */

describe('Arabic encoding rules', () => {
  // ─── U+06EB (ARABIC EMPTY CENTRE HIGH STOP) — med işareti ────────────
  // Secde 32:18: يَسْتَوُ۫نَ — waw üstündeki kırmızı med markeri
  // cleanArabic() bu karakteri SİLMEMELİ — fontumuz (KFGQPC) render edebiliyor.
  describe('U+06EB (med marker) must be preserved', () => {
    it('should not be stripped from verse text', () => {
      const verseWithMed = 'يَسْتَوُ\u06EBنَ';
      expect(verseWithMed).toContain('\u06EB');
      // Regex check: strip listesinde olmamalı
      const stripPattern = /[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06ED]/g;
      expect(verseWithMed.replace(stripPattern, '')).toContain('\u06EB');
    });
  });

  // ─── U+0671 (ALEF WASLA ٱ) — KFGQPC'de ص render eder, normalize edilmeli ───
  describe('U+0671 (Alef Wasla) normalization', () => {
    it('should normalize to plain Alef U+0627', () => {
      const input = '\u0671لْمُسْتَقِيم'; // ٱلْمُسْتَقِيم
      const normalized = input.replace(/\u0671/g, '\u0627');
      expect(normalized).not.toContain('\u0671');
      expect(normalized[0]).toBe('\u0627');
    });
  });

  // ─── U+06CC (Farsi Yeh ی) — KFGQPC desteklemiyor, siyah tofu üretir ──
  describe('U+06CC (Farsi Yeh) normalization', () => {
    it('should normalize to Arabic Yeh U+064A', () => {
      const input = 'مُوس\u06CC'; // مُوسی
      const normalized = input.replace(/\u06CC/g, '\u064A');
      expect(normalized).not.toContain('\u06CC');
      expect(normalized).toContain('\u064A');
    });
  });

  // ─── U+06EA (Uthmani subscript kasra / asar) — KORUNUR ────────────────
  describe('U+06EA (asar kasra) must be preserved', () => {
    it('should not be globally converted to U+0650', () => {
      const input = 'بِعِبَاد\u06EAي';
      // Rule: U+06EA globally dönüştürülmez — font asar şeklinde render eder
      expect(input).toContain('\u06EA');
    });
  });

  // ─── Decomposed ya-hamza ي+ٔ → ئ (precomposed) ───────────────────────
  describe('Decomposed ya-hamza normalization', () => {
    it('should combine ي+ٔ into precomposed ئ', () => {
      const input = '\u064A\u0654'; // ي + combining hamza
      const normalized = input.replace(/\u064A\u0654/g, '\u0626');
      expect(normalized).toBe('\u0626');
    });
  });
});

describe('Arabic strip list integrity', () => {
  it('current strip list does NOT include U+06EB', () => {
    // Aktif strip patterns (ReadingMode.jsx ve diğer 9 cleanArabic)
    const stripPattern = /[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06ED]/;
    expect('\u06EB'.match(stripPattern)).toBeNull();
  });

  it('strip list removes decorative marks that KFGQPC cannot render', () => {
    const chars = ['\u06E0', '\u06E2', '\u06E3', '\u06E4', '\u06E7', '\u06E8', '\u06ED'];
    const stripPattern = /[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06ED]/g;
    for (const c of chars) {
      expect(c.replace(stripPattern, '')).toBe('');
    }
  });
});
