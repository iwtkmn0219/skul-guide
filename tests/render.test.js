import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { SKILL_INFO } from '../public/js/skills.js';
import { escapeHtml, renderCard, renderList, renderSkillDialog, defaultStageIndex } from '../public/js/render.js';

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
  assert.ok(html.includes('<span class="pill">포식</span><span class="or">/</span><span class="pill">찢기</span>'));
  assert.ok(html.includes('<span class="plus">+</span>'));
});
test('portrait only when images enabled', () => {
  assert.ok(!renderCard(byId.werewolf).includes('<img'));
  assert.ok(renderCard(byId.werewolf, { images: true }).includes('src="img/werewolf.png"'));
});
test('fixed skill badge', () => {
  assert.ok(renderCard(byId.samurai).includes('<span class="pill">일섬<span class="fixed">고정</span></span>'));
});
test('prisoner pool table with stars', () => {
  const html = renderCard(byId.prisoner);
  assert.ok(html.includes('<table class="pool">'));
  const row = html.split('<tr>').find(r => r.includes('늑대 덫'));
  assert.ok(row && row.includes('★★'));
});
test('mark and anchor id', () => {
  const html = renderCard(byId['guan-yu']);
  assert.ok(html.includes('<span class="mark" title="원문 표기">★</span>'));
  assert.ok(html.includes('id="skull-guan-yu"'));
});
test('empty list message', () => {
  assert.ok(renderList([]).includes('검색 결과가 없습니다.'));
});

test('아무거나 is a muted pill', () => {
  assert.ok(renderCard(byId['skeleton-spear']).includes('<span class="pill any">아무거나</span>'));
});
test('long notes are clamped with a 더보기 button; short ones are not', () => {
  const thief = renderCard(byId.thief);
  assert.ok(thief.includes('<ul class="notes clamp">'));
  assert.ok(thief.includes('data-more="2">더보기 (+2)</button>'));
  // 3줄은 한 줄만 숨기게 되므로 접지 않는다
  const spear = renderCard(byId['skeleton-spear']);
  assert.ok(spear.includes('<ul class="notes">'));
  assert.ok(!spear.includes('class="more"'));
});
test('others chips list only non-recommended namu skills (노예 alias)', () => {
  const html = renderCard(byId.spartan);
  const others = html.slice(html.indexOf('class="others"'));
  assert.ok(others.includes('<span class="chip">가르기</span>'));
  assert.ok(!others.includes('심장 추적'));
  assert.ok(others.includes('그 외'));
});
test('skull without guide builds lists namu skills under 스킬 (리틀본)', () => {
  const html = renderCard(byId.skul);
  assert.ok(html.includes('별도 추천 없음'));
  assert.ok(html.includes('<span class="others-label">스킬</span>'));
});
test('prisoner has no others chips (pool already lists them)', () => {
  assert.ok(!renderCard(byId.prisoner).includes('class="others"'));
});
test('card has a 스킬 정보 button instead of inline namu tables', () => {
  const html = renderCard(byId.werewolf);
  assert.ok(html.includes('class="open-skills" data-skull="werewolf"'));
  assert.ok(!html.includes('skill-table'));
});
test('query highlights matching pills, chips and pool cells', () => {
  assert.ok(renderCard(byId.werewolf, { query: '포 식' }).includes('<span class="pill hit">포식</span>'));
  assert.ok(renderCard(byId.spartan, { query: '가르' }).includes('<span class="chip hit">가르기</span>'));
  assert.ok(renderCard(byId.prisoner, { query: '늑대' }).includes('<td class="name hit">늑대 덫</td>'));
  assert.ok(!renderCard(byId.werewolf).includes(' hit'));
});
test('list is grouped into grade sections with counts', () => {
  const html = renderList([byId.werewolf, byId.prisoner, byId.thief]);
  assert.ok(html.includes('<h2 class="grade-heading" id="grade-common">일반 <span class="n">2</span></h2>'));
  assert.ok(html.includes('id="grade-unique">유니크 <span class="n">1</span>'));
  assert.ok(!html.includes('grade-rare'));
  assert.ok(html.indexOf('grade-common') < html.indexOf('grade-unique'));
});

test('dialog highlights recommendations; default stage tab is the last regular stage', () => {
  const html = renderSkillDialog(byId.werewolf, SKILL_INFO['웨어울프']);
  assert.ok(html.includes('<tr class="rec"><td>사냥 <span class="tag">추천</span></td>'));
  assert.ok(html.includes('data-stage="3" aria-selected="true" tabindex="0"'));
  assert.ok(html.includes('data-stage="0" role="tabpanel" aria-labelledby="stage-tab-0" tabindex="0" hidden'));
  assert.ok(html.includes('<h2 id="sheet-title">웨어울프</h2>'));
});
test('dialog uses alias matching (노예)', () => {
  assert.ok(renderSkillDialog(byId.spartan, SKILL_INFO['노예']).includes('<td>심장 추적 <span class="tag">추천</span></td>'));
});
test('special form gets its own tab after regular stages (버서커)', () => {
  assert.ok(renderSkillDialog(byId.berserker, SKILL_INFO['버서커']).includes('>데빌</button>'));
  assert.equal(defaultStageIndex(SKILL_INFO['버서커'].stages), 1);
});
test('variants render as extra rows (그림리퍼)', () => {
  assert.ok(renderSkillDialog(byId['grim-reaper'], SKILL_INFO['그림리퍼']).includes('class="variant"'));
});
test('namu text is escaped', () => {
  const info = { stages: [{ label: '기본', form: null, kind: 'stage', passive: ['( ↓ + X ) <a&b>'], swap: null, skills: [] }] };
  assert.ok(renderSkillDialog(byId.werewolf, info).includes('( ↓ + X ) &lt;a&amp;b&gt;'));
});
test('no skill info renders nothing', () => {
  assert.equal(renderSkillDialog(byId.werewolf, undefined), '');
  assert.ok(!renderCard({ ...byId.werewolf, name: '없는 스컬' }).includes('open-skills'));
});
test('dialog carries namu license attribution', () => {
  assert.ok(renderSkillDialog(byId.werewolf, SKILL_INFO['웨어울프']).includes('CC BY-NC-SA 2.0 KR'));
});
