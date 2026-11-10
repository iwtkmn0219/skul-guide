# 허브·도감 임시 디자인 반영 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자이너 시안 `docs/design/2026-11-10-hub-items/`의 CSS를 실제 사이트(`public/css/`)에 반영한다. 2026-11-10 사용자가 "우선 반영"으로 승인했다.

**Architecture:** CSS만 바꾸고 HTML, JS, 데이터는 건드리지 않는다. 반영 방법은 파일마다 다르다.
- `home.css`와 `items.css`는 시안 파일로 통째로 바꾼다.
- `style-additions.css`는 `style.css`의 기존 규칙을 직접 고쳐서 통합한다. 끝에 덮어쓰기 규칙을 붙이는 방식은 쓰지 않는다.

**Tech Stack:** CSS(`:has()`, `color-mix()`, `prefers-color-scheme`, `prefers-reduced-motion`). 도구는 기존 그대로 쓴다.

**Spec:** `docs/design/2026-11-10-hub-items/README.md`와 같은 폴더의 `style-additions.css`, `home.css`, `items.css`. 시안 확인용 페이지 `hub.html`, `items.html`은 반영 대상이 아니라 비교 기준이다.

## Global Constraints

- 선행 조건: `docs/superpowers/plans/2026-11-10-hub-and-item-guide.md`의 Task 6까지 끝나 있고, 그 변경이 모두 커밋되어 있어야 한다. 시작할 때 `git status`에 `public/` 변경이 남아 있으면 멈추고 사용자에게 보고한다.
- 바꾸는 파일은 `public/css/style.css`, `public/css/home.css`, `public/css/items.css` 세 개뿐이다. HTML, JS, 마크업, 클래스 이름은 바꾸지 않는다.
- 시안 README의 "선택 제안"(도감 푸터의 출처 링크 문구 축약)은 이번 범위가 아니다. 허브 시안 `hub.html`의 푸터 마크업(`<ul class="sources">`)과 문구도 반영하지 않는다. 현재 `public/index.html`을 그대로 둔다.
- 이 디자인은 임시다. 사용자가 나중에 처음부터 다시 디자인할 예정이므로, 시안을 넘어서는 추가 다듬기는 하지 않는다.
- 결과 기준: 반영 후 `public/` 페이지의 모양이 시안 페이지(`hub.html`, `items.html`. 둘 다 `public/css/style.css` 위에 `style-additions.css`를 덧씌워 보여 줌)와 같아야 한다.

## Review Focus

1. `/items/`의 360px 가로 스크롤: 툴바를 가로 flex로 바꾸면 `nav.controls:has(.views) > .row { min-width: 0 }`가 없을 때 가로 스크롤이 생긴다. 시안 `items.css`에는 이 규칙이 들어 있으니 지우지 않는다. 확인은 Task 2 Step 2에서 한다.
2. 스킬 페이지 회귀: `style.css` 변경은 `/skills/`에도 적용된다. 다음이 예전처럼 동작해야 한다.
   - 등급 배지·헤딩 글자색
   - sticky 등급 헤딩 위치(`--toolbar-h`)
   - 스킬 정보 대화상자의 표 줄바꿈
   
   확인은 Task 1 Step 3에서 한다.
3. `word-break: keep-all`과 긴 문자열: 띄어쓰기 없이 긴 한글 문자열도 카드 밖으로 넘치면 안 된다. body의 `overflow-wrap: anywhere`를 남겨 두어야 한다. 확인은 Task 1과 Task 2의 360px 확인에서 한다.
4. 다크 모드 대비: `--*-text` 토큰의 다크 값은 기존 등급색과 같아야 한다(`var(--common)` 등). 그래야 다크 모드가 바뀌지 않는다. 확인은 Task 1 Step 3에서 한다.
5. `:has()` 미지원 브라우저: `:has()` 규칙이 무시되면 툴바가 시안 이전처럼 세로로 쌓인다. 그 경우에도 레이아웃이 겹치거나 가로 스크롤이 생기면 안 된다. 따로 대응 코드는 넣지 않고 Task 2 Step 2에서 확인만 한다.

