# Arapça Font Referansı — Kur'an Okuma Modu

Kullanıcıya gösterilen isim yok. UI'da sol/sağ ok ile gezilir.
Her font bir index numarasıyla takip edilir (0'dan başlar).

| # | ID | Kullanıcı Etiketi | Font Ailesi | Kaynak | Stil | Hareke Desteği |
|---|----|--------------------|-------------|--------|------|----------------|
| 0 | `Amiri` | Hat 1 | `'Amiri', serif` | Google Fonts | Klasik Naskh | ✅ Tam |
| 1 | `AmiriQuran` | Hat 2 | `'Amiri Quran', serif` | Google Fonts | Kur'an Naskh (Amiri'nin özelleşmiş versiyonu) | ✅ Tam |
| 2 | `KFGQPC` | Hat 3 | `'KFGQPC', serif` | jsDelivr CDN | Osmanlı Naskh — Suudi Arabistan Kral Fahd Basımevi | ✅ Tam |
| 3 | `Scheherazade` | Hat 4 | `'Scheherazade New', serif` | Google Fonts | SIL Naskh — Kapsamlı Unicode desteği | ✅ Tam |
| 4 | `NotoNaskh` | Hat 5 | `'Noto Naskh Arabic', serif` | Google Fonts | Google Noto Naskh — Modern temiz | ✅ Tam |
| 5 | `Lateef` | Hat 6 | `'Lateef', serif` | Google Fonts | SIL Naskh — Geniş karakter seti | ✅ Tam |
| 6 | `ReemKufi` | Hat 7 | `'Reem Kufi', serif` | Google Fonts | Kûfî — Geometrik, klasik | ⚠️ Kısmi |
| 7 | `ArefRuqaa` | Hat 8 | `'Aref Ruqaa', serif` | Google Fonts | Rık'a — El yazısı tarzı | ⚠️ Kısmi |
| 8 | `MarkaziText` | Hat 9 | `'Markazi Text', serif` | Google Fonts | Naskh — Kitap baskısı tarzı | ✅ İyi |
| 9 | `Harmattan` | Hat 10 | `'Harmattan', serif` | Google Fonts | SIL Batı Afrika Naskh | ✅ İyi |
| 10 | `Alkalami` | Hat 11 | `'Alkalami', serif` | Google Fonts | SIL — Kuzey Afrika Kur'an geleneği | ✅ Tam |
| 11 | `ReemKufiInk` | Hat 12 | `'Reem Kufi Ink', serif` | Google Fonts | Kûfî mürekkep efektli | ⚠️ Kısmi |
| 12 | `Katibeh` | Hat 13 | `'Katibeh', serif` | Google Fonts | Hat sanatı tarzı dekoratif | ⚠️ Kısmi |
| 13 | `HusrevHatti` | Hat 14 | `'HusrevHatti', serif` | /public/fonts/husrev-hatti.woff (CDNFonts) | **Ahmed Hüsrev Hattı** — Hayrat Vakfı & Diyanet onaylı Türkiye baskılarında kullanılan resmi hat. Fatih Babacan tarafından dijitalleştirildi (2010). | ✅ Tam |

## Notlar

- **Hareke Desteği ✅ Tam**: Kur'an okuma için önerilir
- **Hareke Desteği ⚠️ Kısmi**: Bazı hareke/işaretler eksik görünebilir
- Bu liste sadece Fatiha suresinde test amaçlı gösterilmektedir
- Beğenilen font belirlendikten sonra tüm Kur'an okuma moduna uygulanacak
- KFGQPC, Suudi baskı standart fontu olup fotoğraflardaki mushaf baskısına en yakın olanıdır
