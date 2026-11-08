import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { escapeHtml, renderCard, renderList } from '../public/js/render.js';

const byId = Object.fromEntries(SKULLS.map(s => [s.id, s]));

test('escapeHtml escapes & < > " \'', () => {
  assert.equal(escapeHtml('<a href="x">&\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});
test('skull with no builds or pool shows 별도 추천 없음', () => {
  const html = renderCard(byId.skul);
  assert.ok(html.includes('별도 추천 없음'));
  assert.ok(!html.includes('class="builds"'));
});
test('data strings are escaped', () => {
  const html = renderCard({ ...byId.werewolf, name: '<b>x</b>', builds: [{ label: null, slots: [['a&b']], notes: ['"q"'] }] });
  assert.ok(html.includes('&lt;b&gt;x&lt;/b&gt;'));
  assert.ok(html.includes('a&amp;b'));
  assert.ok(html.includes('&quot;q&quot;'));
  assert.ok(!html.includes('<b>x</b>'));
});
test('build labels and options', () => {
  const html = renderCard(byId.werewolf);
  assert.ok(html.includes('<span class="label">물리</span>'));
  assert.ok(html.includes('<span class="opt">포식</span> / <span class="opt">찢기</span>'));
});
test('portrait only when images enabled', () => {
  assert.ok(!renderCard(byId.werewolf).includes('<img'));
  assert.ok(renderCard(byId.werewolf, { images: true }).includes('src="img/werewolf.png"'));
});
test('fixed skill badge', () => {
  assert.ok(renderCard(byId.samurai).includes('<span class="opt">일섬<span class="fixed">고정</span></span>'));
});
test('prisoner pool table with stars', () => {
  const html = renderCard(byId.prisoner);
  assert.ok(html.includes('<table class="pool">'));
  const row = html.split('<tr>').find(r => r.includes('늑대 덫'));
  assert.ok(row && row.includes('★★'));
});
test('mark and anchor id', () => {
  const html = renderCard(byId['guan-yu']);
  assert.ok(html.includes('<span class="mark">★</span>'));
  assert.ok(html.includes('id="skull-guan-yu"'));
});
test('empty list message', () => {
  assert.ok(renderList([]).includes('검색 결과가 없습니다.'));
});