---

### Task 1: 공통 스타일 통합(`style.css`) + 허브(`home.css`)

**Files:**
- Modify: `public/css/style.css`
- Replace: `public/css/home.css` ← `docs/design/2026-11-10-hub-items/home.css` (내용 그대로 복사)
- Add to git: `docs/design/2026-11-10-hub-items/`(시안 기록, 아직 untracked)

**`style.css` 통합 방법** (`style-additions.css` 항목 번호 기준):
1. 등급 글자색 토큰
   - `:root`에 `--legendary` 다음으로 `--common-text: #666666; --rare-text: #3468ab; --unique-text: #8846b7; --legendary-text: #915f17;`을 추가한다.
   - 다크 모드 `:root`에는 `--common-text: var(--common);`처럼 네 토큰 모두 기존 등급색을 가리키게 추가한다.
   - `.grade-common`~`.grade-legendary` 네 규칙에 각각 `--g-text: var(--*-text);`를 추가한다. 예: `.grade-common { --g: var(--common); --g-text: var(--common-text); }`
   - 기존 `.grade` 규칙과 `.grade-heading` 규칙의 `color: var(--g)`를 `color: var(--g-text, var(--g))`로 바꾼다. `.grade-heading::before`의 배경과 `.grade`의 `color-mix` 배경은 `var(--g)` 그대로 둔다.
2. 한글 줄바꿈: 기존 `body` 규칙에 `word-break: keep-all;`을 추가한다. `overflow-wrap: anywhere;`는 남긴다.
3. select 포커스: 기존 `:where(button, input, a, [tabindex]):focus-visible` 선택자에 `select`를 넣는다(`:where(button, input, select, a, [tabindex])`). 따로 규칙을 만들지 않는다.
4. site-nav: 기존 `.site-nav` 블록을 다음 결과가 되게 고친다.
   - `.site-nav`: 기존의 `display:flex; flex-wrap:wrap; max-width:1200px; margin:0 auto; font-size:.9rem`은 유지한다. `gap: 0 8px; padding: 4px 16px 0; border-bottom: 1px solid var(--border);`로 바꾸거나 추가한다.
   - `.site-nav a`: `color: var(--muted); text-decoration: none; display: inline-flex; align-items: center; min-height: 40px; padding: 0 6px; margin-bottom: -1px; border-bottom: 2px solid transparent;`
   - `.site-nav a:first-child { margin-left: -6px; }`
   - `.site-nav a:hover { color: var(--text); text-decoration: none; border-bottom-color: var(--border); }`
   - `.site-nav a[aria-current="page"] { color: var(--text); font-weight: 700; border-bottom-color: var(--accent); }`
   
   현재 페이지는 색, 굵기, 밑줄 세 가지로 표시된다.
5. 푸터: 기존 `footer.site` 규칙에 `margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);`를 합친다. 기존 `padding-bottom: 32px` 등은 유지한다. `.sources` 규칙은 시안 그대로 `footer.site p` 다음에 새로 추가한다.
6. 버튼 눌림 피드백: 시안의 `@media (prefers-reduced-motion: no-preference) { … :active { transform: translateY(1px); } }` 블록을 파일 끝에 주석과 함께 그대로 추가한다.

- [ ] **Step 1: 선행 조건 확인**

Run: `git status --short && git log --oneline -1`
Expected: `public/` 아래에 변경이 없고, 최근 커밋이 hub-and-item-guide 계획 Task 6 커밋이다. 아니면 멈추고 보고한다.

- [ ] **Step 2: `style.css` 통합과 `home.css` 교체**

- [ ] **Step 3: 회귀와 시안 일치 확인**

