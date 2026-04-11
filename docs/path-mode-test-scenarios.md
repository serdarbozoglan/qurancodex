# Path Mode — Manual Test Scenarios (TD-3)

**Amaç:** PathContext + PathBreadcrumb'un gerçek tarayıcıda doğru çalıştığını
doğrulamak. Automated testler (`src/__tests__/path-context.test.jsx`) state
machine'i kapsar, ama smooth scroll, gerçek overlay mount/unmount ve
popstate timing için manuel test gerekli.

**Nasıl kullanılır:**
1. `npm run dev` — dev server başlat (localhost:5173)
2. Her senaryo için: tarayıcıda sıfırla (`sessionStorage.clear()` + F5)
3. Adımları tam sırayla uygula
4. Her "Beklenen" satırını gözle doğrula
5. Failing senaryo varsa: çıktıyı not al, **atlanmış test** olarak işaretle

---

## Senaryo 1 — Dil yolu tam walk (TD-1 fix doğrulaması)

**Hazırlık:**
- PathCards section'a scroll (homepage'den)
- "Kur'an'ın Dilini Keşfet" kartına tıkla → `Bu Yola Başla`

**Adımlar:**
1. ✅ Breadcrumb ekranda belirir (sticky bottom, 720px max-width)
2. ✅ Step 1/4, "Dilsel DNA" etiketi
3. ✅ Sayfa `#linguistic` section'ına smooth scroll
4. ✅ "Sonraki" tıkla → Step 2/4 "İmkansız Ritim" — `#rhythm` section'ına scroll
5. ✅ "Sonraki" → Step 3/4 "Ses Mimarisi" — `#sounds` scroll
6. ✅ "Sonraki" → Step 4/4 "Kur'an'ın Retoriği" — `#rhetoric` scroll
7. ✅ "Sonraki" disabled (son adım), "Yolu Tamamla" butonu gözüküyor

**TD-1 regression checkpoints:**
8. 🔍 **"Önceki" tıkla** → Step 3/4 "Ses Mimarisi" — **sayfa `#sounds` section'ına scroll etmeli**
9. 🔍 "Önceki" → Step 2/4 "İmkansız Ritim" — **`#rhythm` scroll**
10. 🔍 "Önceki" → Step 1/4 "Dilsel DNA" — **`#linguistic` scroll**
11. ✅ "Önceki" disabled (ilk adım)
12. ✅ Dot row: 1. dot aktif gold, diğerleri sönük

**PASS kriteri:** 8-10 numaraları smooth scroll ile **doğru** section'a gider.
Yanlış section'da kalırsa TD-1 hala var.

---

## Senaryo 2 — Peygamberler yolu (tüm overlay)

**Hazırlık:** Clear state → "Peygamberleri ve Kıssaları Tanı" → `Bu Yola Başla`

**Adımlar:**
1. ✅ Breadcrumb belirir + KissaAtlas overlay otomatik açılır
2. ✅ Step 1/3, "Kıssa Atlası" etiketi
3. 🔍 Overlay'in ✕ veya ESC ile kapat
4. ✅ ~300ms sonra **ProphetAtlas otomatik açılır** (auto-advance)
5. ✅ Step 2/3, "Peygamberler Atlası" etiketi
6. 🔍 ProphetAtlas kapat → KavimlerAtlasi otomatik açılır
7. ✅ Step 3/3, "Kavimler Atlası"
8. ✅ "Yolu Tamamla" butonu görünür
9. 🔍 "Yolu Tamamla" tıkla → breadcrumb "✓ tamamlandı" gösterir
10. ✅ 1.5s sonra breadcrumb kaybolur
11. 🔍 KavimlerAtlasi hala açık (stay-in-place rule)
12. 🔍 KavimlerAtlasi kapat → sayfa `#path-cards` section'ına soft scroll eder
13. ✅ PathCards'ta Peygamberler kartında ✓ badge görünür

---

## Senaryo 3 — Auto-advance overlay close

**Senaryo 2'nin alt-case'i — ama odak: popstate timing**

**Test:**
- Peygamberler yolu, Step 1 (KissaAtlas) açık
- Overlay backdrop'a tıkla → auto-advance olmalı mı?
- ESC basarak kapat → 300ms sonra Step 2 açılmalı
- ✕ butonuna tıkla → 300ms sonra Step 2 açılmalı

**Gözlenmesi gereken bug:**
- Step 2 iki kez açılırsa → popstate double-fire
- Step 2 hiç açılmazsa → `skipAutoAdvanceRef` yanlış set
- Flicker görülürse → timer koordinasyonu bozuk

