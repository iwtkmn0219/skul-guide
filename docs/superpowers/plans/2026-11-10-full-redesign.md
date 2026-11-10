# 전체 재디자인(한 화면 통합) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 허브(`/`), 스킬 추천(`/skills/`), 아이템·각인(`/items/`) 세 페이지를 `/` 한 화면(검색창, 탭, 목록·격자, 오른쪽 상세)으로 합치고, 어두운 보라 돌벽·횃불·픽셀 테두리·갈무리 글꼴 디자인을 입힌다.

**Architecture:** 데이터 모듈(`data.js`, `skills.js`, `items.js`)과 일치 규칙(`filter.js`의 `matchesQuery`, `item-filter.js`의 `matchesItemQuery`·`matchesEngravingQuery`, `skill-match.js`)은 그대로 쓴다. 새 순수 모듈은 다음과 같다.
- `search.js`: 검색, 탭, 선택 규칙
- `app-state.js`: 주소 해시와 예전 주소 변환
- `images.js`: 그림 자리
- `view-list.js`, `view-detail.js`: HTML 조각
- `keynav.js`: 방향키 계산

DOM 연결은 `app.js` 하나가 맡는다. `/skills/`, `/items/`는 새 화면으로 옮겨 주는 작은 페이지가 된다. 예전 페이지 코드는 마지막 태스크(Task 8)에서 지운다. 그 전까지는 예전 페이지도 동작한다.

**Tech Stack:** 정적 HTML/CSS, 바닐라 ES 모듈(빌드 없음, 런타임 의존성 없음). 테스트는 Node `node:test`(`npm test`)와 Python 3.12 표준 라이브러리 unittest(`npm run test:tools`)로 한다. 글꼴 서브셋 도구만 개발용 pip 패키지 `fonttools`, `brotli`를 쓴다. 테스트는 이 패키지 없이 돈다.

**Spec:** `docs/design/2026-11-10-redesign/README.md`(이하 "스펙", 장 번호는 이 문서 기준). 시안 화면은 `screens/`, 직접 열어 보는 시안은 `mockups/`에 있다. 스펙 2026-11-10 사용자 승인. 시안의 HTML/CSS는 분위기 참고용이고, 스펙 규칙이 우선한다.

## 계획에서 정한 것

스펙에 없거나 스펙 11장에서 개발자에게 맡긴 것을 이 계획에서 정했다. 사용자가 계획을 검토할 때 함께 확인한다.

1. **전체 탭의 아이템 묶음:** 등급 소제목을 유지한다(사용자 결정, 2026-11-10). 전체 탭의 스컬은 스펙 6.4대로 소제목 없이 줄 끝에 등급 글자를 붙인다. 각인은 소제목 없이 줄로 둔다.
2. **전체 개수:** 실제 데이터는 스컬 45 + 아이템 258 + 각인 36 = **339**개다. 스펙 6.1·11장의 "359"는 오기다.
3. **글꼴 서브셋:** 다음 글자를 남긴다. 결과는 세 파일 합계 약 137KB다(원본 1.24MB).
   - ASCII
   - KS X 1001 한글 2,350자
   - `public/`의 html·js·css에 실제로 쓰인 모든 글자

   서브셋에는 `fonttools`를 쓴다. 데이터에 새 글자가 생기면 Node 테스트가 실패해서 알려 준다. 재서브셋 명령은 `npm run build:fonts`다. Galmuri11-Bold와 Galmuri14에는 `≥`와 `ⓩ`가 없어서 시스템 글꼴로 나온다. 받아들이기로 한다.
4. **자동 선택(스펙 6.3-1의 "첫 결과"):** 화면 순서에서 이름이 검색어와 맞는 첫 항목을 고른다. 이름이 맞는 항목이 없으면 첫 항목을 고른다.
   - 예: 전체 탭에서 "보물"을 치면 아이템 15개가 앞에 나오지만, 이름이 맞는 각인 "보물"을 고른다.
   - 결과 순서 자체는 고정이다. 종류는 스컬 → 아이템 → 각인, 그 안은 등급 또는 분류 순서, 그 안은 데이터 순서다.
5. **상세 안의 링크 이동**(각인 칩, 각인 상세의 아이템 칸, 강화·변환형 링크):
   - 지금 탭이 전체 탭이면 그대로 둔다. 아니면 대상 종류의 탭(아이템 또는 각인)으로 바꾼다.
   - 대상이 지금 검색어의 결과에 있으면 검색어를 유지하고, 없으면 지운다.
   - history를 한 칸 쌓아 뒤로 가기로 돌아올 수 있게 한다.
   - 탭 바꾸기, 검색어 입력, 목록에서 고르기는 history를 쌓지 않는다(`replaceState`).
6. **탭 이동 시 선택:** 그 탭에서 마지막으로 고른 항목이 지금 결과에 있으면 그대로 둔다. 결과에 없고, 데스크톱이고, 검색어가 있으면 자동 선택한다. 그 밖에는 마지막 항목을 유지한다. ★/◆ 거르기를 켜고 끌 때도 같은 규칙을 쓴다.
7. **대표 조합 문구:** 빌드 없이 추천 표만 있는 스컬(죄수)은 "추천 표 참고"라고 쓴다. 빌드도 표도 없는 스컬(리틀본)은 "추천 없음"이라고 쓴다.
8. **각인 상세의 "이 각인이 붙은 아이템":** 작은 칸도 등급을 색으로만 나타내지 않도록 등급 소제목("레전더리 5")으로 나눈다.
9. **그림:**
   - 스컬 초상화는 상세 머리에만, 그림을 켰을 때(`IMAGES = true`)만 보인다.
   - 그림 폴더는 `public/img/skulls/{id}.png`, `public/img/items/{파일 이름}`이다. `public/img/`는 `.gitignore`에 넣는다. 지금의 `public/skills/img/`를 대신한다.
   - 아이템 파일 이름은 아이템 이름에서 `\ / : * ? " < > |`를 빼고 공백을 하나로 줄인 뒤 `.png`를 붙인다. 예: `영원의 뼈: 광란` → `영원의 뼈 광란.png`. 258개가 모두 다르다.
10. **휴대폰:** 열자마자 검색창에 포커스를 주지 않는다. 화면 자판이 목록을 가리기 때문이다. 데스크톱(761px 이상)에서만 준다.
11. **바닥 띠:**
    - 라이선스 조건인 "나무위키 기여자" 표기를 바닥 띠에 둔다.
    - 펼친 출처 목록 끝에 글꼴 라이선스 링크(`fonts/OFL.txt`)를 둔다.
    - 휴대폰의 상세 덮개 맨 끝에는 바닥 띠 복사본을 둔다(스펙 6.8).
12. **목록 항목의 접근성:** 목록 줄과 격자 칸은 모두 `<button>`이다.
    - 고른 항목에 `aria-current="true"`를 준다.
    - 포커스는 roving tabindex로 다룬다. 고른 항목만 `tabindex="0"`이고, 고른 항목이 목록에 없으면 첫 항목이 `tabindex="0"`이다.
    - 탭과 ★/◆ 버튼은 `aria-pressed` 버튼이다.

## Global Constraints

- 정적 사이트, 빌드 없음, 런타임 의존성 없음. 외부 CDN 금지. 글꼴은 `public/fonts/`에서 불러온다. 시안이 jsDelivr를 쓰는 것은 시안에서만이다.
- 게임 그림(로고, 캐릭터, 아이템 아이콘)을 저장소에 넣지 않는다. 디시인사이드 이미지 핫링크도 금지다.
- 라이트 모드는 만들지 않는다. `color-scheme: dark`.
- 데이터와 변환기는 바꾸지 않는다.
  - 손대지 않을 파일: `public/js/data.js`, `skills.js`, `items.js`, `data/*.xlsx`, `tools/convert_items.py`, `tools/extract_namu.py`
  - `skills.js`와 `items.js`는 생성물이므로 손으로 고치지 않는다.
- 비상업. 광고 영역을 두지 않는다. 출처(디시 원문, 나무위키 문서 7개)와 라이선스(CC BY-NC-SA 2.0 KR, 나무위키 기여자)가 화면에 보여야 한다.
- 360px 폭에서 페이지 전체 가로 스크롤이 생기면 안 된다. 키보드만으로 모든 기능을 쓸 수 있어야 하고 포커스가 보여야 한다. `prefers-reduced-motion: reduce`이면 횃불 깜빡임을 멈춘다. 다른 움직임은 넣지 않는다.
- 색, 글꼴, 크기, 테두리는 스펙 7장의 이름과 값을 그대로 쓴다. `border-radius`는 쓰지 않는다. 스펙 7.1 표에 없는 글자색 조합을 새로 만들면 WCAG 4.5:1 이상인지 확인한다.
- 등급, 표시, 선택 상태를 색으로만 구분하지 않는다(스펙 8장).
- 결과 수는 데이터 기준이다: 스컬 45, 아이템 258, 각인 36, 전체 339.
- UI 문구에 새 글자가 들어가서 `tests/fonts.test.js`가 실패하면, 같은 태스크 안에서 `npm run build:fonts`를 다시 실행하고 바뀐 `public/fonts/*.woff2`와 `tools/font-chars.txt`를 함께 커밋한다.
- 루트의 `CLAUDE.md`(untracked)는 건드리지 않는다. 배포는 사용자가 한다.
- 각 태스크 끝에 `npm test && npm run test:tools`가 통과해야 한다.

## Review Focus

1. **좁은 폭 넘침:**
   - 360px(휴대폰)과 761~900px(가장 좁은 데스크톱 두 칸)에서 다음이 칸 밖으로 넘치거나 페이지 가로 스크롤을 만들면 안 된다.
     - 긴 이름(예: `흉조: 거부할 수 없는 제안`, `벼락의 열 한번째 손가락`)
     - 탭 4개와 ★/◆ 버튼
     - 스킬 표와 각인 단계 표
   - 표는 칸 안에서 줄바꿈하거나 표만 가로 스크롤한다.
   - 확인은 Task 5 Step 4와 Task 7 Step 3에서 한다.
2. **휴대폰 상세와 뒤로 가기:** 다음 동작이 맞아야 한다.
   - 상세를 열고 뒤로 가기를 누르면 목록이 다시 보인다. 방금 본 줄에 포커스가 가고, 그 줄이 화면 안에 있다.
   - 상세 안에서 링크로 두 번 이동한 뒤 "◀ 목록"을 누르면 한 번에 목록으로 돌아간다.
   - 상세가 열린 채로 화면을 데스크톱 폭으로 넓히면 아무 칸도 `inert`로 남지 않는다.

   확인은 Task 7 Step 3에서 한다.
