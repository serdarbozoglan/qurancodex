import fs from 'node:fs';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default;

// Longhand side suffixes used throughout globals.css (.mq-box)
const SIDE_SUFFIX = { top: 'pt', right: 'pr', bottom: 'pb', left: 'pl' };
const MARGIN_SIDE_SUFFIX = { top: 'mt', right: 'mr', bottom: 'mb', left: 'ml' };

const LONGHAND_PROPS = {
  paddingTop: 'pt', paddingBottom: 'pb', paddingLeft: 'pl', paddingRight: 'pr',
  marginTop: 'mt', marginBottom: 'mb', marginLeft: 'ml', marginRight: 'mr',
};
const SHORTHAND_PROPS = { padding: SIDE_SUFFIX, margin: MARGIN_SIDE_SUFFIX };
const TARGET_PROPS = new Set([...Object.keys(LONGHAND_PROPS), ...Object.keys(SHORTHAND_PROPS)]);

function isSimpleNode(node) {
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral') return true;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return true;
  return false;
}

function rawValue(node) {
  // Returns the literal's raw string/number value (unquoted) for shorthand token parsing.
  if (node.type === 'StringLiteral') return String(node.value);
  if (node.type === 'NumericLiteral') return String(node.value);
  if (node.type === 'TemplateLiteral') return node.quasis.map((q) => q.value.cooked).join('');
  return null;
}

// Standard CSS shorthand expansion (1/2/3/4-token forms) -> {top,right,bottom,left} as strings (unitless numbers pass through as-is, consumer decides).
function expandShorthand(raw) {
  if (raw.includes('(')) return null; // calc()/var() etc — refuse, ambiguous split
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || tokens.length > 4) return null;
  let top, right, bottom, left;
  if (tokens.length === 1) { top = right = bottom = left = tokens[0]; }
  else if (tokens.length === 2) { top = bottom = tokens[0]; left = right = tokens[1]; }
  else if (tokens.length === 3) { top = tokens[0]; left = right = tokens[1]; bottom = tokens[2]; }
  else { [top, right, bottom, left] = tokens; }
  return { top, right, bottom, left };
}

