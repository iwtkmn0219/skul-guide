import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILL_INFO } from '../public/js/skills.js';
import { lookup } from '../public/js/search.js';
import { renderDetail, defaultStageIndex } from '../public/js/view-detail.js';

const d = (key, o) => renderDetail(lookup(key), o);

test('placeholder', () => assert.ok(renderDetail(null).includes('목록에서 고르면 여기에 나옵니다.')));

test('skull head and builds', () => {
  const h = d('skull:werewolf');
  assert.ok(h.includes('<p class="kind">스컬</p>'));
  assert.ok(h.includes('<h2 id="detail-title" tabindex="-1">웨어울프</h2>'));
  assert.ok(h.includes('<span class="badge grade grade-common">일반</span>'));
  assert.ok(h.includes('<span class="tag">물리</span>'));
  assert.ok(h.includes('<span class="chip rec">포식</span><span class="or">/</span><span class="chip rec">찢기</span>'));
  assert.ok(h.includes('<span class="plus">+</span>'));
});

test('mark badges', () => {
  assert.ok(d('skull:guan-yu').includes('<span class="badge mark">★ 신화 DLC</span>'));
  assert.ok(d('skull:davy-jones').includes('<span class="badge mark">◆ 마석 해금</span>'));
});

test('all notes are shown, no clamp', () => {
  const h = d('skull:thief');
  assert.ok(!h.includes('class="more"') && !h.includes('clamp'));
});

test('fixed, any, pool, others, no-build', () => {
  assert.ok(d('skull:samurai').includes('<span class="chip rec">일섬<span class="fixed">고정</span></span>'));
  assert.ok(d('skull:skeleton-spear').includes('<span class="chip any">아무거나</span>'));
  const p = d('skull:prisoner');
  assert.ok(p.includes('<table class="pool">') && !p.includes('class="others"'));
  assert.ok(p.split('<tr>').find(r => r.includes('늑대 덫')).includes('★★'));
  const sp = d('skull:spartan');
  const start = sp.indexOf('class="others"'); const others = sp.slice(start, sp.indexOf('</p>', start));
  assert.ok(others.includes('<span class="chip">가르기</span>') && !others.includes('심장 추적') && others.includes('그 외'));
  const sk = d('skull:skul');
  assert.ok(sk.includes('별도 추천 없음') && sk.includes('<span class="others-label">스킬</span>'));
});

test('skill info inline: recommended rows, default stage, aliases, forms, variants, license', () => {
  const h = d('skull:werewolf');
  assert.ok(h.includes('<tr class="rec"><td>사냥 <span class="tag">추천</span></td>'));
  assert.ok(h.includes('data-stage="3" aria-selected="true" tabindex="0"'));
  assert.ok(h.includes('data-stage="0" role="tabpanel" aria-labelledby="stage-tab-0" tabindex="0" hidden'));
  assert.ok(h.includes('CC BY-NC-SA 2.0 KR'));
  assert.ok(d('skull:spartan').includes('<td>심장 추적 <span class="tag">추천</span></td>'));
  assert.ok(d('skull:berserker').includes('>데빌</button>'));
  assert.equal(defaultStageIndex(SKILL_INFO['버서커'].stages), 1);
  assert.ok(d('skull:grim-reaper').includes('class="variant"'));
});

test('query marks', () => {
  assert.ok(d('skull:werewolf', { query: '포 식' }).includes('<span class="chip rec"><mark>포식</mark></span>'));
  assert.ok(d('skull:prisoner', { query: '늑대' }).includes('<td class="name"><mark>늑대</mark> 덫</td>'));
  assert.ok(!d('skull:werewolf').includes('<mark>'));
});

test('portrait only when images enabled', () => {
  assert.ok(!d('skull:werewolf').includes('<img'));
  assert.ok(d('skull:werewolf', { images: true }).includes('src="img/skulls/werewolf.png"'));
});

test('item detail: glyph slot, engraving jumps, tier boxes', () => {
  const h = d('item:칼레온 계급장');
  assert.ok(h.includes('<p class="kind">아이템</p>'));
  assert.ok(h.includes('<span class="slot grade-common" aria-hidden="true">계</span>'));
  assert.ok(!h.includes('신화 DLC'));
  assert.ok(h.includes('<button type="button" class="chip jump" data-key="eng:전리품">전리품</button>'));
  assert.ok(h.includes('<h3>각인 효과</h3>'));
  assert.ok(h.includes('<tr class="mod"><td>2개 개조</td>'));
  assert.ok(d('item:거인 석상').includes('<span class="badge mark">★ 신화 DLC</span>'));
});

test('random and doubled engravings', () => {
  const r = d('item:복제 도장');
  assert.ok(!r.includes('data-key="eng:') && !r.includes('tier-box') && !r.includes('각인 효과'));
  const w = d('item:진홍빛 태양의 여명');
  assert.equal(w.split('<section class="tier-box">').length - 1, 1);
  assert.equal(w.split('data-key="eng:무구"').length - 1, 2);
});

test('variants link both ways', () => {
  assert.ok(d('item:영원의 뼈: 광란').includes('<button type="button" class="link jump" data-key="item:광란의 뼈">광란의 뼈</button>의 강화·변환형'));
  assert.ok(d('item:광란의 뼈').includes('data-key="item:영원의 뼈: 광란"'));
});

test('engraving detail: tiers, note, items by grade', () => {
  assert.ok(d('eng:요새').includes('<p class="note">※ 방어막 5당 증가량은 원문 표기 오류로 확인 필요.</p>'));
  const b = d('eng:보물');
  assert.ok(b.includes(`<p class="kind">각인 · ${lookup('eng:보물').data.category}</p>`));
  assert.ok(b.includes('<h3>이 각인이 붙은 아이템 <span class="n">14</span></h3>'));
  assert.ok(b.includes('<h4 class="sub grade-legendary">레전더리 <span class="n">5</span></h4>'));
  assert.ok(b.includes('class="jump mini grade-common" data-key="item:칼레온 계급장"'));
  assert.equal(b.split('data-key="item:황금왕의 가호"').length - 1, 1);
  const s = d('eng:죄');
  assert.ok(s.includes('이 각인을 가진 아이템이 없습니다.') && s.includes('<span class="badge mod">개조 불가</span>'));
});

test('data strings are escaped', () => {
  const fake = { kind: 'item', key: 'item:x', name: '<b>', data: { name: '<b>', grade: 'common', engravings: [], description: ['"q"&'], variantOf: null, dlc: false } };
  const h = renderDetail(fake);
  assert.ok(h.includes('&lt;b&gt;') && h.includes('&quot;q&quot;&amp;') && !h.includes('<b>'));
});
