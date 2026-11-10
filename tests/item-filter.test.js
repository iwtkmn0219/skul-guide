import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, ENGRAVINGS } from '../public/js/items.js';
import {
  isRandomEngraving, filterItems, itemCountByEngraving, variantsOf, filterEngravings,
} from '../public/js/item-filter.js';

const all = { grade: 'all', eng: '', query: '' };
const names = items => items.map(i => i.name);
const q = query => names(filterItems(ITEMS, { ...all, query }));

test('query is normalized and matched literally', () => {
  assert.ok(q('가시 견갑').includes('가시견갑'));
  assert.equal(q('.*').length, 0);
  const paren = q('(');
  assert.ok(Array.isArray(paren) && paren.length > 0);
});
test('query searches description lines', () => {
  assert.ok(q('빙결').includes('버려진 결혼반지'));
});
test('grade filter', () => {
  const omen = filterItems(ITEMS, { ...all, grade: 'omen' });
  assert.equal(omen.length, 22);
  assert.ok(omen.every(i => i.grade === 'omen'));
});
test('engraving filter lists an item with a doubled engraving once', () => {
  assert.equal(names(filterItems(ITEMS, { ...all, eng: '무구' })).filter(n => n === '진홍빛 태양의 여명').length, 1);
});
test('grade and engraving filters combine', () => {
  const result = names(filterItems(ITEMS, { ...all, grade: 'legendary', eng: '보물' }));
  for (const n of ['황금왕의 가호', '황금왕의 심판', '황금왕의 은총']) assert.ok(result.includes(n), n);
});
test('item count per engraving ignores duplicates and random engravings', () => {
  const counts = itemCountByEngraving(ITEMS);
  assert.ok(!counts.get('죄'));
  assert.ok(!counts.has('랜덤A'));
  assert.equal(counts.get('무구'), ITEMS.filter(i => i.engravings.includes('무구')).length);
});
test('random engraving detection', () => {
  assert.equal(isRandomEngraving('랜덤B'), true);
  assert.equal(isRandomEngraving('랜덤각인'), false);
});
test('variants of an item', () => {
  assert.deepEqual(variantsOf(ITEMS, '복제 도장'), ['복제 뼈', '복제 복제']);
});
test('engraving search covers effects and notes', () => {
  assert.deepEqual(filterEngravings(ENGRAVINGS, '운석').map(e => e.name), ['마도구']);
  assert.ok(filterEngravings(ENGRAVINGS, '확인 필요').some(e => e.name === '요새'));
});
