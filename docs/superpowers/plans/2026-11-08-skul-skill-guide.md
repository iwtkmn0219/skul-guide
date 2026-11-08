# 스컬별 스킬 추천 정적 가이드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디시인사이드 스컬 마이너 갤러리 글 「스컬별 스킬 추천」(no=57295)의 45개 스컬 추천 스킬 정보를 등급 탭·검색·필터가 있는 정적 웹페이지로 정리한다.

**Architecture:** 빌드 없는 바닐라 ES 모듈 정적 사이트. 데이터(`public/js/data.js`)·순수 로직(`public/js/filter.js`, `public/js/state.js`)·HTML 문자열 생성(`public/js/render.js`)을 DOM 연결부(`public/js/main.js`)와 분리해, DOM이 없는 Node 내장 테스트 러너로 로직을 전부 테스트한다. 필터 상태는 URL 해시(`#grade=unique&q=죄수`)에 저장해 링크로 공유할 수 있다. 배포되는 파일은 `public/` 폴더뿐이고 Cloudflare Pages 무료 플랜에 올린다.

**Tech Stack:** HTML/CSS/Vanilla JS (ES modules), Node ≥ 20 `node:test` + `node:assert/strict` (테스트 전용, 의존성 0개), Cloudflare Pages (무료, 빌드 없음)

**Spec:** `docs/superpowers/specs/2026-11-08-skul-skill-source.txt` — 원문 본문을 줄 단위로 옮긴 파일. 데이터 문구는 전부 여기서 그대로 가져온다. 첨부 이미지 파일명 목록(3번째 줄)은 영문 id의 근거다.

## Global Constraints

- 런타임 의존성 0개, 빌드 단계 없음. `package.json`은 `"type": "module"`과 `"test": "node --test"`만 둔다.
- UI 문구는 한국어. 스컬 이름·스킬 이름·메모는 스펙 파일 문구를 그대로 쓴다(맞춤법 교정 금지. 예: `쫒기`, `금각일격`, `아얘`도 원문 그대로).
- 페이지 상단에 출처를 표시한다: 원문 링크 `https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295`, 작성자 `정도`, 수정일 `25.02.05`, `26.01.26`, 원문 머리말 `보스 비중이 크니 참고`.
- 디시인사이드 이미지(`dcimg*.dcinside.com`)는 핫링크하지 않는다(리퍼러 차단, 게임 아트 권리 문제). 이미지는 선택 사항이고 기본은 끈다. 끈 상태에서는 `<img>`를 출력하지 않는다(404 요청 45개와 콘솔 에러를 막기 위해서다). 켜면 `img/{id}.png`를 표시하고, 로드에 실패하면 숨긴다. 이미지 파일은 저장소에 넣지 않는다.
- ES 모듈은 `file://`에서 로드되지 않는다. 로컬 실행은 `python -m http.server 8000 -d public`으로 하고, README에 적는다.
- 배포는 Cloudflare Pages 무료 플랜이다. 빌드 명령은 없고 출력 디렉터리는 `public`이다. `public/` 밖의 파일(`docs/`, `tests/`, `package.json`)은 배포되지 않아야 한다.
- 사이트 안의 경로는 모두 상대 경로로 쓴다(`js/main.js`, `css/style.css`, `img/{id}.png`). 그래야 `*.pages.dev` 루트와 하위 경로 어디서든 동작한다.
- 원문의 ★/◆ 기호는 의미가 적혀 있지 않다. 기호만 그대로 표시하고 뜻을 지어내지 않는다.

## Review Focus