3. **키보드와 포커스:**
   - `/`는 검색창 밖에서만 검색창으로 간다. 검색창이나 다른 입력칸에서는 그냥 입력된다.
   - 포커스 고리(`--focus`, offset 5px)가 스크롤 칸 가장자리에서 잘리지 않는다.
   - Tab 순서는 검색 → 탭 → 목록(한 칸만) → 상세 → 바닥 띠다.
   - 상세의 단계 탭에서 쓰는 ←→는 목록 이동을 일으키지 않는다.

   확인은 Task 6 Step 5에서 한다.
4. **선택과 목록이 어긋나는 경우:** 다음 상황에서 상세는 마지막 항목을 그대로 보여 주고, 목록에는 선택 표시가 없어야 한다. 그 상태에서 `↓`를 누르면 첫 항목부터 이동한다.
   - 고른 항목이 검색어나 ★/◆ 거르기로 목록에서 사라진 경우
   - 주소의 `sel`이 지금 탭 결과에 없는 경우

   확인은 Task 6 Step 5에서 한다.
5. **픽셀 글꼴 가독성:**
   - 글꼴이 늦게 오거나 빠진 글자가 있어도 레이아웃이 크게 흔들리지 않아야 한다(`font-display: swap`, 대체 글꼴 `system-ui, "Malgun Gothic", sans-serif`).
   - 11px 라벨이 흐릿하게 보이지 않아야 한다. 갈무리 설계 크기의 정수배만 쓴다(스펙 7.2).

   확인은 Task 5 Step 4에서 한다.

## 파일 구조

| 파일 | 상태 | 역할 |
|---|---|---|
| `public/index.html` | 다시 씀 (Task 5) | 한 화면 앱 |
| `public/skills/index.html`, `public/items/index.html` | 다시 씀 (Task 8) | 예전 주소를 새 화면으로 옮기는 페이지 |
| `public/css/base.css` | 새로 (Task 5) | 토큰, `@font-face`, 돌벽과 횃불, 픽셀 테두리, 머리 띠, 탭, 바닥 띠, 포커스 |
| `public/css/app.css` | 새로 (Task 5, 7) | 두 칸 배치, 목록 줄, 격자 칸, 상세, 스킬 정보, 단계 표, 휴대폰 |
| `public/fonts/*.woff2`, `OFL.txt` | 생성 (Task 1) | 갈무리 서브셋과 라이선스 |
| `public/js/search.js` | 새로 (Task 2) | 검색, 탭별 결과, 개수, 자동 선택, 링크 이동 상태, 항목 찾기 |
| `public/js/app-state.js` | 새로 (Task 2) | 해시 ↔ 상태, 예전 주소 변환(데이터 import 없음) |
| `public/js/common.js` | 수정 (Task 3) | `highlight` 추가 |
| `public/js/images.js` | 새로 (Task 3) | `IMAGES` 설정, 그림 자리 글자, 그림 경로 |
| `public/js/view-list.js` | 새로 (Task 3) | 목록과 격자 HTML |
| `public/js/view-detail.js` | 새로 (Task 4) | 상세 HTML(스컬, 아이템, 각인, 안내) |
| `public/js/keynav.js` | 새로 (Task 6) | 방향키 다음 칸 계산 |
| `public/js/app.js` | 새로 (Task 5~7) | DOM 연결 |
| `tools/subset_fonts.py`, `tools/font-chars.txt` | 새로 (Task 1) | 글꼴 서브셋 도구와 그 글자 목록 |
| 삭제 (Task 8) | | `public/css/style.css`, `home.css`, `items.css`, `public/js/render.js`, `item-render.js`, `item-state.js`, `state.js`, `legacy-redirect.js`, `skill-page.js`, `item-page.js`와 해당 테스트 |

---

### Task 1: 갈무리 글꼴 서브셋

**Files:**
- Create:
  - `tools/subset_fonts.py`
  - `tools/test_subset_fonts.py`
  - `tests/fonts.test.js`
  - 생성물: `tools/font-chars.txt`, `public/fonts/Galmuri11.woff2`, `public/fonts/Galmuri11-Bold.woff2`, `public/fonts/Galmuri14.woff2`, `public/fonts/OFL.txt`
- Modify:
  - `package.json`: 스크립트 `build:fonts` 추가
  - `public/_headers`: `/fonts/*` 추가
  - `README.md`: "글꼴" 절 추가
- Add to git: `docs/design/2026-11-10-redesign/`(아직 untracked), 이 계획 파일

**Interfaces:**
- Produces:
  - `tools/subset_fonts.py`: `FONTS = ('Galmuri11.woff2', 'Galmuri11-Bold.woff2', 'Galmuri14.woff2')`, `ks_x_1001_hangul() -> list[str]`, `collect_chars(public_dir: str) -> set[str]`, `subset_text(public_dir: str) -> str`, `main(argv: list[str] | None = None) -> int`
  - 글꼴 파일 세 개. Task 5 CSS가 `../fonts/…`로 쓴다.
  - `npm run build:fonts`
  - `tests/fonts.test.js`: 이후 모든 태스크에서 UI 문구 글자를 검사한다.

- [ ] **Step 1: 실패하는 Python 테스트 작성** (`tools/test_subset_fonts.py`, 기존 테스트처럼 `from subset_fonts import …`)

```python
class KsHangulTest(unittest.TestCase):
    def test_2350_syllables(self):
        ks = ks_x_1001_hangul()
        self.assertEqual(len(ks), 2350)
        self.assertIn('가', ks); self.assertIn('힝', ks)
        self.assertNotIn('똠', ks); self.assertNotIn('쫒', ks)

class SubsetTextTest(unittest.TestCase):
    # setUp: 임시 public 폴더에 다음 파일을 UTF-8로 만든다.
    #   index.html = '<p>쫒★</p>\r\n', js/a.js = "'ⓩ'", css/a.css = 'a::after{content:"▸"}', fonts/OFL.txt = '똠'
    def test_includes_ascii_ks_and_used_chars(self):
        text = subset_text(self.dir)
        for c in ' A~가힝쫒★ⓩ▸':
            self.assertIn(c, text)
    def test_skips_other_files_and_control_chars(self):
        text = subset_text(self.dir)
        self.assertNotIn('똠', text); self.assertNotIn('\n', text); self.assertNotIn('\r', text)
    def test_sorted_and_unique(self):
        text = subset_text(self.dir)
        self.assertEqual(text, ''.join(sorted(set(text))))
```

- [ ] **Step 2: 실패 확인**

Run: `npm run test:tools`
Expected: `ModuleNotFoundError: No module named 'subset_fonts'`

- [ ] **Step 3: `tools/subset_fonts.py` 구현**

규칙:
- `ks_x_1001_hangul`:
  - EUC-KR 두 바이트 `0xB0A1`~`0xC8FE`(행 `0xB0`~`0xC8`, 열 `0xA1`~`0xFE`)를 하나씩 디코드한다.
  - U+AC00~U+D7A3 안의 글자만 남긴다.
  - 디코드 오류는 건너뛴다.
- `collect_chars`:
  - `public_dir` 아래를 재귀로 돌며 확장자가 `.html`, `.js`, `.css`인 파일만 UTF-8로 읽는다.
  - 코드포인트가 0x20 이상이고 0x7F가 아닌 글자를 모은다.
- `subset_text`: ASCII 0x20~0x7E, KS 한글, `collect_chars` 결과를 합쳐 정렬한 문자열을 돌려준다.
- `main`:
  - 인자는 `--src`, `--public`, `--chars-out`이다.
  - `fontTools`는 `main` 안에서 import한다. 없으면 `python -m pip install --user fonttools brotli`를 안내하고 1을 돌려준다.
  - `--src`에 `FONTS`와 `LICENSE.txt`가 없으면 Step 5의 내려받기 명령을 안내하고 1을 돌려준다.
  - 글꼴마다 `fontTools.subset`으로 서브셋한다. 옵션: `flavor='woff2'`, `layout_features=['*']`, `name_IDs=['*']`, `notdef_outline=True`, `populate(text=subset_text(...))`. 결과는 `{public}/fonts/{이름}`에 쓴다.
  - 글꼴마다 파일 크기를 출력하고, 요청한 글자 중 그 글꼴의 cmap(`getBestCmap()`)에 없는 ASCII 밖 글자도 출력한다.
  - `LICENSE.txt`를 `{public}/fonts/OFL.txt`로 복사한다.
  - `--chars-out`에 `subset_text` 결과를 UTF-8로, 끝 줄바꿈 없이 쓴다.
  - 성공하면 0을 돌려준다.

- [ ] **Step 4: 통과 확인**

Run: `npm run test:tools`
Expected: 새 테스트를 포함해 모두 PASS(fonttools 없이 통과해야 한다)

- [ ] **Step 5: 원본 글꼴 받기와 도구 설치** (`sources/`는 이미 `.gitignore`에 있다)

```bash
python -m pip install --user fonttools brotli
mkdir -p sources/galmuri && cd sources/galmuri
npm pack galmuri@2.40.3
tar -xzf galmuri-2.40.3.tgz package/dist/Galmuri11.woff2 package/dist/Galmuri11-Bold.woff2 package/dist/Galmuri14.woff2 package/dist/LICENSE.txt
mv package/dist/* . && rm -r package galmuri-2.40.3.tgz && cd ../..
```

- [ ] **Step 6: `package.json`에 스크립트 추가 후 실행**

`"build:fonts": "python -X utf8 tools/subset_fonts.py --src sources/galmuri --public public --chars-out tools/font-chars.txt"`

Run: `npm run build:fonts`
Expected:
- 종료 코드 0
- 크기: `Galmuri11.woff2` 약 45KB, `Galmuri11-Bold.woff2` 약 41KB, `Galmuri14.woff2` 약 51KB(±10KB)
- 빠진 글자는 Bold와 14에서만 `≥ⓩ`로 나온다(받아들임).
- `public/fonts/OFL.txt` 첫 줄은 `Copyright (c) 2019–2025 Lee Minseo (quiple@quiple.dev)`이다.

- [ ] **Step 7: Node 테스트 `tests/fonts.test.js` 작성**

```js
test('every character used in public/ html, js, css is in the font subset', () => {
  // tools/font-chars.txt를 읽어 끝의 \r\n만 떼고 Set으로 만든다.
  // public/ 아래를 재귀로 돌며 .html/.js/.css 파일의 글자 중 코드포인트가 0x20 이상이고 0x7F가 아닌 것을 모은다.
  assert.equal(missing, '', `글꼴 서브셋에 없는 글자: ${missing} → npm run build:fonts`);
});
test('font files and OFL license are present', () => {
  for (const f of ['Galmuri11.woff2', 'Galmuri11-Bold.woff2', 'Galmuri14.woff2']) assert.ok(statSync(fontPath(f)).size > 10_000, f);
  assert.ok(readFileSync(fontPath('OFL.txt'), 'utf8').includes('SIL OPEN FONT LICENSE Version 1.1'));
});
```

