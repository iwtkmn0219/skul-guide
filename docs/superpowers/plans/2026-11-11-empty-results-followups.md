# 빈 결과 후속 수정(Esc 포커스, 빈 목록 주소) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `2026-11-11-empty-results-clear-detail`(ff8c588)의 최종 리뷰에서 나온 Minor 2건을 고친다.
1. 결과 없음 화면의 "다른 탭에 결과가 있습니다" 버튼에 포커스가 있을 때 Esc를 누르면, 포커스와 선택이 서로 다른 항목에 간다.
2. 목록이 비는 주소(`sel`은 올바름)로 들어오면, 목록은 빈데 상세에 그 항목이 나온다.

**Architecture:**
- 1번: Esc 처리에서 고를 항목을 먼저 계산하고 `update({ query: '', sel })` 한 번으로 바꾼다. 그러면 다시 그리기 포커스 복원(`keepFocus`)이 처음부터 그 항목으로 포커스를 준다.
- 2번: 순수 함수 `selectionOnLoad(entries, sel)`(`search.js`)로 "목록이 비면 선택을 비운다" 규칙을 `loadFromLocation`에도 적용한다. 주소에 있던 선택은 그 탭의 기억으로 남긴다.

**Tech Stack:** 바닐라 ES 모듈, Node `node:test`(`npm test`)

**Spec:** 이 문서의 "규칙" 절. 2026-11-11 사용자 승인. 앞선 규칙은 `docs/superpowers/plans/2026-11-11-empty-results-clear-detail.md`를 따른다(목록이 비면 선택을 비우고, 탭 기억은 유지).

## 규칙

- **Esc로 검색어를 지울 때:**
  - 고를 항목은 지금과 같다: `chooseSelection({ entries: 검색어 '' 기준 지금 탭 목록, query: '', remembered: remembered[tab], reason: 'query', auto: 데스크톱 })`. 검색어가 비므로 기억한 항목이 된다.
  - 다른 점은 이 계산을 `update` **전에** 하고, 검색어와 선택을 한 번에 바꾼다는 것이다.
  - 포커스가 목록 안(예: `.to-tab` 버튼)에 있었다면, 다시 그린 뒤 그 고른 항목으로 간다. 포커스가 검색창에 있었다면 검색창에 남는다(지금과 같음).
- **주소로 들어올 때**(`loadFromLocation`: 처음 열기, 뒤로·앞으로):
  - 해석한 `sel`이 있으면 먼저 그 탭의 기억으로 남긴다(지금과 같음).
  - 그다음 지금 탭의 목록이 비어 있으면 선택을 `''`로 만든다. 목록에 결과가 있는데 그 항목만 빠진 경우는 선택을 그대로 둔다(재디자인 Review Focus 4).
  - 처음 열 때는 기존 주소 정리(`writeHistory(false)`)가 바뀐 상태로 주소를 다시 쓰므로 `sel`이 빠진다. 뒤로·앞으로에서는 주소를 따로 고치지 않는다.
  - 휴대폰에서 선택이 비면 상세 덮개를 열지 않는다(history 상태가 상세여도). 빈 덮개를 띄우지 않기 위해서다.

## Global Constraints

- 바꾸는 파일은 `public/js/search.js`, `public/js/app.js`, `tests/search.test.js` 세 개뿐이다.
- 루트의 `CLAUDE.md`(untracked)는 건드리지 않는다. 푸시와 배포는 사용자가 한다.
- 끝에 `npm test && npm run test:tools`가 통과해야 한다.

## Review Focus

1. **Esc 뒤 포커스와 선택이 같은 항목인지:**
   - 데스크톱 스컬 탭에서 웨어울프를 고르고 `광란`을 친다. 스컬 0, 아이템 2이므로 상세는 안내이고 "아이템 2" 버튼이 나온다.
   - Tab으로 그 버튼에 포커스를 두고 Esc를 누른다. 검색어가 지워지고, 웨어울프가 선택되고, 포커스도 웨어울프 줄에 있어야 한다.
   - 이어서 `↓`를 누르면 다음 줄 `칼레온 신병`이 선택되어야 한다.
2. **검색창에서 Esc:** 1번과 같은 상태에서 포커스가 검색창에 있을 때 Esc를 누르면, 웨어울프가 선택되고 포커스는 검색창에 남아야 한다.
3. **빈 목록 주소:**
   - `/#tab=skulls&q=%EA%B4%91%EB%9E%80&sel=skull:werewolf`를 새 탭에서 연다. 목록은 비고, 상세는 안내이고, 주소는 `#tab=skulls&q=%EA%B4%91%EB%9E%80`(sel 없음)로 정리되어야 한다.
   - 그 상태에서 Esc를 누르면 웨어울프가 선택되어야 한다(주소의 선택이 기억으로 남음).
