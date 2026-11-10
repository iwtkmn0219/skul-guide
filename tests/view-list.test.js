import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { search } from '../public/js/search.js';
import { comboText, renderResults } from '../public/js/view-list.js';

const byId = Object.fromEntries(SKULLS.map(s => [s.id, s]));
const html = opts => renderResults({ tab: 'all', results: search(''), mark: 'all', query: '', sel: '', images: false, ...opts });

test('combo text', () => {
  assert.equal(comboText(byId.werewolf), '사냥 + 짐승의 도약 · 빌드 2');
  assert.equal(comboText(byId.dominator), '아무거나 · 빌드 4');
  assert.equal(comboText(byId.alchemist), '불안정한소환 + 마비/화염/오염물질');
  assert.equal(comboText(byId.prisoner), '추천 표 참고');
  assert.equal(comboText(byId.skul), '추천 없음');
});

test('skull tab: grade sections, source line, no grade text', () => {
  const h = html({ tab: 'skulls' });
  assert.ok(h.includes('<h2 class="sub grade-common">일반 <span class="n">13</span></h2>'));
  assert.ok(h.includes('<h2 class="sub grade-legendary">레전더리 <span class="n">8</span></h2>'));
  assert.ok(h.includes('수정 25.02.05, 26.01.26 · 보스 비중이 크니 참고'));
  assert.ok(h.includes('href="https://gall.dcinside.com/mgallery/board/view/?id=skul&amp;no=57295"'));
  assert.ok(h.includes('<span class="combo">사냥 + 짐승의 도약 · 빌드 2</span>'));
  assert.ok(!h.includes('class="gr"'));
});

test('all tab: kind groups; skulls flat with grade text; items keep grade subheadings', () => {
  const h = html({ results: search('칼레온'), query: '칼레온' });
  assert.ok(h.includes('<h2 class="kind-head">스컬 <span class="n">1</span></h2>'));
  assert.ok(h.includes('<span class="gr">일반</span>'));
  assert.ok(h.includes('<h2 class="kind-head">아이템 <span class="n">5</span></h2>'));
  assert.ok(h.includes('<h3 class="sub grade-common">일반 <span class="n">5</span></h3>'));
  assert.ok(h.includes('<h2 class="kind-head">각인 <span class="n">1</span></h2>'));
  const skullPart = h.slice(0, h.indexOf('kind-head">아이템'));
  assert.ok(!skullPart.includes('class="sub'));
  assert.ok(h.indexOf('kind-head">스컬') < h.indexOf('kind-head">아이템'));
  assert.ok(h.includes('<mark>칼레온</mark> 계급장'));
});

test('marks and DLC stars carry text, not just a symbol', () => {
  const h = html({ tab: 'skulls' });
  assert.ok(h.includes('<span class="mark" title="신화 DLC"><span aria-hidden="true">★</span><span class="sr-only">신화 DLC</span></span>'));
  assert.ok(h.includes('<span class="sr-only">마석 해금</span>'));
  const items = html({ tab: 'items' });
  const cell = name => items.split('<button').find(b => b.includes(`data-key="item:${name}"`));
  assert.ok(cell('거인 석상').includes('<span class="sr-only">신화 DLC</span>'));
  assert.ok(!cell('칼레온 계급장').includes('신화 DLC'));
  assert.ok(cell('칼레온 계급장').includes('<span class="slot" aria-hidden="true">계</span>'));
  assert.equal(cell('복제 도장').split('<span class="chip random" title="무작위 각인">랜덤A</span>').length - 1, 2);
});

test('roving tabindex and selection', () => {
  const h = html({ tab: 'skulls', sel: 'skull:werewolf' });
  assert.equal(h.split('tabindex="0"').length - 1, 1);
  assert.match(h, /data-key="skull:werewolf" tabindex="0" aria-current="true"/);
  const none = html({ tab: 'skulls' });
  assert.match(none, /data-key="skull:skul" tabindex="0"/);
  assert.ok(!none.includes('aria-current'));
});

test('engraving tab rows', () => {
  const h = html({ tab: 'engravings' });
  assert.ok(h.includes('<h2 class="sub">특수능력 각인(방어) <span class="n">6</span></h2>'));
  assert.ok(h.split('<button').find(b => b.includes('data-key="eng:죄"')).includes('<span class="mod">개조 불가</span>'));
});

test('empty results point to other tabs', () => {
  assert.ok(html({ results: search('zzz'), query: 'zzz' }).includes('검색 결과가 없습니다.'));
  assert.ok(!html({ results: search('zzz'), query: 'zzz' }).includes('empty-hint'));
  const h = html({ tab: 'skulls', results: search('광란'), query: '광란' });
  assert.ok(h.includes('<button type="button" class="to-tab" data-tab="items">아이템 2</button>'));
  assert.ok(!h.includes('data-tab="engravings"'));
});

test('item images only when enabled', () => {
  assert.ok(!html({ tab: 'items' }).includes('<img'));
  assert.ok(html({ tab: 'items', images: true }).includes('src="img/items/'));
});
