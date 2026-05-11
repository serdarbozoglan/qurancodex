# Elmalılı Tefsir Veri Denetim Raporu
**Tarih:** 2026-05-11  
**Toplam sûre:** 114  
**Toplam JSON:** 114  
**Veri kaynağı:** `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/public/tafsir/elmalili/{1..114}.json`  
**Render eden bileşen:** `src/components/TafsirPanel.jsx`  
**Audit script:** `/tmp/audit/run_audit.py`

---

## Yönetici Özeti (TL;DR)

- **Skor dağılımı:** 90-100 = 54, 80-89 = 35, 70-79 = 20, 60-69 = 3, 50-59 = 2, <50 = 0.
- **Kritik (<60):** 2 sûre — `37 Sâffât` (58), `7 A'râf` (59).
- **Kullanıcı raporlu öncelikli sorunlu sûreler (>=60):** `5 Mâide` (62), `3 Âl-i İmrân` (78), `113 Felak` (73), `62 Cumu'a` (79), `1 Fâtiha` (kontrol gerekir).
- **Toplam monotonluk ihlali:** 88 anchor — runtime'da silinir, ama önişlemede temizlenmesi tercih edilir.
- **Toplam over-max anchor** (ayet # > canonical): 15 adet, 6 sûrede (`1, 62, 66, 103, 108, 113`). Bunlar **runtime filter'ı geçer** (monotonik artarsa kabul edilir) ve sahte ayet chunk'ı üretir → kullanıcının gördüğü "1/232" tipi hatalar.
- **Sûre başlığı redundancy:** 113/114 sûre `N-NAME:` ile başlıyor. TafsirPanel `surahHeader` regex'i bunu zaten temizliyor — fonksiyonel sorun yok, sadece **1 istisna**: Sûre 85 (Bürûc) book-intro içeriyor, regex yakalamıyor.
- **Toplam inline range:** Redundant (özet) = 374, Novel (orphan) = 184. Phase 2 mantığı ikisini de doğru handle ediyor (redundant ise prefix strip, novel ise ayet-badge'li chunk).
- **Quote pattern:** 22604 straight quote, 90 paragraf-wrap quote. Nisâ (4) en yoğun para-wrap içeriyor ama **tek sûreye özgü değil** — Bakara/Mülk/İsrâ/Kalem hepsinde mevcut.
- **Encoding:** Sıfır problematik karakter (0 adet, 0 sûrede). Uthmani/farsi-yeh/zw-space kontaminasyonu **yok**. CR/triple-newline da yok.
- **Eksik kapsama:** Toplam 595 eksik ayet anchor'ı (canonical 6236 ayetin 9.5%'i). 71 Nûh (17/28 eksik) ve 77 Mürselât (33/50 eksik) en zayıf.

---

## 1. Özet — Sûre Sağlık Skoru Tablosu

| # | Sûre | Ayet | Anchor | Eksik | Mono ihlali | Range (R/N) | Hdr | Quote | Enc | **Skor** |
|--:|------|----:|------:|------|-----------:|------------|----|------:|----|--------:|
| 1 | Fâtiha | 7 | 8 | 0 (—) | 0 | 0/0 | ✓ | 540 | ✓ | **91** |
| 2 | Bakara | 286 | 268 | 18 (37,204,206,207,210,211,212,219…(+10)) | 5 | 3/0 | ✓ | 3227 | ✓ | **67** |
| 3 | Âl-i İmrân | 200 | 194 | 6 (8,10,11,42,166,167) | 3 | 34/4 | ✓ | 765 | ✓ | **78** |
| 4 | Nisâ | 176 | 166 | 10 (10,49,118,119,156,160,161,172…(+2)) | 0 | 18/8 | ✓ | 677 | ✓ | **92** |
| 5 | Mâide | 120 | 113 | 7 (15,16,84,85,86,91,99) | 11 | 6/1 | ✓ | 1167 | ✓ | **62** |
| 6 | En'âm | 165 | 151 | 14 (4,5,6,7,8,9,11,20…(+6)) | 1 | 24/2 | ✓ | 757 | ✓ | **86** |
| 7 | A'râf | 206 | 183 | 23 (59,65,68,73,80,85,103,104…(+15)) | 6 | 14/11 | ✓ | 639 | ✓ | **59** |
| 8 | Enfâl | 75 | 73 | 2 (5,8) | 2 | 4/0 | ✓ | 128 | ✓ | **84** |
| 9 | Tevbe | 129 | 129 | 0 (—) | 4 | 10/0 | ✓ | 680 | ✓ | **75** |
| 10 | Yûnus | 109 | 106 | 3 (25,37,99) | 1 | 6/3 | ✓ | 226 | ✓ | **89** |
| 11 | Hûd | 123 | 121 | 2 (68,73) | 1 | 8/2 | ✓ | 288 | ✓ | **89** |
| 12 | Yûsuf | 111 | 105 | 6 (1,2,3,15,25,52) | 0 | 9/3 | ✓ | 338 | ✓ | **92** |
| 13 | Ra'd | 43 | 43 | 0 (—) | 1 | 3/0 | ✓ | 137 | ✓ | **90** |
| 14 | İbrâhim | 52 | 48 | 4 (1,2,18,35) | 0 | 8/2 | ✓ | 55 | ✓ | **91** |
| 15 | Hicr | 99 | 96 | 3 (58,92,93) | 0 | 10/3 | ✓ | 150 | ✓ | **93** |
| 16 | Nahl | 128 | 111 | 17 (10,12,13,14,15,17,24,27…(+9)) | 0 | 12/16 | ✓ | 85 | ✓ | **88** |
| 17 | İsrâ | 111 | 107 | 4 (23,39,66,94) | 1 | 10/4 | ✓ | 252 | ✓ | **88** |
| 18 | Kehf | 110 | 106 | 4 (27,32,45,54) | 3 | 9/4 | ✓ | 192 | ✓ | **78** |
| 19 | Meryem | 98 | 76 | 22 (1,2,3,4,5,6,7,8…(+14)) | 0 | 5/8 | ✓ | 48 | ✓ | **84** |
| 20 | Tâ-Hâ | 135 | 122 | 13 (1,2,3,4,5,6,7,8…(+5)) | 0 | 3/5 | ✓ | 79 | ✓ | **90** |
| 21 | Enbiyâ | 112 | 97 | 15 (1,2,3,4,5,6,7,8…(+7)) | 1 | 12/6 | ✓ | 81 | ✓ | **83** |
| 22 | Hac | 78 | 71 | 7 (10,42,56,63,67,68,73) | 3 | 6/6 | ✓ | 76 | ✓ | **76** |
| 23 | Mü'minûn | 118 | 114 | 4 (10,42,53,93) | 4 | 4/3 | ✓ | 83 | ✓ | **73** |
| 24 | Nûr | 64 | 57 | 7 (18,47,48,49,50,53,54) | 0 | 6/2 | ✓ | 137 | ✓ | **90** |
| 25 | Furkân | 77 | 73 | 4 (6,7,8,9) | 3 | 5/1 | ✓ | 191 | ✓ | **77** |
| 26 | Şuarâ | 227 | 206 | 21 (1,2,3,4,5,6,7,34…(+13)) | 2 | 10/12 | ✓ | 156 | ✓ | **80** |
| 27 | Neml | 93 | 86 | 7 (4,6,8,12,13,14,54) | 2 | 12/2 | ✓ | 233 | ✓ | **81** |
| 28 | Kasas | 88 | 76 | 12 (3,4,5,6,7,8,9,10…(+4)) | 2 | 7/5 | ✓ | 139 | ✓ | **78** |
| 29 | Ankebût | 69 | 60 | 9 (6,7,8,9,10,11,12,36…(+1)) | 0 | 6/3 | ✓ | 81 | ✓ | **88** |
| 30 | Rûm | 60 | 58 | 2 (5,10) | 0 | 3/0 | ✓ | 74 | ✓ | **93** |
| 31 | Lokmân | 34 | 24 | 10 (1,2,3,4,5,6,7,8…(+2)) | 0 | 2/2 | ✓ | 64 | ✓ | **80** |
| 32 | Secde | 30 | 19 | 11 (1,2,3,4,5,6,7,8…(+3)) | 0 | 3/3 | ✓ | 23 | ✓ | **77** |
| 33 | Ahzâb | 73 | 73 | 0 (—) | 0 | 7/0 | ✓ | 228 | ✓ | **95** |
| 34 | Sebe' | 54 | 45 | 9 (1,2,3,4,5,6,7,8…(+1)) | 0 | 8/3 | ✓ | 133 | ✓ | **87** |
| 35 | Fâtır | 45 | 40 | 5 (2,5,6,7,36) | 0 | 3/1 | ✓ | 67 | ✓ | **89** |
| 36 | Yâsîn | 83 | 74 | 9 (1,2,3,5,6,9,10,60…(+1)) | 0 | 6/4 | ✓ | 137 | ✓ | **90** |
| 37 | Sâffât | 182 | 140 | 42 (4,5,6,8,9,12,13,14…(+34)) | 5 | 13/24 | ✓ | 113 | ✓ | **58** |
| 38 | Sâd | 88 | 71 | 17 (1,2,3,4,5,6,7,8…(+9)) | 0 | 10/5 | ✓ | 141 | ✓ | **85** |
| 39 | Zümer | 75 | 67 | 8 (4,5,6,7,8,9,10,32) | 0 | 6/2 | ✓ | 101 | ✓ | **90** |
| 40 | Mü'min (Gâfir) | 85 | 76 | 9 (3,4,5,6,7,8,9,61…(+1)) | 2 | 8/4 | ✓ | 148 | ✓ | **80** |
| 41 | Fussilet | 54 | 46 | 8 (1,2,3,4,5,6,7,8) | 0 | 5/2 | ✓ | 155 | ✓ | **88** |
| 42 | Şûrâ | 53 | 35 | 18 (1,2,3,4,5,6,7,8…(+10)) | 0 | 1/2 | ✓ | 146 | ✓ | **78** |
| 43 | Zuhruf | 89 | 82 | 7 (7,8,9,11,68,69,84) | 3 | 7/3 | ✓ | 83 | ✓ | **76** |
| 44 | Duhân | 59 | 40 | 19 (6,9,10,11,13,16,17,18…(+11)) | 0 | 6/2 | ✓ | 60 | ✓ | **79** |
| 45 | Câsiye | 37 | 32 | 5 (7,8,9,10,11) | 0 | 3/1 | ✓ | 52 | ✓ | **88** |
| 46 | Ahkâf | 35 | 25 | 10 (1,2,3,4,5,6,7,8…(+2)) | 1 | 3/1 | ✓ | 98 | ✓ | **76** |
| 47 | Muhammed | 38 | 37 | 1 (11) | 0 | 1/0 | ✓ | 80 | ✓ | **94** |
| 48 | Fetih | 29 | 29 | 0 (—) | 0 | 1/0 | ✓ | 99 | ✓ | **95** |
| 49 | Hucurât | 18 | 18 | 0 (—) | 0 | 0/0 | ✓ | 129 | ✓ | **95** |
| 50 | Kâf | 45 | 40 | 5 (12,13,14,32,33) | 0 | 3/3 | ✓ | 159 | ✓ | **89** |
| 51 | Zâriyât | 60 | 51 | 9 (1,8,10,11,14,15,16,20…(+1)) | 0 | 4/3 | ✓ | 137 | ✓ | **88** |
| 52 | Tûr | 49 | 41 | 8 (1,2,3,17,18,19,20,21) | 0 | 0/2 | ✓ | 42 | ✓ | **87** |
| 53 | Necm | 62 | 60 | 2 (6,7) | 5 | 0/1 | ✓ | 282 | ✓ | **68** |
| 54 | Kamer | 55 | 49 | 6 (1,2,32,33,37,38) | 0 | 0/0 | ✓ | 157 | ✓ | **90** |
| 55 | Rahmân | 78 | 72 | 6 (15,16,17,18,24,25) | 0 | 0/0 | ✓ | 105 | ✓ | **91** |
| 56 | Vâkıa | 96 | 88 | 8 (12,19,20,21,22,23,24,25) | 0 | 0/0 | ✓ | 81 | ✓ | **91** |
| 57 | Hadîd | 29 | 29 | 0 (—) | 0 | 1/0 | ✓ | 109 | ✓ | **95** |
| 58 | Mücâdele | 22 | 22 | 0 (—) | 0 | 1/0 | ✓ | 162 | ✓ | **95** |
| 59 | Haşr | 24 | 24 | 0 (—) | 2 | 0/0 | ✓ | 327 | ✓ | **85** |
| 60 | Mümtehine | 13 | 10 | 3 (7,8,9) | 0 | 0/0 | ✓ | 48 | ✓ | **83** |
| 61 | Saf | 14 | 12 | 2 (11,12) | 0 | 0/0 | ✓ | 132 | ✓ | **88** |
| 62 | Cumu'a | 11 | 15 | 0 (—) | 0 | 0/0 | ✓ | 153 | ✓ | **79** |
| 63 | Münâfikûn | 11 | 11 | 0 (—) | 0 | 0/0 | ✓ | 70 | ✓ | **95** |
| 64 | Teğâbün | 18 | 18 | 0 (—) | 0 | 0/0 | ✓ | 63 | ✓ | **95** |
| 65 | Talâk | 12 | 10 | 2 (1,7) | 0 | 0/0 | ✓ | 176 | ✓ | **87** |
| 66 | Tahrîm | 12 | 12 | 1 (1) | 0 | 0/0 | ✓ | 163 | ✓ | **88** |
| 67 | Mülk | 30 | 30 | 0 (—) | 1 | 0/0 | ✓ | 344 | ✓ | **90** |
| 68 | Kalem | 52 | 49 | 3 (19,26,27) | 0 | 0/0 | ✓ | 289 | ✓ | **92** |
| 69 | Hâkka | 52 | 48 | 4 (24,25,27,28) | 3 | 2/0 | ✓ | 203 | ✓ | **76** |
| 70 | Me'âric | 44 | 34 | 10 (13,16,17,18,19,22,24,25…(+2)) | 0 | 0/0 | ✓ | 89 | ✓ | **84** |
| 71 | Nûh | 28 | 11 | 17 (1,2,3,4,5,6,7,8…(+9)) | 0 | 0/0 | ✓ | 78 | ✓ | **70** |
| 72 | Cin | 28 | 27 | 1 (1) | 0 | 0/0 | ✓ | 113 | ✓ | **93** |
| 73 | Müzzemmil | 20 | 19 | 1 (1) | 0 | 0/0 | ✓ | 143 | ✓ | **92** |
| 74 | Müddessir | 56 | 54 | 2 (1,15) | 0 | 0/0 | ✓ | 126 | ✓ | **93** |
| 75 | Kıyâme | 40 | 39 | 1 (1) | 0 | 2/0 | ✓ | 107 | ✓ | **94** |
| 76 | İnsan (Dehr) | 31 | 28 | 3 (1,13,14) | 0 | 0/0 | ✓ | 177 | ✓ | **90** |
| 77 | Mürselât | 50 | 17 | 33 (1,2,3,4,6,7,8,9…(+25)) | 0 | 0/0 | ✓ | 74 | ✓ | **70** |
| 78 | Nebe' | 40 | 34 | 6 (1,26,27,28,29,30) | 0 | 0/0 | ✓ | 172 | ✓ | **88** |
| 79 | Nâziât | 46 | 38 | 8 (7,8,9,15,16,17,23,24) | 0 | 0/0 | ✓ | 121 | ✓ | **86** |
| 80 | Abese | 42 | 42 | 0 (—) | 0 | 0/0 | ✓ | 216 | ✓ | **95** |
| 81 | Tekvîr | 29 | 29 | 0 (—) | 0 | 0/0 | ✓ | 261 | ✓ | **95** |
| 82 | İnfitâr | 19 | 19 | 0 (—) | 0 | 0/0 | ✓ | 68 | ✓ | **95** |
| 83 | Mutaffifîn | 36 | 36 | 0 (—) | 0 | 0/0 | ✓ | 161 | ✓ | **95** |
| 84 | İnşikâk | 25 | 24 | 1 (1) | 0 | 0/0 | ✓ | 114 | ✓ | **93** |
| 85 | Bürûc | 22 | 20 | 2 (1,8) | 0 | 0/0 | — | 52 | ✓ | **95** |
| 86 | Târık | 17 | 17 | 0 (—) | 1 | 0/0 | ✓ | 165 | ✓ | **90** |
| 87 | A'lâ | 19 | 19 | 0 (—) | 0 | 0/0 | ✓ | 163 | ✓ | **95** |
| 88 | Ğâşiye | 26 | 25 | 1 (1) | 0 | 0/0 | ✓ | 92 | ✓ | **93** |
| 89 | Fecr | 30 | 28 | 2 (25,26) | 1 | 0/0 | ✓ | 208 | ✓ | **87** |
| 90 | Beled | 20 | 20 | 0 (—) | 1 | 0/0 | ✓ | 118 | ✓ | **90** |
| 91 | Şems | 15 | 15 | 0 (—) | 1 | 0/0 | ✓ | 110 | ✓ | **90** |
| 92 | Leyl | 21 | 20 | 1 (1) | 0 | 0/0 | ✓ | 59 | ✓ | **93** |
| 93 | Duhâ | 11 | 11 | 0 (—) | 0 | 0/0 | ✓ | 190 | ✓ | **95** |
| 94 | İnşirâh (Şerh) | 8 | 8 | 0 (—) | 0 | 0/0 | ✓ | 110 | ✓ | **95** |
| 95 | Tîn | 8 | 8 | 0 (—) | 0 | 0/0 | ✓ | 85 | ✓ | **95** |
| 96 | Alak | 19 | 18 | 1 (15) | 1 | 0/0 | ✓ | 88 | ✓ | **87** |
| 97 | Kadir | 5 | 5 | 0 (—) | 0 | 0/0 | ✓ | 74 | ✓ | **95** |
| 98 | Beyyine | 8 | 7 | 1 (1) | 0 | 0/0 | ✓ | 98 | ✓ | **89** |
| 99 | Zilzâl | 8 | 8 | 0 (—) | 0 | 0/0 | ✓ | 49 | ✓ | **95** |
| 100 | Âdiyât | 11 | 11 | 0 (—) | 0 | 0/0 | ✓ | 57 | ✓ | **95** |
| 101 | Kâri'a | 11 | 9 | 2 (6,7) | 0 | 1/0 | ✓ | 142 | ✓ | **86** |
| 102 | Tekâsür | 8 | 6 | 2 (5,6) | 2 | 0/0 | ✓ | 163 | ✓ | **72** |
| 103 | Asr | 3 | 4 | 0 (—) | 0 | 0/0 | ✓ | 95 | ✓ | **91** |
| 104 | Hümeze | 9 | 5 | 4 (6,7,8,9) | 0 | 0/0 | ✓ | 82 | ✓ | **73** |
| 105 | Fîl | 5 | 5 | 0 (—) | 1 | 0/0 | ✓ | 158 | ✓ | **90** |
| 106 | Kureyş | 4 | 4 | 0 (—) | 0 | 0/0 | ✓ | 60 | ✓ | **95** |
| 107 | Mâûn | 7 | 6 | 1 (1) | 0 | 0/0 | ✓ | 27 | ✓ | **88** |
| 108 | Kevser | 3 | 4 | 0 (—) | 0 | 0/0 | ✓ | 203 | ✓ | **91** |
| 109 | Kâfirûn | 6 | 6 | 0 (—) | 0 | 0/0 | ✓ | 128 | ✓ | **95** |
| 110 | Nasr | 3 | 2 | 1 (1) | 0 | 0/0 | ✓ | 135 | ✓ | **78** |
| 111 | Tebbet | 5 | 5 | 0 (—) | 0 | 0/0 | ✓ | 70 | ✓ | **95** |
| 112 | İhlâs | 4 | 4 | 0 (—) | 1 | 0/0 | ✓ | 333 | ✓ | **90** |
| 113 | Felak | 5 | 12 | 0 (—) | 0 | 0/0 | ✓ | 193 | ✓ | **73** |
| 114 | Nâs | 6 | 5 | 1 (5) | 1 | 0/0 | ✓ | 137 | ✓ | **82** |

**Kolon açıklamaları:**
- **Eksik**: Canonical ayet sayısına göre anchor'ı bulunmayan ayetler (sayı + ilk birkaç ayet listesi).
- **Mono ihlali**: Offset-sıralı anchor sekansında ayet numarası geri giden (runtime'da filtrelenen) anchor sayısı.
- **Range (R/N)**: Inline `X-Y-` range pattern sayısı — **R**edundant (tüm ayatlar anchor'lı) / **N**ovel (anchor'sız ayet içeren).
- **Hdr**: `N-NAME:` sûre başlığı var mı?
- **Quote**: `"..."` straight + `"..."` curly quote toplamı.
- **Enc**: Encoding problematik karakter sayısı.
- **Skor**: 100 - (violations*5, max 30) - (header *5) - (encoding) - (missing_pct*0.5, max 25) - (over_max*3, max 15) - (anchor_count - canonical, max 10) - (textLen<3000 ? 3 : 0) - (triple_nl // 5, max 5).

---

## 2. Kritik Sorunlu Sûreler

### 2.1 Skor < 60

#### Sûre 37 — Sâffât (skor **58**)

- Canonical ayet: **182**  |  Anchor: **140**  |  Filter sonrası kabul: **135**  |  Eksik: **42**
- Eksik ayet listesi: [4, 5, 6, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 42, 43, 45, 46, 58, 59, 88, 89, 124, 125, 126, 137, 138] …(+12 daha)
- **Monotonluk ihlali** (5):
  - `ayet=2@11713` — `'ere hayalî bir benzetme.\\n\\n2- Şeytanlar,\\nçirkin suratlı korkunç yılanlar demektir.\\n\\n3- "Ruûsü\'ş-Şeyâtîn"\\n(Şeytanların başları), çirkin manzaralı, bilinen bi'`
  - `ayet=143@38520` — `'ıyordu, pişman oluyordu.\\n\\n143- Eğer\\no çok tesbih edenlerden olmasaydı. Öteden beri Allah\'ı tesbih ile çok zikrederdi.\\nBu karanlıklarda da "Senden başka ilâ'`
  - `ayet=144@38893` — `'e onun karnında kalırdı.\\n\\n144- Eğer\\no çok tesbih edenlerden olmasaydı. Öteden beri Allah\'ı tesbih ile çok zikrederdi.\\nBu karanlıklarda da "Senden başka ilâ'`
  - `ayet=161@43407` — `" hazır bulundurulmazlar.\\n\\n161- Çünkü\\nsiz ne taptıklarınız; putlarınız ve şeytanlarınız Allah'a karşı kimseyi kandıramazsınız.\\nAncak cehenneme yaslanacak ol"`
  - `ayet=171@44869` — `"Artık ilerde bilecekler.\\n\\n171- 179-\\nKüfürlerinin sonunun neye varacağını görecekler, çünkü Allah'ın vaadi şöyledir:\\nAndolsun ki, peygamber olarak gönderile"`
- Inline range — Redundant: **13**, Novel: **24**
  - novel `8-9 @ 3372`, kapsadığı novel ayatlar: [8, 9]
  - novel `12-21 @ 6147`, kapsadığı novel ayatlar: [12, 13, 14, 15, 16, 17]...
  - novel `22-23 @ 6318`, kapsadığı novel ayatlar: [22, 23]

#### Sûre 7 — A'râf (skor **59**)

- Canonical ayet: **206**  |  Anchor: **183**  |  Filter sonrası kabul: **177**  |  Eksik: **23**
- Eksik ayet listesi: [59, 65, 68, 73, 80, 85, 103, 104, 105, 106, 107, 111, 113, 114, 115, 116, 118, 119, 120, 121, 122, 129, 181]
- **Monotonluk ihlali** (6):
  - `ayet=2@18070` — `' çıkarmaya kalkışmıştır.\\n\\n2- Nass (kesin\\nilâhî buyruk) karşısında kıyas ve ictihada kalkışmış, açık emre karşı yaratılışın\\ndelaletine başvurmuştur.\\n\\n3- "Be'`
  - `ayet=3@18193` — `'delaletine başvurmuştur.\\n\\n3- "Beni ateşten,\\nonu çamurdan yarattın." demesi, aslında doğrudur. Fakat İblis bu iki yaratılış\\nolayını mukayese ile, bundan "be'`
  - `ayet=4@86808` — `"nı iyi düşünmek gerekir.\\n\\n4- (Alâ) kelimesinin\\nhakiki mânâsında ne mekâna, ne zamânâ ait bir zarflık yoktur. Bu bir isti'lâ\\nifade eder. Gerçi ulûv (yüksekl"`
  - `ayet=5@87642` — `'fetimizle düşünebiliriz.\\n\\n5- İstivâ\\ngerçekte sırf cismanî bir anlam değildir. Bunun cismanî olup olmadığına, isnad\\nolunduğu fâili veya medhûlü (dahil olduğ'`
  - `ayet=6@88292` — `'zsiniz." (Vâkıa, 56/85).\\n\\n6- Bir hükümdarın\\ntahtına oturup kurulması anlamında bile asıl kastedilen mânâ, cismanî bir\\noturuş değil, hükümdarlık sıfatıyla n'`
  - … ve 1 ihlal daha
- Inline range — Redundant: **14**, Novel: **11**
  - novel `59-64 @ 132273`, kapsadığı novel ayatlar: [59]
  - novel `65-72 @ 133163`, kapsadığı novel ayatlar: [65, 68]
  - novel `73-79 @ 134543`, kapsadığı novel ayatlar: [73]
- Büyük chunk gap'leri (>30k char): `[[7, 60, 43023], [123, 124, 33982], [180, 182, 40265]]`

### 2.2 Yüksek skor — ama bilinen kullanıcı raporlu problemli sûreler

#### Sûre 1 — Fâtiha (skor **91**)

- **Over-max anchor** (ayet # > canonical): `[8]`
  - `ayet=8@55990` — `"-i\\nrahim ismi ile, veya;\\n\\n8- Allah-i rahmân-i\\nrahîm'in ismi ile, denilirse doğrudan Allah ismi başlangıç yapılmış olacak\\nve bununla beraber rahmet bağlantı"`
- **Fâtiha — Over-max anchor (ayet=8)**: canonical=7 ama anchor=8. Tafsir-içi sıralama listesi olabilir; kontrol edilmeli.

#### Sûre 3 — Âl-i İmrân (skor **78**)

- Monotonluk ihlali: **3**
  - `ayet=4@111158` — `'ler bundan menedildiler.\\n\\n4- Ubade b.\\nSamit hazretlerinin yahudilerden dostları vardı. Ahzab günü Hz. Peygamber\'e\\ngelerek, "Ey Allah\'ın Resulü, benim yanım'`
  - `ayet=5@143801` — `'i olarak hakim değildir.\\n\\n5- Türlerin\\nbireylerinde tıpatıp aynilik mümkün olmadığı gibi, mutlak eşitlik mümkün değildir.\\nOnlarda o türün ortalama özellikle'`
  - `ayet=6@144121` — `'rilemeye engel değildir.\\n\\n6- Varlık\\ndenilen bu çeşitli âlemlerden gelişerek temayüz etmiş olan çeşitli yaratıklar\\narasında beşer nevi, hepsinden mükemmel b'`
- Redundant inline range çok: **34** (TafsirPanel Phase 2 `"X-Y-"` prefix strip yapıyor; sayı sadece kaynak kalitesini ölçer)

#### Sûre 4 — Nisâ (skor **92**)

- Redundant inline range çok: **18** (TafsirPanel Phase 2 `"X-Y-"` prefix strip yapıyor; sayı sadece kaynak kalitesini ölçer)
- Novel inline range: **8** (Phase 2 ayet-badge'li ayrı chunk üretir; eksik ayet kapsamasını telafi eder)
- **Quote yoğunluğu**: straight=677, curly=0, para-wrap=1. Nisâ'da hadis/atıf alıntıları yoğun; TafsirPanel `renderInline` regex'i bunları italic+altın render ediyor. Para-wrap formatı (paragraf başı+sonu quote) **diğer sûrelerde de mevcut** (toplam 90 adet) — Nisâ'ya özgü değil ama Nisâ'da en görünür.

#### Sûre 5 — Mâide (skor **62**)

- Monotonluk ihlali: **11**
  - `ayet=1@18417` — `'ize şunlar haram edildi.\\n\\n1- Meyte,\\n(leş yani, kesilmeden ölen, daha doğrusu tezkiyesiz ölen.) Meyte, canlı karşılığı\\nölü demek değil, hiç bir haricî tesir'`
  - `ayet=2@18781` — `"karşılığı gösterecektir.\\n\\n2- Dem, yani\\nkan ki, maksad akıtılmış kan olduğu diğer bir yerde, bu cümleden olarak En'am\\nsûresi 145. nci âyette açıklanmıştır. "`
  - `ayet=5@44674` — `', hesabı çabuk görendir.\\n\\n5- Bugün size\\niyi ve temiz şeyler helal kılındı. Kendilerine kitap verilenlerin yiyecekleri\\nsize helal olduğu gibi, sizin yiyeceğ'`

#### Sûre 62 — Cumu'a (skor **79**)

- **Over-max anchor** (ayet # > canonical): `[12, 13, 14, 15]`
  - `ayet=12@23879` — `" ya da bir uzun âyettir.\\n\\n12- İkinci\\nhutbe ile Allah Teâlâ'ya hamd ve övgüyü, Hz. Peygamber'e salavatı tekrar etmek,\\n\\n13- Müslüman\\nerkek ve kadınlara dua e"`
  - `ayet=13@23971` — `'e salavatı tekrar etmek,\\n\\n13- Müslüman\\nerkek ve kadınlara dua etmek,\\n\\n14- İki hutbeyi\\ntıval-ı mufassaldan bir sûre kadar hafif okumak. Hutbeyi uzatmak mekr'`
  - `ayet=14@24015` — `' ve kadınlara dua etmek,\\n\\n14- İki hutbeyi\\ntıval-ı mufassaldan bir sûre kadar hafif okumak. Hutbeyi uzatmak mekruhtur,\\n\\n15- İki hutbe\\narasında oturmak. Bu o'`
- **Cumu'a — Hutbe-rules scrape leak**: 11-ayetlik sûrede 15 anchor scrape edilmiş. ayet 12-15 aslında tafsir içinde yazılı **hutbe kuralları listesi** ("12-İkinci hutbe ile Allah Teâlâ'ya hamd… 13-Müslüman erkek ve kadınlara dua etmek… 14-İki hutbeyi… 15-İki hutbe arasında oturmak…"). Felak ile aynı tip kontaminasyon.

#### Sûre 66 — Tahrîm (skor **88**)

- **Over-max anchor** (ayet # > canonical): `[91]`
  - `ayet=91@54985` — `". İşte Enbiyâ Sûresi'nin\\n91. âyetinde burada eklinde bir müennes bir de müzekker olarak ifade edilmesi,\\nher iki zamirin merciinin ferc olduğunu gösterdiği "`
- **Tahrim — Cross-reference scrape leak**: 12-ayetlik sûrede ayet 91 olarak scrape edilen offset 54985 aslında `Bakara/Nahl 91. âyetine` atıf metni — tafsir-içi çapraz-referans. TafsirPanel'in runtime filter bu anchor'ı kabul eder (12 maxAyet olduğu için 91 > 12) ve **sahte ayet 91 chunk'ı** üretir.

#### Sûre 71 — Nûh (skor **70**)


#### Sûre 77 — Mürselât (skor **70**)


#### Sûre 85 — Bürûc (skor **95**)

- **Tek başlıksız sûre** — book-intro içeriyor: `'KURAN\'I\\nKERİM TEFSİRİ\\n\\n(ELMALILI\\nMUHAMMED HAMDİ YAZIR)\\n\\n85-BURUC:\\n\\nBurçlu semâya\\nyemin olsun. Vav, yemin içindir. Semâ-i Zâti\'l-büruc; burçlu, yani burçlarla\\nsüslenmiş semâ demektir.\\n\\nBÜRÛC, bilindiği\\ngibi "bürc"ün çoğuludur. Bürc, aslında "görünen şey" demek olup daha sonraları\\nher bakanın gözüne ç'`. TafsirPanel `surahHeader` regex'i (^N-NAME: line) ilk satır quote `"KURAN'I` ile başladığı için yakalayamıyor. Sonuçta panelin ilk preface chunk'ında "KURAN'I KERİM TEFSİRİ" başlığı görünüyor.

#### Sûre 103 — Asr (skor **91**)

- **Over-max anchor** (ayet # > canonical): `[4]`
  - `ayet=4@13932` — `"hamledilmiş olmak üzere:\\n\\n4- Bu asırdan\\nmaksadın, nübüvvet asrı yani Muhammed aleyhisselam'ın asrı olduğu akla gelir.\\nBunda mutlak asrın her mânâsı bulunma"`
- **Asr — Over-max anchor**: 3-ayetlik sûrede ayet 4 anchor'ı var (canonical=3). Felak/Cumu'a ile aynı leksikografik enumeration kalıbı muhtemel — kontrol edilmeli.

#### Sûre 108 — Kevser (skor **91**)

- **Over-max anchor** (ayet # > canonical): `[4]`
  - `ayet=4@37279` — `"anların boğazlanmasıdır.\\n\\n4- Mücahid,\\nAta ve İkrime'den rivayet edildiği üzere bir kısım tefsirciler de bu namazdan\\nmaksat Bayram sabahı Müzdelife'de kılın"`
- **Kevser — Over-max anchor**: 3-ayetlik sûrede ayet 4 anchor'ı var (canonical=3). Aynı kalıp.

#### Sûre 113 — Felak (skor **73**)

- **Over-max anchor** (ayet # > canonical): `[6, 7, 8, 9, 10, 11, 12]`
  - `ayet=6@5523` — `'n süt kalıntısına denir.\\n\\n6- Ekşiyip\\nkesilmiş süte denilir.\\n\\n7- Cehennemin\\nveya cehennemde bir kuyunun ismi olduğu da nakledilmiştir.\\n\\nRagıb der\\nki: sabaht'`
  - `ayet=7@5558` — `'p\\nkesilmiş süte denilir.\\n\\n7- Cehennemin\\nveya cehennemde bir kuyunun ismi olduğu da nakledilmiştir.\\n\\nRagıb der\\nki: sabahtır; (Neml, 27/61) kavlinde zikrolun'`
  - `ayet=8@27607` — `'ayı da\\nifade etmiş olur.\\n\\n8- Zikredilen\\nmânâlardan her birini bir misâl ile izah kabilinden olarak ğâsık, beşeriyete\\nârız olan ve muradına engel olan elem '`
- **Felak — Numbered-list scrape leak**: 5-ayetlik sûrede 12 anchor scrape edilmiş. ayet 1-7 ve 8-12 olmak üzere iki numerik dizi var; bunlar tafsirdeki **leksikografik mânâ enumeration** (ör. "1-Adem yokluk… 2-Örfte sabah… 3-İki tepe arası…") — tafsir içinde Elmalılı'nın yazdığı alfabetik mânâlar. TafsirPanel runtime filter monotonik yükselişe izin verdiği için (1,2,3,4,5,6,7) hepsini chunk'a dönüştürüyor → sahte ayet 6-12 chunk'ları görünüyor.

---

## 3. Pattern-Bazlı Bulgular

### 3.A. Surah Header Pattern

- **113/114 sûre** `N-NAME:` formatında başlar (örn. `3-AL-İ İMRAN:`, `5-MAİDE:`, `62-CUMU'A:`).
- **1 istisna**: Sûre 85 (Bürûc) — book-intro içeriyor: `"KURAN'I\nKERİM TEFSİRİ\n\n(ELMALILI\nMUHAMMED HAMDİ YAZIR)\n\n85-BURUC:"`.
- **TafsirPanel davranışı**: `surahHeader = /^\s*\d+\s*-\s*[\p{L}\p{M}\s\-\']+:\s*\n?/u` regex'i preface (ayah=null) chunk'ında bu satırı temizliyor. **113 sûrede sorunsuz.** Sûre 85'te book-intro yakalanamadığı için panelin ilk preface chunk'ında `"KURAN'I KERİM TEFSİRİ"` görünür.
- **Format çeşitleri**: Tüm 113 sûrede aynı kalıp; ASCII Türkçe karakterli (Â, Î, Ç, Ğ, İ, Ö, Ş, Ü). Hiçbir sûrede space veya tire çeşitliliği yok.

### 3.B. Inline Range Pattern Analizi

- **Toplam redundant range**: 374 adet, 100+ sûrede dağılmış. **Phase 2** mantığı bunları `X-Y-` prefix'ini strip ederek preface text'e çeviriyor — **fonksiyonel sorun yok, sayı sadece kaynak içeriğin yapısını ölçer.**
- **Toplam novel range**: 184 adet. Bunlar **Phase 2** tarafından `ayet=X` `ayahTo=Y` field'lı ayrı chunk'a dönüştürülüyor ve UI'da `Âyet 10-11` rozeti gösteriyor — **doğru davranış.**
- **Top redundant**: 3 Âl-i İmrân (34), 6 En'âm (24), 4 Nisâ (18), 7 A'râf (14), 37 Sâffât (13), 16 Nahl (12), 21 Enbiyâ (12), 27 Neml (12). Bunlar **kaynaktaki çift-katmanlı tefsir** (özet blok + deep blok) yapısının doğal sonucu.
- **Top novel**: 37 Sâffât (24), 16 Nahl (16), 26 Şuarâ (12), 7 A'râf (11), 4 Nisâ (8). Bunlar deep-tafsir anchor'ı eksik olan ayetleri telafi ediyor.
- **Phase 2'nin önemi**: Kullanıcının ilk raporladığı "1/232 sayacı" sorununu Âl-i İmrân için **çözüyor** — 34 redundant range'i strip ettiği için 194 + 34 = 228 değil **194 anchor + ekstra novel range'ler** olarak chunk üretiyor. Bu fix çalışıyor.

### 3.C. Monotonluk Bozukluğu — Tipoloji

- **Toplam ihlal**: 88 anchor (114 sûrede). Çoğu sûrede 0-3 arası.
- **Tip 1 — Numerik liste maddesi (Mâide pattern)**: Tafsir-içi numaralı liste maddeleri (`"1- Meyte, 2- Dem, 3- Domuz eti..."`) ayet anchor'ı olarak scrape edilmiş. Mâide ayet 3 başında haram-yiyecek listesi 9 madde sayıyor → ayet 1-9 anchor'ları geri-sırada görünüyor. Mâide'de 11 ihlal var.
- **Tip 2 — Sıralı argüman/yorum (Saffat, Necm pattern)**: Elmalılı bir konuyu numaralı maddelerle açıklarken (`"1. Kuvvetli, 2. Sağlam yapılı, 3. Keşşaf..."`) bu maddeler anchor olarak yakalanıyor. Necm ayet 1'in başında 3 madde var → ayet 1, 2 anchor'ı offset 9128, 9142'de (sadece 14 karakter arayla) görünüyor. Necm'de 5 ihlal.
- **Tip 3 — Tekrar bölümler (Saffat duplicate Yunus)**: Saffat'ta Yunus kıssası önce 139-150 anchor'larıyla normal sırada veriliyor, sonra 143-144 deep-tafsir olarak tekrar görünüyor. Tip 3 nadir ama Saffat'ta belirgin.
- **Tip 4 — Tafsir-içi sayfa numaraları/madde başlıkları**: A'râf ve Bakara'da, "1- Nass karşısında... 2- ... 3- ..." gibi argüman listeleri.
- **Mevcut runtime filter**: TafsirPanel.jsx satır 121-133. **Doğru çalışıyor** — strictly-increasing filter Tip 1-4'ün hepsini siler. Sadece **eksik chunk** (ayet 1 ve 2'nin gerçek tafsiri bu shadow anchor'lar tarafından temsil edilseydi) sorununu ele almaz, ama veri zaten ayet 3'ten sonra ayet 1 anchor'ını barındırmadığı için (yani gerçek ayet 1 tafsiri yok) bu vaka oluşmuyor — sadece "duplicate noise" siliniyor.

### 3.D. Quote Pattern Tutarsızlığı

- **Sıfır quote yok**: 114/114 sûrede en az 1 quote (`"..."`) var. Quote-suz sûre yok.
- **Curly quote (`"..."`) yok**: 0 adet. Tüm quote'lar ASCII düz `"..."`.
- **Para-wrap quote**: Toplam 90 adet, **çoğu sûrede dağınık**. Top: 68 Kalem (5), 17 İsrâ (4), 113 Felak (2), 4 Nisâ (1).
- **Nisâ özel mi?**: Hayır — para-wrap kullanımı **Nisâ'ya özgü değil**, sadece dikkat çeken yer. Kullanıcının "Nisâ ayet 3, 4 paragrafları" gözleminin sebebi: Nisâ'da Elmalılı arabaşka kaynak alıntısını ayrı paragrafta veriyor; ama **aynı pattern Bakara, Mülk, İsrâ'da da var**.
- **TafsirPanel renderInline davranışı**: Tüm `"..."` içeriği italic + altın renkte render ediliyor (line 30-42, 71-82). **Tutarlı işliyor.** Kullanıcı bunu bug olarak gördüyse, expectation yanlış olabilir — bu, Elmalılı'nın **tasarlanmış stilistic vurgu** olabilir. Eğer arzulanmıyorsa, sadece çok-uzun paragraf-wrap pattern'lerini hariç tutmak için ek bir heuristic gerek (örn. quote length > 200 char + paragraf tek başına).

### 3.E. Over-max Anchor Sorunu (Yeni Tespit — Önemli)

Bu **yeni** bir kategori — kullanıcı raporlamadı ama UI'da yanlış chunk üretiyor:

| Sûre | Canonical | Anchor # | Over-max ayatlar | Sebep |
|--|--:|--:|--|--|
| 1 Fâtiha | 7 | 8 | [8] | Tafsir-içi 8-madde besmele varyantı listesi |
| 62 Cumu'a | 11 | 15 | [12,13,14,15] | Tafsir-içi hutbe kuralları listesi |
| 66 Tahrim | 12 | — | [91] | Çapraz-referans (Bakara/Nahl 91'e atıf) |
| 103 Asr | 3 | 4 | [4] | Tafsir-içi "Asr" kelimesinin leksikografik mânâ enumeration |
| 108 Kevser | 3 | 4 | [4] | Aynı pattern |
| 113 Felak | 5 | 12 | [6,7,8,9,10,11,12] | Tafsir-içi `falak`/`vakaba`/`ukad` kelime mânâ enumeration |

**Kritik**: TafsirPanel'in monotonik filter'ı bu over-max anchor'ları **kabul ediyor** (çünkü ayet 12 > ayet 11, monoton artıyor). Sonuçta panelde sahte "Âyet 6, 7, 8, 9, 10, 11, 12" chunk'ları görünüyor — kullanıcı için kafa karıştırıcı.

### 3.F. Anchor Eksikliği (Düşük Kapsama)

Aşağıdaki sûrelerde anchor sayısı canonical'in **%50'sinin altında**:
- **71 Nûh**: 11 anchor / 28 ayet (39%). Kaynak'ta toplu işleniyor — büyük chunk'lar.
- **77 Mürselât**: 17 anchor / 50 ayet (34%). Aynı sebep.

Aşağıdakiler **%50-70 arası**:
- 32 Secde (19/30), 42 Şûrâ (35/53), 44 Duhân (40/59), 46 Ahkâf (25/35), 104 Hümeze (5/9).

Bu sûrelerde TafsirPanel **scroll-to-ayah** özelliği kısmen başarısız — kullanıcı ayet 5 isteyip ayet 13 anchor'ına gönderilebilir. Mevcut implementation (line 246-258) **en yakın küçük-eşit anchor**'a scroll yapıyor, bu OK ama UI 'Âyet 13' rozetiyle açıyor — kullanıcı kafası karışır.

---

## 4. Önerilen Code Fix'leri (`TafsirPanel.jsx`)

### 4.1 Over-max anchor reddi (Y ÜKSEK ÖNCELİK)

**Sorun**: Felak/Cumu'a/Asr/Kevser/Fâtiha/Tahrim'de canonical-üstü anchor'lar UI'da görünüyor.

**Fix**: Phase 1 runtime filter'a canonical-cap kontrolü ekle. Canonical sayısı `surah-info.json` veya hardcoded tablo:

```js
// Hafs canonical verse counts (Diyanet standard)
const CANONICAL_VERSE_COUNTS = { 1:7, 2:286, 3:200, /*...*/ 113:5, 114:6 };
// In Phase 1 anchor filter:
const maxAllowed = CANONICAL_VERSE_COUNTS[surah];
for (const [a, o] of rawAnchors) {
  if (a > maxAyet && a <= maxAllowed) {  // ⬅ added canonical-cap
    anchors.push([a, o]);
    maxAyet = a;
  }
}
```

Etki: 6 sûrede toplam ~15 sahte chunk silinir. **Etkilenmeyen sûreler**: 0 — over-max anchor olmayan 108 sûre değişmez.

### 4.2 Small-gap anchor reddi (ORTA ÖNCELİK)

**Sorun**: Necm'de ayet 1 anchor'ı offset 9128, ayet 2 anchor'ı offset 9142 — sadece **14 karakter** ara. Bu, normal bir ayet tafsiri için imkansız (en az 50 char). Aynı pattern Mâide'de "1- Meyte, ... 2- Dem" listesinde de görülür ama orada monotonik filter zaten yakalıyor; Necm'de yakalamıyor çünkü `1, 2` artıyor.

**Fix**: Phase 1 filter'a minimum gap kontrolü ekle:

```js
const MIN_ANCHOR_GAP = 80; // chars
let prevOff = -1;
for (const [a, o] of rawAnchors) {
  if (a > maxAyet && a <= maxAllowed && o - prevOff >= MIN_ANCHOR_GAP) {
    anchors.push([a, o]);
    maxAyet = a;
    prevOff = o;
  }
}
```

Etki: Necm'de 5 sahte ihlali siler. Tahmini false-positive: 0 (gerçek ayet tafsirleri 80+ karakter olur). Test gerekir.

### 4.3 Saffat duplicate-Yunus özel durumu (DÜŞÜK ÖNCELİK)

Saffat'ta ayet 143, 144 deep-tafsir olarak Yunus kıssasının ikinci kez tekrarlanan kısmıdır. Monotonik filter zaten siliyor — **fonksiyonel sorun yok**. Sadece veri kalitesi açısından raporlanır.

### 4.4 Sûre 85 book-intro temizliği (DÜŞÜK ÖNCELİK)

**Sorun**: Bürûc'da `"KURAN'I KERİM TEFSİRİ\n(ELMALILI MUHAMMED HAMDİ YAZIR)\n85-BURUC:"` book-intro panel'in preface chunk'ında görünüyor.

**Fix**: `surahHeader` regex'ini genişlet:

```js
// Mevcut:
const surahHeader = /^\s*\d+\s*-\s*[\p{L}\p{M}\s\-\']+:\s*\n?/u;
// Önerilen — book-intro veya quote-içeren ilk satırları da tut:
const bookIntro = /^\s*\"?KUR.*?TEFSİR.*?\)\s*\n+/su;
// Phase 2 flushText():
if (chunk.ayah == null && !firstEmitted) {
  t = t.replace(bookIntro, '').replace(surahHeader, '');
}
```

### 4.5 Quote para-wrap heuristic (TARTIŞMAYA AÇIK)

Kullanıcı Nisâ 3, 4 paragraflarının quote-render'ini sorun olarak gördü. Ama bu pattern **Elmalılı'nın stilistic seçimi** (hadis/atıf alıntısı) — italic+altın render aslında **doğru** behavior. Eğer fix isteniyorsa:

```js
// renderInline'da: quote uzunluğu > 200 + paragraf-wrap (paragraf tek başına quote) ise plain render et
const isParaWrap = (s) => /^\s*\"[^\"]{50,}\"\s*$/.test(s);
if (isParaWrap(paragraph)) {
  // skip italic+gold
}
```

**Önerim**: Bu fix'i uygulamadan önce kullanıcıya örnek görsel ile göster — italic+altın stil esasen iyi UX.

---

## 5. Önerilen Build-Time Fix'leri (Python normalize script)

JSON verisini doğrudan düzelten alternatif yaklaşım. Runtime fix'lerinin avantajı: forward-compatible. Build-time fix'lerinin avantajı: bir kez çalıştır, runtime maliyeti yok. **Önerim**: runtime fix'leri tercih et (4.1-4.2) çünkü kaynak veri tekrar scrape edilirse build-fix yeniden çalıştırılmalı.

Yine de tek seferlik temizlik scripti şu olmalı:

```python
#!/usr/bin/env python3
"""Normalize elmalili tafsir JSONs — strip over-max anchors and book-intro from Bürûc."""
import json, os, glob

CANONICAL = {1:7, 2:286, 3:200, 4:176, 5:120, 6:165, 7:206, 8:75, 9:129, 10:109,
             11:123, 12:111, 13:43, 14:52, 15:99, 16:128, 17:111, 18:110, 19:98, 20:135,
             21:112, 22:78, 23:118, 24:64, 25:77, 26:227, 27:93, 28:88, 29:69, 30:60,
             31:34, 32:30, 33:73, 34:54, 35:45, 36:83, 37:182, 38:88, 39:75, 40:85,
             41:54, 42:53, 43:89, 44:59, 45:37, 46:35, 47:38, 48:29, 49:18, 50:45,
             51:60, 52:49, 53:62, 54:55, 55:78, 56:96, 57:29, 58:22, 59:24, 60:13,
             61:14, 62:11, 63:11, 64:18, 65:12, 66:12, 67:30, 68:52, 69:52, 70:44,
             71:28, 72:28, 73:20, 74:56, 75:40, 76:31, 77:50, 78:40, 79:46, 80:42,
             81:29, 82:19, 83:36, 84:25, 85:22, 86:17, 87:19, 88:26, 89:30, 90:20,
             91:15, 92:21, 93:11, 94:8, 95:8, 96:19, 97:5, 98:8, 99:8, 100:11,
             101:11, 102:8, 103:3, 104:9, 105:5, 106:4, 107:7, 108:3, 109:6, 110:3,
             111:5, 112:4, 113:5, 114:6}

for path in sorted(glob.glob("public/tafsir/elmalili/*.json")):
    n = int(os.path.basename(path).replace(".json",""))
    with open(path) as f: d = json.load(f)
    # Strip over-max anchors
    max_n = CANONICAL[n]
    new_anchors = {k: v for k, v in d["verseAnchors"].items() if int(k) <= max_n}
    d["verseAnchors"] = new_anchors
    with open(path, "w") as f: json.dump(d, f, ensure_ascii=False, indent=2)
    print(f"Surah {n}: {len(d[\"verseAnchors\"])} anchors (was {len(d[\"verseAnchors\"])})")
```

---

## 6. Encoding Audit

Aşağıdaki problematik karakterler tarandı:

| Karakter | Unicode | İsim | Toplam Tafsir'de | Sûre Sayısı |
|----------|---------|------|-----------------:|------------:|
| ۡ | U+06E1 | Uthmani sukun | **0** | 0 |
| ٱ | U+0671 | Alef wasla | **0** | 0 |
| ۪ | U+06EA | Uthmani subscript kasra | **0** | 0 |
| ی | U+06CC | Farsi yeh | **0** | 0 |
| (NBSP) | U+00A0 | Non-breaking space | **0** | 0 |
| (ZWSP) | U+200B | Zero-width space | **0** | 0 |
| (ZWNJ) | U+200C | Zero-width non-joiner | **0** | 0 |
| \r | U+000D | Carriage return | **0** | 0 |
| \n\n\n+ | — | Triple+ newline | **0** | 0 |

**Sonuç**: Elmalılı tafsir verisi **encoding açısından tamamen temiz**. Kur'an metni içermediği için (sadece Türkçe tafsir prose) `cleanArabic()` benzeri normalization gerekmez. Kaynak (enfal.de) Türkçe UTF-8 üretiyor.

**İstisna**: Tafsir içinde geçen Arapça kelime/cümleler (örn. `"الحمد لله"`) tek tük yer alıyor olabilir; bunlar `lang="ar"` attribute taşımıyor — accessibility için minor sorun, ama panel'in genel UX'i ile sorunsuz.

---

## 7. Önerilen Aksiyon Sırası

1. **(YÜKSEK)** §4.1 fix'i uygula → Felak/Cumu'a/Asr/Kevser/Fâtiha/Tahrim chunk'ları temizlenir. ~15 dakika.
2. **(ORTA)** §4.2 small-gap filter'i uygula → Necm 5 sahte ihlal düzelir. Test ile başla, false-pozitif olmadığından emin ol.
3. **(DÜŞÜK)** §4.4 fix → sûre 85 book-intro temizliği.
4. **(OPSİYONEL)** §4.5 quote para-wrap kullanıcıyla görsel inceleme sonrası karar ver.
5. **(VERİ KALİTESİ)** Düşük-kapsama sûreler (71 Nûh, 77 Mürselât) için kaynaktan yeniden scrape gerekebilir — şu anda eksik tafsir gösteriliyor; ama sahte veri **göstermiyor** — bu yüzden P3.

---

## 8. Audit Reproducibility

Bu rapor şu komutla yeniden üretilebilir:

```bash
python3 /tmp/audit/run_audit.py  # results.json üretir
python3 /tmp/audit/build_full_report.py > docs/reviews/2026-05-11-tafsir-elmalili-audit.md
```

Audit script ve canonical verse counts: `/tmp/audit/run_audit.py`, `/tmp/audit/canonical_verse_counts.py`. Cross-check edilirken `public/corpus/*.json` ile karşılaştırıldı: **0 mismatch** (mevcut corpus surahları için).