- [ ] **Step 8: `_headers`와 README**

`public/_headers`에 다음을 추가한다.

```
/fonts/*
  Cache-Control: public, max-age=604800
```

README에 "글꼴" 절을 추가한다.
- 출처: 갈무리 2.40.3, OFL-1.1, https://github.com/quiple/galmuri
- 서브셋 범위: ASCII, KS X 1001 한글 2,350자, 사이트에 쓰인 글자
- Step 5의 받기 명령
- `npm run build:fonts`
- 테스트가 실패하면 다시 실행한다는 안내

- [ ] **Step 9: 전체 테스트**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 10: Commit**

```bash
git add tools/subset_fonts.py tools/test_subset_fonts.py tools/font-chars.txt tests/fonts.test.js public/fonts package.json public/_headers README.md docs/design/2026-11-10-redesign docs/superpowers/plans/2026-11-10-full-redesign.md
git commit -m "feat: bundle subset Galmuri pixel fonts (OFL-1.1)"
```

---

### Task 2: 검색, 선택 규칙, 주소 상태

**Files:**
- Create: `public/js/search.js`, `public/js/app-state.js`, `tests/search.test.js`, `tests/app-state.test.js`

**Interfaces:**
- Consumes:
  - `matchesQuery(skull, query)` (`filter.js`)
  - `matchesItemQuery(item, query)`, `matchesEngravingQuery(eng, query)`, `isRandomEngraving(name)` (`item-filter.js`)
  - `normalize` (`common.js`)
  - `SKULLS`, `GRADES` (`data.js`), `ITEMS`, `ENGRAVINGS`, `ITEM_GRADES`, `ENGRAVING_CATEGORIES` (`items.js`)
- Produces (`search.js`):
  ```js
  /** @typedef {'skull'|'item'|'eng'} Kind */
  /** @typedef {{ kind: Kind, key: string, name: string, data: object }} Entry */
  export const TABS = ['all', 'skulls', 'items', 'engravings'];
  export const TAB_LABELS = { all: '전체', skulls: '스컬', items: '아이템', engravings: '각인' };
  export const MARK_LABELS = { '★': '신화 DLC', '◆': '마석 해금' };
  export function keyOf(kind, data): string           // 'skull:' + id | 'item:' + name | 'eng:' + name
  export function tabOfKind(kind): 'skulls'|'items'|'engravings'
  export function lookup(key): Entry | null           // 모르는 키, 랜덤 각인, 형식 오류 → null
  export function search(query): { skulls: Entry[], items: Entry[], engravings: Entry[] }  // 화면 순서
  export function tabEntries(results, tab, mark): Entry[]   // mark('all'|'★'|'◆')는 tab === 'skulls'일 때만 적용
  export function tabCounts(results, mark): { all: number, skulls: number, items: number, engravings: number }
  export function autoPick(entries, query): string    // 이름이 맞는 첫 항목 키, 없으면 첫 항목 키, 항목 없으면 ''
  export function chooseSelection({ entries, query, remembered, reason, auto }): string  // reason: 'query'|'tab'
  export function itemsOfEngraving(name): Entry[]     // 그 각인이 붙은 아이템, 중복 없이, 등급 순서
  export function jumpTo(state, key): AppState        // 계획에서 정한 것 5번
  ```
- Produces (`app-state.js`, import 없음):
  ```js
  /** @typedef {{ tab: 'all'|'skulls'|'items'|'engravings', query: string, mark: 'all'|'★'|'◆', sel: string }} AppState */
  export const DEFAULT_APP_STATE = Object.freeze({ tab: 'all', query: '', mark: 'all', sel: '' });
  export function parseAppHash(hash, isKnownKey): AppState
  export function toAppHash(state): string
  export function fromSkillsPage(hash): AppState
  export function fromItemsPage(hash): AppState
  ```

**규칙:**
- 화면 순서:
  - 스컬은 `GRADES` 순서, 아이템은 `ITEM_GRADES` 순서, 각인은 `ENGRAVING_CATEGORIES` 순서다. 같은 묶음 안은 데이터 순서다(안정 정렬).
  - 전체 탭은 스컬 → 아이템 → 각인 순서다.
- `Entry.name`은 데이터의 `name`이고, `Entry.data`는 원래 데이터 객체다.
- `tabCounts`: 스컬 수에는 `mark`를 적용한다. `all`은 `mark`를 적용하지 않은 스컬 + 아이템 + 각인이다.
- `chooseSelection`: 자동 선택 조건에 맞으면 `autoPick`, 아니면 `remembered`를 돌려준다. 조건은 다음을 모두 만족하는 것이다.
  - `auto`가 true다.
  - `normalize(query)`가 비어 있지 않다.
  - `entries`가 비어 있지 않다.
  - `reason === 'query'`이거나, `remembered`가 `entries`에 없다.
- `jumpTo`:
  - 탭은 `state.tab === 'all'`이면 `'all'`, 아니면 `tabOfKind(대상 종류)`다.
  - 대상이 `tabEntries(search(state.query), 새 탭, state.mark)`에 있으면 검색어를 유지하고, 없으면 `''`로 만든다.
  - `mark`는 그대로 두고, `sel`은 `key`로 바꾼다.
- `toAppHash`:
  - 상태가 `DEFAULT_APP_STATE`와 같으면 `''`를 돌려준다.
  - 아니면 항상 `tab`부터 쓴다. 이어서 기본값이 아닌 `q`, `mark`, `sel`을 이 순서로 쓴다(`URLSearchParams`).
- `parseAppHash`:
  - 해시에 `tab`이 없고 `grade`, `mark`, `q`, `skull` 중 하나라도 있으면, 루트 시절의 스킬 페이지 해시로 본다(`fromSkillsPage`로 처리한 뒤 `sel`을 검증).
  - 그 밖의 경우:
    - `tab`과 `mark`는 허용 목록에 있는 값만 받는다. 아니면 기본값이다.
    - `q`는 그대로 받는다.
    - `sel`은 `isKnownKey(sel)`이 true이고, 탭이 `'all'`이거나 `sel`의 종류가 그 탭의 종류일 때만 받는다. 아니면 `''`다.
- `fromSkillsPage`:
  - `tab`은 `'skulls'`다.
  - `q`는 그대로 받는다.
  - `mark`는 `★`, `◆`만 받는다.
  - `skull`이 `/^[a-z0-9-]+$/`이면 `sel`은 `'skull:' + skull`이다.
  - `grade`는 버린다.
- `fromItemsPage`:
  - `eng`이 비어 있지 않으면 `{ tab: 'engravings', query: '', mark: 'all', sel: 'eng:' + eng }`다.
  - 아니면 `{ tab: view === 'engravings' ? 'engravings' : 'items', query: q ?? '', mark: 'all', sel: '' }`다.
  - `grade`는 버린다. 검증은 루트의 `parseAppHash`가 한다.
- 잘못된 퍼센트 인코딩이 들어와도 예외를 던지지 않는다(`URLSearchParams`).

- [ ] **Step 1: 실패하는 테스트 작성 (`tests/search.test.js`)**

```js
const keys = entries => entries.map(e => e.key);
const all = search('');
test('totals', () => {
  assert.deepEqual(tabCounts(all, 'all'), { all: 339, skulls: 45, items: 258, engravings: 36 });
  assert.equal(tabCounts(all, '★').skulls, 5);
  assert.equal(tabCounts(all, '◆').skulls, 4);
  assert.equal(tabCounts(all, '★').all, 339);
});
test('display order: kind, then grade/category, then data order', () => {
  const e = tabEntries(all, 'all', 'all');
  assert.equal(e[0].key, 'skull:skul');
  assert.equal(e[45].key, 'item:그림자 정령 데스');
  assert.deepEqual([...new Set(e.map(x => x.kind))], ['skull', 'item', 'eng']);
  const gi = id => ITEM_GRADES.findIndex(g => g.id === id);
  const items = e.filter(x => x.kind === 'item');
  assert.ok(items.every((x, i) => i === 0 || gi(items[i - 1].data.grade) <= gi(x.data.grade)));
});
test('칼레온 across tabs; mark applies to the skull tab only', () => {
  const r = search('칼레온');
  assert.deepEqual(keys(r.skulls), ['skull:recruit']);
  assert.equal(r.items.length, 5);
  assert.deepEqual(keys(r.engravings), ['eng:전리품']);   // 효과 문구 "칼레온의 깃발"
  assert.deepEqual(tabCounts(r, 'all'), { all: 7, skulls: 1, items: 5, engravings: 1 });
  assert.deepEqual(tabEntries(r, 'skulls', '★'), []);
  assert.equal(tabEntries(r, 'all', '★').length, 7);
});
test('autoPick prefers a name match, else the first entry', () => {
  assert.equal(autoPick(tabEntries(search('보물'), 'all', 'all'), '보물'), 'eng:보물');
  assert.equal(autoPick(tabEntries(search('보물'), 'items', 'all'), '보물'), 'item:미지의 씨앗');
  assert.equal(autoPick(tabEntries(search('검'), 'items', 'all'), '검'), 'item:보급형 칼레온 검');
  assert.equal(autoPick(tabEntries(search('칼레온'), 'all', 'all'), '칼레온'), 'skull:recruit');
  assert.equal(autoPick([], 'x'), '');
});
test('chooseSelection', () => {
  const allK = tabEntries(search('칼레온'), 'all', 'all');
  const itemsK = tabEntries(search('칼레온'), 'items', 'all');
  const base = { query: '칼레온', remembered: 'item:절대반지', auto: true };
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query' }), 'skull:recruit');
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query', auto: false }), 'item:절대반지');
  assert.equal(chooseSelection({ ...base, entries: allK, reason: 'query', query: '  ' }), 'item:절대반지');
  assert.equal(chooseSelection({ ...base, entries: [], reason: 'query' }), 'item:절대반지');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab', remembered: 'item:칼레온 계급장' }), 'item:칼레온 계급장');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab' }), 'item:보급형 칼레온 갑옷');
  assert.equal(chooseSelection({ ...base, entries: itemsK, reason: 'tab', query: '' }), 'item:절대반지');
});
test('lookup', () => {
  assert.equal(lookup('skull:werewolf').name, '웨어울프');
  assert.equal(lookup('item:영원의 뼈: 광란').data.variantOf, '광란의 뼈');
  assert.equal(lookup('eng:보물').kind, 'eng');
  for (const bad of ['item:없는 아이템', 'eng:랜덤A', 'skull:', 'bad', '']) assert.equal(lookup(bad), null, bad);
});
test('itemsOfEngraving: unique, grade order', () => {
  const k = keys(itemsOfEngraving('보물'));
  assert.equal(k.length, 14);
  assert.equal(k[0], 'item:칼레온 계급장');
  assert.equal(k.filter(x => x === 'item:황금왕의 가호').length, 1);   // 보물 각인이 두 번 붙은 아이템
  assert.deepEqual(itemsOfEngraving('죄'), []);
});
test('jumpTo keeps the query only when the target is still a result', () => {
  const s = { tab: 'items', query: '칼레온', mark: 'all', sel: 'item:칼레온 계급장' };
  assert.deepEqual(jumpTo(s, 'eng:보물'), { tab: 'engravings', query: '', mark: 'all', sel: 'eng:보물' });
  assert.deepEqual(jumpTo(s, 'eng:전리품'), { tab: 'engravings', query: '칼레온', mark: 'all', sel: 'eng:전리품' });
  const a = { ...s, tab: 'all', mark: '★' };
  assert.deepEqual(jumpTo(a, 'item:보급형 칼레온 검'), { tab: 'all', query: '칼레온', mark: '★', sel: 'item:보급형 칼레온 검' });
  assert.deepEqual(jumpTo(a, 'item:절대반지'), { tab: 'all', query: '', mark: '★', sel: 'item:절대반지' });
});
```

