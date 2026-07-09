// Content lint — Kur'aniyyun tuzağı yasak ifadeler + allowlist.
// Spec §6.3 + §9 kabul kriteri: build-fail'e bağlı.
//
// Yasak: "Kur'an'da yok" gibi ifadeler tek başına, hedge olmadan.
// Allowlist: "Kur'an'da açıkça yok, sünnet-i mütevâtire ile sabit" güvenli.

const FORBIDDEN_PATTERNS = [
  /kur['ʼ']?an['ʼ']?da\s+yok\b/i,
  /sonradan\s+eklendi/i,
  /aslında\s+yok/i,
  /sadece\s+fıkıh/i,
  /fıkhî\s+ekleme/i,
];

// Allowlist — yasak pattern yakalanan string bu güvenli formülasyonlardan
// birini içeriyorsa flag atılmaz.
const ALLOWED_CONTEXTS = [
  /kur['ʼ']?an['ʼ']?da\s+açıkça\s+yok,\s+sünnet-i\s+mütevâtire\s+ile\s+sabit/i,
  /kur['ʼ']?an['ʼ']?da\s+doğrudan\s+geçmez,\s+.*tafsil/i,
  /kur['ʼ']?an['ʼ']?da\s+bu\s+ayr[ıi]m\s+yok,\s+sünnet/i,
];

export function lintContent(str, path = 'unknown') {
  if (!str || typeof str !== 'string') return [];
  const findings = [];
  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = str.match(pattern);
    if (!match) continue;
    // Allowlist check — güvenli context'te ise geç
    if (ALLOWED_CONTEXTS.some(safe => safe.test(str))) continue;
    findings.push({
      path,
      pattern: pattern.toString(),
      matched: match[0],
      snippet: str.slice(Math.max(0, match.index - 30), match.index + match[0].length + 30),
    });
  }
  return findings;
}

// Recursive object walker — her string field'ı lint'ler.
export function lintPillarData(data, pathPrefix = '$') {
  const all = [];
  const walk = (val, path) => {
    if (typeof val === 'string') {
      all.push(...lintContent(val, path));
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => walk(item, `${path}[${i}]`));
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) walk(v, `${path}.${k}`);
    }
  };
  walk(data, pathPrefix);
  return all;
}