1. 검색어 띄어쓰기·하이픈 차이: `스켈레톤 검`, `스켈레톤검`, `스켈레톤-검`은 모두 스켈레톤-검을 찾아야 한다. 테스트는 Task 2에 있다.
2. 잘못되거나 인코딩된 해시: `#grade=foo&mark=x`는 기본값으로 돌아가야 하고, `#q=%EC%A3%84%EC%88%98`는 `죄수`로 디코드되어야 한다. 어느 경우에도 에러가 나면 안 된다. 테스트는 Task 2에 있다.
3. 정규식 특수문자 검색어: `돌격!`, `(`, `+`처럼 정규식 특수문자가 든 검색어도 예외 없이 문자 그대로 매칭해야 한다. `includes`를 쓰고 `RegExp`는 쓰지 않는다. 테스트는 Task 2에 있다.
4. 추천이 없는 스컬: 리틀본처럼 빌드·풀이 없는 카드는 빈칸 대신 `별도 추천 없음`을 보여야 한다. 테스트는 Task 3에 있다.
5. HTML 이스케이프: 데이터나 검색어에 `<`, `&`, `"`가 들어가도 마크업이 깨지거나 주입되면 안 된다. 테스트는 Task 3에 있다.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `package.json` | ESM 선언, `npm test` (배포 안 됨) |
| `public/js/data.js` | `GRADES`, `SOURCE`, `SKULLS` 상수(원문 전사) |
| `public/js/filter.js` | 검색 정규화, 필터링(순수 함수) |
| `public/js/state.js` | URL 해시와 필터 상태 간 변환(순수 함수) |
| `public/js/render.js` | 스컬 → HTML 문자열(순수 함수) |
| `public/js/main.js` | DOM 이벤트 연결, 해시 동기화 |
| `public/index.html`, `public/css/style.css` | 페이지 골격, 스타일 |
| `public/_headers` | Cloudflare Pages 캐시 헤더 |
| `README.md` | 실행 방법, 출처, 이미지 넣는 법 |
| `tests/*.test.js` | 위 순수 모듈 테스트 |

---

### Task 1: 프로젝트 골격 + 스컬 데이터 전사

**Files:**
- Create: `package.json`, `.gitignore` (`node_modules/`, `public/img/`), `public/js/data.js`
- Test: `tests/data.test.js`

**Interfaces:**
- Produces (`public/js/data.js`):
  - `export const GRADES = [{id:'common',label:'일반'},{id:'rare',label:'레어'},{id:'unique',label:'유니크'},{id:'legendary',label:'레전더리'}]`
  - `export const SOURCE = { url, title:'스컬별 스킬 추천', author:'정도', updated:['25.02.05','26.01.26'], headline:'보스 비중이 크니 참고' }`
  - `export const SKULLS: Skull[]` (원문 순서)
  ```js
  /** @typedef {{
   *   id: string,            // 첨부 파일명 기반 kebab-case. 예: 'skeleton-sword', 'prisoner', 'guan-yu'
   *   no: number,            // 등급 안에서의 원문 번호(1부터)
   *   name: string,          // '스켈레톤-검'
   *   grade: 'common'|'rare'|'unique'|'legendary',
   *   mark: '★'|'◆'|null,
   *   fixedSkill: string|null,
   *   builds: Array<{ label: string|null, slots: string[][], notes: string[] }>,
   *   pool: null | Array<{ type: '즉발형'|'지속형'|'증폭기', skills: Array<{ name: string, value: string, stars: 0|1|2 }> }>,
   *   notes: string[]
   * }} Skull */
  ```