- [ ] **Step 2: 실패하는 테스트 작성 (`tests/app-state.test.js`)** (`isKnownKey = k => lookup(k) !== null`)

```js
test('empty hash → defaults; default → empty hash', () => {
  for (const h of ['', '#']) assert.deepEqual(parseAppHash(h, known), DEFAULT_APP_STATE);
  assert.equal(toAppHash(DEFAULT_APP_STATE), '');
});
test('non-default state always writes tab first', () => {
  assert.equal(toAppHash({ ...DEFAULT_APP_STATE, query: '칼레온' }), '#tab=all&q=%EC%B9%BC%EB%A0%88%EC%98%A8');
});
test('round-trip', () => {
  const s = { tab: 'skulls', query: '사냥 + 도약', mark: '★', sel: 'skull:werewolf' };
  assert.deepEqual(parseAppHash(toAppHash(s), known), s);
  const i = { tab: 'all', query: '', mark: 'all', sel: 'item:영원의 뼈: 광란' };
  assert.deepEqual(parseAppHash(toAppHash(i), known), i);
});
test('invalid values fall back', () => {
  assert.deepEqual(parseAppHash('#tab=nope&mark=x&sel=item:없는것', known), DEFAULT_APP_STATE);
  assert.equal(parseAppHash('#tab=items&sel=skull:werewolf', known).sel, '');   // 탭과 종류가 다름
  assert.equal(parseAppHash('#tab=all&sel=eng:보물', known).sel, 'eng:보물');
  assert.doesNotThrow(() => parseAppHash('#tab=all&q=%E0%A4%A', known));
});
test('root-era skill hashes (no tab) open the skull tab', () => {
  assert.deepEqual(parseAppHash('#grade=unique&q=%EC%A3%84%EC%88%98', known), { tab: 'skulls', query: '죄수', mark: 'all', sel: '' });
  assert.equal(parseAppHash('#skull=prisoner', known).sel, 'skull:prisoner');
  assert.equal(parseAppHash('#mark=%E2%98%85', known).mark, '★');
  assert.deepEqual(parseAppHash('#foo=1', known), DEFAULT_APP_STATE);
});
test('/skills/ and /items/ hashes', () => {
  assert.equal(toAppHash(fromSkillsPage('')), '#tab=skulls');
  assert.equal(fromSkillsPage('#skull=Bad!').sel, '');
  assert.equal(toAppHash(fromItemsPage('')), '#tab=items');
  assert.deepEqual(fromItemsPage('#view=engravings&q=%EB%8F%85'), { tab: 'engravings', query: '독', mark: 'all', sel: '' });
  assert.deepEqual(fromItemsPage('#grade=legendary&eng=%EB%B3%B4%EB%AC%BC'), { tab: 'engravings', query: '', mark: 'all', sel: 'eng:보물' });
  assert.deepEqual(parseAppHash(toAppHash(fromItemsPage('#eng=%EB%9E%9C%EB%8D%A4A')), known), { tab: 'engravings', query: '', mark: 'all', sel: '' });
});
```

- [ ] **Step 3: 실패 확인**

Run: `npm test`
Expected: `search.test.js`와 `app-state.test.js`가 모듈을 찾지 못해 FAIL

- [ ] **Step 4: `search.js`와 `app-state.js` 구현** (위 규칙대로. `app-state.js`는 아무것도 import하지 않는다. `/skills/`·`/items/` 페이지가 데이터를 받지 않고 이 모듈만 불러오기 때문이다.)

- [ ] **Step 5: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 6: Commit**

```bash
git add public/js/search.js public/js/app-state.js tests/search.test.js tests/app-state.test.js
git commit -m "feat: unified search, selection rules and hash state"
```

---

### Task 3: 검색어 표시, 그림 자리, 목록·격자 HTML

**Files:**
- Modify: `public/js/common.js` (`highlight` 추가)
- Create: `public/js/images.js`, `public/js/view-list.js`, `tests/common.test.js`, `tests/images.test.js`, `tests/view-list.test.js`

**Interfaces:**
- Consumes: Task 2의 `search`, `tabEntries`, `tabCounts`, `keyOf`, `TAB_LABELS`, `MARK_LABELS`, `Entry`. 그 밖에 `SOURCE`, `GRADES`(`data.js`), `ITEM_GRADES`, `ENGRAVING_CATEGORIES`(`items.js`), `isRandomEngraving`.
- Produces:
  ```js
  // common.js
  export function highlight(text, query): string   // 이스케이프된 HTML. 맞은 부분을 <mark>로 감싼다
  // images.js
  export const IMAGES = false;   // public/img/에 그림을 넣은 뒤 true로 바꾸면 스컬 초상화와 아이템 그림을 보여 준다
  export function itemGlyph(name): string
  export function itemImageFile(name): string
  export function itemImageUrl(name): string        // 'img/items/' + encodeURIComponent(itemImageFile(name))
  export function skullImageUrl(id): string         // 'img/skulls/' + id + '.png'
  // view-list.js
  export function comboText(skull): string
  export function renderResults({ tab, results, mark, query, sel, images }): string
  ```
- 마크업 약속(Task 5 CSS와 Task 5~7 `app.js`가 쓴다):
  - 모든 항목은 `<button type="button" class="entry …" data-key="{키}" tabindex="0|-1">`이다. 고른 항목에는 `aria-current="true"`가 붙는다. 출력 전체에서 `tabindex="0"`은 정확히 하나다(고른 항목, 없으면 첫 항목).
  - 스컬 줄: `<button class="entry row grade-{g}" …><span class="sq" aria-hidden="true"></span><span class="no">{no}</span><span class="nm">{이름}</span>{표시}<span class="combo">{대표 조합}</span>{전체 탭이면 <span class="gr">{등급}</span>}</button>`
  - 표시(★/◆): `<span class="mark" title="{MARK_LABELS}"><span aria-hidden="true">{기호}</span><span class="sr-only">{MARK_LABELS}</span></span>`
  - 아이템 칸:
    - `<button class="entry cell grade-{g}" …><span class="slot" aria-hidden="true">{글자}{그림}</span>{신화 DLC 표}<span class="nm">{이름}</span><span class="engs">{칩 2개}</span></button>`
    - 칩은 `<span class="chip">{각인}</span>`이다. 무작위 각인이면 `<span class="chip random" title="무작위 각인">{각인}</span>`이다.
    - 신화 DLC 표는 `<span class="dlc" title="신화 DLC"><span aria-hidden="true">★</span><span class="sr-only">신화 DLC</span></span>`다.
    - 그림은 `IMAGES`일 때만 `<img src="{itemImageUrl}" alt="" loading="lazy" onerror="this.remove()">`로 넣는다.
  - 각인 줄: `<button class="entry row eng" …><span class="nm">{이름}</span><span class="mod">개조 가능|개조 불가</span></button>`
  - 묶음:
    - 스컬·아이템·각인 탭: `<section class="group"><h2 class="sub grade-{g}">{등급} <span class="n">{n}</span></h2><div class="rows|grid">…</div></section>`. 각인 탭은 `class="sub"`(색 없음)이고 제목이 분류 이름이다.
    - 전체 탭: `<section class="kind-group"><h2 class="kind-head">{스컬|아이템|각인} <span class="n">{n}</span></h2>…</section>`. 스컬과 각인은 소제목 없이 `<div class="rows">`다. 아이템은 등급마다 `<h3 class="sub grade-{g}">…</h3><div class="grid">`다.
  - 스컬 탭 맨 위: `<p class="list-source"><a href="{SOURCE.url}" target="_blank" rel="noopener">디시 스컬 갤러리 「스컬별 스킬 추천」</a> · 정도 · 수정 25.02.05, 26.01.26 · 보스 비중이 크니 참고</p>`. 값은 `SOURCE`에서 만든다.
  - 결과 없음: `<p class="empty">검색 결과가 없습니다.</p>`. 다른 탭(전체 제외)에 결과가 있으면 다음 줄을 덧붙인다: `<p class="empty-hint">다른 탭에 결과가 있습니다. <button type="button" class="to-tab" data-tab="{탭}">{탭 이름} {n}</button>…</p>`. 개수가 0인 탭은 넣지 않는다.

**규칙:**
- `highlight`:
  - 원문 글자 중 `[\s\-·]`를 건너뛰고 소문자로 바꾼 "정규화 문자열"을 만든다. 정규화 문자열의 각 글자가 원문 몇 번째 글자인지도 함께 기록한다.
  - 정규화된 검색어가 겹치지 않게 나오는 곳을 모두 찾는다.
  - 찾은 곳마다 원문의 첫 글자부터 끝 글자까지를 감싼다. 사이에 건너뛴 공백이나 `-`가 있으면 그것도 함께 감싼다.
  - 감싼 부분과 나머지를 각각 이스케이프한다.
  - 정규화된 검색어가 비면 `escapeHtml(text)`와 같다.
- 검색어 표시는 그 종류의 검색 대상 필드에만 쓴다.
  - 스컬: 이름, 대표 조합
  - 아이템: 이름, 각인 칩
  - 각인: 이름