function transform(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    return { filePath, error: `parse error: ${e.message}` };
  }

  const rawEdits = []; // { start, end, text, openingEl, line, keyName }
  const skipped = [];
  const openingElInfo = new Map();

  traverse(ast, {
    ObjectProperty(path) {
      const { node } = path;
      if (node.computed) return;
      const keyName = node.key.type === 'Identifier' ? node.key.name : (node.key.type === 'StringLiteral' ? node.key.value : null);
      if (!keyName || !TARGET_PROPS.has(keyName)) return;
      const val = node.value;
      if (val.type !== 'ConditionalExpression') return;
      if (val.test.type !== 'Identifier' || val.test.name !== 'isMobile') return;

      const objExprPath = path.parentPath;
      if (!objExprPath || objExprPath.node.type !== 'ObjectExpression') return;
      const exprContainerPath = objExprPath.parentPath;
      if (!exprContainerPath || exprContainerPath.node.type !== 'JSXExpressionContainer') return;
      const attrPath = exprContainerPath.parentPath;
      if (!attrPath || attrPath.node.type !== 'JSXAttribute') return;
      if (attrPath.node.name.name !== 'style') return;
      const openingEl = attrPath.parentPath.node;
      if (!openingEl || openingEl.type !== 'JSXOpeningElement') return;

      if (!isSimpleNode(val.consequent) || !isSimpleNode(val.alternate)) {
        skipped.push({ line: node.loc.start.line, reason: 'non-simple ternary branch', keyName });
        return;
      }

      let newText;
      if (keyName in LONGHAND_PROPS) {
        const prefix = LONGHAND_PROPS[keyName];
        const mobileSrc = code.slice(val.consequent.start, val.consequent.end);
        const desktopSrc = code.slice(val.alternate.start, val.alternate.end);
        newText = `'--${prefix}-d': ${desktopSrc}, '--${prefix}-m': ${mobileSrc}`;
      } else {
        // shorthand: padding / margin — expand both branches into 4 sides independently
        const sideMap = SHORTHAND_PROPS[keyName];
        const mobileRaw = rawValue(val.consequent);
        const desktopRaw = rawValue(val.alternate);
        if (mobileRaw == null || desktopRaw == null) {
          skipped.push({ line: node.loc.start.line, reason: 'could not extract raw value', keyName });
          return;
        }
        const mobileSides = expandShorthand(mobileRaw);
        const desktopSides = expandShorthand(desktopRaw);
        if (!mobileSides || !desktopSides) {
          skipped.push({ line: node.loc.start.line, reason: 'shorthand has calc()/var() or >4 tokens', keyName });
          return;
        }
        const parts = [];
        for (const side of ['top', 'right', 'bottom', 'left']) {
          const suffix = sideMap[side];
          parts.push(`'--${suffix}-d': ${JSON.stringify(desktopSides[side])}`);
          parts.push(`'--${suffix}-m': ${JSON.stringify(mobileSides[side])}`);
        }
        newText = parts.join(', ');
      }

      rawEdits.push({ start: node.start, end: node.end, text: newText, openingEl, line: node.loc.start.line, keyName });

      if (!openingElInfo.has(openingEl)) {
        const classNameAttr = openingEl.attributes.find(
          (a) => a.type === 'JSXAttribute' && a.name && a.name.name === 'className'
        );
        if (classNameAttr) {
          if (classNameAttr.value && classNameAttr.value.type === 'StringLiteral') {
            openingElInfo.set(openingEl, { kind: 'append-string', attr: classNameAttr });
          } else {
            openingElInfo.set(openingEl, { kind: 'skip-dynamic', line: openingEl.loc.start.line });
          }
        } else {
          openingElInfo.set(openingEl, { kind: 'insert-new', afterOffset: openingEl.name.end });
        }
      }
    },
  });

  const propEdits = [];
  for (const e of rawEdits) {
    const info = openingElInfo.get(e.openingEl);
    if (info.kind === 'skip-dynamic') {
      skipped.push({ line: e.line, reason: 'className is dynamic expression, skipped element', keyName: e.keyName });
    } else {
      propEdits.push(e);
    }
  }

  if (propEdits.length === 0) {
    return { filePath, code, changed: false, skipped };
  }

  const usedOpeningEls = new Set(propEdits.map((e) => e.openingEl));
  const classNameEdits = [];
  for (const el of usedOpeningEls) {
    const info = openingElInfo.get(el);
    if (info.kind === 'append-string') {
      const attrNode = info.attr;
      const existing = attrNode.value.value;
      if (/\bmq-box\b/.test(existing)) continue;
      const newVal = `${existing} mq-box`.trim();
      classNameEdits.push({ start: attrNode.value.start, end: attrNode.value.end, text: JSON.stringify(newVal) });
    } else if (info.kind === 'insert-new') {
      classNameEdits.push({ start: info.afterOffset, end: info.afterOffset, text: ' className="mq-box"' });
    }
  }

  const allEdits = [...propEdits.map((e) => ({ start: e.start, end: e.end, text: e.text })), ...classNameEdits];
  allEdits.sort((a, b) => b.start - a.start);

  let out = code;
  for (const e of allEdits) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }

  return { filePath, code: out, changed: true, count: propEdits.length, skipped };
}

const files = process.argv.slice(2);
const write = process.env.MQ_WRITE === '1';
let totalConverted = 0;
let totalSkipped = 0;
for (const f of files) {
  const res = transform(f);
  if (res.error) {
    console.log(`ERR  ${f}: ${res.error}`);
    continue;
  }
  if (res.changed) {
    totalConverted += res.count;
    console.log(`${write ? 'WROTE' : 'DRY  '} ${f}: ${res.count} converted, ${res.skipped.length} skipped`);
    if (write) fs.writeFileSync(f, res.code);
  } else if (res.skipped.length) {
    console.log(`NOOP ${f}: 0 converted, ${res.skipped.length} skipped`);
  }
  for (const s of res.skipped) {
    totalSkipped++;
    console.log(`  skip L${s.line} ${s.keyName}: ${s.reason}`);
  }
}
console.log(`\nTOTAL converted=${totalConverted} skipped=${totalSkipped} files=${files.length}`);
