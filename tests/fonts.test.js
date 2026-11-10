import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = join(root, 'public');
const fontPath = name => join(publicDir, 'fonts', name);

function usedChars(dir, found = new Set()) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) usedChars(path, found);
    else if (['.html', '.js', '.css'].includes(extname(entry.name))) {
      for (const c of readFileSync(path, 'utf8')) {
        const cp = c.codePointAt(0);
        if (cp >= 0x20 && cp !== 0x7f) found.add(c);
      }
    }
  }
  return found;
}

test('every character used in public/ html, js, css is in the font subset', () => {
  const subset = new Set(readFileSync(join(root, 'tools', 'font-chars.txt'), 'utf8').replace(/[\r\n]+$/, ''));
  const missing = [...usedChars(publicDir)].filter(c => !subset.has(c)).sort().join('');
  assert.equal(missing, '', `글꼴 서브셋에 없는 글자: ${missing} → npm run build:fonts`);
});

test('font files and OFL license are present', () => {
  for (const f of ['Galmuri11.woff2', 'Galmuri11-Bold.woff2', 'Galmuri14.woff2']) assert.ok(statSync(fontPath(f)).size > 10_000, f);
  assert.ok(readFileSync(fontPath('OFL.txt'), 'utf8').includes('SIL OPEN FONT LICENSE Version 1.1'));
});
