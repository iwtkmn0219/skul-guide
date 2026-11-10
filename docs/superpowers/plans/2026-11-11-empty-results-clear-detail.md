# 결과가 없으면 상세 비우기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 지금 탭의 목록이 비어 있는 동안은 선택을 비워서 상세에 안내만 보이게 한다. 목록이 "검색 결과가 없습니다"인데 상세에 예전 항목이 다시 나타나는 일을 없앤다.

**Architecture:** `chooseSelection`(`public/js/search.js`)이 `entries`가 비면 `''`를 돌려주게 한다. `app.js`의 `autoSelect`는 이미 그 값으로 `select`하므로 그대로 둔다. Esc로 검색어를 지울 때도 `autoSelect('query')`를 부르게 해서, 비었던 선택이 기억한 항목으로 돌아오게 한다. 탭 기억(`remembered`)은 빈 선택으로 지워지지 않으므로(67da20c), 결과가 다시 생기면 기억이 그대로 쓰인다.

**Tech Stack:** 바닐라 ES 모듈, Node `node:test`(`npm test`)

**Spec:** 이 문서의 "규칙" 절. 2026-11-11 사용자 승인. 배경은 `docs/superpowers/plans/2026-11-11-tab-select-focus.md`의 최종 리뷰 Minor 1이다. 결과가 없는 탭을 눌러 상세가 비었는데, 그 상태에서 글자를 더 치거나 ★/◆를 바꾸면 기억해 둔 항목이 상세에 다시 나왔다.

## 규칙

- 검색어 입력(`autoSelect('query')`)이나 ★/◆ 거르기(`autoSelect('tab')`) 뒤에 지금 탭의 목록이 비어 있으면, 선택을 `''`로 만든다.
  - 상세에는 안내("목록에서 고르면 여기에 나옵니다.")가 나온다.
  - 주소에는 `sel`이 없다.
  - 데스크톱과 휴대폰 모두 같다.
- 그 탭의 기억은 지우지 않는다. 결과가 다시 생기면 다음과 같이 고른다.
  - 데스크톱에서 검색어가 있으면 지금처럼 자동 선택(`autoPick`)한다.
  - 검색어가 비면(Esc 등) 기억한 항목으로 돌아간다.
- 바꾸지 않는 것: 목록에 결과는 있지만 고른 항목만 빠진 경우(상세는 마지막 항목 유지, 재디자인 Review Focus 4), 탭 전환(`tabSelection`), 방향키, 상세 링크 이동.
- 이로써 재디자인 때의 동작 하나가 바뀐다. 전에는 검색 결과가 없어도 이전 상세를 남겼는데, 이제는 비운다. 사용자 결정이다.

## Global Constraints

- 바꾸는 파일은 `public/js/search.js`, `public/js/app.js`(주석과 Esc 처리 한 줄), `tests/search.test.js` 세 개뿐이다.
- 루트의 `CLAUDE.md`(untracked)는 건드리지 않는다. 푸시와 배포는 사용자가 한다.
- 끝에 `npm test && npm run test:tools`가 통과해야 한다.

## Review Focus

1. **결과가 다시 생길 때의 복귀:**
   - 데스크톱 아이템 탭에서 `칼레온 계급장`을 고르고 검색어 `zzz`를 친다. 상세가 비어야 한다.
   - Esc로 검색어를 지우면 `칼레온 계급장`이 다시 선택되고 상세에 나와야 한다.
2. **오타 수정:** 검색어 `칼레온x`로 결과가 없어 상세가 빈 뒤 `x`를 지우면, 데스크톱에서는 `칼레온` 결과의 자동 선택 항목이 상세에 나와야 한다.
3. **★/◆로 비는 경우:** 스컬 탭, 검색어 `칼레온`, ★를 켠다(칼레온 신병은 ★가 아님). 목록이 비고 상세도 안내만 보여야 한다. ★를 끄면 `칼레온 신병`이 다시 고른 항목이 된다.

---

### Task 1: 빈 결과에서 선택 비우기