**전사 규칙** (스펙 파일의 각 스컬 제목 아래 줄을 위에서부터 처리):
- 조합 줄은 build 하나가 된다. 조합 줄이란 줄 전체가 스킬 이름(뒤에 붙은 괄호 포함)과 `+`만으로 이루어진 줄이다(`A+B`, `A+BorC`, `흡입(물리증폭)+크게썰기(공속증가)`). `야차정권+금각일격도 나쁘지않음`처럼 서술어가 붙은 줄은 note로 처리한다. `+`로 slot을 나누고, slot 안의 `or`와 `,`는 선택지로 나눈다. 예: `사냥+포식or찢기`는 `[['사냥'],['포식','찢기']]`, `학살+선별,갈증`은 `[['학살'],['선별','갈증']]`, `불안정한소환(고정스킬)+마비, 화염, 오염물질`은 `[['불안정한소환'],['마비','화염','오염물질']]`. 선택지 앞뒤 공백은 지운다.
- 스킬 이름 뒤의 `(고정스킬)`은 이름에서 떼고 `fixedSkill`에 넣는다. `(추가타 빌드)`, `(강타 빌드)`는 떼서 `label`에 `추가타 빌드`처럼 넣는다. 그 밖의 괄호(`흡입(물리증폭)`)는 이름에 그대로 둔다.
- 라벨 줄은 웨어울프의 `물리`, `마딜` 두 줄뿐이다. 이 줄은 바로 다음 build의 `label`이 되고 notes에는 넣지 않는다.
- 위 규칙에 해당하지 않는 줄은 직전 build의 `notes`에 넣는다. 아직 build가 없으면 skull의 `notes`에 넣는다.
- 특수 케이스:
  - 리틀본: `builds: []`.
  - 데비존스: `{label:'셋 중 두 개', slots:[['포격하라!','백병전!','닻을 내려라!']]}`.
  - 잊혀진 왕: build 3개 `{label:'게이지',slots:[['파란의검']]}`, `{label:'타수',slots:[['인도의검','운명의검']]}`, `{label:'깔끔',slots:[['신뢰의검']]}`.
  - 지배자: 첫 build는 `{label:null, slots:[['아무거나']]}`.
  - 죄수: `builds: []`. `pool`에는 `•즉발형` / `•지속형` / `•증폭기` 아래 줄을 넣는다. `*`의 개수가 `stars`, 이름과 값은 이렇게 나눈다. `*`가 있으면 `*` 앞이 `name`, 뒤(trim)가 `value`다. `*`가 없으면 마지막 공백 뒤 토큰이 `value`, 그 앞이 `name`이다(`장검* 1타`는 `{name:'장검',value:'1타',stars:1}`, `늑대 덫**  30%`는 `{name:'늑대 덫',value:'30%',stars:2}`, `피의검* 풀히트시 6타`는 `{name:'피의검',value:'풀히트시 6타',stars:1}`, `쾌속쇠뇌 21타(키다운스킬)`는 `{name:'쾌속쇠뇌',value:'21타(키다운스킬)',stars:0}`, `선봉대의 방패 증폭40%`는 `{name:'선봉대의 방패',value:'증폭40%',stars:0}`). 나머지 설명 줄은 skull의 `notes`에 넣는다.
- id는 아래 목록을 본문 순서 그대로 쓴다(첨부 파일명 기반. 레전더리는 첨부 순서와 본문 순서가 다르므로 이 목록을 따른다):
  - 일반: `skul`, `skeleton-sword`, `skeleton-spear`, `skeleton-shield`, `werewolf`, `recruit`, `thief`, `ent-skul`, `stone-monkey`, `grave-digger`, `wizard`, `spartan`, `thor`
  - 레어: `mummy`, `gargoyle`, `glacial-skull`, `minotaurus`, `warrior`, `hunter`, `ghost-rider`, `genie`, `clown`, `bomb-skul`, `aqua-skull`, `alchemist`, `ghoul`, `guan-yu`
  - 유니크: `rock-star`, `samurai`, `ninja`, `dark-paladin`, `berserker`, `predator`, `living-armor`, `prisoner`, `high-warlock`, `hercules`
  - 레전더리: `grim-reaper`, `fighter`, `yaksha`, `arch-lich`, `gambler`, `davy-jones`, `king-arthur`, `dominator`

- [ ] **Step 1: 저장소 초기화**

Run: `git init` 후 `package.json`(`{"name":"skul-skill-guide","private":true,"type":"module","scripts":{"test":"node --test"}}`)과 `.gitignore`를 만든다.

- [ ] **Step 2: 실패하는 데이터 테스트 작성** (`tests/data.test.js`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS, GRADES } from '../public/js/data.js';

const byId = Object.fromEntries(SKULLS.map(s => [s.id, s]));
const ids = g => SKULLS.filter(g).map(s => s.id).sort();