---

## Senaryo 4 — F5 restore overlay step

**Hazırlık:** Peygamberler yolu, Step 2 (ProphetAtlas) açıkken F5 bas

**Adımlar:**
1. ✅ Sayfa yenilenir
2. ✅ Breadcrumb hemen görünür (sessionStorage'dan restore)
3. ✅ Step 2/3, "Peygamberler Atlası"
4. 🔍 ~100ms sonra ProphetAtlas otomatik yeniden açılır (PathContext
   `restoreHandledRef` effect)
5. ✅ "Önceki" tıkla → KissaAtlas açılır (history.back + new dispatch sequence)

---

## Senaryo 5 — Listener leak prevention

**Senaryo:** Kullanıcı overlay-step son adımında "Yolu Tamamla" basar,
modal'ı kapatmaz, doğrudan yeni bir path başlatır.

**Test:**
1. Peygamberler yolu Step 3 (KavimlerAtlasi) açık
2. "Yolu Tamamla" tıkla
3. KavimlerAtlasi **hala açık** — kapatma
4. Breadcrumb kaybolur (1.5s sonra)
5. Modal'ı kapatmadan → PathCards'a scroll et manuel
6. "Kur'an'ın Dilini Keşfet" → Bu Yola Başla
7. ✅ Dil yolu başlar, Step 1 açılır
8. 🔍 **Şimdi eski KavimlerAtlasi modal'ı varsa** kapat
9. 🔍 **Sayfa `#path-cards`'a scroll ETMEMELİ** — Dil yolu Step 1'de kalmalı

**PASS kriteri:** 9 numarada scroll gerçekleşmezse listener leak yok.
Scroll olursa → `startPath` içindeki `clearCompletionScrollListener()` çalışmıyor.

---

## Senaryo 6 — Mid-path dot click

**Test:**
1. Dil yolu başlat → Step 1
2. Dot row'da 4. dot'a tıkla → Step 4 doğrudan açılır
3. Dot 2'ye tıkla → Step 2'ye geri döner
4. ✅ Her dot click → doğru section'a scroll
5. ✅ Active dot her zaman current step'i gösterir
6. ✅ Past (daha önce ziyaret edilmiş) dot'lar farklı renkte (gold fade)

**Overlay path için ek:**
7. Peygamberler Step 1 (KissaAtlas) açık
8. Dot 3'e tıkla → KissaAtlas kapanır, KavimlerAtlasi açılır
9. ✅ Flicker yok, homepage'ye dönmüyor

---

## Senaryo 7 — ESC ile exit (section step üzerinde)

**Test:**
1. Dil yolu Step 2 (İmkansız Ritim)
2. **ESC** bas
3. ✅ Breadcrumb kaybolur (path mode exit)
4. ✅ sessionStorage temiz
5. ✅ Sayfa hala `#rhythm` section'ında

**Edge case — overlay step'te ESC:**
6. Peygamberler yolu Step 1 (KissaAtlas açık)
7. ESC bas → **Overlay kapanır**, path mode aktif kalır
8. ✅ ~300ms sonra Step 2 otomatik açılır (auto-advance)
9. ❌ Path mode exit OLMAMALI (overlay ESC handler'ı path mode ESC'i yutar)

---

## Senaryo 8 — Tarayıcı geri/ileri butonları

**Test:**
1. Path başlat, overlay step aç
2. Tarayıcı ← butonu → overlay kapanır + auto-advance (Senaryo 3 ile aynı)
3. Tarayıcı → butonu → ?

**Bu davranış hiç test edilmedi — beklenen: history entry'sine göre
devam etmeli. Tespit edilmesi gereken bug'lar var mı dikkat et.**

---

## Notlar

- Tüm senaryolar **dev mode** için yazıldı (HMR açık, verbose error'lar).
  Production build (`npm run build && npm run preview`) ayrı bir test turu
  ister — özellikle popstate timing.
- **Mobil test yapılmadı.** 720px breadcrumb mobil'de ekranı aşabilir.
  TD-5'e dahil.
- Senaryo 8 (tarayıcı geri/ileri) henüz otomatik değil, **bilinen test açığı**.

## İlgili kod

- [src/contexts/PathContext.jsx](../src/contexts/PathContext.jsx)
- [src/components/PathBreadcrumb.jsx](../src/components/PathBreadcrumb.jsx)
- [src/data/paths.jsx](../src/data/paths.jsx)
- [src/__tests__/path-context.test.jsx](../src/__tests__/path-context.test.jsx) — automated coverage