Run: `npm test && npm run test:tools`, then `python -m http.server 8000 -d public`(사이트)과 저장소 루트에서 `python -m http.server 8766`(시안)
Expected:
- 테스트가 모두 통과한다(CSS만 바꿨으므로 결과가 이전과 같아야 한다).
- 허브(`http://localhost:8000/`)가 시안(`http://localhost:8766/docs/design/2026-11-10-hub-items/hub.html`)과 같은 모양이다.
  - 카드 2장이 넓은 화면에서 한 줄을 채운다.
  - 위쪽 강조 테두리와 "바로 가기 →"가 있다.
  - site-nav의 현재 페이지에 밑줄이 있다.
  - 푸터 위에 구분선이 있다.
- 스킬 페이지(`/skills/`)를 라이트 모드로 보면 등급 배지와 등급 헤딩 글자가 이전보다 진하다. 다크 모드는 이전과 같다.
- 스킬 페이지의 sticky 등급 헤딩이 툴바 바로 아래에 붙는다. 스킬 정보 대화상자가 열리고 단계 탭이 동작하며, 표 글이 음절 중간에서 끊기지 않는다.
- 세 페이지 모두 site-nav에서 Tab으로 이동하면 포커스 표시가 보인다.
- 360px 폭에서 허브와 스킬 페이지에 가로 스크롤이 없다.
- 콘솔 에러가 없다.

- [ ] **Step 4: Commit**

```bash
git add public/css/style.css public/css/home.css docs/design/2026-11-10-hub-items docs/superpowers/plans/2026-11-10-apply-interim-design.md
git commit -m "style: apply interim hub design and shared style updates"
```

---

### Task 2: 도감 스타일(`items.css`)

**Files:**
- Replace: `public/css/items.css` ← `docs/design/2026-11-10-hub-items/items.css` (내용 그대로 복사)

시안 `items.css`에 들어 있는 주요 변경(참고용, 따로 구현할 것은 없음):
- `.grade-omen`의 `--g-text`
- 툴바 가로 배치와 `min-width: 0`
- 640px 이하에서 sticky 해제, 등급 탭 두 줄 감싸기
- 각인 보기에서 섹션 헤딩과 겹치는 분류 배지 숨김
- `.card.engraving { --g: var(--muted); }`

- [ ] **Step 1: `items.css` 교체**

- [ ] **Step 2: 시안 일치와 회귀 확인**

Run: `npm test`, then 사이트 `http://localhost:8000/items/`와 시안 `http://localhost:8766/docs/design/2026-11-10-hub-items/items.html`을 같은 해시로 비교한다.
Expected:
- 1280px와 360px 모두, 라이트와 다크 모두에서 다음 화면이 시안과 같다.
  - 기본 화면
  - `#grade=legendary&eng=%EB%B3%B4%EB%AC%BC`(각인 요약 패널, 아이템 5개)
  - `#view=engravings`(각인 카드 왼쪽 테두리가 중립색이고, 섹션 헤딩과 겹치는 분류 배지가 숨겨짐)
  - `#q=%EB%B3%B5%EC%A0%9C`(`복제 도장`의 랜덤 칩)
- 360px에서는 툴바가 sticky가 아니고, 등급 탭 6개(전체~흉조)가 가로 스크롤 없이 두 줄로 모두 보인다. 페이지 전체에도 가로 스크롤이 없다. (Review Focus 1)
- 흉조 섹션 헤딩과 배지 글자가 흉조 색으로 보인다.
- 개발자도구에서 `nav.controls:has(.views) > .row`의 `min-width: 0`이 적용되어 있다.
- Firefox 등에서 `:has()` 규칙을 끈 상태(개발자도구에서 해당 규칙 해제)로 봐도 툴바가 세로로 쌓일 뿐 겹치거나 넘치지 않는다. (Review Focus 5)
- 콘솔 에러가 없다.

- [ ] **Step 3: Commit**

```bash
git add public/css/items.css
git commit -m "style: apply interim item guide design"
```

- [ ] **Step 4: 재배포 안내** (사용자 진행)

사용자에게 `npx wrangler pages deploy public --project-name skul-skill-guide` 재배포를 안내하고, 두 태스크의 확인 결과를 보고한다.