- `itemGlyph`: 앞의 `흉조:` 접두어와 그 뒤 공백을 떼고, 공백으로 나눈 마지막 낱말의 첫 글자를 돌려준다.
- `itemImageFile`: `\ / : * ? " < > |`를 지우고, 연속 공백을 하나로 줄이고, 앞뒤 공백을 지운 뒤 `.png`를 붙인다.
- `comboText`:
  - 첫 빌드의 슬롯을 `' + '`로 잇고, 슬롯 안 대안은 `/`로 잇는다.
  - 빌드가 2개 이상이면 `` ` · 빌드 ${builds.length}` ``를 붙인다.
  - 빌드가 없고 `pool`이 있으면 `추천 표 참고`, 둘 다 없으면 `추천 없음`이다.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/common.test.js`:
```js
test('highlight wraps normalized matches in <mark>', () => {
  assert.equal(highlight('보급형 칼레온 검', '칼레온'), '보급형 <mark>칼레온</mark> 검');
  assert.equal(highlight('스켈레톤-검', '톤검'), '스켈레<mark>톤-검</mark>');
  assert.equal(highlight('ABC', 'b'), 'A<mark>B</mark>C');
  assert.equal(highlight('aXaXa', 'a'), '<mark>a</mark>X<mark>a</mark>X<mark>a</mark>');
  assert.equal(highlight('a<b', '<'), 'a<mark>&lt;</mark>b');
  assert.equal(highlight('a&b', ''), 'a&amp;b');
  assert.equal(highlight('없음', 'zz'), '없음');
});
```

`tests/images.test.js`:
```js
test('glyph is the first letter of the last word, without 흉조:', () => {
  const cases = { '칼레온 계급장': '계', '보급형 칼레온 검': '검', '흉조: 월식': '월', '영원의 뼈: 광란': '광', '고통 & 절망': '절' };
  for (const [name, g] of Object.entries(cases)) assert.equal(itemGlyph(name), g, name);
});
test('image file names are filesystem-safe and unique', () => {
  assert.equal(itemImageFile('영원의 뼈: 광란'), '영원의 뼈 광란.png');
  assert.equal(itemImageFile('흉조: 월식'), '흉조 월식.png');
  assert.equal(new Set(ITEMS.map(i => itemImageFile(i.name))).size, 258);
  assert.equal(itemImageUrl('고통 & 절망'), 'img/items/' + encodeURIComponent('고통 & 절망.png'));
  assert.equal(skullImageUrl('werewolf'), 'img/skulls/werewolf.png');
  assert.equal(IMAGES, false);
});
```

`tests/view-list.test.js`. 도우미는 두 개다.
- `byId = Object.fromEntries(SKULLS.map(s => [s.id, s]))`
- `html(opts) = renderResults({ tab: 'all', results: search(''), mark: 'all', query: '', sel: '', images: false, ...opts })`
```js
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
```

속성 순서는 `class`, `data-key`, `tabindex`, `aria-current`이다. 테스트가 이 순서를 가정한다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: 새 테스트 세 파일이 FAIL(`highlight` 없음, 모듈 없음)

- [ ] **Step 3: 구현** (`common.js`의 `highlight`, `images.js`, `view-list.js`)

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 5: Commit**

```bash
git add public/js/common.js public/js/images.js public/js/view-list.js tests/common.test.js tests/images.test.js tests/view-list.test.js
git commit -m "feat: list/grid markup with match marks and item glyph slots"
```

---

### Task 4: 상세 HTML(스컬, 아이템, 각인)

**Files:**
- Create: `public/js/view-detail.js`, `tests/view-detail.test.js`

**Interfaces:**
- Consumes:
  - Task 2: `lookup`, `itemsOfEngraving`, `MARK_LABELS`, `Entry`
  - Task 3: `highlight`, `itemGlyph`, `itemImageUrl`, `skullImageUrl`
  - 기존 모듈: `SKILL_INFO`, `NAMU`(`skills.js`), `isRecommended`, `ANY`(`skill-match.js`), `variantsOf`, `isRandomEngraving`(`item-filter.js`)
- Produces:
  ```js
  export function defaultStageIndex(stages): number    // render.js에서 옮김(같은 동작)
  export function renderDetail(entry, { query = '', images = false } = {}): string
  ```
- 마크업 약속(CSS와 `app.js`가 쓴다):
  - 안내(`entry === null`): `<div class="placeholder"><p>목록에서 고르면 여기에 나옵니다.</p><p class="keys"><kbd>/</kbd> 검색 · <kbd>↑</kbd><kbd>↓</kbd> 이동</p></div>`
  - 머리(공통): `<header class="detail-head">{그림 자리}<div><p class="kind">{종류}</p><h2 id="detail-title" tabindex="-1">{이름}</h2><p class="badges">{배지}</p></div></header>`
    - 종류는 `스컬`, `아이템`, `` `각인 · ${category}` ``다.
    - 배지:
      - 등급: `<span class="badge grade grade-{g}">{등급}</span>`
      - ★/◆, 신화 DLC: `<span class="badge mark">★ 신화 DLC</span>`, `<span class="badge mark">◆ 마석 해금</span>`
      - 개조: `<span class="badge mod">개조 가능|개조 불가</span>`
    - 그림 자리:
      - 아이템은 항상 `<span class="slot grade-{g}" aria-hidden="true">{글자}{그림}</span>`이다.
      - 스컬은 `images`일 때만 `<img class="portrait" src="{skullImageUrl}" alt="" onerror="this.remove()">`이다.
  - 다른 항목으로 가는 것은 모두 `class`에 `jump`가 있고 `data-key`가 있는 `<button type="button">`이다.
    - 각인 칩: `<button type="button" class="chip jump" data-key="eng:{이름}">`
    - 아이템 작은 칸: `<button type="button" class="jump mini grade-{g}" data-key="item:{이름}">`
    - 강화·변환형 링크: `<button type="button" class="link jump" data-key="item:{이름}">`
  - 단계 탭은 지금 `renderSkillDialog`와 같다.
    - 탭: `role="tab"`, `id="stage-tab-{i}"`, `aria-controls`, `data-stage`, `aria-selected`, `tabindex`
    - 패널: `role="tabpanel"`, `id="stage-panel-{i}"`, `data-stage`
    - 이것을 `<section class="skill-info" aria-labelledby="skill-info-title"><h3 id="skill-info-title">스킬 정보</h3><div class="stage-tabs" role="tablist" aria-label="각성 단계">…</div>…<p class="attribution">…</p></section>`로 감싼다.
- 내용(스펙 6.7):
  - **스컬:**
    - 빌드 `<ul class="builds"><li class="build">`. 빌드 이름 `<span class="tag">`, 조합 `<p class="combo">`가 들어간다.
      - 선택지 칩은 `<span class="chip rec">`, 아무거나는 `<span class="chip any">아무거나</span>`, 고정 스킬은 `<span class="fixed">고정</span>`이다.
      - 대안은 `<span class="or">/</span>`, 슬롯 사이는 `<span class="plus">+</span>`로 잇는다.
      - 메모는 **전부** `<ul class="notes">`에 넣는다. 접기와 "더보기"는 없앤다.
    - 죄수 추천 표 `<table class="pool">`. 이름 칸은 `<td class="name">`이다.
    - 빌드도 표도 없으면 `<p class="no-build">별도 추천 없음</p>`을 넣는다.
    - 스컬 메모 `<ul class="notes">`
    - "그 외" 칩 `<p class="others"><span class="others-label">그 외|스킬</span><span class="chip">…</span></p>`
    - 스킬 정보: 단계 탭, 패시브, 교대, 스킬 표, `<tr class="rec">`, `<span class="tag">추천</span>`, 변형 행 `class="variant"`, 나무위키 출처 줄
    - `render.js`의 `renderBuild`, `renderPool`, `renderOthers`, `renderStage`, `renderSkillDialog`를 옮겨 와서 고친다. `hit` 클래스는 `highlight`로 바꾼다.
  - **아이템:**
    - 설명 `<p class="desc">`. 줄은 `<br>`로 잇는다.
    - 각인 칩 `<p class="engs">`. 무작위 각인은 `<span class="chip random" title="무작위 각인">`이다.
    - 무작위가 아닌 각인이 있으면 `<h3>각인 효과</h3>`를 두고, 각인마다 한 번씩(중복 제거) `<section class="tier-box"><h4>{각인}<span class="mod">개조 가능|개조 불가</span></h4>{단계 표}</section>`를 넣는다.
    - 강화·변환형: `<p class="variant-of">{링크}의 강화·변환형</p>`, `<p class="variants">강화·변환형: {링크들}</p>`
  - **각인:**
    - 단계 표를 넣는다.
    - `<h3>이 각인이 붙은 아이템 <span class="n">{n}</span></h3>` 아래에 등급마다 `<h4 class="sub grade-{g}">{등급} <span class="n">{n}</span></h4><div class="mini-grid">{작은 칸}</div>`를 넣는다.
    - 작은 칸 안은 `<span class="slot" aria-hidden="true">{글자}{그림}</span><span class="nm">{이름}</span>`이다.
    - 아이템이 0개면 `<p class="no-items">이 각인을 가진 아이템이 없습니다.</p>`를 넣는다.
  - **단계 표**(아이템과 각인 공통):
    - `<table class="tiers"><tbody>` 행은 `<tr><td>{n}개</td><td>{효과 줄}</td></tr>`이고, 개조 행은 `<tr class="mod"><td>{n}개 개조</td>…`이다.
    - 표 다음에 `note`마다 `<p class="note">※ {note}</p>`를 둔다.
  - 검색어 표시(`highlight`)는 검색 대상 필드에만 쓴다.
    - 스컬: 빌드 선택지, 추천 표 이름, "그 외" 칩, 스킬 표 이름, 교대 이름
    - 아이템: 이름, 설명, 각인 칩
    - 각인: 이름, 효과, note

- [ ] **Step 1: 실패하는 테스트 작성** (`d = (key, o) => renderDetail(lookup(key), o)`)

```js
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
  const sp = d('skull:spartan'); const start = sp.indexOf('class="others"');
  const others = sp.slice(start, sp.indexOf('</p>', start));   // "그 외" 줄만. 뒤의 스킬 표에는 심장 추적이 있다
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
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: `view-detail.test.js` FAIL(모듈 없음)

- [ ] **Step 3: `view-detail.js` 구현** (`render.js`는 Task 8까지 그대로 둔다. 옮겨 온 코드는 복사해서 고친다.)

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 5: Commit**

```bash
git add public/js/view-detail.js tests/view-detail.test.js
git commit -m "feat: detail panel markup for skulls, items and engravings"
```

---

### Task 5: 한 화면 골격(데스크톱)

**Files:**
- Modify (전체 다시 씀): `public/index.html`
- Create: `public/css/base.css`, `public/css/app.css`, `public/js/app.js`

**Interfaces:**
- Consumes:
  - Task 2: `parseAppHash`, `toAppHash`, `search`, `tabEntries`, `tabCounts`, `lookup`, `jumpTo`, `TAB_LABELS`
  - Task 3: `renderResults`, `IMAGES`
  - Task 4: `renderDetail`
  - 기존 모듈: `NAMU`(`skills.js`), `ITEMS_META`(`items.js`)