test('45 skulls, 13/14/10/8 per grade', () => {
  assert.equal(SKULLS.length, 45);
  assert.deepEqual(GRADES.map(g => SKULLS.filter(s => s.grade === g.id).length), [13, 14, 10, 8]);
});
test('ids unique kebab-case', () => {
  assert.equal(new Set(SKULLS.map(s => s.id)).size, 45);
  SKULLS.forEach(s => assert.match(s.id, /^[a-z0-9]+(-[a-z0-9]+)*$/));
});
test('no is 1..n contiguous within grade, in array order', () => {
  for (const g of GRADES) assert.deepEqual(SKULLS.filter(s => s.grade === g.id).map(s => s.no), [...Array(SKULLS.filter(s => s.grade === g.id).length)].map((_, i) => i + 1));
});
test('marks', () => {
  assert.deepEqual(ids(s => s.mark === '★'), ['guan-yu', 'hercules', 'king-arthur', 'spartan', 'thor']);
  assert.deepEqual(ids(s => s.mark === '◆'), ['davy-jones', 'dominator', 'grave-digger', 'stone-monkey']);
});
test('fixed skills sit in first slot of every build', () => {
  const fixed = { 'ghost-rider': '헬바이크', alchemist: '불안정한소환', 'rock-star': '앰프', samurai: '일섬', berserker: '악마의뼈' };
  assert.deepEqual(ids(s => s.fixedSkill), Object.keys(fixed).sort());
  for (const [id, name] of Object.entries(fixed)) {
    assert.equal(byId[id].fixedSkill, name);
    byId[id].builds.forEach(b => assert.deepEqual(b.slots[0], [name]));
  }
});
test('every skull except skul/prisoner has builds; no empty slots', () => {
  assert.deepEqual(ids(s => s.builds.length === 0), ['prisoner', 'skul']);
  SKULLS.forEach(s => s.builds.forEach(b => { assert.ok(b.slots.length > 0); b.slots.forEach(sl => assert.ok(sl.length > 0 && sl.every(Boolean))); }));
});
test('prisoner pool', () => {
  const p = byId.prisoner.pool;
  assert.deepEqual(p.map(g => [g.type, g.skills.length]), [['즉발형', 6], ['지속형', 3], ['증폭기', 2]]);
  const stars = Object.fromEntries(p.flatMap(g => g.skills).filter(k => k.stars).map(k => [k.name, k.stars]));
  assert.deepEqual(stars, { 장검: 1, 중형쇠뇌: 1, 피의검: 1, 도축기: 1, 이중자동쇠뇌: 2, '늑대 덫': 2 });
  assert.equal(SKULLS.filter(s => s.pool).length, 1);
});
test('spot checks', () => {
  assert.deepEqual(byId.werewolf.builds.map(b => b.label), ['물리', '마딜']);
  assert.deepEqual(byId.werewolf.builds[1].slots, [['사냥'], ['포식', '찢기']]);
  assert.deepEqual(byId.hunter.builds.map(b => b.label), ['추가타 빌드', '강타 빌드']);
  assert.deepEqual(byId.ghoul.builds[0].slots, [['흡입(물리증폭)'], ['크게썰기(공속증가)']]);
  assert.equal(byId.warrior.builds[1].notes.at(-1), '딜 자체는 혼신>>강타>제압=라이징');
  assert.deepEqual(SKULLS.filter(s => s.grade === 'legendary').map(s => s.id), ['grim-reaper', 'fighter', 'yaksha', 'arch-lich', 'gambler', 'davy-jones', 'king-arthur', 'dominator']);
  assert.deepEqual(byId.prisoner.pool[0].skills[5], { name: '피의검', value: '풀히트시 6타', stars: 1 });
  assert.deepEqual(byId.prisoner.pool[2].skills[0], { name: '선봉대의 방패', value: '증폭40%', stars: 0 });
  assert.deepEqual(byId.alchemist.builds[0].slots, [['불안정한소환'], ['마비', '화염', '오염물질']]);
  assert.ok(!byId.werewolf.builds[0].notes.includes('마딜'));
});
```

- [ ] **Step 3: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/data.js'`

- [ ] **Step 4: `public/js/data.js` 작성**

전사 규칙대로 스펙 파일 45개 항목을 모두 옮긴다.

- [ ] **Step 5: 통과 확인**

