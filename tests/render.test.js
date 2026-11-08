import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { SKILL_INFO } from '../public/js/skills.js';
import { escapeHtml, renderCard, renderList, renderSkillSection, defaultStageIndex } from '../public/js/render.js';

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

test('skill chips highlight recommendations; default stage tab is the last regular stage', () => {
  const html = renderCard(byId.werewolf);
  assert.ok(html.includes('<li class="chip rec" title="추천">사냥</li>'));
  assert.ok(html.includes('role="tab" data-stage="3" aria-selected="true"'));
  assert.ok(html.includes('data-stage="0" role="tabpanel" hidden'));
});
test('chips use namu spelling with alias highlighting (노예)', () => {
  const html = renderCard(byId.spartan);
  assert.ok(html.includes('<li class="chip rec" title="추천">심장 추적</li>'));
  assert.ok(html.includes('<li class="chip">가르기</li>'));
});
test('special form gets its own tab after regular stages (버서커)', () => {
  assert.ok(renderCard(byId.berserker).includes('>데빌</button>'));
  assert.equal(defaultStageIndex(SKILL_INFO['버서커'].stages), 1);
});
test('variants render as extra rows (그림리퍼)', () => {
  assert.ok(renderCard(byId['grim-reaper']).includes('class="variant"'));
});
test('skull without guide builds still shows skill chips (리틀본)', () => {
  const html = renderCard(byId.skul);
  assert.ok(html.includes('별도 추천 없음'));
  assert.ok(html.includes('class="skill-chips"'));
});
test('namu text is escaped', () => {
  const info = { stages: [{ label: '기본', form: null, kind: 'stage', passive: ['( ↓ + X ) <a&b>'], swap: null, skills: [] }] };
  assert.ok(renderSkillSection(byId.werewolf, info).includes('( ↓ + X ) &lt;a&amp;b&gt;'));
});
test('no skill info renders nothing', () => {
  assert.equal(renderSkillSection(byId.werewolf, undefined), '');
});
test('card carries namu license attribution', () => {
  assert.ok(renderCard(byId.werewolf).includes('CC BY-NC-SA 2.0 KR'));
});
