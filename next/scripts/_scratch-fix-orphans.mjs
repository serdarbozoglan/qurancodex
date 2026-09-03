import { parse } from '@babel/parser';
import fs from 'fs';

const path = 'src/components/ReadingMode.jsx';
let src = fs.readFileSync(path, 'utf8');

function tryParse(code) {
  try {
    parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      errorRecovery: false,
    });
    return null;
  } catch (e) {
    return e;
  }
}

let fixes = 0;
let lastErrLine = -1;
let sameLineStreak = 0;

for (let iter = 0; iter < 200; iter++) {
  const err = tryParse(src);
  if (!err) {
    console.log('PARSE OK after', fixes, 'fixes');
    break;
  }
  const loc = err.loc; // {line, column}
  if (!loc) {
    console.log('No loc info, error:', err.message);
    break;
  }
  if (loc.line === lastErrLine) {
    sameLineStreak++;
    if (sameLineStreak > 2) {
      console.log('STUCK at line', loc.line, err.message);
      break;
    }
  } else {
    sameLineStreak = 0;
  }
  lastErrLine = loc.line;

  const lines = src.split('\n');
  const idx = loc.line - 1; // 0-based index of the offending line
  const offendingLine = lines[idx];

  // Expect the offending line to look like a property assignment, e.g. "  display: 'flex',"
  const isPropLine = /^\s*[a-zA-Z_$][\w$]*\s*:\s*/.test(offendingLine);
  if (!isPropLine) {
    console.log('Unexpected offending line shape at', loc.line, ':', JSON.stringify(offendingLine));
    console.log('Error:', err.message);
    break;
  }

  // Determine indentation to use for the inserted opener: match the offending
  // line's own leading whitespace minus nothing (JSX doesn't care, but keep
  // it tidy) — actually use one level LESS indent than the property line,
  // matching this file's convention (props indented one step deeper than tag).
  const indentMatch = offendingLine.match(/^(\s*)/);
  const propIndent = indentMatch ? indentMatch[1] : '';
  // Try removing 2 spaces for the tag's own indent (common in this file).
  const tagIndent = propIndent.length >= 2 ? propIndent.slice(0, -2) : propIndent;

  const opener = `${tagIndent}<div style={{`;
  lines.splice(idx, 0, opener);
  src = lines.join('\n');
  fixes++;
}

fs.writeFileSync(path, src);
console.log('Total fixes applied:', fixes);
