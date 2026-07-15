# Araçlar Audit — 2026-07-14

## Özet

| Metrik | Değer |
|---|---|
| Toplam tool | **46** |
| Kategori | `/arac` (25) · `/atlas` (15) · `/graf` (6) |
| Zayıf (≤2/5) | **21 tool** (%44) |
| Orta (3/5) | 12 tool (%25) |
| Güçlü (≥4/5) | 13 tool (%27) |

**Sonuç:** Proje "wide but shallow" durumda. Çoğu tool ToolHeader + birkaç ayet ile bitiyor. **10-15 saatlik hızlı kazanç** ile 12 zayıf tool 3-4/5'e çıkabilir.

---

## Zayıf Tool'lar (Öncelikli)

### En kritik (1/5) — Hızlı fix mümkün

| Tool | Satır | Sorun | Çözüm (1-2h) |
|---|---|---|---|
| **AltiKonu** | 117 | ToolHeader + minimal content | Hero (Nahl 16:103) + Tab (6 konu) + CTA |
| **KorumaZinciri** | 118 | Sadece giriş cümleleri | Hero + CTA → İbadetlerHub |
| **Ritim** | 133 | Ana MechMukayese eksik | Hero (26:1-4) + Tab (Şiir/Kur'an/Düzyazı) |
| **SesMimarisi** | 122 | 2 ayet ref; ses-anlam eşleşmesi eksik | Hero (Şûrâ 42:11) + Tab (Rahmet/Azap sesleri) |
| **RevelationTimeline** | 376 | Data atom, verse text eksik | Verse metnini enrich et |

### Content zayıf (1-2/5)

| Tool | Satır | Neden zayıf |
|---|---|---|
| **EsmaFrekans** | 3798 | **Paradoks:** kod uzun (heatmap logic), Hero/metodoloji eksik |
| **VerseGraph** | 3288 | 3D viz güçlü, page-UX zayıf (Hero + CTA + metodoloji eksik) |
| **AddresseeSystem** | 463 | Muhataplar kategorize var; tab yok |
| **QuranCommands** | 639 | Buyruklar veri-tabanlı, single-view |
| **DuaVerses** | 566 | SourcesCitation yok |

### Görsel eksik (CTA/Hero/Tab)

- **ConceptGraph**, **SemanticMap**, **SurahComparator**, **WordHeatmap** — Graf araçları; CTA yok
- **KadinlarAtlasi** (1612L) — 86 ayet ref ama tab yok
- **KissaAtlas** (860L) — 25+ kıssa, filtre/tab yok
- **InsanPsikolojisi** (450L) — 7 nefs mertebeleri; tab yok
- **RetorikSorular** (487L) — Erotesis kategorize; tab yok

---

## Orta Tool'lar (3/5) — 1-2h ile 4'e çıkar

Tipik: ToolHeader ✅ + 1-2 tab ✅ + minimal CTA/Src

- **DiyalogAgi** (1228L) — CTA/Src eksik
- **FurukAtlasi** (1252L) — visual hierarchy düşük
- **TarihselKanitlar** (902L) — Src eksik
- **SebebiNuzul** (1830L) — CTA eksik
- **ZamanBoyutlari** (1801L) — CTA/Src eksik
- **InsanTanimi** (410L) — CTA eksik
- **MunasebatAtlasi** (796L) — Src eksik

---

## Güçlü Tool'lar (4-5/5) — Bakım-only

Tipik: ToolHeader ✅ + Hero ✅ + 3-5+ tab ✅ + CTA ✅ + 1500L+ + 40+ ayet ref

1. **CennetCehennem** (1860L) — 65 ayet, 3+ tab
2. **Melekler** (1558L) — 45 ayet, 3+ tab
3. **KiyametSahneleri** (1423L) — 86 ayet, 4+ tab
4. **KuranYeminleri** (2653L) — 65 ayet
5. **KuranRenkleri** (3222L) — 94 ayet, 4+ tab
6. **KuranRetorigi** (1177L) — 5+ tab, focused
7. **KavimlerAtlasi** (2171L) — 92 ayet, 6+ tab
8. **BilimselIsaretler** (636L) — Src ✅
9. **DogaAtlasi** (1655L) — 55 ayet, 4+ tab
10. **MunafikProfili** (1873L) — Src ✅
11. **NefisMertebeleri** (1451L) — Src ✅
12. **DuaDili** (656L) — Src ✅
13. **SunnetullahAtlasi** (1806L) — 3 ayet, cinematic

---

## Sistemsel Eksikler (kritik)

| Pattern | Adoption | Eksik | Öncelik |
|---|---|---|---|
| ToolHeader | 43/46 (%93) | 3 (EsmaFrekans, VerseGraph, ...) | Yüksek |
| **CrossToolCTA** | 12/46 (%26) | **34 tool** | **KRİZ** |
| **SourcesCitation** | 5/46 (%11) | **41 tool** | **KRİZ** |
| Tab system | 24/46 (%52) | 22 tool | Orta |
| Verse refs (≥6) | 24/46 (%52) | 12 tool minimal | Orta |
| Cinematic Hero (§13.18) | 0/46 (0%) | TBD | Anasayfa ile birlikte |

---

## Öncelik Sıralaması — Phase Plan

### Phase 1 — Quick Wins (1-2 hafta / 12-18 saat)

12 zayıf tool → 3-4/5:
AltiKonu · KorumaZinciri · Ritim · SesMimarisi · TekrarAnatomi · Mukattaa · HalkaKompozisyon · RetorikSorular · AddresseeSystem · InsanPsikolojisi · KissaAtlas · DuaVerses

**Her tool için 1-2 saat:** Hero + 1 tab + CTA ekle.

### Phase 2 — Batch CTA (2-3 hafta / 10 saat)

34 tool'a CrossToolCTA ekle. Template-based, hızlı.

### Phase 3 — SourcesCitation Curation (3-4 hafta / 30 saat)

41 tool'a klasik tefsir kaynak listesi (Râzî, Kurtubî, Zamahşerî, Bikâî vd.).
2-3 tool/saat rate.

### Phase 4 — Tab Refactor (paralel)

15-18 tool için tab yapısı tasarımı. 25-30 saatlik.

### Phase 5 — EsmaFrekans + VerseGraph UX polish

3D/heatmap sarmalayıcı olarak ToolHeader + Hero + CTA çerçevesi. 4-6 saat.

---

## Sorular / Cevaplar

**Q: EsmaFrekans 3798 satır ama 1/5?**
A: Kod karmaşıklığı ≠ content depth. Heatmap rendering + UI state uzun, ama Hero/metodoloji/CTA yok. "Technical but not narrative."

**Q: VerseGraph niye 1/5?**
A: 3D standalone güçlü, page-UX zayıf. Hero eksik, CTA eksik.

**Q: Atlas'lar niye zayıf?**
A: Katalog-tabanlı; tab olmadan flat görünüyor. Tab refactor ile jump → Medium.

---

## Dosya Referansları

- Envanter tabloları: bu dosya
- Todo dosyası: `tasks/todo_2026-07-14_next_actions.md` (#188 audit tamamlandı)
- Patterns: `CLAUDE.md` §13.17 ToolHeader · §13.18 Hero · §13.20 CTA · §13.21 Sources

---

**Rapor:** 46 tool audit edildi · 21 zayıf · 12 orta · 13 güçlü · sistemsel eksikler CTA (%74) + Src (%89) + Tab (%44).
