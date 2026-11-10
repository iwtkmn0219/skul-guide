import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, ENGRAVINGS, ENGRAVING_CATEGORIES } from '../public/js/items.js';
import { filterItems, itemCountByEngraving } from '../public/js/item-filter.js';
import { renderItemCard, renderItemList, renderEngravingCard, renderEngravingList } from '../public/js/item-render.js';

const item = name => ITEMS.find(i => i.name === name);
const eng = name => ENGRAVINGS.find(e => e.name === name);
const count = (html, needle) => html.split(needle).length - 1;
const headings = html => [...html.matchAll(/<h2 class="grade-heading">([^<]+?) <span/g)].map(m => m[1]);
const bodyRows = html => html.split('<tbody>')[1].split('</tbody>')[0].match(/<tr[^>]*>/g);

test('random engravings are plain chips, not buttons', () => {
  const html = renderItemCard(item('복제 도장'));
  assert.equal(count(html, '<span class="chip random" title="무작위 각인">랜덤A</span>'), 2);
  assert.ok(!html.includes('data-eng="랜덤A"'));
});
test('a doubled engraving shows twice on the card', () => {
  assert.equal(count(renderItemCard(item('진홍빛 태양의 여명')), 'data-eng="무구"'), 2);
});
test('variant links back to its base item without the bracket line', () => {
  const html = renderItemCard(item('영원의 뼈: 광란'));
  assert.ok(html.includes('data-query="광란의 뼈"'));
  assert.ok(!html.includes('[광란의 뼈'));
});
test('base item lists its variants', () => {
  const html = renderItemCard(item('광란의 뼈'), { variants: ['영원의 뼈: 광란'] });
  assert.ok(html.includes('강화·변환형: '));
  assert.ok(html.includes('data-query="영원의 뼈: 광란"'));
});
test('DLC badge only on DLC items', () => {
  assert.ok(renderItemCard(ITEMS.find(i => i.dlc)).includes('class="badge dlc"'));
  assert.ok(!renderItemCard(ITEMS.find(i => !i.dlc)).includes('class="badge dlc"'));
});
test('data strings are escaped', () => {
  const html = renderItemCard({ name: '<b>x</b>', grade: 'rare', engravings: ['a&b'], description: ['"q"'], variantOf: null, dlc: false });
  assert.ok(html.includes('&lt;b&gt;x&lt;/b&gt;'));
  assert.ok(html.includes('a&amp;b'));
  assert.ok(html.includes('&quot;q&quot;'));
  assert.ok(!html.includes('<b>x</b>'));
});
test('item list is grouped by grade in fixed order', () => {
  const html = renderItemList(filterItems(ITEMS, { grade: 'all', eng: '', query: '' }));
  assert.deepEqual(headings(html), ['일반', '레어', '유니크', '레전더리', '흉조']);
  assert.ok(html.includes('<h2 class="grade-heading">흉조 <span class="n">22</span></h2>'));
  assert.ok(renderItemList([]).includes('검색 결과가 없습니다.'));
});
test('engraving card tiers, mod row and items button', () => {
  const html = renderEngravingCard(eng('마도구'), 5);
  const rows = bodyRows(html);
  assert.equal(rows.length, 4);
  assert.equal(rows[3], '<tr class="mod">');
  assert.ok(html.split('<tr class="mod">')[1].includes('6개'));
  assert.ok(html.includes('아이템 5개 보기'));
});
test('tier note is shown', () => {
  assert.ok(renderEngravingCard(eng('요새'), 3).includes('※ 방어막 5당 증가량은 원문 표기 오류로 확인 필요.'));
});
test('engraving without items shows a notice instead of a button', () => {
  const html = renderEngravingCard(eng('죄'), 0);
  assert.ok(html.includes('이 각인을 가진 아이템이 없습니다.'));
  assert.ok(html.includes('개조 불가'));
  assert.ok(!html.includes('show-items'));
});
test('items button can be turned off', () => {
  assert.ok(!renderEngravingCard(eng('마도구'), 5, { itemsButton: false }).includes('show-items'));
});
test('engraving list is grouped by category in fixed order', () => {
  assert.deepEqual(headings(renderEngravingList(ENGRAVINGS, itemCountByEngraving(ITEMS))), ENGRAVING_CATEGORIES);
});
