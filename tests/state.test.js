import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STATE, parseHash, toHash } from '../public/js/state.js';

test('empty hash parses to defaults', () => {
  assert.deepEqual(parseHash(''), DEFAULT_STATE);
  assert.deepEqual(parseHash('#'), DEFAULT_STATE);
});
test('invalid grade/mark fall back to defaults', () => {
  assert.deepEqual(parseHash('#grade=foo&mark=x'), DEFAULT_STATE);
});
test('percent-encoded query is decoded', () => {
  assert.deepEqual(parseHash('#q=%EC%A3%84%EC%88%98&grade=unique'), { grade: 'unique', mark: 'all', query: '죄수', skull: '' });
  assert.equal(parseHash('#mark=%E2%98%85').mark, '★');
});
test('malformed percent-encoding does not throw', () => {
  const s = parseHash('#q=%E0%A4%A');
  assert.equal(typeof s.query, 'string');
});
test('default state serializes to empty hash', () => {
  assert.equal(toHash(DEFAULT_STATE), '');
});
test('toHash/parseHash round-trip', () => {
  const s = { grade: 'rare', mark: '◆', query: '돌격! &', skull: 'werewolf' };
  assert.deepEqual(parseHash(toHash(s)), s);
});
test('skull id is kept only when it looks like an id', () => {
  assert.equal(parseHash('#skull=grim-reaper').skull, 'grim-reaper');
  assert.equal(parseHash('#skull=%3Cx%3E').skull, '');
  assert.equal(toHash({ ...DEFAULT_STATE, skull: 'thief' }), '#skull=thief');
});