- Produces(Task 6~7이 쓰는 `app.js` 내부 함수. 이름을 맞춘다):
  - `update(patch, { push = false } = {})`: 상태를 바꾸고 해시를 쓰고(`push`면 `pushState`, 아니면 `replaceState`) 필요한 부분을 다시 그린다.
  - `select(key)`: `state.sel`만 바꾸고 해시를 `replaceState`로 쓴다. 목록은 다시 그리지 않고 `aria-current`와 `tabindex`만 옮긴다. 상세는 다시 그리고 상세 칸 스크롤을 맨 위로 보낸다.
  - `entryEl(key)`
  - `loadFromLocation()`
  - `remembered`: 탭별 마지막 선택 `{ all, skulls, items, engravings }`.
    - 선택이 바뀔 때마다(`select`, `update`, `loadFromLocation`) `remembered[state.tab] = state.sel`로 갱신한다.
    - Task 6의 자동 선택이 쓴다.
- DOM 약속(`index.html`):
  ```html
  <header class="site-head">
    <div class="bar">
      <h1 class="title"><span class="torch" aria-hidden="true"></span>Skul 정리<span class="torch" aria-hidden="true"></span></h1>
      <label class="search frame"><span class="sr-only">검색</span>
        <input id="q" type="search" placeholder="스컬·아이템·각인 이름이나 효과 검색" autocomplete="off" spellcheck="false">
        <kbd class="key" aria-hidden="true">/</kbd></label>
    </div>
    <div class="tabbar">
      <div class="tabs" role="group" aria-label="보기"><!-- 전체·스컬·아이템·각인: button[data-tab] + span.n --></div>
      <div class="marks" role="group" aria-label="스컬 거르기" hidden>
        <button type="button" data-mark="★" aria-pressed="false">★ 신화 DLC</button>
        <button type="button" data-mark="◆" aria-pressed="false">◆ 마석 해금</button></div>
    </div>
    <p id="status" class="sr-only" aria-live="polite"></p>
  </header>
  <main class="split">
    <section id="results-pane" class="pane frame" aria-label="검색 결과"><div id="results"></div></section>
    <section id="detail-pane" class="pane frame" aria-label="상세">
      <button type="button" class="back">◀ 목록</button><div id="detail"></div><div class="detail-foot"></div></section>
  </main>
  <footer class="site">
    <span>비공식 팬 정리 · Skul: The Hero Slayer 관련 권리는 SouthPAW Games</span>
    <span>스킬 추천: <a href="https://gall.dcinside.com/mgallery/board/view/?id=skul&amp;no=57295" target="_blank" rel="noopener">디시 스컬 갤러리 「스컬별 스킬 추천」 · 정도</a></span>
    <details class="namu"><summary>스킬·아이템·각인: <span id="namu-count"></span></summary><ul id="namu-sources"></ul>
      <p>글꼴: <a href="fonts/OFL.txt">갈무리</a> (SIL Open Font License 1.1)</p></details>
    <span>나무위키 기여자 · <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/kr/" target="_blank" rel="noopener">CC BY-NC-SA 2.0 KR</a></span>
  </footer>
  ```
  - `<head>`:
    - `<title>`은 `Skul: The Hero Slayer 정리`다.
    - description은 `Skul: The Hero Slayer 비공식 팬 정리: 스컬 45종 추천 스킬, 아이템 258종과 각인 36종을 한 화면에서 검색`이다.
    - `<link rel="icon" href="data:,">`
    - `css/base.css`, `css/app.css`
    - `fonts/Galmuri14.woff2`, `fonts/Galmuri11.woff2`의 `<link rel="preload" as="font" type="font/woff2" crossorigin>`
    - `<script type="module" src="js/app.js">`
  - 예전 허브의 legacy 스크립트는 넣지 않는다. 루트 시절 해시는 `parseAppHash`가 처리한다.

**CSS(스펙을 그대로 따른다):**
- 토큰과 등급:
  - `:root`에 스펙 7.1 토큰을 같은 이름과 값으로 넣는다.
  - 등급색 `--common:#a3a3a3; --rare:#6ea6f0; --unique:#c08cf0; --legendary:#f0b552; --omen:#f08791;`을 넣고, `.grade-{id} { --g: var(--{id}); }`로 쓴다.
  - `color-scheme: dark`
- 글꼴(스펙 7.2):
  - `@font-face`는 세 개다. 셋 다 `font-display: swap`이고, Galmuri11-Bold는 `font-family: "Galmuri11"; font-weight: 700`이다. 경로는 `../fonts/…`다.
  - 크기는 스펙 7.2 표 그대로 쓴다.
  - 본문에는 `word-break: keep-all; overflow-wrap: anywhere;`를 준다.
- 픽셀 테두리(스펙 7.3): `.frame`(3px)과 2px 작은 테두리를 쓴다. `border-radius`는 없다.
- 돌벽과 횃불(스펙 7.4): `mockups/unified.html`의 `.u` 배경과 `.torch::before`를 옮긴다. 깜빡임은 `@media (prefers-reduced-motion: no-preference)` 안에만 둔다.
- 크기와 간격: 스펙 7.5 표를 따른다(여백, 검색창 42px, 목록 줄 42px 고정, 아이템 칸 `minmax(148px, 1fr)`·높이 172px·그림 자리 64px, 작은 칸 `minmax(92px, 1fr)`·40px, 누르는 영역 최소 32px).
- 데스크톱(`min-width: 761px`):
  - `body`는 `display: grid; grid-template-rows: auto minmax(0, 1fr) auto; height: 100dvh; overflow: hidden`이다.
  - `.split` 칸 비율은 기본 `minmax(0,5fr) minmax(0,6fr)`이고, `body[data-tab="items"]`이면 `6fr 5fr`이다.
  - `.pane`은 `overflow-y: auto; min-height: 0`이다. 안쪽 여백은 8px 이상 두어 포커스 고리가 잘리지 않게 한다.
  - `.back`과 `.detail-foot`은 숨긴다.
- 상태 표시(스펙 6.3, 6.5, 8):
  - 선택된 탭(`[aria-pressed="true"]`)은 `--bone` 바탕에 어두운 글자다.
  - 개수가 0인 탭은 `.zero { opacity: .55 }`다.
  - 고른 줄(`.entry.row[aria-current="true"]`)은 `--sel-bg` 바탕과 `box-shadow: inset 3px 0 0 var(--acc)`다.
  - 고른 칸은 주황 픽셀 테두리와 `--sel-bg` 바탕이다.
  - `mark { background: none; color: inherit; text-decoration: underline 2px var(--acc); text-underline-offset: 4px; }`
  - 포커스는 `:focus-visible { outline: 2px solid var(--focus); outline-offset: 5px; }`다.
  - 검색창에 포커스가 있으면 주황 테두리를 두고 `caret-color: var(--acc)`를 준다.
  - 검색창의 기본 지우기 버튼(`::-webkit-search-cancel-button`)은 숨긴다.
- 구성 요소(스펙 6.4~6.7, 7.1):
  - 등급 소제목(`.sub.grade-*::before`)과 스컬 줄의 `.sq`는 `--g` 색 10px 네모다.
  - 줄 끝 등급 글자 `.gr`은 `color: var(--g)`다.
  - 신화 DLC 표 `.cell .dlc`는 그림 자리 오른쪽 위에 둔다.
  - 그림 자리 `.slot`은 64px이고, `--g` 색 3px 픽셀 테두리와 어두운 원형 그라데이션 안쪽, 등급색 글자로 만든다. 작은 칸 `.mini .slot`은 40px다.
  - 칩:
    - `.chip.random`과 `.chip.any`는 점선 테두리에 흐린 글자다.
    - `.chip.rec`는 추천 스킬 칩 색이다(바탕 `#3b2410`, 글자 `#ffd89a`, 테두리 `#b07a2a`).
  - `.badge.grade`는 `--g` 바탕에 `#141414` 글자다.
  - `.tiers tr.mod td`는 `--mod-bg` 바탕이고, 첫 칸 글자는 `--mod-text`다.
  - 단계 탭(`.stage-tabs [role="tab"]`)은 2px 픽셀 테두리 탭이고, 선택된 탭은 상단 탭과 같은 뼈 색이다.
- 말줄임:
  - 스컬 줄은 이름을 줄이지 않고 대표 조합만 말줄임한다.
  - 아이템 칸 이름은 최대 2줄이다(`-webkit-line-clamp: 2`).
  - 표(`.tiers`, 스킬 표, `.pool`)는 칸 안에서 줄바꿈하고, 넘치면 표를 감싼 요소만 가로 스크롤한다.
- `.sr-only` 유틸리티를 둔다.
- 휴대폰 규칙은 Task 7에서 추가한다.

**`app.js` 동작(이 태스크 범위):**
- 시작할 때:
  - 탭 버튼 네 개를 만든다(`TABS`, `TAB_LABELS`).
  - `#namu-sources`를 채운다. `NAMU` 1개와 `ITEMS_META.sources` 6개를 `<li><a href target=_blank rel=noopener>나무위키 「{title}」</a> · {retrieved} 기준</li>`로 만든다.
  - `#namu-count`에 `나무위키 문서 7개`를 넣는다(개수는 계산).
  - `.detail-foot`을 `footer.site`의 복제로 채운다(Task 7에서 휴대폰만 보이게 함).
    - 바닥 띠를 다 채운 뒤에 복제한다.
    - 복제본의 `id` 속성은 모두 지운다(id 중복 방지).
  - `loadFromLocation()`을 부른다.
- `render()`:
  - `results = search(state.query)`로 결과를 구하고 `#results.innerHTML = renderResults(…)`로 그린다.
  - 탭 버튼의 `.n`, `.zero`, `aria-pressed`를 갱신한다.
  - `.marks`는 `state.tab === 'skulls'`일 때만 보이고, `aria-pressed`를 갱신한다.
  - `document.body.dataset.tab`을 갱신한다.
  - `#status`에 `` `${TAB_LABELS[tab]} ${n}개` ``를 쓴다.
  - 목록은 `tab`, `query`, `mark`가 바뀔 때만 다시 그린다.
- 이벤트:
  - `#q` input → `update({ query })`
  - 탭 → `update({ tab })`. 이때 `sel`은 `remembered[tab]`이다.
  - ★/◆ → 같은 값이면 `'all'`, 아니면 그 값
  - `.entry` 클릭 → `select(key)`
  - `.to-tab` → 그 탭으로 이동
  - `#detail`의 `.jump` → `update(jumpTo(state, key), { push: true })`. 그 뒤 대상 항목을 `scrollIntoView({ block: 'nearest' })`로 보이게 한다.
  - 단계 탭: 클릭하거나 ←→ Home End를 누르면 패널을 바꾼다. `skill-page.js`의 `selectStage`와 keydown 처리를 옮겨 온다.
  - `popstate`와 `hashchange` → `loadFromLocation()`.
    - 두 이벤트가 같이 오므로 `location.hash + '|' + JSON.stringify(history.state)`가 마지막으로 처리한 값과 같으면 건너뛴다.
    - history를 쓰는 모든 곳(`update`, `select`)에서도 이 값을 갱신한다. 그래야 자기가 쓴 history로 다시 그리지 않는다.

