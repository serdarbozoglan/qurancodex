import fs from 'node:fs';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default;

// react/no-unescaped-entities kozmetik temizliği. Yalnız JSXText düğümlerini
// (etiketler arasındaki DÜZ metin) hedefler — JSXExpressionContainer içindeki
// JS string'lere ({...}) veya attribute değerlerine DOKUNMAZ, AST bu ayrımı
// zaten kendiliğinden yapıyor. Yalnız `'` → `&apos;` ve `"` → `&quot;` —
// tarayıcıda BİREBİR AYNI karakteri render eder (görsel fark yok), yalnız
// JSX'in kendi söz dizimi kuralına uyar.
function transform(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    return { filePath, error: `parse error: ${e.message}` };
  }

  const edits = [];
  traverse(ast, {
    JSXText(path) {
      const { node } = path;
      if (!/['"]/.test(node.value)) return;
      const escaped = node.value.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
      if (escaped === node.value) return;
      edits.push({ start: node.start, end: node.end, text: escaped, line: node.loc.start.line });
    },
  });

  if (!edits.length) return { filePath, code, changed: false };

  edits.sort((a, b) => b.start - a.start);
  let out = code;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

  return { filePath, code: out, changed: true, count: edits.length };
}

const files = process.argv.slice(2);
const write = process.env.MQ_WRITE === '1';
let total = 0;
for (const f of files) {
  const res = transform(f);
  if (res.error) { console.log(`ERR  ${f}: ${res.error}`); continue; }
  if (res.changed) {
    total += res.count;
    console.log(`${write ? 'WROTE' : 'DRY  '} ${f}: ${res.count} JSXText düğümü değişti`);
    if (write) fs.writeFileSync(f, res.code);
  }
}
console.log(`\nTOTAL edited JSXText nodes=${total} files=${files.length}`);
