import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, ENGRAVINGS } from '../public/js/items.js';
import {
  isRandomEngraving, matchesItemQuery, variantsOf, filterEngravings,
} from '../public/js/item-filter.js';

const names = items => items.map(i => i.name);
const q = query => names(ITEMS.filter(i => matchesItemQuery(i, query)));

test('query is normalized and matched literally', () => {
  assert.ok(q('가시 견갑').includes('가시견갑'));
  assert.equal(q('.*').length, 0);
  const paren = q('(');
  assert.ok(Array.isArray(paren) && paren.length > 0);
});
test('query searches description lines', () => {
  assert.ok(q('빙결').includes('버려진 결혼반지'));
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
