# 탭 고를 때 선택과 포커스 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 탭을 고르면 그 탭 목록의 항목 하나가 선택되고, 키보드 포커스가 그 항목으로 간다. 고칠 문제는 지금 탭을 클릭하면 포커스가 탭 버튼에 남아 방향키로 목록에 들어갈 수 없는 것이다.

**Architecture:**
- 고를 항목은 순수 함수 `tabSelection(entries, remembered)`(`public/js/search.js`)로 정한다.
- `app.js`의 `goToTab`이 이 함수로 고른 뒤 포커스를 옮긴다.
- 지금 `goToTab`이 쓰는 `autoSelect('tab')`(검색어가 있으면 이름이 맞는 항목을 고르는 규칙)는 탭 전환에서 빼고, ★/◆ 거르기에서만 쓴다.

**Tech Stack:** 바닐라 ES 모듈, Node `node:test`(`npm test`). 기존 그대로다.

**Spec:** 이 문서의 "규칙" 절. 2026-11-11 개발플래너 세션에서 사용자와 정했다. 기반은 `docs/superpowers/plans/2026-11-10-full-redesign.md`로 구현된 현재 `main`(21b7625)이다.

## 규칙 (사용자 결정, 2026-11-11)

탭을 고를 때(`goToTab`) 다음을 순서대로 적용한다.

1. 그 탭에서 이전에 고른 항목(`remembered[tab]`)이 지금 목록에 있으면, 그 항목을 고르고 포커스를 준다.
2. 이전 기억이 없거나 지금 목록에 없으면(검색어나 ★/◆로 빠짐), 목록의 **첫 항목**(화면 순서)을 고르고 포커스를 준다.
   - 검색어가 있어도 이름이 맞는 항목이 아니라 맨 첫 항목이다. 이름이 맞는 항목을 고르는 규칙(`autoPick`)은 검색어를 칠 때만 쓴다.
3. 목록이 비어 있으면 선택을 비운다. 상세에는 안내가 나오고, 포커스는 누른 탭 버튼에 남는다.
   - 이때 그 탭의 이전 기억은 지우지 않는다. 결과가 다시 생기면 1번이 적용된다.

적용 범위:
- 탭 버튼 클릭, 탭 버튼에서 Enter나 Space
- 결과 없음 안내의 "다른 탭에 결과가 있습니다" 버튼(`.to-tab`)
- 이미 열린 탭을 다시 누른 경우
- 데스크톱과 휴대폰 모두. 휴대폰에서는 고르기만 하고 상세 덮개는 열지 않는다.

이전 기억은 페이지를 연 동안만 유지된다. 새로고침하면 주소의 선택만 그 탭의 기억이 된다(지금과 같음).

바꾸지 않는 것:
- ★/◆ 거르기의 `autoSelect('tab')` 동작
- 검색어 입력 중 자동 선택(`autoSelect('query')`)
- 방향키, `/`, Esc
- 상세 안 링크 이동(`jumpTo`)

## Global Constraints

- 바꾸는 파일은 `public/js/search.js`, `public/js/app.js`, `tests/search.test.js`, `README.md` 네 개뿐이다. CSS, HTML, 데이터, 생성물은 건드리지 않는다.
- 루트의 `CLAUDE.md`(untracked)는 건드리지 않는다. 배포와 푸시는 사용자가 한다.
- 끝에 `npm test && npm run test:tools`가 통과해야 한다. UI 문구가 바뀌어 `tests/fonts.test.js`가 실패하면 `npm run build:fonts`를 다시 실행해 함께 커밋한다.

## Review Focus

1. **포커스가 실제로 목록으로 가는지:** 탭을 마우스로 클릭한 직후 `↓`, `↑`를 누르면 목록이 움직여야 한다.
   - 다시 그리기 포커스 복원(`keepFocus`)이 탭 버튼이나 목록 첫 항목으로 포커스를 되돌려 덮어쓰면 안 된다.
   - `.to-tab` 버튼은 목록 안에 있어서 다시 그리면 사라진다. 그 경우에도 포커스는 규칙대로 고른 항목에 가야 한다.
2. **빈 탭의 기억 보존:**
   - 아이템 탭에서 `칼레온 계급장`을 고른다. 검색어 `zzz`를 치고 아이템 탭을 누르면 선택이 비고 포커스는 탭 버튼에 남는다.
   - 검색어를 지우고 다시 아이템 탭을 누르면 `칼레온 계급장`이 선택된다.
3. **멀리 있는 기억 항목:** 기억한 항목이 목록 아래쪽(예: 아이템 탭의 흉조 아이템)이면 그 항목이 화면 안으로 스크롤되어 보인다.
4. **휴대폰:** 360px에서 탭을 눌러도 상세 덮개가 열리지 않는다. 포커스와 선택 표시만 바뀌고, 그 줄이 화면 안에 보인다.
5. **주소:** 탭을 바꾼 뒤 새로고침하면 같은 탭과 같은 선택이 열린다. 빈 탭이면 주소에 `sel`이 없다.

---

### Task 1: 탭 전환 선택 규칙과 포커스

