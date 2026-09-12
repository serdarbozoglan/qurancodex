# §13.24 Hakem İnceleme Paketi — Bilimsel İşaretler & Târık

> **Amaç:** Kaynak-denetimi turunda (PR #35, #36) yapılan, §13.24 (İ'câz-ı İlmî /
> Bucaillism çerçevesi) alanına giren **iki** düzeltmeyi hakem (GPT-5.2 ve/veya
> âlim) onayına sunmak. İkisi de **yeni iddia eklemez; mevcut aşırı-apolojetik
> unsuru KALDIRIR** — yani §13.24'ün istediği yönde. Değişiklikler zaten main'de
> (kullanıcı merge etti); bu retrospektif bir teyit turudur.
>
> **Hakemden istenen:** "Bu iki değişiklik §13.24 ilkesine uygun mu? Kaldırılan
> unsurların yerine yanlış/eksik bir şey doğdu mu? TR ve EN eşdeğer mi?"

---

## Değişiklik 1 — Bilimsel İşaretler: "İki Deniz" · Cousteau atfı kaldırıldı
Dosya: `next/public/bilimsel-isaretler.json` (id: `iki-deniz`)

**ÖNCE (`discoveryYear` / `discoveryYearEn`):**
> "20. yy — halocline/pycnocline oseanografi çalışmaları · **Jacques Cousteau (1962+)**"
> "20th c. — halocline/pycnocline oceanography studies · **Jacques Cousteau (1962+)**"

**SONRA:**
> "20. yy: halocline/pycnocline oseanografi çalışmaları"
> "20th c.: halocline/pycnocline oceanography studies"

**Gerekçe:**
- "Jacques Cousteau bu âyeti keşfedip Müslüman oldu" anlatısı doğrulanamayan bir
  internet efsanesidir; `content-accuracy-review` skill'inin regresyon listesinde
  **açıkça yasaklı**. Cousteau adını bir "keşif" alanında anmak bu efsaneyi
  fabrikasyon bir künye gibi diriltiyordu.
- Aynı maddenin `criticalNoteTr/En`'i zaten efsaneyi çürütüyor ("kaynaklarda
  doğrulanamamaktadır") — atıf ile not çelişiyordu; çelişki giderildi.
- Meşru bilim (halocline/pycnocline oseanografisi) korundu; yalnız kişi-atfı çıktı.
- §13.24 uyumu: bir beşerî ismi/keşfi öne çıkarıp "bilim tasdik etti" imasını
  kaldırmak, Kur'an'ı değişken bilime rehin etmekten kurtarır (Kur'an lehine).

---

## Değişiklik 2 — Doğa Atlası: Târık · pulsar/Zakir Naik cümlesi kaldırıldı
Dosya: `next/src/components/DogaAtlasi.jsx` (Târık 86:1-3)

**ÖNCE (noteTr sonu):**
> "...Klasik tefsirde meteor, parlak yıldız ya da Süreyya yıldız kümesi olarak
> yorumlanır. **Modern okumalarda (örn. Z. Naik) periyodik atımlı pulsarlara
> işaret olabileceği önerilir; pulsarlar ilk kez 1967'de keşfedildi ve periyodik
> radyo darbeleri verir.**"

**SONRA:**
> "...Klasik tefsirde 'delici yıldız' (en-necmü's-sâkıb) meteor, parlak yıldız ya
> da Süreyyâ yıldız kümesi olarak yorumlanır."

(EN eşdeğeri de aynı şekilde: pulsar/Naik/1967 cümlesi çıkarıldı, klasik tefsir kaldı.)

**Gerekçe:**
- "1967'de keşfedildi" vurgusu §13.24'ün açıkça yasakladığı "7. yy'da bilinemezdi
  → mucize" (bilinemezdi→i'câz) çerçevesini örtük olarak taşıyordu.
- Zakir Naik allowlist-dışı, popülist bir kaynak (§13.35); bir i'câz iddiasının
  dayanağı olamaz.
- Klasik tefsir yorumu (meteor/parlak yıldız/Süreyyâ) — asıl/otorite — korundu.
- §13.24 uyumu: zayıf apolojetik halkayı (pulsar-i'câzı) kaldırmak, âyeti çürük
  bir bilimsel iddiaya bağlamaktan kurtarır (Kur'an lehine, taviz değil).

---

## Not
Her iki değişiklik de **yalnız kaldırma**dır; hiçbir yeni bilimsel/tarihî iddia
eklenmedi, hiçbir âyete şüphe düşürülmedi. §13.24'ün "orta yol" ilkesinin
(ne aşırı apolojetik, ne gereksiz reddediş) apolojetik-aşırılık tarafından
düzeltilmesidir. Hakem onayı sonrası bu dosya arşivlenebilir.