Run: `npm test`
Expected: 8 tests pass, 0 fail

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore public/js/data.js tests/data.test.js docs/
git commit -m "feat: transcribe skull skill recommendations into data module"
```

---

### Task 2: 검색·필터·해시 상태

**Files:**
- Create: `public/js/filter.js`, `public/js/state.js`
- Test: `tests/filter.test.js`, `tests/state.test.js`

**Interfaces:**
- Consumes: `SKULLS`, `GRADES` from `public/js/data.js`
- Produces:
  - `normalize(text: string): string`: 소문자로 바꾸고 공백·`-`·`·`을 제거한다.
  - `matchesQuery(skull: Skull, query: string): boolean`: 정규화한 query가 비면 true. 대상은 `name`, 모든 build slot 선택지, pool 스킬 `name`이다. notes는 검색하지 않는다. `String.prototype.includes`로 매칭한다.
  - `filterSkulls(skulls: Skull[], state: FilterState): Skull[]`: 원래 순서를 유지한다.
  - `/** @typedef {{ grade: 'all'|'common'|'rare'|'unique'|'legendary', mark: 'all'|'★'|'◆', query: string }} FilterState */`
  - `DEFAULT_STATE: FilterState = { grade:'all', mark:'all', query:'' }` (in `public/js/state.js`)
  - `parseHash(hash: string): FilterState`: `#`가 있든 없든 받는다. 키는 `grade`, `mark`, `q`다. 허용되지 않은 값은 기본값으로 바꾼다. `URLSearchParams`로 디코드한다.
  - `toHash(state: FilterState): string`: 기본값과 같은 키는 생략한다. 모두 기본값이면 `''`, 아니면 `'#grade=unique&q=%EC%A3%84%EC%88%98'` 형태다.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/filter.test.js`:
- `normalize('스켈레톤 - 검 ')`의 결과는 `'스켈레톤검'`이다.
- `['스켈레톤 검','스켈레톤검','스켈레톤-검']` 각각으로 `filterSkulls(SKULLS,{...DEFAULT_STATE,query:q})`를 돌린 결과에 `skeleton-sword`가 들어 있다. (Review Focus 1)
- query `''`와 `'   '`는 45개를 반환한다.
- query `'돌격!'`는 `skeleton-spear`를 포함하고, `'('`, `'+'`, `'.*'`는 예외 없이 배열을 반환한다. `'.*'`는 0개다. (Review Focus 3)
- query `'늑대 덫'`의 결과는 `['prisoner']`다(pool 검색).
- query `'사냥'`은 `werewolf`를 포함한다(slot 검색).
- `{grade:'unique'}`는 10개이고 첫 항목은 `rock-star`다. `{mark:'★'}`는 5개다. `{grade:'legendary',mark:'◆'}`의 결과 id는 `['davy-jones','dominator']`다.

`tests/state.test.js`:
- `parseHash('')`와 `parseHash('#')`는 `DEFAULT_STATE`와 같다.
- `parseHash('#grade=foo&mark=x')`는 `DEFAULT_STATE`와 같다. (Review Focus 2)
- `parseHash('#q=%EC%A3%84%EC%88%98&grade=unique')`의 결과는 `{grade:'unique',mark:'all',query:'죄수'}`다. (Review Focus 2)
- `parseHash('#mark=%E2%98%85')`의 `mark`는 `'★'`다.
- `parseHash('#q=%E0%A4%A')`는 예외를 던지지 않고 `query`가 문자열이다. (Review Focus 2)
- `toHash(DEFAULT_STATE)`의 결과는 `''`다.
- 상태 `{grade:'rare',mark:'◆',query:'돌격! &'}`에 대해 `parseHash(toHash(s))`는 다시 `s`와 같다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/filter.js'` / `'../public/js/state.js'`