4. **결과는 있는데 선택만 빠진 주소:** `/#tab=items&q=%EC%B9%BC%EB%A0%88%EC%98%A8&sel=item:%EC%A0%88%EB%8C%80%EB%B0%98%EC%A7%80`(`칼레온` 결과에 절대반지 없음)는 지금처럼 상세에 절대반지가 나오고 목록에는 선택 표시가 없어야 한다.
5. **휴대폰:** 360px에서도 1~3번이 같다. 3번 주소에서 상세 덮개가 열리지 않는다.

---

### Task 1: Esc 선택 선계산과 빈 목록 주소 처리

**Files:**
- Modify: `public/js/search.js` (`selectionOnLoad` 추가)
- Modify: `public/js/app.js` (Esc 처리, `loadFromLocation`)
- Modify: `tests/search.test.js`

**Interfaces:**
- Consumes:
  - `chooseSelection`, `tabEntries`, `search`(`search.js`, 기존)
  - `app.js`의 `update`, `entryEl`, `remembered`, `rememberSel`, `currentResults`, `desktop`, `detailDepth`, `setDetailOpen`(기존)
- Produces:
  ```js
  /** 주소로 들어올 때의 선택. entries가 비면 '', 아니면 sel 그대로(목록에 없어도). */
  export function selectionOnLoad(entries, sel): string
  ```

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/search.test.js`, import에 `selectionOnLoad` 추가)

```js
test('selectionOnLoad clears the selection only when the list is empty', () => {
  const items = tabEntries(search('칼레온'), 'items', 'all');
  assert.equal(selectionOnLoad(items, 'item:칼레온 계급장'), 'item:칼레온 계급장');
  assert.equal(selectionOnLoad(items, 'item:절대반지'), 'item:절대반지');   // 결과가 있으면 목록에 없어도 유지
  assert.equal(selectionOnLoad([], 'item:칼레온 계급장'), '');
  assert.equal(selectionOnLoad([], ''), '');
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: 새 테스트만 FAIL(`selectionOnLoad is not a function`)

- [ ] **Step 3: `search.js`에 `selectionOnLoad(entries, sel)` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: 모두 PASS

- [ ] **Step 5: `app.js` 수정**
  - **Esc 처리**(document keydown의 `if (e.key === 'Escape' && state.query)` 블록):
    1. `chooseSelection`으로 고를 키를 먼저 구한다. 인자는 `{ entries: tabEntries(search(''), state.tab, state.mark), query: '', remembered: remembered[state.tab], reason: 'query', auto: desktop.matches }`다.
    2. `update({ query: '', sel })`
    3. `sel`이 있으면 `entryEl(sel)?.scrollIntoView({ block: 'nearest' })`
    4. ff8c588에서 넣은 `autoSelect('query')` 호출은 지운다.
  - **`loadFromLocation`**:
    1. `parseAppHash`와 `rememberSel()`은 지금 순서대로 둔다(주소의 선택이 먼저 기억이 됨).
    2. 그다음 `render()` 전에 선택을 정리한다: `state = { ...state, sel: selectionOnLoad(tabEntries(currentResults(), state.tab, state.mark), state.sel) }`. 기억은 빈 선택으로 지워지지 않으므로 다시 쓰지 않는다.
    3. 상세 덮개를 열지 정하는 조건 `detailDepth() >= 1`에 `&& state.sel !== ''`를 더한다.
  - 처음 열 때 주소 정리(`writeHistory(false)`)는 바꾸지 않는다. 바뀐 `state`로 쓰므로 `sel`이 빠진다.

- [ ] **Step 6: 테스트**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 7: 브라우저 확인** (`python -m http.server 8000 -d public`, 1280px와 360px)

Expected:
- Review Focus 1~5가 그대로 동작한다.
- ff8c588 확인 항목이 그대로다: 아이템 탭에서 칼레온 계급장 → `zzz` → 안내 → Esc → 칼레온 계급장.
- 콘솔 에러가 없다.

- [ ] **Step 8: Commit**

```bash
git add public/js/search.js public/js/app.js tests/search.test.js docs/superpowers/plans/2026-11-11-empty-results-followups.md
git commit -m "fix: keep focus and selection together on Esc; clear selection for empty lists on load"
```

- [ ] **Step 9: 보고**

개발플래너에게 Step 7 결과를 보고한다. 푸시와 배포는 사용자가 한다.
