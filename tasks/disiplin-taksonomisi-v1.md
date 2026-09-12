# Disiplin Bazlı Keşif — Taksonomi v1 (gpt-6-astra REVIEW #1)

> **Amaç (Serkan Tezgel feedback'i, 2026-09-12):** İnsanların kendi meslek/ilgi
> alanından Kur'an'a bir keşif kapısı bulması. Mevcut 65 araç + 53 Tefekkür
> yazısına `disciplines: [...]` etiketi + `/keşfet`'te "Disipline Göre" görünüm.
>
> **ÇERÇEVE İLKESİ (değişmez — memory `feedback_quran_certainty_framing`, §13.24):**
> Kur'an **sabit, kesin referans noktasıdır** (lâ raybe fîh). Disiplinler ona
> **bakış kapısıdır**, hakemi değildir. Dil daima: "Kur'an şunu SÖYLER/BUYURUR"
> + "bir [psikolog/yönetici] olarak buradan şu TEFEKKÜRÜ/ÖRTÜŞMEYİ görürüz."
> ASLA "bilim Kur'an'ı doğruladı / kanıtladı". Bu bir navigasyon/keşif katmanıdır;
> **sıfır yeni Kur'anî iddia** — yalnız mevcut içeriği disiplin lensiyle gruplar.

---

## A. GÜVENLİ DİSİPLİNLER (Kur'an doğrudan/normatif konuşur — i'câz riski yok)

**1. Psikoloji & Nefs** — insanın iç dünyası
İnsan Psikolojisi · Nefs Mertebeleri · İnsan Tanımı · İnsan Yolculuğu ·
Münâfık Profili · İblis & Şeytan (vesvese) · Yakın Anlamlı Nüanslar (kalb/fuâd)

**2. Ahlâk & Karakter** — erdem, niyet, davranış
Münâfık Profili · Neden→Sonuç (sabır/şükür) · Buyruklar · Tövbe · İbadetler (takva)

**3. Liderlik & Yönetim** — otorite, şûra, emanet, adalet
Peygamber Atlası · Kıssa Atlası · Kavim Atlası · Sünnetullah Atlası · Muhataplar

**4. Adalet & Hukuk** — ahkâm, mîzan, şahitlik, haklar
Buyruklar · Eleştirel Çerçeve (miras/ahkâm) · Zekât · Fürûk (kavram ayırımı)

**5. Sosyoloji & Toplum** — ümmet, helâk/ıslah, toplumsal yasa
Kavim Atlası · Sünnetullah Atlası · Kıssa Atlası · Muhataplar · Neden→Sonuç

**6. İktisat & Ticaret (Business)** — mülk, infak, ölçü-tartı, faiz, emanet
Zekât · Buyruklar (ölçü-tartı) · Sebeb-i Nüzûl (faiz âyetleri) · Kurban

**7. Dil & Belâgat & Yapı** — i'câz-ı beyânî (güvenli; dilsel)
Mukattaa · Retorik · Retorik Sorular · Ritim · Ses Mimarisi · Halka Kompozisyon ·
İlk-Son Kelimeler · Tekrar Anatomisi · İsimlendirme · Kıraat · Münâsebât · Yeminler ·
Fâtiha Atlası · Kelime Isı · Semantik Harita

**8. Tarih & Medeniyet** — kıssa, kronoloji, koruma (§13.24 ölçülü)
Tarihsel İzler · Kıssa Atlası · Kavim Atlası · Peygamber Atlası · Korunma Zinciri ·
Sebeb-i Nüzûl · Nüzul Kronolojisi · Diyalog Ağı

**9. Maneviyat & İbadet** — kulluk, dua, zikir, âhiret
İbadetler (+ namaz/oruç/zekât/hac/kurban/tövbe/zikir) · Dualar · Dua Dili ·
Esmâ Frekans · Melekler · Kıyâmet · Âhiret Yolculuğu · Cennet & Cehennem

## B. EKSTRA §13.24 DİKKAT (yalnız tefekkür/örtüşme dili, "ispat" ASLA)

**10. Kozmoloji & Tabiat (Fizik/Biyoloji)** — âfâk âyetleri
Bilimsel İşaretler · Tabiat Atlası · Zaman Boyutları
→ Bu disiplin sayfası **zorunlu** bir üst-uyarı taşır: "Bu başlık Kur'an'ı bir
bilim kitabı gibi sunmaz; bilimsel bulgular tefekküre vesiledir, Kur'an'ın
hakemi değildir." (§13.24 çerçeve metni birebir.)

---

## Teknik plan (sıfır yeni iddia, küçük adım)
1. `toolCatalog.js` + `_index.json`'a `disciplines: ['psikoloji', ...]` alanı
   (her araç/makale 1-3 disipline düşebilir; yukarıdaki harita temel).
2. `/keşfet` altında "Disipline Göre" görünüm: disiplin seç → o disipline
   etiketli mevcut araçlar/makaleler listelensin. (Var olan kart bileşenleri.)
3. Disiplin başlık metni: 1-2 cümle, kesinlik-çerçevesiyle; §13.34 humanizer'dan
   geçer; kozmoloji için §13.24 üst-uyarı.
4. RAG: disiplin etiketi searchText'e girerse §13.22 incremental embed.

## gpt-6-astra'ya sorulacak (REVIEW #1)
- Disiplin listesi ve kapsamı isabetli mi? Eksik/fazla disiplin var mı?
- Çerçeve ilkesi (Kur'an=sabit referans, disiplin=kapı) net ve yeterli mi?
- "Business/İktisat" ve "Kozmoloji" gibi riskli başlıklar doğru mu konumlanmış?
- Araç→disiplin haritasında yanlış/zorlama eşleşme var mı?
