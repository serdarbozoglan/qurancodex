// ─── Kontrast ölçümü — WCAG 2.1 (§13.25 md. 9) ──────────────────────────────
//
// 2026-08-13. Bu tarihe kadar sitede kontrast HİÇ ölçülmemişti; erişilebilirlik
// notu (76) bu boşluğun üstünde duruyordu. Bir kez yazılır, 74 sayfada çalışır.
//
// Zorluk koyu temada alfa: metin `rgba(148,163,184,0.7)` olabilir, kapsayıcı
// `rgba(255,255,255,0.05)`, onun kapsayıcısı gradyan… Bu yüzden:
//   1. Metin renginin alfası, üzerine oturduğu efektif zeminle KARIŞTIRILIR
//   2. Zemin, ilk opak renge kadar yukarı yürünerek katman katman birleştirilir
//   3. Ata `opacity` zinciri de metin alfasına çarpılır
//
// ⚠ SINIR: gradyan / arka plan görseli olan kapsayıcılarda `background-color`
// çoğu zaman `transparent` döner; o durumda bir üst opak renk kullanılır.
// Bu bir YAKLAŞIM — düşük çıkan değerler gözle doğrulanmalı, yüksek çıkanlar
// güvenli sayılabilir.
// ────────────────────────────────────────────────────────────────────────────

