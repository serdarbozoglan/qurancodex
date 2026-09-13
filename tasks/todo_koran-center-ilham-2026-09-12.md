# koran.center İncelemesi → İlham Listesi (2026-09-12)

**Kaynak:** https://koran.center/en (ve alt sayfalar: /asmaul-husna, /1, ana menü)
**Yöntem:** WebFetch ile içerik/menü/görsel analiz + kendi kod tabanımızla (`toolCatalog`,
`ReadingMode.jsx`, `kutuphanem`, `Footer.jsx`, `BugReportFab.jsx`) karşılaştırma.

## Genel değerlendirme

koran.center **içerik derinliği ve görsellik açısından bizden geride** — 100 Esmâ'yı
açıklamasız/ayetsiz/sessiz liste olarak veriyor, sûre sayfası "Show Options" butonlarından
ibaret göründü, renk paleti "siyah metin beyaz zemin" seviyesinde minimal. Bizim
`/arac/esma-frekans`, `/atlas/kissa`, `/oku` (12k+ satır, reciter+interlinear+audio+Hatim
Duası) gibi sayfalarımız zaten çok daha ileride.

Asıl değer, **pratik kullanılabilirlik ve keşfedilebilirlik** tarafında: basit ama işlek
UX kalıpları (hamburger menüde her yardımcı aracın açıkça etiketlenmesi, rastgele
başlangıç CTA'sı, hedef bazlı okuma takibi). Aşağıdaki liste yalnız bunlardan, bizde
**gerçekten eksik olan veya zayıf olan** kısımları hedefliyor — mevcut derinliğimizi
tekrar icat etmiyor.

---

## TODO — öncelik sırasıyla

### 1. [ACİL, DÜŞÜK EFOR] Geri bildirim aracının keşfedilebilirliğini düzelt
**Durum:** Kullanıcı bunu ekran görüntüsüyle bizzat işaret etti (koran.center'ın hamburger
menüsündeki "Geri bildirimler" satırı — ikon + görünür metin + dış-link ikonu).

Bizim `BugReportFab.jsx` (`[locale]/layout.js:64`) zaten var ama:
- Sol altta 42px, opacity 0.6, yalnız ikon — sayfa açılışında fark edilmiyor.
- İkon (konuşma balonu + ünlem) "yardım/chat" ile karışıyor, hiçbir yerde "Sorun bildir"
  yazmıyor (yalnız hover tooltip — mobilde hiç görünmez).
- Footer.jsx'te (Hakkında/Kaynakça/e-posta linkleri var) hiç referansı yok, /hakkinda'da
  da yok, navbar mega-menüsünde de yok. Tek erişim = bu görünmez FAB.

**Yapılacak:**
- [ ] FAB'a sabit metin etiketi ekle (yalnız ikon değil — "Geri bildirim" / "Feedback"
  pill), en azından masaüstünde.
- [ ] `Footer.jsx`'e About/Bibliography linklerinin yanına açık bir "Geri Bildirim" linki
  ekle.
- [ ] `/hakkinda` sayfasına da bir satır ekle.
- [ ] Navbar mega-menüsünde uygun bir gruba (Hakkında grubu) satır olarak ekle.

### 2. [ORTA EFOR] Hedef bazlı "Okuma Serüveni" (Hatim takibi)
**Gözlem:** koran.center'ın "Start a Reading Journey" / "Reading Journeys" özelliği var
(hedef, ilerleme takibi). Bizde `src/lib/reading-progress.js` yalnız **son kalınan yeri**
(`qurancodex_last_position`) tutuyor — hedef, süre, günlük ilerleme, streak yok.
`ReadingMode.jsx`'te "Hatim Duası" (satır ~1292, ~4887, ~6813) zaten var ama bu yalnız
Kur'an'ı bitirince gösterilen bir dua ekranı — bir **takip sistemi değil**.

