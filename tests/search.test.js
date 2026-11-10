import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEM_GRADES } from '../public/js/items.js';
import {
  search, tabEntries, tabCounts, autoPick, chooseSelection, lookup, itemsOfEngraving, jumpTo, tabSelection,
} from '../public/js/search.js';

const keys = entries => entries.map(e => e.key);
const all = search('');

test('totals', () => {
  assert.deepEqual(tabCounts(all, 'all'), { all: 339, skulls: 45, items: 258, engravings: 36 });
  assert.equal(tabCounts(all, '★').skulls, 5);
  assert.equal(tabCounts(all, '◆').skulls, 4);
  assert.equal(tabCounts(all, '★').all, 339);
});

test('display order: kind, then grade/category, then data order', () => {
  const e = tabEntries(all, 'all', 'all');
  assert.equal(e[0].key, 'skull:skul');
  assert.equal(e[45].key, 'item:그림자 정령 데스');
  assert.deepEqual([...new Set(e.map(x => x.kind))], ['skull', 'item', 'eng']);
  const gi = id => ITEM_GRADES.findIndex(g => g.id === id);
  const items = e.filter(x => x.kind === 'item');
  assert.ok(items.every((x, i) => i === 0 || gi(items[i - 1].data.grade) <= gi(x.data.grade)));
});

test('칼레온 across tabs; mark applies to the skull tab only', () => {
  const r = search('칼레온');
  assert.deepEqual(keys(r.skulls), ['skull:recruit']);
  assert.equal(r.items.length, 5);
  assert.deepEqual(keys(r.engravings), ['eng:전리품']);   // 효과 문구 "칼레온의 깃발"
  assert.deepEqual(tabCounts(r, 'all'), { all: 7, skulls: 1, items: 5, engravings: 1 });
  assert.deepEqual(tabEntries(r, 'skulls', '★'), []);
  assert.equal(tabEntries(r, 'all', '★').length, 7);
});

test('autoPick prefers a name match, else the first entry', () => {
  assert.equal(autoPick(tabEntries(search('보물'), 'all', 'all'), '보물'), 'eng:보물');
  assert.equal(autoPick(tabEntries(search('보물'), 'items', 'all'), '보물'), 'item:미지의 씨앗');
  assert.equal(autoPick(tabEntries(search('검'), 'items', 'all'), '검'), 'item:보급형 칼레온 검');
  assert.equal(autoPick(tabEntries(search('칼레온'), 'all', 'all'), '칼레온'), 'skull:recruit');
  assert.equal(autoPick([], 'x'), '');
});

test('chooseSelection', () => {
  const allK = tabEntries(search('칼레온'), 'all', 'all');
  const itemsK = tabEntries(search('칼레온'), 'items', 'all');
  const base = { query: '칼레온', remembered: 'item:절대반지', auto: true };
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query' }), 'skull:recruit');
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query', auto: false }), 'item:절대반지');
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query', query: '  ' }), 'item:절대반지');
  // 목록이 비면 언제나 선택을 비운다(기억은 app.js에서 유지)
  assert.equal(chooseSelection({ ...base, entries: [], reason: 'query' }), '');
  assert.equal(chooseSelection({ ...base, entries: [], reason: 'tab' }), '');
  assert.equal(chooseSelection({ ...base, entries: [], reason: 'query', auto: false }), '');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab', remembered: 'item:칼레온 계급장' }), 'item:칼레온 계급장');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab' }), 'item:보급형 칼레온 갑옷');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab', query: '' }), 'item:절대반지');
});

test('lookup', () => {
  assert.equal(lookup('skull:werewolf').name, '웨어울프');
  assert.equal(lookup('item:영원의 뼈: 광란').data.variantOf, '광란의 뼈');
  assert.equal(lookup('eng:보물').kind, 'eng');
  for (const bad of ['item:없는 아이템', 'eng:랜덤A', 'skull:', 'bad', '']) assert.equal(lookup(bad), null, bad);
});

test('itemsOfEngraving: unique, grade order', () => {
  const k = keys(itemsOfEngraving('보물'));
  assert.equal(k.length, 14);
  assert.equal(k[0], 'item:칼레온 계급장');
  assert.equal(k.filter(x => x === 'item:황금왕의 가호').length, 1);   // 보물 각인이 두 번 붙은 아이템
  assert.deepEqual(itemsOfEngraving('죄'), []);
});

test('jumpTo keeps the query only when the target is still a result', () => {
  const s = { tab: 'items', query: '칼레온', mark: 'all', sel: 'item:칼레온 계급장' };
  assert.deepEqual(jumpTo(s, 'eng:보물'), { tab: 'engravings', query: '', mark: 'all', sel: 'eng:보물' });
  assert.deepEqual(jumpTo(s, 'eng:전리품'), { tab: 'engravings', query: '칼레온', mark: 'all', sel: 'eng:전리품' });
  const a = { ...s, tab: 'all', mark: '★' };
  assert.deepEqual(jumpTo(a, 'item:보급형 칼레온 검'), { tab: 'all', query: '칼레온', mark: '★', sel: 'item:보급형 칼레온 검' });
  assert.deepEqual(jumpTo(a, 'item:절대반지'), { tab: 'all', query: '', mark: '★', sel: 'item:절대반지' });
});

test('tabSelection: remembered if listed, else the first entry, else empty', () => {
  const items = tabEntries(search('칼레온'), 'items', 'all');
  assert.equal(tabSelection(items, 'item:칼레온 계급장'), 'item:칼레온 계급장');
  assert.equal(tabSelection(items, 'item:절대반지'), 'item:보급형 칼레온 갑옷');   // 기억이 목록에 없음
  assert.equal(tabSelection(items, ''), 'item:보급형 칼레온 갑옷');
  assert.equal(tabSelection([], 'item:칼레온 계급장'), '');
  // 검색어가 있어도 이름 일치(autoPick)가 아니라 맨 첫 항목
  const all = tabEntries(search('보물'), 'all', 'all');
  assert.equal(tabSelection(all, ''), 'item:미지의 씨앗');
  assert.equal(autoPick(all, '보물'), 'eng:보물');
});