- [ ] **Step 1: `index.html`, `base.css`, `app.css`, `app.js` 작성**

- [ ] **Step 2: 글꼴 글자 검사**

Run: `npm test`
Expected: PASS. `fonts.test.js`가 새 글자(예: `◀`)로 실패하면 `npm run build:fonts`를 다시 실행한 뒤 PASS를 확인한다.

- [ ] **Step 3: 브라우저 동작 확인**

Run: `python -m http.server 8000 -d public`, 시안은 저장소 루트에서 `python -m http.server 8766`
Expected (1280px):
- `http://localhost:8000/`이 `mockups/unified.html`, `item-grid.html`(A), `overview.html`과 같은 분위기와 배치다.
  - 돌벽, 양쪽 위 횃불 빛, 픽셀 횃불, 보라 픽셀 테두리, 모든 글자가 갈무리다.
- 탭 개수는 `전체 339`, `스컬 45`, `아이템 258`, `각인 36`이다.
- `칼레온`을 입력하면 `전체 7`, `스컬 1`, `아이템 5`, `각인 1`이다.
- `zzz`를 입력하면 모든 탭이 흐려지고 "검색 결과가 없습니다."가 나온다.
- 스컬 탭에서만 ★/◆ 버튼이 보인다. ★를 켜면 스컬 5개, 다시 누르면 꺼진다.
- 줄이나 칸을 누르면 오른쪽 상세가 바뀌고, 고른 줄이나 칸에 주황 표시가 생긴다.
- 웨어울프 상세 아래에 스킬 정보가 이어서 나오고, 단계 탭이 동작한다.
- 칼레온 계급장 상세에서 `보물` 칩을 누르면 각인 탭의 보물 상세로 간다. 브라우저 뒤로 가기로 아이템 상세에 돌아온다.
- 보물 상세의 작은 칸 `절대반지`를 누르면 그 아이템으로 간다.
- 새로고침해도 탭, 검색어, 선택이 유지된다. 주소를 복사해 새 탭에서 열어도 같다.
- `http://localhost:8000/#grade=unique&q=%EC%A3%84%EC%88%98`는 스컬 탭에 검색어 `죄수`로 열린다.
- 바닥 띠가 항상 보이고, "나무위키 문서 7개"를 펼치면 문서 7개와 기준일, 글꼴 라이선스 링크가 보인다.
- 목록을 끝까지 내려도 머리 띠, 상세, 바닥 띠가 제자리에 있다.
- 콘솔 에러가 없다.

- [ ] **Step 4: 좁은 데스크톱과 가독성 확인** (Review Focus 1, 5)

Expected:
- 800px 폭에서 페이지 가로 스크롤이 없다. 긴 이름, 스킬 표, 단계 표가 칸 밖으로 나가지 않는다.
- 개발자도구에서 글꼴 요청이 `fonts/*.woff2` 세 개뿐이다(jsDelivr 요청 없음).
- 11px 라벨이 흐리지 않다.
- 개발자도구 Rendering에서 `prefers-reduced-motion: reduce`를 켜면 횃불이 멈춘다.

- [ ] **Step 5: Commit**

```bash
git add public/index.html public/css/base.css public/css/app.css public/js/app.js
git commit -m "feat: single-screen castle UI with search, tabs, list and detail"
```

(Step 2에서 글꼴을 다시 만들었다면 `public/fonts tools/font-chars.txt`도 함께 add한다.)

---

### Task 6: 키보드와 자동 선택

**Files:**
- Create: `public/js/keynav.js`, `tests/keynav.test.js`
- Modify: `public/js/app.js`

**Interfaces:**
- Consumes:
  - Task 2: `chooseSelection`, `tabEntries`
  - Task 5: `update`, `select`, `entryEl`, `remembered`
- Produces:
  ```js
  /** @typedef {{ left: number, top: number, bottom: number }} Box */
  /** key: 'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'. 다음 항목 index, 없으면 -1. */
  export function nextIndex(boxes, isCell, current, key): number
  ```

**`nextIndex` 규칙:**
- 같은 줄은 `top` 차이가 2px 이하인 항목이다.
- `ArrowDown`:
  - `top`이 지금 항목의 `top + 2`보다 큰 항목 중에서 가장 작은 `top`을 가진 줄로 간다.
  - 그 줄에서 `left`가 지금 항목과 가장 가까운 항목을 고른다. 같으면 앞의 것을 고른다.
- `ArrowUp`: `top`이 지금 항목의 `top - 2`보다 작은 항목 중에서 가장 큰 `top`을 가진 줄로 간다. 고르는 방식은 위와 같다.
- `ArrowLeft`, `ArrowRight`:
  - 지금 항목과 DOM 순서상 앞 또는 뒤 항목이 **둘 다** 격자 칸(`isCell`)일 때만 그 앞 또는 뒤 항목으로 간다.
  - 그 밖에는 -1이다(목록에서는 ←→를 쓰지 않는다).

**`app.js` 동작(스펙 6.3-1, 8장):**
- 데스크톱(`matchMedia('(min-width: 761px)')`)이면 시작할 때 `#q`에 포커스를 준다.
- `/` 키(document keydown):
  - 다음 경우에는 아무것도 하지 않는다: Ctrl·Alt·Meta가 눌렸거나, 대상이 `input`·`textarea`·`select`·contenteditable이다.
  - 그 밖에는 `preventDefault` 후 `#q`에 포커스를 주고 검색어 전체를 선택한다.
- `#q`에서 `ArrowDown`: 고른 항목이 목록에 있으면 그 항목에, 없으면 첫 항목을 골라 그 항목에 포커스를 준다.
- `#results`에서 방향키:
  - 모든 `.entry`의 `getBoundingClientRect()`로 `nextIndex`를 계산한다.
  - 결과가 있으면 그 항목을 `select`하고 포커스를 준다(`preventDefault`).
  - `ArrowUp`이 -1이고 지금 항목이 첫 항목이면 `#q`로 포커스를 옮긴다.
- 자동 선택:
  - 검색어가 바뀔 때(`reason: 'query'`)와 탭이나 ★/◆가 바뀔 때(`reason: 'tab'`) `chooseSelection`을 부른다.
  - 인자는 `{ entries: tabEntries(...), query, remembered: remembered[tab], reason, auto: 데스크톱 여부 }`다.
  - 결과가 바뀌면 `select`한다. 포커스는 옮기지 않는다(검색창에 남김).
  - 고른 항목은 `scrollIntoView({ block: 'nearest' })`로 보이게 한다.
- `Esc`: 검색어가 있으면 `update({ query: '' })`를 하고 포커스는 그대로 둔다. Task 7이 이 앞에 휴대폰 상세 닫기를 넣는다.
- 방향키 처리는 `#results` 안에서만 한다. 상세의 단계 탭 ←→와 겹치지 않게 한다.

- [ ] **Step 1: 실패하는 테스트 작성 (`tests/keynav.test.js`)**

```js
const row = top => ({ left: 0, top, bottom: top + 42 });
const cell = (left, top) => ({ left, top, bottom: top + 172 });
// 목록 줄 3개, 그 아래 3칸 격자(5칸)
const boxes = [row(0), row(42), row(84), cell(0, 200), cell(160, 200), cell(320, 200), cell(0, 384), cell(160, 384)];
const isCell = [false, false, false, true, true, true, true, true];
const n = (i, key) => nextIndex(boxes, isCell, i, key);
test('down/up move by visual row, keeping the column', () => {
  assert.equal(n(0, 'ArrowDown'), 1);
  assert.equal(n(2, 'ArrowDown'), 3);    // 목록 → 격자 첫 칸
  assert.equal(n(4, 'ArrowDown'), 7);    // 같은 열
  assert.equal(n(5, 'ArrowDown'), 7);    // 아래 줄에 열이 없으면 가장 가까운 칸
  assert.equal(n(7, 'ArrowDown'), -1);
  assert.equal(n(0, 'ArrowUp'), -1);
  assert.equal(n(4, 'ArrowUp'), 2);      // 격자 → 위 목록 줄
});
test('left/right only inside grids', () => {
  assert.equal(n(4, 'ArrowLeft'), 3);
  assert.equal(n(3, 'ArrowLeft'), -1);   // 앞이 목록 줄
  assert.equal(n(5, 'ArrowRight'), 6);   // 다음 줄로 이어짐
  assert.equal(n(7, 'ArrowRight'), -1);
  assert.equal(n(1, 'ArrowRight'), -1);  // 목록에서는 무시
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: `keynav.test.js` FAIL(모듈 없음)

- [ ] **Step 3: `keynav.js` 구현, `app.js`에 키보드와 자동 선택 연결**

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS

- [ ] **Step 5: 브라우저 키보드 확인** (1280px, Review Focus 3, 4)

Expected:
- 페이지를 열면 커서가 검색창에 있다.
- `칼레온 계급`까지 입력하면 방향키 없이 상세가 `칼레온 계급장`이 되고, 포커스는 검색창에 남는다.
- `보물`을 입력하면 전체 탭 상세가 각인 `보물`이다(계획에서 정한 것 4번).
- `↓`로 목록에 들어간 뒤 `↑↓`로 이동하면 상세가 바로 바뀐다.
- 전체 탭에서 스컬 마지막 줄 → 아이템 격자 첫 줄 → … → 각인 첫 줄로 이어진다.
- 아이템 탭에서 `←→↑↓`로 칸을 옮긴다. 첫 항목에서 `↑`를 누르면 검색창으로 간다.
- 목록에 포커스가 있을 때 `/`를 누르면 검색창으로 가서 검색어가 전체 선택된다. 검색창에서 `/`를 치면 `/`가 입력된다.
- 검색창에서 `Esc`를 누르면 검색어가 지워진다. 검색어가 비면 자동 선택이 일어나지 않고 상세가 그대로다.
- 아이템 탭에서 `칼레온 계급장`을 고르고 각인 탭으로 갔다가 돌아오면 `칼레온 계급장`이 그대로다.
- 웨어울프를 고른 뒤 ★ 거르기를 켜면 웨어울프는 목록에서 사라지고, 상세는 웨어울프로 남는다. 이때 `↓`를 누르면 첫 항목부터 이동한다.
- Tab 순서는 검색 → 탭 → (★/◆) → 목록(한 칸만) → 상세 링크와 단계 탭 → 바닥 띠다.
- 포커스 고리가 줄, 칸, 칩, 단계 탭, `summary`에 모두 보이고, 스크롤 칸 가장자리에서 잘리지 않는다.
- 상세의 단계 탭에서 `←→`를 누르면 단계만 바뀌고 목록 선택은 그대로다.

- [ ] **Step 6: Commit**

```bash
git add public/js/keynav.js tests/keynav.test.js public/js/app.js
git commit -m "feat: keyboard navigation, slash-to-search and auto selection"
```

---

### Task 7: 휴대폰(760px 이하)

**Files:**
- Modify: `public/css/base.css`, `public/css/app.css`, `public/js/app.js`

**Interfaces:**
- Consumes: Task 5~6의 `select`, `update`, `entryEl`, `loadFromLocation`, Esc 처리
- Produces:
  - `openDetail(key)`, `closeDetail()`, `syncOverlay()`(`app.js` 내부)
  - history 상태 `{ detail: n }`. n은 상세를 연 뒤 쌓은 칸 수다(1부터 시작).

**규칙(스펙 6.9, 8장):**
- CSS `@media (max-width: 760px)`:
  - 머리 띠는 고정하지 않는다. 제목은 16px이고, 검색창은 다음 줄에서 전체 폭을 쓴다. 탭은 줄바꿈을 허용한다.
  - 페이지 좌우 여백은 12px이다.
  - `body`는 일반 문서 스크롤이다(데스크톱 grid와 `100dvh` 해제).
  - `.split`은 한 칸이다. 아이템 격자는 `repeat(2, minmax(0, 1fr))`이다.
  - `#detail-pane`은 평소 숨긴다. `body.detail-open`이면 `position: fixed; inset: 0; overflow-y: auto; z-index: 10`으로 화면을 덮는다.
  - `.back`과 `.detail-foot`은 보이고, `footer.site`는 목록 뒤 일반 흐름에 둔다.
