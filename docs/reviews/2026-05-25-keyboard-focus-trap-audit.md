# QuranCodex — W22-U3 Klavye Navigation & Focus Trap Audit

Tarih: 2026-05-25
Branch: `migration-to-next.js`
Kapsam: `next/src/` — modal/dialog/overlay UI'larında klavye navigation, focus trap, focus return
Mod: audit + minimal fix (1 dosya)
İlgili kurallar: `CLAUDE.md` §9 (Accessibility), §13.10/13.11 (Overlay/Modal pattern), prior `2026-05-24-d2-focus-audit.md`

---

## 1. Özet

Migration sonrası tool route'ları full-page olduğu için (artık modal değil) klasik focus trap çoğu yerde gereksiz. **Gerçek modal/overlay sayısı: 12** (`role="dialog"` ile işaretli) + birkaç implicit popover (WordPopover, QuranCommands).

### Mevcut Durum (Genel)

| Pattern | Durum | Kapsam |
|---|---|---|
| `Escape` ile kapatma | ✅ Geniş kapsamlı | 40 dosya — neredeyse tüm overlay'lerde |
| `role="dialog"` | ⚠️ Kısmi | 12 component (ToolsBrowser, IblisSatan, KuranRenkleri, FurukAtlasi, MunasebatAtlasi, KiyametSahneleri, EsmaFrekans, Melekler, SebebiNuzul, DiyalogAgi, ToolStub, ReadingMode) |
| `aria-modal="true"` | ⚠️ Kısmi | 11 component (`role="dialog"` ile beraber çoğunda) |
| Tab key focus trap | ❌ **YOK** | Hiçbir component'ta explicit focus trap yok — Tab tuşu modal dışındaki elementlere kaçabilir |
| Focus return (modal kapanınca tetikleyiciye dön) | ❌ **YOK** | Hiç implementasyon yok |
| Initial focus (modal açılınca ilk focusable'a) | ⚠️ Kısmi | Sadece VerseGraph, ConceptGraph, SurahComparator search input'larında `inputRef.current?.focus()` |
| Backdrop click ile kapatma | ✅ Yaygın | WordPopover, çoğu modal'da var |

### W22-U4 Hatırlatma
Önceki audit'te TafsirPanel + ProphetAtlas için Esc handler'ları eklendi. **Bu commit'te (W22-U3)** sadece audit + 1 minimal fix yapıldı.

---

## 2. Modal/Overlay Sınıflandırması

### A. Gerçek Modal'lar (z-9999, `position: fixed`, backdrop)

| Dosya | role="dialog" | aria-modal | aria-label | Escape | Tab Trap | Focus Return | Severity |
|---|---|---|---|---|---|---|---|
| `WordPopover.jsx:148` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | **MED** |
| `TafsirPanel.jsx:302` | ⚠️ `complementary` | ❌ | ✅ "Tefsir Paneli" | ✅ | ❌ | ❌ | LOW |
| `ToolsBrowser.jsx:170` | ✅ | ✅ | n/a | implicit | ❌ | ❌ | LOW |
| `IblisSatan.jsx:490` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | LOW |
| `KuranRenkleri.jsx:1272` | ✅ | ✅ | n/a | ✅ | ❌ | ❌ | LOW |
| `FurukAtlasi.jsx:162` | ✅ | ✅ | n/a | ✅ | ❌ | ❌ | LOW |
| `MunasebatAtlasi.jsx:608, 623` | ✅ | ✅ | n/a | ✅ | ❌ | ❌ | LOW |
| `KiyametSahneleri.jsx:488` | ✅ | ✅ | n/a | ✅ | ❌ | ❌ | LOW |
| `EsmaFrekans.jsx:237` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | LOW |
| `Melekler.jsx:1114` | ✅ | ✅ | n/a | ⚠️ yok | ❌ | ❌ | LOW |
| `SebebiNuzul.jsx:1702, 1719` | ✅ | ✅ | n/a | implicit | ❌ | ❌ | LOW |
| `DiyalogAgi.jsx:228` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | LOW |
| `ToolStub.jsx:27` | ✅ | ❌ | n/a | ✅ | n/a stub | n/a | LOW |
| `QuranCommands.jsx:172` | ❌ | ❌ | n/a | ✅ | ❌ | ❌ | LOW (route-page) |

**Açıklama (severity):**
- **MED — WordPopover:** Drag-handle bottom-sheet (slide-up) — tablette/touch'ta sık kullanılan corpus kelime popover'ı. ARIA dialog işareti hiç yok; screen reader "modal açıldı" sinyali alamaz, klavye kullanıcısı popover'ın varlığını fark etmeyebilir.
- **LOW — TafsirPanel:** `role="complementary"` (sidebar landmark) kullanılmış — yarı doğru karar (kalıcı, body'ye paralel panel). Modal değil sidebar olduğu için `role="dialog"` zorunlu değil ama `aria-modal` da yok. Kullanım UX'i: Esc + close button mevcut.
- **LOW — Melekler.jsx:** Esc handler bulamadım (grep -n "Escape" → no hit). Tek kapatma yolu: close button. Severity LOW çünkü çoğu kullanıcı için button click yeterli.
- **LOW — QuranCommands:** Artık `/arac/buyruklar` full-page route'u. Modal değil "fullscreen page", `role="dialog"` semantik olarak yanlış olur — `<main>` daha doğru, ama yapısal refactor gerektirir.

### B. Klavye Tab Order Problemi (Genel)

**Hiçbir** modal'da focus trap yok. Davranış:

1. WordPopover açıldı → kullanıcı Tab basıyor → focus modal içindeki "Kavram Ağı" CTA button'una geçer (doğru)
2. Tab basmaya devam → modal içindeki tüm focusable elementler tüketildi
3. Tab basmaya devam → focus **modal'ın altında kalan** (z-index daha düşük) ReadingMode'un focusable elementlerine kaçıyor
4. Kullanıcı görsel olarak modal'da olduğunu sanıyor ama Tab arka plandaki bir butona vurabilir → kafa karışıklığı + accidental click riski

**WCAG 2.1 SC 2.4.3 "Focus Order"** ihlali (level A). Severity: orta — production'da kritik bug değil çünkü çoğu kullanıcı klavyeyle gezmiyor.

### C. Initial Focus Eksikliği

Modal açılınca focus tetikleyici button'da kalıyor (modal'ın altında). VerseGraph + ConceptGraph + SurahComparator yalnızca search modal'larında `inputRef.current?.focus()` çağırıyor. Diğer modallarda hiçbir focus yönlendirme yok → screen reader kullanıcı "yeni içerik açıldığını" duymak için manuel olarak Tab basmak zorunda.

### D. Focus Return Eksikliği

Modal kapandığında focus body'ye düşüyor (DOM default). Tetikleyici buton'a geri dönmüyor. Klavye kullanıcısı her modal kapanışında en üstten Tab'lamaya başlamak zorunda → ciddi UX bozulması.

---

## 3. Fix Önerileri (Önceliklendirilmiş)

### MED-1 — WordPopover ARIA Semantics (UYGULANDI)

**Sorun:** Bottom-sheet popover (Corpus kelime detay paneli) `role="dialog"` ve `aria-modal` taşımıyor. Screen reader kullanıcıları için "yeni modal açıldı" sinyali yok.

**Fix (minimal, güvenli):**
```jsx
// next/src/components/WordPopover.jsx — outer container
<div
  onClick={onClose}
  role="dialog"
  aria-modal="true"
  aria-label={tr ? 'Kelime detayı' : 'Word details'}
  style={{ position: 'fixed', inset: 0, zIndex: 10000, ... }}
>
```

Sadece 3 attribute eklendi. Hiçbir behavior değişmedi. Backdrop click + Escape handler zaten mevcut.

### LOW-1 — `useFocusTrap()` Hook (DEFERRED)

Genel çözüm olur ama 12+ modal'a eşzamanlı uygulama gerektirir, paralel agent'larla çakışma riski. Pattern hazır şablon:

```jsx
// next/src/hooks/useFocusTrap.js (NOT YAZILMADI, sadece şablon)
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const previouslyFocused = document.activeElement;
    const focusables = root.querySelectorAll(FOCUSABLE);
    focusables[0]?.focus();
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      const list = root.querySelectorAll(FOCUSABLE);
      if (list.length === 0) { e.preventDefault(); return; }
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };
    root.addEventListener('keydown', handler);
    return () => {
      root.removeEventListener('keydown', handler);
      previouslyFocused?.focus?.();  // focus return
    };
  }, [active, ref]);
}
```

**Neden DEFERRED:** Şablon implementation cross-modal davranışta köşe vakaları doğurabilir (örn. ToolsBrowser hover-driven popover, SebebiNuzul dual-modal stack). 12+ modal'ı tek seferde değiştirmek mevcut paralel agent çalışmalarıyla çakışabilir. Sonraki dedicated audit'te (W23) uygulanmalı.

### LOW-2 — Melekler.jsx Esc Handler Eklenmeli (DEFERRED)

Tek modal ki Esc handler yok. Refactor ihtiyacı düşük çünkü close button ve mobile menu erişilebilir. W22-U4 Esc-pattern audit'i için kuyruğa girer.

### LOW-3 — TafsirPanel role="dialog" Tartışması (DEFERRED — design decision)

Şu an `role="complementary"`. Sidebar mı modal mı kararı ürün-tasarım meselesi. Kullanıcı body sayfasıyla aynı anda etkileşemediği için aslında modal davranıyor — `role="dialog"` + `aria-modal="true"` daha doğru olabilir. Ama bu **paralel agent'in çalıştığı dosya değil**, yalnızca W22-U4 sırasında Esc eklenmişti. Risk düşük, ama design karar gerektiriyor.

---

## 4. Uygulanan Fix

**Dosya:** `next/src/components/WordPopover.jsx`
**Diff (kavramsal):**
```diff
   return (
     <div
       onClick={onClose}
+      role="dialog"
+      aria-modal="true"
+      aria-label={tr ? 'Kelime detayı' : 'Word details'}
       style={{
         position: 'fixed', inset: 0, zIndex: 10000,
```

**Doğrulama:** `npm run build` → başarılı (aşağıda).

---

## 5. Sonuç ve Öneriler

**Genel skor:** B- (geçer not, ama klavye-yalnız kullanıcılar için boşluklar var)
- ✅ Escape pattern'ı geniş (40 dosya)
- ✅ Backdrop click yaygın
- ⚠️ ARIA dialog markup'ı %60 oranında (12/~15)
- ❌ Tab focus trap hiç yok (level A WCAG ihlali)
- ❌ Focus return hiç yok
- ⚠️ Initial focus sadece search modal'larda

**Bir sonraki audit (W23) için öneri:**
1. `useFocusTrap()` hook'unu yaz, önce 1 modal'da test et (en izole olanı: ToolStub veya FurukAtlasi)
2. Başarılı olunca 11 modal'a yaygınlaştır
3. Focus return mekanizmasını eşzamanlı ekle
4. TafsirPanel için modal vs sidebar karar ver, ARIA güncelle
5. Melekler.jsx Esc handler ekle

result: 14 modal audit; 12 dialog-role + 1 partial, 5 issue (no tab-trap, no focus-return, partial initial focus, WordPopover ARIA missing, Melekler Esc missing); 1 fix uygulandi (WordPopover role+aria-modal+aria-label).
