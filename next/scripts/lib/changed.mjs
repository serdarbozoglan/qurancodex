// Değişen satır/dosya yardımcıları — diff tabanlı denetimler için.
// Karşılaştırma tabanı: upstream'in son bilinen hâli (origin/<dal>) varsa o,
// yoksa HEAD~1. Çalışma ağacındaki henüz commit'lenmemiş değişiklikler de
// dahil (push'tan önce her şey commit'lenmiş olmalı ama garanti değil).
import { execSync } from 'node:child_process';

export function sh(cmd, cwd) {
  return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
}

export function diffBase(cwd) {
  try {
    const up = sh('git rev-parse --abbrev-ref --symbolic-full-name @{u}', cwd).trim();
    if (up) return up;
  } catch { /* upstream yok */ }
  try { sh('git rev-parse HEAD~1', cwd); return 'HEAD~1'; } catch { return null; }
}

// [{file, line, text}] — yalnız EKLENEN satırlar (repo köküne göre yol).
export function addedLines(cwd, pathFilter = () => true) {
  const base = diffBase(cwd);
  const out = [];
  const parse = (txt) => {
    let file = null, line = 0;
    for (const raw of txt.split('\n')) {
      if (raw.startsWith('+++ ')) { file = raw.slice(4).replace(/^b\//, ''); continue; }
      if (raw.startsWith('@@')) { const m = raw.match(/\+(\d+)/); line = m ? +m[1] - 1 : 0; continue; }
      if (!file || file === '/dev/null') continue;
      if (raw.startsWith('+')) { line++; if (pathFilter(file)) out.push({ file, line, text: raw.slice(1) }); }
      else if (!raw.startsWith('-')) line++;
    }
  };
  try { if (base) parse(sh(`git diff --unified=0 --no-color ${base} -- .`, cwd)); } catch { /* yoksay */ }
  try { parse(sh('git diff --unified=0 --no-color -- .', cwd)); } catch { /* yoksay */ }
  return out;
}

export function changedFiles(cwd) {
  const base = diffBase(cwd);
  const set = new Set();
  const add = (txt) => txt.split('\n').map(s => s.trim()).filter(Boolean).forEach(f => set.add(f));
  try { if (base) add(sh(`git diff --name-only ${base} -- .`, cwd)); } catch { /* yoksay */ }
  try { add(sh('git diff --name-only -- .', cwd)); } catch { /* yoksay */ }
  try { add(sh('git ls-files --others --exclude-standard -- .', cwd)); } catch { /* yoksay */ }
  return [...set];
}

// Verilen yolların HEAD'deki ağaç özetlerinden tek bir kimlik üretir; çalışma
// ağacı kirliyse (o yollarda commit'lenmemiş değişiklik) 'dirty' eklenir.
export function treeStamp(cwd, paths) {
  // `HEAD:<yol>` repo KOKUNE gore cozulur; cwd `next/` ise `HEAD:src` yok
  // sayilir ve damga 'none' olur -- yani her agacla eslesir (ilk surumde
  // tam bu oldu, olculdu: "src=none"). show-prefix ile onek eklenir.
  let prefix = ''; try { prefix = sh('git rev-parse --show-prefix', cwd).trim(); } catch { /* kok */ }
  const parts = [];
  for (const p of paths) {
    let id = 'none';
    try { id = sh(`git rev-parse HEAD:${prefix}${p}`, cwd).trim(); } catch { /* yol yok */ }
    if (id === 'none') throw new Error(`treeStamp: HEAD:${prefix}${p} cozulemedi -- damga uretilemez`);
    parts.push(p + '=' + id);
  }
  let dirty = false;
  try { sh(`git diff --quiet -- ${paths.join(' ')}`, cwd); } catch { dirty = true; }
  try { if (sh(`git ls-files --others --exclude-standard -- ${paths.join(' ')}`, cwd).trim()) dirty = true; } catch { /* yoksay */ }
  return { id: parts.join('|'), dirty };
}
