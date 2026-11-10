import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { normalize, matchesQuery } from '../public/js/filter.js';

const q = query => SKULLS.filter(s => matchesQuery(s, query)).map(s => s.id);

test('normalize lowercases and strips spaces, hyphens, middle dots', () => {
  assert.equal(normalize('스켈레톤 - 검 '), '스켈레톤검');
  assert.equal(normalize('A·b'), 'ab');
});
test('spacing and hyphen variants all find skeleton-sword', () => {
  for (const v of ['스켈레톤 검', '스켈레톤검', '스켈레톤-검']) assert.ok(q(v).includes('skeleton-sword'), v);
});
test('empty or blank query returns all 45', () => {
  assert.equal(q('').length, 45);
  assert.equal(q('   ').length, 45);
});
test('regex special characters match literally without throwing', () => {
  assert.ok(q('돌격!').includes('skeleton-spear'));
  for (const v of ['(', '+', '.*']) assert.ok(Array.isArray(q(v)), v);
  assert.equal(q('.*').length, 0);
});
test('pool skill names are searched', () => {
  assert.deepEqual(q('늑대 덫'), ['prisoner']);
});
test('build slot options are searched', () => {
  assert.ok(q('사냥').includes('werewolf'));
});
test('namu skill and swap names are searched', () => {
  assert.deepEqual(q('환영교차'), ['ninja']);
  assert.ok(q('야생의 질주').includes('werewolf'));
});