**Files:**
- Modify: `public/js/search.js` (`tabSelection` 추가)
- Modify: `public/js/app.js` (`goToTab`, 기억 갱신)
- Modify: `tests/search.test.js`
- Modify: `README.md` (키보드 줄)

**Interfaces:**
- Consumes:
  - `tabEntries(results, tab, mark)`, `search(query)`, `Entry`(`search.js`, 기존)
  - `app.js`의 `update`, `currentResults`, `entryEl`, `remembered`, `resultsPane`, `keepFocus`(기존)
- Produces:
  ```js
  /** 탭을 고를 때 선택할 키. remembered가 entries에 있으면 그것, 아니면 첫 항목, entries가 비면 ''. */
  export function tabSelection(entries, remembered): string
  ```

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/search.test.js`, import에 `tabSelection` 추가)

```js
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
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: `tabSelection is not a function` 등으로 새 테스트만 FAIL

- [ ] **Step 3: `search.js`에 `tabSelection(entries, remembered)` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: 모두 PASS

- [ ] **Step 5: `app.js` 수정**
  - `goToTab(tab)`:
    1. `key = tabSelection(tabEntries(currentResults(), tab, state.mark), remembered[tab])`로 고를 키를 구한다. 검색어는 탭과 상관없으므로 `currentResults()`를 그대로 쓴다.
    2. `update({ tab, sel: key })`
    3. `autoSelect('tab')` 호출을 지운다.
    4. `key`가 있으면:
       - `resultsPane.scrollTop = 0`으로 목록을 맨 위로 보낸다.
       - `entryEl(key)`에 포커스를 준다. 멀리 있는 항목은 focus의 기본 스크롤로 보이게 된다.
       - `scrollIntoView({ block: 'nearest' })`로 화면 안에 있게 한다.
    5. `key`가 없으면 포커스를 옮기지 않는다. 클릭한 탭 버튼에 남는다.
       - `.to-tab`은 개수가 1 이상인 탭에만 나오므로 이 경우가 없다.
  - 기억 갱신: `remembered[state.tab] = state.sel`을 쓰는 세 곳(`update`, `select`, `loadFromLocation`) 모두 `state.sel`이 빈 문자열이 아닐 때만 쓴다. 빈 선택이 그 탭의 기억을 지우지 않게 하기 위해서다(규칙 3).
  - `keepFocus`(다시 그리기 포커스 복원)가 4번의 포커스를 덮어쓰면 안 된다(Review Focus 1). `update` 안에서 포커스가 복원된 뒤에 `goToTab`이 포커스를 주는 순서인지 확인한다.
  - 휴대폰에서도 같은 코드를 쓴다. `goToTab`은 상세 덮개를 열지 않는다(`openDetail`을 부르지 않음).

- [ ] **Step 6: README 키보드 줄 갱신**

`README.md` 8번째 줄의 키보드 설명 끝에 다음 문장을 덧붙인다.

"탭을 고르면 그 탭에서 전에 고른 항목(없거나 목록에 없으면 첫 항목)이 선택되고 포커스가 목록으로 갑니다."

- [ ] **Step 7: 테스트**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 8: 브라우저 확인** (`python -m http.server 8000 -d public`, 1280px와 360px)

Expected:
- 처음 열고 아이템 탭을 클릭하면 `그림자 정령 데스`가 선택되고 상세에 나온다. 바로 `↓`를 누르면 다음 칸으로 간다.
- 아이템 탭에서 `칼레온 계급장`을 고른 뒤 스컬 탭에 갔다가 아이템 탭을 클릭하면 `칼레온 계급장`이 선택되고 포커스도 그 칸에 있다.
- 아이템 탭에서 맨 아래쪽 `흉조: 혼돈`을 고르고 다른 탭에 갔다가 돌아오면 `흉조: 혼돈`이 선택되고, 화면 안에 보이고, 포커스가 있다(Review Focus 3).
- 검색어 `보물`일 때 처음 전체 탭을 클릭하면 `미지의 씨앗`이 선택된다. 반면 검색어를 칠 때의 자동 선택은 지금처럼 각인 `보물`이다.
- Review Focus 2의 빈 탭 시나리오가 그대로 동작한다.
- 결과 없음 화면의 "다른 탭에 결과가 있습니다" 버튼을 누르면 그 탭의 항목에 포커스가 간다(Review Focus 1).
- 탭 버튼에 Tab으로 가서 Enter를 눌러도 같다.
- 스컬 탭에서 ★를 켜고 끄는 동작은 이전과 같다.
- 360px에서 탭을 눌러도 상세 덮개가 열리지 않는다(Review Focus 4).
- 탭을 바꾼 뒤 새로고침하면 같은 탭과 선택이 열린다(Review Focus 5).
- 콘솔 에러가 없다.

- [ ] **Step 9: Commit**

```bash
git add public/js/search.js public/js/app.js tests/search.test.js README.md docs/superpowers/plans/2026-11-11-tab-select-focus.md
git commit -m "feat: selecting a tab focuses its remembered or first entry"
```

- [ ] **Step 10: 보고**

개발플래너에게 Step 8 결과를 보고한다. 개발플래너가 사용자에게 전달한다. 재배포 명령은 `npx wrangler deploy --name skul-guide --assets public --compatibility-date 2026-11-04`(사용자 진행)이다.