**Files:**
- Modify: `public/js/search.js` (`chooseSelection`과 그 주석)
- Modify: `public/js/app.js` (`autoSelect` 주석만)
- Modify: `tests/search.test.js` (`chooseSelection` 테스트)

**Interfaces:**
- Consumes/Produces: 시그니처는 그대로다. `chooseSelection({ entries, query, remembered, reason, auto }): string`. 바뀌는 것은 `entries.length === 0`이면 항상 `''`라는 점 하나다.

- [ ] **Step 1: 테스트 수정 (실패하게)**

`tests/search.test.js`의 `chooseSelection` 테스트에서 다음 한 줄을 바꾼다.

```js
assert.equal(chooseSelection({ ...base, entries: [], reason: 'query' }), 'item:절대반지');
```

이 줄을 아래 세 줄로 바꾼다.

```js
// 목록이 비면 언제나 선택을 비운다(기억은 app.js에서 유지)
assert.equal(chooseSelection({ ...base, entries: [], reason: 'query' }), '');
assert.equal(chooseSelection({ ...base, entries: [], reason: 'tab' }), '');
assert.equal(chooseSelection({ ...base, entries: [], reason: 'query', auto: false }), '');
```

나머지 줄은 그대로 둔다(결과가 있을 때의 동작은 바뀌지 않는다).

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: `chooseSelection` 테스트만 FAIL(`'item:절대반지' !== ''`)

- [ ] **Step 3: `chooseSelection` 수정과 주석 정리**
  - `search.js`:
    - 맨 앞에서 `entries.length === 0`이면 `''`를 돌려준다.
    - 주석을 다음으로 바꾼다: "reason: 'query'(검색어가 바뀜) | 'tab'(★/◆ 거르기가 바뀜. 탭 전환은 tabSelection을 쓴다). 목록이 비면 ''."
  - `app.js`의 `autoSelect` 주석을 다음으로 바꾼다: "검색어나 ★/◆ 거르기가 바뀌면 결과에 맞춰 고른다. 목록이 비면 선택을 비운다. 다른 항목을 자동으로 고르는 것은 데스크톱에서만 한다. 포커스는 옮기지 않는다."
  - `autoSelect` 코드는 바꾸지 않는다. `key`가 `''`이면 `select('')`가 불리고, 기억은 67da20c의 규칙대로 지워지지 않는다. 이것을 코드에서 확인만 한다.
  - `app.js`의 Esc 처리(document keydown에서 검색어를 지우는 `update({ query: '' })`) 바로 뒤에 `autoSelect('query')`를 부른다.
    - 지금은 Esc가 검색어만 지우고 선택은 다시 정하지 않는다. 그래서 결과가 없어 비었던 선택이 Esc 뒤에도 빈 채로 남는다(Review Focus 1).
    - 검색어가 빈 상태라 `chooseSelection`은 기억한 항목을 돌려준다.
    - 입력칸에서 글자를 지워 검색어가 빌 때는 이미 input 처리에서 `autoSelect('query')`를 부르므로 바꾸지 않는다.

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 5: 브라우저 확인** (`python -m http.server 8000 -d public`, 1280px와 360px)

Expected:
- Review Focus 1~3이 그대로 동작한다.
- 결과가 없는 탭을 눌러 상세가 빈 상태에서 글자를 더 치거나 ★/◆를 바꿔도, 목록이 비어 있는 동안 상세는 안내만 보인다(원래 문제).
- 360px에서 검색어 `zzz`를 쳐도 상세 덮개가 열리지 않는다. 검색어를 지우면 전에 고른 줄의 선택 표시가 돌아온다.
- 콘솔 에러가 없다.

- [ ] **Step 6: Commit**

```bash
git add public/js/search.js public/js/app.js tests/search.test.js docs/superpowers/plans/2026-11-11-empty-results-clear-detail.md
git commit -m "fix: clear the detail while the current tab has no results"
```

- [ ] **Step 7: 보고**

개발플래너에게 Step 5 결과를 보고한다. 푸시와 배포는 사용자가 한다.