export const CONTRAST_PROBE = `(() => {
  const parse = (c) => {
    const m = String(c).match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  // Gradyanın renk duraklarını çıkarır. Chrome hesaplanmış stilde durakları
  // rgb()/rgba() olarak normalize eder, bu yüzden tek desen yeterli.
  const stopsOf = (bgImage) => {
    const m = String(bgImage).match(/rgba?\\([^)]+\\)/g);
    if (!m) return [];
    const out = [];
    for (const c of m) { const p = parse(c); if (p) out.push(p); }
    return out;
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  // Efektif zemin: ilk opak renge kadar yukarı yürü, katmanları birleştir.
  // GRADYAN TESPİTİ: bir ata background-image taşıyorsa zemin tek bir renkle
  // temsil edilemez — ölçüm ÖLÇÜLEMEZ olarak işaretlenir.
  // (2026-08-13: ilk sürüm bunu yapmıyordu ve "ÖNE ÇIKAN" rozeti — altın
  //  gradyan üstünde koyu metin, yani YÜKSEK kontrast — ratio 1 diye
  //  raporlanıyordu. Klasik yanlış pozitif.)
  const bgOf = (el) => {
    const stack = [];
    let n = el, gradient = false, gradStops = null, unresolved = false;
    while (n && n !== document.documentElement.parentNode) {
      const cs = getComputedStyle(n);
      // html/body ATLANIR: ikisi de sitenin ambiyans dokusunu taşıyor
      // (grain %2.8, filigran %1.5, radyal parıltı %2.8) — bunlar zemini
      // ölçülemez yapmaz, cosmic-black sayılır. Bu istisna olmadan HER öge
      // "gradyan" damgası yiyordu ve probe hiçbir şey raporlamıyordu.
      const isRoot = n === document.documentElement || n === document.body;
      if (!isRoot && cs.backgroundImage && cs.backgroundImage !== 'none') {
        gradient = true;
        // 2026-08-31 — ESKİ DAVRANIŞ: gradyan görülünce yalnız damga vurulup
        // en yakın OPAK renge göre ölçülüyordu. Dolu bir gradyan butonda o
        // renk şeffaf olduğu için yukarı yürünüp koyu zemin bulunuyor, koyu
        // metin koyu zemine karşı ölçülüyor ve oran 1.04 çıkıyordu — ölçüm
        // değil gürültü. Artık durakları ayrıştırıyoruz ve EN KÖTÜ durağa
        // göre ölçüyoruz; böylece gradyanın koyu ucunda eşiğin altına düşen
        // metin gerçekten yakalanıyor.
        const st = stopsOf(cs.backgroundImage);
        if (st.length) { if (!gradStops) gradStops = st; }
        else unresolved = true;   // url(...) görsel — hâlâ ölçülemez
      }
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    let base = { r: 10, g: 10, b: 26, a: 1 }; // --color-cosmic-black yedeği
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    // Gradyan çözüldüyse her durak, altındaki zemine bindirilerek aday olur.
    // Şeffaf duraklar (ör. transparent 100%) alttaki zemine dönüşür, yani
    // hafif bir kaplama gradyanı sonucu bozmaz.
    if (gradStops) {
      return { bases: gradStops.map((c) => over(c, base)), gradient: true, resolved: true };
    }
    return { bases: [base], gradient, resolved: !unresolved && !gradient };
  };
  const opacityChain = (el) => {
    let o = 1, n = el;
    while (n && n.nodeType === 1) { o *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
    return o;
  };

  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    // yalnız DOĞRUDAN metin taşıyan ögeler
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    // YALNIZ GÖRÜNÜR ALANDAKİ ÖGELER (2026-08-31).
    // Sitede bölümler scroll-reveal ile açılıyor: görünür alana girmeden önce
    // iç içe üç kapsayıcı birden opacity:0.5'te duruyor (0.5³ ≈ 0.13) ve probe
    // bunu "1.22 kontrast" diye raporluyordu. Ölçüldü: aynı öge ekrana girip
    // reveal tamamlanınca opaklık zinciri BOŞ, oran tam — yani ihlal yok.
    // Şişmenin ana kaynağı buydu. Artık yalnız o an ekranda olan ölçülür;
    // sayfayı adım adım gezmek audit-contrast.mjs'in işi.
    if (r.bottom < 0 || r.top > window.innerHeight) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const chainOp = opacityChain(el);
    if (chainOp < 0.05) continue;                       // görünmez sayılır
    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const fg = { ...fg0, a: fg0.a * chainOp };
    const bg = bgOf(el);
    // Gradyanlı zeminde ATLAMAK ölçümü yalanlar: 26 bulgu 2'ye düşmüştü ve
    // bu bir düzelme DEĞİL, gizlemeydi. Onun yerine iki kova:
    //   kesin      → zemin tek bir opak renk, oran güvenilir
    //   yaklaşık   → zeminde gradyan var, en yakın opak renkle hesaplandı
    // İkinci kova gözle doğrulanmalı; sitedeki gradyanların çoğu koyu zemin
    // üstünde %5 altın olduğu için yaklaşım genelde 0.1-0.2 içinde kalıyor —
    // ama "ÖNE ÇIKAN" rozeti gibi zemin GRADYANIN KENDİSİ olan yerlerde
    // tamamen yanıltır.
    let cr = Infinity;
    for (const cand of bg.bases) {
      const v = ratio(over(fg, cand), cand);
      if (v < cr) cr = v;
    }
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    // WCAG: büyük metin = >=24px, ya da >=18.66px ve kalın
    const large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3.0 : 4.5;
    if (cr >= need) continue;
    const txt = own.map((n) => n.textContent.trim()).join(' ').slice(0, 46);
    // Tekilleştirme METNE göre değil, STİL BAĞLAMINA göre (2026-08-31).
    // Eski anahtar renk|punto|METİN idi ve aynı metnin farklı zeminlerdeki
    // örneklerini tek kayda indiriyordu: "İnteraktif Araçlar" hem mega-menü
    // panelinde (gradyan zemin) hem bölüm içinde (cosmic-black) geçiyor;
    // kaydedilen ilk örnek olduğu için rapor 1.35 diyordu, oysa sayfadaki
    // öge 8.81'di. Yani sayı hem şişiyor hem yanlış yeri gösteriyordu.
    //
    // Doğru ölçüt "kaç ayrı DÜZELTME gerekiyor": aynı renk + punto + efektif
    // zemin + opaklık zinciri tek bir CSS düzeltmesiyle çözülür, dolayısıyla
    // tek kayıttır. Metin artık yalnız örnek olarak taşınıyor, anahtar değil.
    const bgKey = bg.bases.map((c) => Math.round(c.r) + ',' + Math.round(c.g) + ',' + Math.round(c.b)).join('/');
    const key = cs.color + '|' + Math.round(px) + '|' + bgKey + '|' + Math.round(chainOp * 100);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      ratio: Math.round(cr * 100) / 100,
      need,
      px: Math.round(px * 10) / 10,
      large,
      color: cs.color,
      opacity: Math.round(chainOp * 100) / 100,
      sec: (el.closest('section[id],div[id]') || {}).id || '',
      text: txt,
      // approx artık YALNIZ gerçekten ölçülemeyenler için: arka plan görseli
      // (url) ya da ayrıştırılamayan gradyan. Çözülmüş gradyanlar gerçek
      // ölçümdür ve elenmemelidir.
      approx: !bg.resolved,
      onGradient: bg.gradient,
      stops: bg.bases.length,
    });
  }
  return out.sort((a, b) => a.ratio - b.ratio);
})()`;
