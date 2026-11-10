import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_ITEM_STATE, parseItemHash, toItemHash } from '../public/js/item-state.js';

const names = ['무구', '마도구', '죄'];

test('empty hash parses to defaults', () => {
  assert.deepEqual(parseItemHash('', names), DEFAULT_ITEM_STATE);
});
test('all keys are read', () => {
  assert.deepEqual(parseItemHash('#view=engravings&grade=omen&eng=%EB%AC%B4%EA%B5%AC&q=a', names),
    { view: 'engravings', grade: 'omen', eng: '무구', query: 'a' });
});
test('unknown view/grade and random or unknown engravings fall back to defaults', () => {
  assert.deepEqual(parseItemHash('#view=x&grade=epic&eng=%EB%9E%9C%EB%8D%A4A', names), DEFAULT_ITEM_STATE);
});
test('malformed percent-encoding does not throw', () => {
  assert.doesNotThrow(() => parseItemHash('#q=%E0%A4%A', names));
});
test('default state serializes to empty hash', () => {
  assert.equal(toItemHash(DEFAULT_ITEM_STATE), '');
});
test('toItemHash/parseItemHash round-trip', () => {
  const s = { view: 'items', grade: 'rare', eng: '마도구', query: '돌격! &' };
  assert.deepEqual(parseItemHash(toItemHash(s), names), s);
});