- [ ] **Step 3: `public/js/filter.js`, `public/js/state.js` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add public/js/filter.js public/js/state.js tests/filter.test.js tests/state.test.js
git commit -m "feat: add search, grade/mark filters and hash state"
```

---

### Task 3: 카드 렌더링

**Files:**
- Create: `public/js/render.js`
- Test: `tests/render.test.js`

**Interfaces:**
- Consumes: `Skull`, `GRADES` (label 조회용)
- Produces:
  - `escapeHtml(s: string): string`: `& < > " '`를 엔티티로 바꾼다.
  - `renderCard(skull: Skull, options?: { images?: boolean }): string`: `images` 기본값은 `false`다. 전체 마크업은 `<article class="card grade-{grade}" id="skull-{id}">` 안에 다음 순서로 들어간다.
    1. `images`가 true일 때만 `<img class="portrait" src="img/{id}.png" alt="" loading="lazy" onerror="this.remove()">`
    2. 헤더: `<span class="no">{no}</span><h2>{name}</h2>`, mark가 있으면 `<span class="mark">{mark}</span>`, 등급 라벨 `<span class="grade">{GRADES label}</span>`
    3. builds가 있으면 `<ul class="builds">`. build마다 `<li>`를 쓴다. label이 있으면 `<span class="label">`을 붙인다. slot은 `<span class="slot">`이고 slot 사이는 ` + `로 잇는다. 선택지는 각각 `<span class="opt">`로 감싸고 ` / `로 잇는다. 선택지가 fixedSkill이면 opt 안 끝에 `<span class="fixed">고정</span>`을 붙인다(`<span class="opt">일섬<span class="fixed">고정</span></span>`). build notes는 `<ul class="notes">`에 넣는다.
    4. pool이 있으면 `<table class="pool">`. 행은 `유형 | 스킬 | 수치 | 추천` 순서이고, 추천 칸은 `★`를 stars번 반복한다(0이면 빈칸).
    5. builds와 pool이 모두 없으면 `<p class="no-build">별도 추천 없음</p>`
    6. skull notes는 `<ul class="notes">`에 넣는다.
    모든 데이터 문자열은 `escapeHtml`을 거친다.
  - `renderList(skulls: Skull[], options?: { images?: boolean }): string`: options를 각 카드에 넘기면서 카드를 이어 붙인다. 빈 배열이면 `<p class="empty">검색 결과가 없습니다.</p>`를 반환한다.

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/render.test.js`)
- `escapeHtml('<a href="x">&\'')`의 결과는 `'&lt;a href=&quot;x&quot;&gt;&amp;&#39;'`이다.
- 리틀본 카드는 `별도 추천 없음`을 포함하고 `class="builds"`는 포함하지 않는다. (Review Focus 4)
- 가짜 스컬 `{...werewolf, name:'<b>x</b>', builds:[{label:null,slots:[['a&b']],notes:['"q"']}]}`의 카드는 `&lt;b&gt;x&lt;/b&gt;`, `a&amp;b`, `&quot;q&quot;`를 포함하고 `<b>x</b>`는 포함하지 않는다. (Review Focus 5)
- 웨어울프 카드는 `<span class="label">물리</span>`와 `<span class="opt">포식</span> / <span class="opt">찢기</span>`를 포함한다.
- 웨어울프 카드는 기본 옵션에서 `<img`를 포함하지 않고, `{images:true}`이면 `src="img/werewolf.png"`를 포함한다.
- 사무라이 카드는 `<span class="opt">일섬<span class="fixed">고정</span></span>`을 포함한다.
- 죄수 카드는 `<table class="pool">`을 포함하고, `늑대 덫` 행에 `★★`가 있다.
- 무관 카드는 `<span class="mark">★</span>`를 포함하고 `id="skull-guan-yu"`를 포함한다.
- `renderList([])`는 `검색 결과가 없습니다.`를 포함한다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/render.js'`

