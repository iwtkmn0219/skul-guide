import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS_META, ITEM_GRADES, ENGRAVING_CATEGORIES, ITEMS, ENGRAVINGS } from '../public/js/items.js';

const RANDOM = /^랜덤[A-Z]?$/;
const itemNames = new Set(ITEMS.map(i => i.name));
const engNames = new Set(ENGRAVINGS.map(e => e.name));
const item = name => ITEMS.find(i => i.name === name);
const eng = name => ENGRAVINGS.find(e => e.name === name);

// 불변 조건: 엑셀을 고쳐도 항상 참이어야 한다.
test('item names are unique', () => {
  assert.equal(itemNames.size, ITEMS.length);
});
test('every grade is a known grade id', () => {
  const ids = ITEM_GRADES.map(g => g.id);
  for (const i of ITEMS) assert.ok(ids.includes(i.grade), i.name);
});
test('every engraving value is a known engraving or a random one', () => {
  for (const i of ITEMS) for (const e of i.engravings) assert.ok(engNames.has(e) || RANDOM.test(e), `${i.name}: ${e}`);
});
test('every variantOf points to a real item', () => {
  for (const i of ITEMS.filter(i => i.variantOf)) assert.ok(itemNames.has(i.variantOf), i.name);
});
test('descriptions have no bracket prefix and no empty lines', () => {
  for (const i of ITEMS) for (const line of i.description) assert.ok(line && !line.startsWith('['), i.name);
});
test('engravings are well-formed', () => {
  for (const e of ENGRAVINGS) {
    assert.ok(ENGRAVING_CATEGORIES.includes(e.category), e.name);
    assert.ok(e.tiers.length >= 1, e.name);
    for (const t of e.tiers) assert.ok(Number.isInteger(t.count) && t.count > 0, e.name);
    if (e.moddable === false) assert.ok(!e.tiers.some(t => t.kind === '개조'), e.name);
  }
});
test('license metadata', () => {
  assert.equal(ITEMS_META.license, 'CC BY-NC-SA 2.0 KR');
  assert.equal(ITEMS_META.sources.length, 6);
});

// 엑셀을 의도적으로 고쳤다면 같은 커밋에서 아래 값을 갱신한다.
test('snapshot of 2026-11-10 xlsx', () => {
  assert.equal(ITEMS.length, 258);
  const byGrade = Object.fromEntries(ITEM_GRADES.map(g => [g.id, ITEMS.filter(i => i.grade === g.id).length]));
  assert.deepEqual(byGrade, { common: 18, rare: 96, unique: 73, legendary: 49, omen: 22 });
  assert.equal(ITEMS.filter(i => i.dlc).length, 23);
  assert.equal(ENGRAVINGS.length, 36);
  assert.equal(ENGRAVINGS.reduce((n, e) => n + e.tiers.length, 0), 108);
  assert.equal(ITEMS.filter(i => i.variantOf).length, 25);
  assert.deepEqual(ITEMS.filter(i => i.engravings.some(e => RANDOM.test(e))).map(i => i.name), ['왕자의 상자', '왕자의 상자 두 개', '뼈 상자', '복제 도장']);
  assert.deepEqual(item('복제 도장').engravings, ['랜덤A', '랜덤A']);
  assert.equal(item('영원의 뼈: 광란').variantOf, '광란의 뼈');
  assert.equal(item('가시견갑').description.length, 2);
  assert.deepEqual(eng('마도구').tiers.map(t => [t.kind, t.count]), [['기본', 2], ['기본', 4], ['기본', 6], ['개조', 6]]);
  assert.equal(eng('걸작').moddable, false);
  assert.equal(eng('요새').tiers.find(t => t.kind === '개조').note, '방어막 5당 증가량은 원문 표기 오류로 확인 필요.');
  assert.equal(ITEMS.filter(i => i.engravings.includes('죄')).length, 0);
});
