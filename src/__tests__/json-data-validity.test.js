import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * public/ altındaki tüm .json dosyalarının geçerliliğini doğrula.
 * JSON parse hatası → runtime fetch hatası → blank screen.
 */

const publicDir = join(process.cwd(), 'public');

function findJsonFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(full));
    } else if (entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

describe('public/*.json data validity', () => {
  const jsonFiles = findJsonFiles(publicDir);

  it('public/ has at least one JSON file', () => {
    expect(jsonFiles.length).toBeGreaterThan(0);
  });

  it.each(jsonFiles.map(f => [f.replace(publicDir + '/', '')]))(
    '%s parses as valid JSON',
    (relativePath) => {
      const content = readFileSync(join(publicDir, relativePath), 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    }
  );
});