- [ ] **Step 3: `public/js/render.js` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add public/js/render.js tests/render.test.js
git commit -m "feat: render skull cards as escaped HTML strings"
```

---

### Task 4: 페이지 조립 (HTML/CSS/main.js) + README

**Files:**
- Create: `public/index.html`, `public/css/style.css`, `public/js/main.js`, `public/_headers`, `README.md`

**Interfaces:**
- Consumes: `SKULLS`, `GRADES`, `SOURCE`, `filterSkulls`, `parseHash`, `toHash`, `DEFAULT_STATE`, `renderList`
- Produces: 없음(최종 산출물)

**페이지 구성:**
- `<html lang="ko">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>스컬별 스킬 추천</title>`, `<meta name="description">`. viewport가 없으면 모바일 360px 검증이 의미가 없다.
- `<header>`: 제목 `스컬별 스킬 추천`, 출처 줄 `원문: <a href=SOURCE.url target="_blank" rel="noopener">디시 스컬 갤러리 · 정도</a> · 수정 25.02.05, 26.01.26`, 머리말 `보스 비중이 크니 참고`
- `<nav>` 컨트롤:
  - 등급 탭 `<button data-grade="all|common|rare|unique|legendary">`. 라벨은 `전체`, GRADES 라벨이고 선택된 탭에는 `aria-pressed="true"`를 단다.
  - `<select id="mark" aria-label="원문 표기">` 옵션은 `원문 표기: 전체 / ★ / ◆`다.
  - `<input id="q" type="search" placeholder="스컬 또는 스킬 이름 검색">`을 두고, 그 옆에 `<span id="count">N개</span>`를 둔다.
- `<main id="list">`
- `<footer>`: `비공식 팬 정리 페이지입니다. 내용 출처는 위 원문이며, Skul: The Hero Slayer 관련 권리는 SouthPAW Games에 있습니다.`
- `public/js/main.js` 동작: 파일 맨 위에 `const IMAGES = false;`를 두고 `renderList(..., { images: IMAGES })`로 넘긴다. 시작할 때 `parseHash(location.hash)`로 컨트롤 값을 채우고 렌더링한다. 컨트롤 입력(`input`/`change`/`click`)이 오면 state를 갱신하고 `history.replaceState(null,'',toHash(state) || location.pathname)` 후 렌더링한다. `hashchange`가 오면 다시 파싱해서 렌더링한다.
- CSS: 카드 그리드는 `repeat(auto-fill, minmax(320px, 1fr))`이다. 등급마다 왼쪽 테두리 색을 다르게 하고(`.grade-common/.grade-rare/.grade-unique/.grade-legendary`), `.fixed`, `.mark`, `.label`은 배지로 표시한다. 360px 폭에서 가로 스크롤이 생기면 안 된다. `prefers-color-scheme: dark`도 지원한다.
- `public/_headers`: `/js/*`와 `/css/*`에 `Cache-Control: public, max-age=300`을 준다. 데이터를 자주 고치므로 캐시를 짧게 둔다.
- README: 실행 방법(`python -m http.server 8000 -d public`, 접속 주소 `http://localhost:8000`), `npm test`, 출처 링크와 작성자, 이미지를 넣는 법(`public/img/{id}.png`를 넣고 `public/js/main.js`의 `IMAGES`를 `true`로 바꾼다. id 목록은 `public/js/data.js` 참고), 데이터 갱신 절차(스펙 파일 수정 후 data.js 반영)를 적는다. 배포 방법도 적는다. 대시보드 Git 연동은 빌드 명령 없음, 출력 디렉터리 `public`로 설정한다. CLI는 `npx wrangler pages deploy public --project-name skul-skill-guide`이다. Git 연동으로 배포하면 `.gitignore`에 있는 `public/img/`는 올라가지 않는다는 점도 적는다.

- [ ] **Step 1: `public/index.html`, `public/css/style.css`, `public/js/main.js`, `public/_headers`, `README.md` 작성**

- [ ] **Step 2: 단위 테스트 회귀 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 3: 브라우저 수동 검증**

Run: `python -m http.server 8000 -d public` 후 `http://localhost:8000`에 접속한다.
Expected:
- 처음 접속하면 카드 45개가 보이고 `45개`로 표시된다. 콘솔 에러가 없다.
- `유니크` 탭에서 10개가 보이고 주소가 `#grade=unique`가 된다.
- 검색창에 `죄수`를 입력하면 죄수 카드 1개만 남고, 풀 표에 ★가 표시된다.
- `http://localhost:8000/#q=%EC%A3%84%EC%88%98`로 새로 접속해도 같은 결과이고 검색창에 `죄수`가 채워져 있다.
- `#grade=foo`로 접속하면 전체 45개가 보인다.
- 검색어 `zzz`는 `검색 결과가 없습니다.`를 보여 준다.
- 네트워크 탭에 `img/` 요청이 하나도 없다(`IMAGES=false`).
- 개발자도구 360px 폭에서 가로 스크롤이 없다.

- [ ] **Step 4: Commit**

```bash
git add public/index.html public/css/style.css public/js/main.js public/_headers README.md
git commit -m "feat: assemble static skill guide page with filters"
```

- [ ] **Step 5: Cloudflare Pages 배포 확인** (사용자가 Cloudflare 계정 로그인 후 진행)

Run: `npx wrangler pages deploy public --project-name skul-skill-guide` (또는 대시보드 Git 연동)
Expected:
- 출력된 `https://*.pages.dev`에서 Step 3 체크리스트가 모두 통과한다.
- `https://<도메인>/package.json`과 `/tests/data.test.js`는 404를 돌려준다.
- 응답 헤더에서 `/js/data.js`의 `Cache-Control`이 `max-age=300`이다.
