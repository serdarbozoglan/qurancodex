import { parse } from '@babel/parser';
import fs from 'fs';

const path = 'src/components/ReadingMode.jsx';
let src = fs.readFileSync(path, 'utf8');

function tryParse(code) {
  try {
    parse(code, { sourceType: 'module', plugins: ['jsx'], errorRecovery: false });
    return null;
  } catch (e) {
    return e;
  }
}

function looksLikePropLine(line) {
  const t = line.trim();
  if (t === '') return true; // blank counts as "skip upward"
  // property assignment: identifier: ..., possibly with trailing comma
  if (/^[a-zA-Z_$][\w$]*\s*:/.test(t)) return true;
  // continuation lines that are pure values (template literals, ternary arms, etc.)
  if (/^[?:]\s/.test(t)) return true;
  if (/^`.*`,?$/.test(t)) return true;
  return false;
}

function isBoundaryLine(line) {
  const t = line.trim();
  if (t.startsWith('//')) return true;
  if (t.startsWith('{/*') || t.startsWith('/*') || t.endsWith('*/}') || t.endsWith('*/')) return true;
  if (t === ')') return true;
  if (t.endsWith(')}') || t.endsWith(')};')) return true;
  if (t.endsWith('}') && !t.includes(':')) return true;
  if (t.startsWith('</')) return true;
  if (t.startsWith('return (')) return true;
  if (t.endsWith('(')) return true;
  if (t.endsWith('>') && !t.endsWith('=>')) return true; // JSX tag opener/closer
  if (t.endsWith('{')) return true;
  return false;
}

let fixes = 0;
let seen = new Set();

for (let iter = 0; iter < 200; iter++) {
  const err = tryParse(src);
  if (!err) {
    console.log('PARSE OK after', fixes, 'fixes');
    break;
  }
  const loc = err.loc;
  if (!loc) { console.log('no loc:', err.message); break; }

  const lines = src.split('\n');
  // Scan backward from the error line to find the orphan insertion point:
  // the first line (from the error, going up) that is a boundary (not a
  // property-continuation line). Insert opener right after that boundary.
  let idx = loc.line - 1; // 0-based
  // If the error line itself is already a boundary/closer like `}}>`, start
  // scanning from the line ABOVE it (since that closer belongs to the
  // orphaned object, not something we skip past).
  let scan = idx;
  // Walk upward while lines look like property continuations.
  while (scan > 0 && looksLikePropLine(lines[scan])) {
    scan--;
  }
  // `scan` now points at a boundary line (or 0). Insertion point is scan+1.
  const insertAt = scan + 1;
  const sig = insertAt + ':' + lines[insertAt];
  if (seen.has(sig)) {
    console.log('STUCK — same insertion point repeated:', insertAt, JSON.stringify(lines[insertAt]));
    console.log('Original error:', err.message, 'at', loc.line);
    break;
  }
  seen.add(sig);

  // Sanity check: the line at insertAt should look like a property line
  // (otherwise our heuristic picked a bad spot).
  if (!looksLikePropLine(lines[insertAt]) || lines[insertAt].trim() === '') {
    console.log('Insertion point does not look like a property line — aborting for manual review.');
    console.log('insertAt', insertAt, JSON.stringify(lines[insertAt]));
    console.log('boundary line (scan)', scan, JSON.stringify(lines[scan]));
    console.log('error:', err.message, 'at line', loc.line);
    break;
  }

  const propIndent = (lines[insertAt].match(/^(\s*)/) || ['', ''])[1];
  const tagIndent = propIndent.length >= 2 ? propIndent.slice(0, -2) : propIndent;
  lines.splice(insertAt, 0, `${tagIndent}<div style={{`);
  src = lines.join('\n');
  fixes++;
  seen.clear(); // state changed; old signatures no longer relevant
}

fs.writeFileSync(path, src);
console.log('Total fixes applied:', fixes);