**Fikir (bizim tasarım diline uygun, kopya değil):** mevcut `ReadingProgressCard`'ı
genişleten bir "Okuma Serüveni" — kullanıcı bir hedef seçer (ör. "30 günde hatim",
"günde 1 sayfa", "Ramazan'a özel"), `kutuphanem` altında bir ilerleme çubuğu + günlük
seri (streak) sayacı görür, hedefe ulaşınca zaten var olan Hatim Duası ekranına bağlanır.
- [ ] `lib/reading-progress.js`'i genişlet: hedef tipi + başlangıç tarihi + günlük hedef
  (sayfa/ayet) + son N günün streak'i.
- [ ] `kutuphanem` sayfasına (veya ayrı `/oku` içinde bir panel) ilerleme kartı ekle.
- [ ] Anasayfadaki mevcut `ReadingProgressCard`'ı bu veriyle zenginleştir (yalnız "kaldığın
  yer" değil, "X gün seri" gibi bir satır).
- [ ] Görsel dil: mevcut gold-glow glassmorphism kart pattern'i (§13.20 CrossToolCTA
  stiliyle tutarlı) — koran.center'ın düz progress bar'ı değil.

### 3. [DÜŞÜK EFOR] Anasayfada "Rastgele bir ayetle başla" CTA
**Gözlem:** koran.center hero'sunda `/en/random`'a giden tek, sürtünmesiz bir giriş
noktası var. Bizim anasayfa araştırma/atlas ağırlıklı (14 derin bölüm, bkz. CLAUDE.md
§17) — ilk kez gelen, "sadece bir şey okumak isteyen" ziyaretçi için düşük efor'lu bir
keşif CTA'sı yok.
- [ ] Hero'ya veya "Kur'an'ı Oku" CTA'sının yanına küçük bir "Rastgele bir sayfa aç" /
  "Random surah" ikincil link ekle — `/oku/[rastgele 1-114]` içine yönlendirsin.
- [ ] Aşırıya kaçma: tek satır, ikincil buton — ana hero hiyerarşisini bozmasın (§11
  metin genişliği kurallarına uy).

### 4. [DEĞERLENDİRME GEREKİR — BÜYÜK KAPSAM] Çok dilli genişleme
**Gözlem:** koran.center TR/EN dışında Rusça, Azerice, Özbekçe, Kazakça, Ukraynaca da
sunuyor. Bu bizim için stratejik bir karar (i18n mimarisi zaten `/tr`, `/en` locale-prefix
route'lara göre kurulu — CLAUDE.md §16.4) — teknik olarak yeni bir locale eklemek
mümkün ama TÜM içeriğin (114 sûre + onlarca atlas/tool sayfası + tefekkür makaleleri)
çevirisi devasa bir efor. **Şimdilik yalnız not olarak bırakılıyor**, ayrı bir karar
gerektirir — bu turda uygulanmadı.

### 5. Zaten bizde daha iyi olan / dokunmayın
Bunlar koran.center'da var ama bizde zaten daha derin — **tekrar icat etmeye gerek yok**:
- Sûre okuma deneyimi: bizim `ReadingMode.jsx` (reciter seçimi, interlinear/kelime-kelime,
  audio, tecvid overlay, Hatim Duası) koran.center'ın "Show Options" düğmelerinden çok
  daha kapsamlı.
- Esmâ-i Hüsnâ: `/arac/esma-frekans` frekans analizi sunuyor, koran.center'ın 100 isimlik
  açıklamasız/ayetsiz listesinden çok ileride.
- Kıssalar/Peygamberler/Meseller: `/atlas/kissa`, `/atlas/peygamber`, `/atlas/mesel` zaten
  var ve klasik tefsir kaynaklı (§13.30 doğrulama disiplinine tabi) — koran.center'ın
  düz metin listelerinden nitelik olarak farklı.
- Kütüphane (bookmark): `kutuphanem` 27+ tip destekliyor, koran.center'ın "Bookmarks"ından
  daha zengin.

---

## Sıradaki adım
Kullanıcı onayı ile önce **madde 1** (geri bildirim keşfedilebilirliği) uygulanabilir —
en düşük efor, en somut kullanıcı şikayeti. Madde 2 ve 3 ayrı görevler olarak planlanmalı.