- 휴대폰에서 항목 고르기(클릭 또는 Enter):
  1. 지금 history 칸을 `replaceState(null, '', 그 선택을 담은 해시)`로 바꾼다. 뒤로 왔을 때 그 줄로 돌아오게 하기 위해서다.
  2. `pushState({ detail: 1 }, '', 같은 해시)`를 한다.
  3. `body.detail-open`을 켜고 `#detail-title`에 포커스를 준다.
- 상세 안의 `.jump`(휴대폰): `pushState({ detail: n + 1 }, …)`를 한다. 데스크톱은 Task 5대로 `pushState(null, …)`이다.
- "◀ 목록", Esc: `history.state?.detail`이 있으면 `history.go(-history.state.detail)`, 없으면 `closeDetail()`이다.
- `loadFromLocation`: 상세 열림은 `휴대폰 && history.state?.detail >= 1`일 때다. 닫힐 때는 고른 줄에 포커스를 주고 `scrollIntoView({ block: 'center' })`로 보이게 한다.
- `syncOverlay()`:
  - `휴대폰 && detail-open`일 때만 `.site-head`, `#results-pane`, `footer.site`에 `inert`를 켠다. 그 밖에는 끈다.
  - `matchMedia` change에서도 부른다(Review Focus 2).
- 휴대폰에서는 자동 선택을 하지 않는다(Task 6의 `auto: false`). 시작할 때 검색창에 포커스를 주지 않는다(계획에서 정한 것 10번).

- [ ] **Step 1: CSS와 `app.js` 수정**

- [ ] **Step 2: 테스트**

Run: `npm test && npm run test:tools`
Expected: 모두 PASS(글꼴 검사가 실패하면 `npm run build:fonts`)

- [ ] **Step 3: 휴대폰 화면 확인** (개발자도구 기기 모드 360×740, Review Focus 1, 2)

Expected:
- 페이지 전체 가로 스크롤이 없다. 탭이 두 줄로 내려가도 된다. 아이템 격자는 2칸이다. 긴 이름은 두 줄에서 말줄임된다.
- 열었을 때 검색창에 포커스가 없다. 검색어를 쳐도 상세가 저절로 열리지 않는다.
- 줄을 누르면 상세가 화면을 덮고, 맨 위에 "◀ 목록"이 있고, 맨 끝에 바닥 띠 복사본이 있다.
- 기기 뒤로 가기(브라우저 뒤로)를 누르면 목록이 다시 보이고, 방금 본 줄에 포커스가 가며 그 줄이 화면 안에 있다.
- 상세에서 각인 칩 → 아이템 작은 칸으로 두 번 이동한 뒤 "◀ 목록"을 누르면 한 번에 목록으로 돌아온다. `Esc`도 같다.
- 상세가 열린 채로 폭을 1280px로 넓히면 두 칸 화면이 되고, 머리 띠와 목록을 누를 수 있다(`inert` 없음).
- 다시 360px로 줄이면 상세가 다시 덮인다(history 상태가 상세인 경우).
- 바닥 띠는 목록 맨 끝에 있다(고정 아님).
- 콘솔 에러가 없다.

- [ ] **Step 4: Commit**

```bash
git add public/css/base.css public/css/app.css public/js/app.js
git commit -m "feat: mobile layout with full-screen detail and back navigation"
```

---

### Task 8: 예전 주소, 정리, 문서

**Files:**
- Modify (전체 다시 씀): `public/skills/index.html`, `public/items/index.html`
- Modify:
  - `public/js/filter.js`: `filterSkulls` 삭제. `matchesQuery`, `normalize` 재수출은 유지
  - `public/js/item-filter.js`: `filterItems`, `itemCountByEngraving` 삭제
  - `tests/filter.test.js`, `tests/item-filter.test.js`
  - `.gitignore`
  - `README.md`
- Delete:
  - `public/css/style.css`, `public/css/home.css`, `public/css/items.css`
  - `public/js/render.js`, `item-render.js`, `item-state.js`, `state.js`, `legacy-redirect.js`, `skill-page.js`, `item-page.js`
  - `tests/render.test.js`, `tests/item-render.test.js`, `tests/item-state.test.js`, `tests/state.test.js`, `tests/legacy-redirect.test.js`

**Interfaces:**
- Consumes: Task 2의 `fromSkillsPage`, `fromItemsPage`, `toAppHash`(`app-state.js`, 데이터 import 없음)

**옮기는 페이지(두 파일 같은 모양, 함수만 다름):**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Skul: The Hero Slayer 정리</title>
  <link rel="icon" href="data:,">
  <script type="module">
    import { fromSkillsPage, toAppHash } from '../js/app-state.js';
    location.replace('../' + toAppHash(fromSkillsPage(location.hash)));
  </script>
</head>
<body><p>새 주소로 옮겼습니다: <a href="../#tab=skulls">Skul 정리</a></p></body>
</html>
```

`items/index.html`은 `fromItemsPage`와 `../#tab=items`를 쓴다.

- [ ] **Step 1: 옮기는 페이지 작성**

- [ ] **Step 2: 예전 코드와 테스트 삭제, 죽은 함수 정리**
  - `filter.test.js`:
    - `filterSkulls(SKULLS, …)` 호출을 `SKULLS.filter(s => matchesQuery(s, q))`로 바꾼다.
    - `DEFAULT_STATE` import를 지운다.
    - `grade and mark filters keep original order` 테스트를 지운다(★/◆는 `search.test.js`가 다룬다).
  - `item-filter.test.js`: `grade filter`, `engraving filter …`, `grade and engraving filters combine`, `item count per engraving …` 테스트를 지운다(`itemsOfEngraving` 테스트가 대신한다).
  - 삭제 후 `grep -rn "render.js\|item-render\|item-state\|legacy-redirect\|skill-page\|item-page\|style.css\|home.css\|items.css\|filterSkulls\|filterItems\|itemCountByEngraving" public tests`의 결과가 없어야 한다.

- [ ] **Step 3: `.gitignore`와 README**
  - `.gitignore`: `public/skills/img/`를 `public/img/`로 바꾼다.
  - README:
    - 첫머리: 사이트는 `/` 한 화면이고, 탭과 검색, 키보드(`/`, `↑↓`, `Esc`)를 쓴다.
    - ★ = 신화 DLC, ◆ = 마석 해금. DLC 아이템도 신화 DLC다.
    - 주소 해시 형식 예: `/#tab=items&q=칼레온&sel=item:칼레온 계급장`
    - 예전 주소(`/skills/…`, `/items/…`, `/#grade=…`)가 옮겨지는 규칙
    - 구조 표를 새 파일로 바꾼다.
    - "이미지 넣기"를 새 규칙(`public/img/skulls/{id}.png`, `public/img/items/{itemImageFile 결과}`, `public/js/images.js`의 `IMAGES`)으로 바꾼다.
    - 배포 후 확인 목록:
      - `/`가 열린다.
      - `/skills/#q=%EC%A3%84%EC%88%98`는 스컬 탭, `/items/#eng=%EB%B3%B4%EB%AC%BC`는 각인 보물로 옮겨진다.
      - `/fonts/Galmuri14.woff2`는 200이다.
      - `/data/…xlsx`, `/tools/…`, `/package.json`, `/sources/…`는 404다.

- [ ] **Step 4: 글꼴 다시 만들기와 전체 테스트**

Run: `npm run build:fonts && npm test && npm run test:tools`
Expected: 모두 PASS. `git status`에 글꼴 변경이 있으면 함께 커밋한다.

- [ ] **Step 5: 예전 주소 확인** (`python -m http.server 8000 -d public`)

Expected:
- `/skills/` → `/#tab=skulls`
- `/skills/#grade=unique&q=%EC%A3%84%EC%88%98&skull=prisoner` → 스컬 탭, 검색어 `죄수`, 상세 죄수
- `/skills/#mark=%E2%98%85` → 스컬 탭, ★ 거르기 켜짐
- `/items/` → 아이템 탭
- `/items/#view=engravings&q=%EB%8F%85` → 각인 탭, 검색어 `독`
- `/items/#grade=legendary&eng=%EB%B3%B4%EB%AC%BC` → 각인 탭, 상세 보물(아이템 14개)
- `/#skull=prisoner` → 스컬 탭, 상세 죄수
- 각 경우 뒤로 가기를 눌러도 옮기는 페이지에 갇히지 않는다(`location.replace`).

- [ ] **Step 6: Commit**

```bash
git add -A public tests .gitignore README.md
git commit -m "feat: redirect old /skills/ and /items/ links; remove old pages"
```

(`git add -A public tests`는 삭제도 함께 담는다. `CLAUDE.md`는 add하지 않는다.)

- [ ] **Step 7: 완료 보고** (재배포는 사용자 진행)

개발플래너 세션에 다음 두 가지를 보고한다. 개발플래너가 사용자에게 전달한다.
- 확인 결과(Task 5~8의 브라우저 확인, Review Focus 1~5)
- 재배포 명령: `npx wrangler deploy --name skul-guide --assets public --compatibility-date 2026-11-04`
