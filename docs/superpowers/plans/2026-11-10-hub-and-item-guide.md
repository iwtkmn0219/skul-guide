# 메인 허브 + 아이템·각인 도감 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사이트 루트(`/`)에 새 메인 홈페이지를 두고, 여기서 기존 스킬 추천 페이지(`/skills/`로 이동)와 새 아이템·각인 도감 페이지(`/items/`)로 이동할 수 있게 한다. 도감 데이터는 사용자가 관리하는 엑셀 `Skul_아이템_각인_DB형.xlsx`에서 생성한다.

**Architecture:** 빌드 없는 정적 다중 페이지 구조다(`public/index.html`, `public/skills/index.html`, `public/items/index.html`). 도감 데이터는 나무위키 스킬 정보와 같은 방식으로 만든다. 저장소에 커밋한 엑셀을 Python 변환기(`tools/convert_items.py`, 표준 라이브러리만 사용)가 검증한 뒤 `public/js/items.js`로 생성하고, 그 결과를 커밋한다. 런타임 DB나 서버는 없다. 페이지 사이에 공유하는 코드는 `public/js/common.js`(이스케이프, 검색 정규화)와 `public/css/style.css`(디자인 토큰, 공통 컴포넌트)다.

**Tech Stack:** 기존 구성(Vanilla ES modules, `node:test`, Python 3.12 표준 라이브러리 `zipfile`·`xml.etree`·`unittest`)을 그대로 쓴다. 새 의존성은 없다.

**Spec:** 사용자 요구는 두 가지다. (1) 메인 홈페이지(new)에서 새 페이지로 연결할 수 있게 구성한다. (2) 메인 홈페이지에 기존 스킬 추천 페이지와 새 각인·아이템 정보 페이지(new)를 연결한다. 데이터 원본은 `data/Skul_아이템_각인_DB형.xlsx`(2026-11-10 사용자 수정본, Task 3에서 이 경로로 옮김)다. 기존 계획 두 개(`2026-11-08-skul-skill-guide.md`, `2026-11-08-namu-skill-info.md`)의 Global Constraints도 계속 적용된다.

## Global Constraints

- URL 구조는 다음과 같다. 모든 페이지 안의 링크와 자산 경로는 상대 경로로 쓴다(`skills/`, `../css/style.css`, `../js/item-page.js`).
  - `/`: 허브
  - `/skills/`: 기존 스킬 추천 페이지
  - `/items/`: 아이템·각인 도감
- 모든 페이지 상단에 같은 사이트 내비게이션(`<nav class="site-nav">`)을 둔다. 링크는 `홈`, `스킬 추천`, `아이템·각인` 세 개이고, 현재 페이지 링크에 `aria-current="page"`를 붙인다.
- 엑셀이 유일한 원본이다. `public/js/items.js`는 생성물이므로 손으로 고치지 않는다. 엑셀을 고친 뒤 변환기를 다시 실행한다.
- 시트와 열은 위치가 아니라 이름으로 찾는다.
  - 시트 `아이템 목록`의 열: `아이템 이름`, `등급`, `각인 1`, `각인 2`, `설명`, `DLC`
  - 시트 `각인 정보`의 열: `각인명`, `분류`, `효과유형`, `필요개수`, `개조가능`, `효과`, `비고`
  - 헤더 행은 그 시트에서 `아이템 이름`(또는 `각인명`)이 처음 나오는 행이다. 그 밖의 열(예: 다시 추가된 `이미지`)은 무시한다.
- 등급 표기와 id는 다음 순서로 고정한다: `일반`=`common`, `레어`=`rare`, `유니크`=`unique`, `레전더리`=`legendary`, `흉조`=`omen`.
- 각인 분류 순서는 `능력치 각인`, `상태이상 각인`, `특수능력 각인(공격)`, `특수능력 각인(방어)`로 고정한다.
- 랜덤 각인은 `^랜덤[A-Z]?$`에 맞는 값이다(`랜덤`, `랜덤A`, `랜덤B`). 표시는 하되 각인 필터나 링크로 쓰지 않는다.
- 강화·변환형 표기: 설명 첫 줄이 `^\[(.+)의 강화·변환형 / 등급은 원본 문서 분류 기준\]$`이면 그 줄을 설명에서 빼고, 그룹 1을 `variantOf`에 넣는다.
- 출처와 라이선스: 엑셀 초기본 3행에 "출처: 사용자 제공 나무위키 본문 6건"이라고 적혀 있었다. 이 6건은 나무위키 다음 문서들이다.
  - `Skul: The Hero Slayer/아이템과 각인`
  - 그 하위 문서 `레어 아이템`, `유니크 아이템`, `레전더리 아이템`, `흉조 아이템`, `DLC 아이템`
  
  따라서 `items.js`도 CC BY-NC-SA 2.0 KR을 따른다. 도감 페이지 푸터, 허브 푸터, README, `items.js` 머리 주석에 다음을 적는다.
  - 문서 6개 링크(`https://namu.wiki/w/` + `urllib.parse.quote(제목, safe=':/')`)
  - "나무위키 기여자"
  - 라이선스 이름과 링크
  - 정리 기준일 `2026-11-10`
- 기존 스킬 페이지 테스트 30여 개는 수정 없이 계속 통과해야 한다.

## Review Focus

1. 이미 공유된 옛 링크: `/#grade=unique&q=죄수`나 `/#skull=prisoner`처럼 예전 루트 주소로 들어오면 `/skills/#…`로 옮겨 가야 한다. 해시가 없거나 관계없는 해시면 허브에 머문다. 테스트는 Task 1에 있다.
2. 변환 실패 시 기존 데이터 보존: 엑셀에 오타가 있어 변환이 실패해도 `public/js/items.js`가 비거나 덮어써지면 안 된다(셸 `>` 리다이렉트 대신 `--out`을 쓰고, 성공했을 때만 쓴다). 오류 메시지에는 시트 이름과 행 번호가 있어야 한다. 테스트는 Task 2에 있다.
3. 엑셀 저장 방식 차이: Excel로 다시 저장하면 셀 형식이 공유 문자열, 리치 텍스트 조각, `t="str"`, `inlineStr`, 불리언, `2`와 `2.0` 같은 숫자, `\r\n` 줄바꿈 등으로 달라질 수 있다. 어느 형식이든 같은 결과가 나와야 하고, 열 순서가 바뀌거나 열이 추가되어도 같아야 한다. 테스트는 Task 2에 있다.
4. 특이한 각인 값:
   - 랜덤 각인(`랜덤A`)은 버튼이 아닌 표시로만 나오고, `#eng=랜덤A`는 무시된다.
   - 같은 각인이 두 번 붙은 아이템(`진홍빛 태양의 여명`: 무구+무구)은 각인별 아이템 수에서 한 번만 센다.
   - 아이템이 없는 각인(`죄`)은 "아이템 보기" 버튼 대신 안내 문구를 보여 준다.
   
   테스트는 Task 4와 Task 5에 있다.
5. 하위 폴더 페이지의 상대 경로: `/skills/`와 `/items/`에서 CSS와 JS가 로드되어야 한다. 스킬 초상화 이미지 경로(`img/{id}.png`)는 페이지 기준이므로 이미지 폴더를 `public/skills/img/`로 옮긴다. 확인은 Task 1과 Task 6의 수동 검증에서 한다.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `public/index.html` (새로 작성) | 허브: 두 페이지로 가는 카드, 출처 요약, 옛 링크 리다이렉트 |
| `public/skills/index.html` (`public/index.html`에서 이동) | 기존 스킬 추천 페이지 |
| `public/items/index.html` | 아이템·각인 도감 페이지 |
| `public/js/common.js` | `escapeHtml`, `normalize` (페이지 공용) |
| `public/js/legacy-redirect.js` | 옛 루트 해시 → `/skills/` 주소 계산(순수 함수) |
| `public/js/skill-page.js` (`main.js`에서 이름 변경) | 스킬 페이지 DOM 연결 |
| `public/js/items.js` | 생성물: `ITEMS_META`, `ITEM_GRADES`, `ENGRAVING_CATEGORIES`, `ITEMS`, `ENGRAVINGS` |
| `public/js/item-filter.js` | 아이템·각인 검색과 필터(순수 함수) |
| `public/js/item-state.js` | 도감 URL 해시와 상태 간 변환(순수 함수) |
| `public/js/item-render.js` | 아이템·각인 카드 HTML(순수 함수) |
| `public/js/item-page.js` | 도감 페이지 DOM 연결 |
| `public/css/home.css`, `public/css/items.css` | 페이지별 스타일(공통은 `style.css`) |
| `data/Skul_아이템_각인_DB형.xlsx` | 도감 원본(커밋함, 배포 안 됨) |
| `tools/convert_items.py`, `tools/test_convert_items.py` | 엑셀 → `items.js` 변환기와 단위 테스트 |
| `tests/legacy-redirect.test.js`, `tests/items.test.js`, `tests/item-filter.test.js`, `tests/item-state.test.js`, `tests/item-render.test.js` | 각 모듈 테스트 |

---

### Task 1: 허브 도입과 스킬 페이지 이동

**Files:**
- Move: `public/index.html` → `public/skills/index.html`, `public/js/main.js` → `public/js/skill-page.js` (`git mv`)
- Create: `public/index.html`(허브), `public/css/home.css`, `public/js/common.js`, `public/js/legacy-redirect.js`, `tests/legacy-redirect.test.js`
- Modify: `public/js/render.js`, `public/js/filter.js`(공용 함수 이동), `public/css/style.css`(`.site-nav` 추가), `.gitignore`(`public/img/`를 `public/skills/img/`로), `README.md`

**Interfaces:**
- Produces:
  - `public/js/common.js`: `escapeHtml(s: string): string`, `normalize(text: string): string`. 지금 `render.js`와 `filter.js`에 있는 정의를 그대로 옮긴다. 두 파일은 `export { escapeHtml } from './common.js'`와 `export { normalize } from './common.js'`로 다시 내보내서 기존 import와 테스트가 그대로 동작하게 한다.
  - `public/js/legacy-redirect.js`: `LEGACY_KEYS = ['grade', 'mark', 'q', 'skull']`, `legacySkillRedirect(hash: string): string | null`. 해시 파라미터에 `LEGACY_KEYS` 중 하나라도 있으면 `'skills/' + hash`(원래 해시 문자열 그대로)를 반환하고, 없으면 `null`을 반환한다.

**페이지 구성:**
- `public/skills/index.html`: 내용은 그대로 둔다. 바꾸는 것은 세 가지다.
  - 경로: `../css/style.css`, `../js/skill-page.js`
  - `<header class="site">` 위에 site-nav를 둔다. 이 Task에서는 `홈`(`../`)과 `스킬 추천`(`./`, `aria-current="page"`)만 넣는다.
  - `<title>`은 `스컬별 스킬 추천`으로 유지한다.
- `public/index.html`(허브):
  - `<title>Skul: The Hero Slayer 정리</title>`, `lang="ko"`, viewport 메타, `<meta name="description" content="Skul: The Hero Slayer 비공식 팬 정리: 스컬별 추천 스킬과 아이템·각인 도감">`
  - `<link rel="stylesheet" href="css/style.css">`, `css/home.css`
  - site-nav(`홈`에 `aria-current`)
  - `<h1>Skul: The Hero Slayer 정리</h1>`, 그 아래 `<p class="headline">비공식 팬 정리 페이지</p>`
  - `<main><ul class="hub">`. 이 Task에서는 카드 1개만 둔다: `<li><a class="hub-card" href="skills/"><h2>스컬별 스킬 추천</h2><p>스컬별 추천 스킬 조합과 각성 단계별 스킬 정보</p></a></li>`
  - 푸터: 기존 비공식 고지 문장과 디시 원문 링크, 나무위키 스컬 문서 링크와 라이선스. 값은 정적 HTML로 적는다.
  - `</body>` 앞에 `<script type="module">import { legacySkillRedirect } from './js/legacy-redirect.js'; const to = legacySkillRedirect(location.hash); if (to) location.replace(to);</script>`
- CSS:
  - `style.css` 끝에 `.site-nav`를 추가한다(가로 링크 줄, `[aria-current="page"]`는 굵게·강조색, 기존 컨테이너 폭과 패딩을 공유).
  - `home.css`: `.hub`는 `.grid`와 같은 그리드 규칙이고 `list-style:none`이다. `.hub-card`는 `.card`와 같은 테두리·배경이고, hover 시 `border-color: var(--accent)`다.
- 이미지 경로: 렌더 코드의 `img/{id}.png`는 그대로 둔다. README와 `.gitignore`의 이미지 위치를 `public/skills/img/`로 바꾸고, `skill-page.js` 상단 주석의 경로도 같이 고친다.
- README: 구조 표에 허브, `skills/`, `skill-page.js`, `common.js`를 반영한다. 해시 예시는 `/skills/#grade=unique&q=죄수`로 바꾼다.

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/legacy-redirect.test.js`)
  - `legacySkillRedirect('#grade=unique&q=%EC%A3%84%EC%88%98')`의 결과는 `'skills/#grade=unique&q=%EC%A3%84%EC%88%98'`다.
  - `legacySkillRedirect('#skull=prisoner')`의 결과는 `'skills/#skull=prisoner'`다.
  - `legacySkillRedirect('#mark=%E2%98%85')`의 결과는 `'skills/#mark=%E2%98%85'`다.
  - `''`, `'#'`, `'#foo=1'`은 `null`을 반환한다.
  - `'#q=%E0%A4%A'`는 예외 없이 `'skills/#q=%E0%A4%A'`를 반환한다.
  - `common.js`의 `escapeHtml`, `normalize`가 `render.js`, `filter.js`에서 내보내는 것과 같은 함수다(`assert.equal(render.escapeHtml, common.escapeHtml)`).

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/legacy-redirect.js'`

- [ ] **Step 3: 파일 이동, 새 파일 작성, 수정**

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: all pass (기존 테스트 포함)

- [ ] **Step 5: 브라우저 수동 검증**

Run: `python -m http.server 8000 -d public`
Expected:
- `http://localhost:8000/`에 허브 카드 1개가 보이고, 누르면 `/skills/`로 간다.
- `/skills/`는 예전 화면과 같고 스타일이 적용되어 있으며 콘솔 에러가 없다.
- `/skills`(슬래시 없음)는 `/skills/`로 리다이렉트된다.
- `http://localhost:8000/#grade=unique&q=%EC%A3%84%EC%88%98`로 접속하면 `/skills/#grade=unique&q=…`로 바뀌고 죄수 카드가 보인다.
- 두 페이지의 site-nav가 서로 연결된다.

- [ ] **Step 6: Commit**

```bash
git add -A public tests/legacy-redirect.test.js .gitignore README.md
git commit -m "feat: add hub page and move skill guide to /skills/"
```

---

### Task 2: 엑셀 → items.js 변환기

**Files:**
- Create: `tools/convert_items.py`, `tools/test_convert_items.py`
- Modify: `.gitignore`(`~$*.xlsx` 추가)

**Interfaces:**
- Produces (`tools/convert_items.py`):
  - `read_xlsx(source: str | bytes) -> dict[str, list[list[str]]]`: 시트 이름을 키로, 행 목록을 값으로 돌려준다. 행 안의 셀은 열 문자(`r` 속성)의 위치에 놓고 빈 칸은 `''`로 채운다.
    - 문자열: 공유 문자열(리치 텍스트 `<r><t>`는 이어 붙임), `t="str"`, `inlineStr`
    - 불리언: `'TRUE'`/`'FALSE'`
    - 숫자: `<v>` 텍스트 그대로
    - 줄바꿈은 `\r\n`을 `\n`으로 바꾼다.
    - `workbook.xml.rels`로 시트 파일을 찾는다. 네임스페이스 접두사(`x:` 유무)와 관계없이 동작해야 한다.
  - `class ConvertError(Exception)`: `.messages: list[str]`. 메시지 형식은 `"{시트} {행번호}행: {내용}"`이다.
  - `build(sheets: dict[str, list[list[str]]]) -> dict`: 결과는 `{"items": [Item], "engravings": [Engraving]}`이다. 오류는 모두 모아서 한 번에 `ConvertError`로 던진다.
    - `Item = {"name": str, "grade": GradeId, "engravings": list[str], "description": list[str], "variantOf": str|None, "dlc": bool}`
    - `Engraving = {"name": str, "category": str, "moddable": bool, "tiers": [{"kind": "기본"|"개조", "count": int, "effect": list[str], "note": str|None}]}`
  - `to_module(data: dict, retrieved: str) -> str`: 머리 주석(생성 명령, 원본 파일, 출처 6개, 라이선스, "손으로 고치지 말 것")에 이어 다음을 출력한다.
    - `export const ITEMS_META = { sources: [{title, url}], license: 'CC BY-NC-SA 2.0 KR', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/2.0/kr/', retrieved }`
    - `export const ITEM_GRADES = [{id, label}]`(Global Constraints 순서)
    - `export const ENGRAVING_CATEGORIES = [...]`
    - `export const ITEMS = [...]`
    - `export const ENGRAVINGS = [...]`
  - CLI: `python -X utf8 tools/convert_items.py <xlsx> --retrieved YYYY-MM-DD --out public/js/items.js`. 성공하면 `--out`에 쓰고 `items N, engravings M`을 출력한다. `ConvertError`가 나면 메시지를 stderr에 한 줄씩 출력하고 exit 1로 끝나며, `--out` 파일은 건드리지 않는다.

**변환 규칙:**
- 데이터 행: 헤더 다음 행부터 읽는다. 필수 열이 모두 빈 행은 건너뛴다. 셀 값은 줄마다 trim하고 빈 줄은 버린다(설명과 효과). 그 밖의 칸은 앞뒤 공백을 지운다.
- 아이템:
  - 이름, 등급, 설명이 비어 있으면 오류다. 이름이 중복되면 오류다. 등급이 다섯 표기 밖이면 오류다.
  - `각인 1`, `각인 2` 중 빈 칸은 뺀다. 남은 값은 각인 시트의 이름이거나 랜덤 각인이어야 하고, 아니면 오류다(값과 행을 메시지에 담는다).
  - `DLC` 칸은 `'DLC'`면 true, `''`면 false다. 다른 값은 오류다.
  - 강화·변환형 첫 줄은 Global Constraints 규칙대로 처리한다. `variantOf` 대상 이름이 아이템 목록에 없으면 오류다.
- 각인:
  - 같은 `각인명`의 행을 시트 순서대로 묶어 tiers로 만든다.
  - `분류`는 네 분류 중 하나여야 하고 같은 각인 안에서 같아야 한다.
  - `효과유형`은 `기본` 또는 `개조`다.
  - `필요개수`는 양의 정수다(`'2'`, `'2.0'` 허용).
  - `개조가능`은 `TRUE`/`FALSE`(`1`/`0`도 허용)이고 같은 각인 안에서 같아야 한다. false인데 `개조` tier가 있으면 오류다.
  - `비고`는 그 행 tier의 `note`가 된다(빈 칸이면 None).

- [ ] **Step 1: 실패하는 단위 테스트 작성** (`tools/test_convert_items.py`)

테스트 파일 안에 도우미 `make_xlsx(sheets: dict[str, list[list[str|bool|int]]], style: 'shared'|'inline') -> bytes`를 둔다. `zipfile`로 최소 구성(`[Content_Types].xml`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels`, 시트 XML, shared 방식이면 `xl/sharedStrings.xml`)을 만든다. 시트 XML은 `x:` 접두사 네임스페이스를 쓴다.
- `test_shared_and_inline_same_result`: 같은 내용을 두 방식으로 만들었을 때 `build(read_xlsx(...))` 결과가 같다.
- `test_rich_text_and_crlf`: 리치 텍스트 조각 `["물리공격력이 ", "20%"]`와 `"A\r\nB"`가 각각 `"물리공격력이 20%"`와 `["A","B"]`가 된다.
- `test_header_found_by_name_with_extra_and_reordered_columns`: 제목 행 뒤에 헤더가 있고, `이미지` 열이 추가되고, `DLC`가 맨 앞으로 옮겨진 경우에도 결과가 같다.
- `test_variant_prefix`: 설명이 `"[광란의 뼈의 강화·변환형 / 등급은 원본 문서 분류 기준]\n효과"`이면 `variantOf == "광란의 뼈"`, `description == ["효과"]`다.
- `test_random_engravings_allowed`: `랜덤A`/`랜덤B`/`랜덤`은 오류가 아니고 값 그대로 남는다.
- `test_errors_collected_with_row_numbers`: 알 수 없는 각인 `"무구ㄱ"`(5행), 중복 이름(6행), 등급 `"에픽"`(7행)이 한 번의 `ConvertError`로 나오고, messages에 `"아이템 목록 5행"`, `"아이템 목록 6행"`, `"아이템 목록 7행"`이 들어 있다.
- `test_engraving_tiers`: `개조가능` `'TRUE'`/`'1'` 섞임 허용, `필요개수 '2.0'`은 `2`, `비고`는 note가 된다. `개조가능 FALSE`인데 `개조` 행이 있으면 오류다. 각인 시트에 같은 각인의 `분류`가 다르게 적혀 있으면 오류다.
- `test_missing_sheet_or_column`: `각인 정보` 시트가 없거나 `설명` 열이 없으면 이름이 담긴 오류가 난다.
- `test_cli_keeps_output_on_error`: 임시 폴더의 `--out` 파일에 `"OLD"`를 써 두고 잘못된 xlsx로 `main([...])`을 호출하면 반환값이 1이고 파일 내용은 `"OLD"` 그대로다. 정상 xlsx면 반환값이 0이고 내용이 `export const ITEMS`를 포함한다. (Review Focus 2)
- `test_to_module_header`: 결과는 `"CC BY-NC-SA 2.0 KR"`, `"retrieved: '2026-11-10'"`, `"아이템과 각인/흉조 아이템"`, `"export const ENGRAVINGS = "`를 포함한다.

`main(argv: list[str]) -> int`는 CLI 진입점이다(`if __name__ == '__main__': sys.exit(main(sys.argv[1:]))`).

- [ ] **Step 2: 실패 확인**

Run: `npm run test:tools`
Expected: FAIL, `ModuleNotFoundError: No module named 'convert_items'`

- [ ] **Step 3: `tools/convert_items.py` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm run test:tools`
Expected: `OK` (기존 추출기 테스트 포함)

- [ ] **Step 5: Commit**

```bash
git add tools/convert_items.py tools/test_convert_items.py .gitignore
git commit -m "feat: add xlsx item/engraving converter with validation"
```

---

### Task 3: 엑셀 이동 + items.js 생성 + 골든 테스트

**Files:**
- Move: 저장소 루트의 `Skul_아이템_각인_DB형.xlsx` → `data/Skul_아이템_각인_DB형.xlsx` (아직 추적되지 않은 파일이므로 `mv` 후 `git add`)
- Create: `public/js/items.js`(생성물), `tests/items.test.js`
- Modify: `tools/convert_items.py`(골든 테스트가 드러낸 규칙 누락이 있을 때만), `package.json`(`"build:items": "python -X utf8 tools/convert_items.py data/Skul_아이템_각인_DB형.xlsx --retrieved 2026-11-10 --out public/js/items.js"`)

**Interfaces:**
- Consumes: Task 2 CLI
- Produces: `public/js/items.js`. export 이름과 필드는 Task 2의 `to_module`과 같다.

- [ ] **Step 1: 실패하는 골든 테스트 작성** (`tests/items.test.js`)

불변 조건 테스트(엑셀을 고쳐도 항상 참이어야 한다):
- 아이템 이름에 중복이 없다.
- 모든 `grade`가 `ITEM_GRADES`의 id 중 하나다.
- 모든 각인 값은 `ENGRAVINGS`의 이름이거나 `/^랜덤[A-Z]?$/`에 맞는다.
- 모든 `variantOf`는 실제 아이템 이름이다.
- 어떤 설명 줄도 `[`로 시작하지 않고, 빈 줄이 없다.
- 모든 각인의 `category`가 `ENGRAVING_CATEGORIES` 안에 있다. tiers가 1개 이상이고 `count`는 양의 정수다. `moddable === false`이면 `개조` tier가 없다.
- `ITEMS_META.license === 'CC BY-NC-SA 2.0 KR'`이고 `sources.length === 6`이다.

스냅샷 테스트 `snapshot of 2026-11-10 xlsx`: 이 테스트에는 "엑셀을 의도적으로 고쳤다면 같은 커밋에서 값을 갱신한다"는 주석을 단다.
- `ITEMS.length === 258`
- 등급별 수는 `{common:18, rare:96, unique:73, legendary:49, omen:22}`
- DLC 23개
- `ENGRAVINGS.length === 36`, tiers 합계 108
- `variantOf`가 있는 아이템 25개
- 랜덤 각인을 가진 아이템 이름은 `['왕자의 상자','왕자의 상자 두 개','뼈 상자','복제 도장']`
- `복제 도장.engravings`는 `['랜덤A','랜덤A']`
- `영원의 뼈: 광란.variantOf`는 `'광란의 뼈'`
- `가시견갑.description.length === 2`
- `마도구` tiers의 `[kind,count]`는 `[['기본',2],['기본',4],['기본',6],['개조',6]]`
- `걸작.moddable === false`
- `요새`의 `개조` tier note는 `'방어막 5당 증가량은 원문 표기 오류로 확인 필요.'`
- `죄`를 각인으로 가진 아이템은 0개

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/items.js'`

- [ ] **Step 3: 엑셀 이동 후 생성**

Run: `mv "Skul_아이템_각인_DB형.xlsx" data/ && npm run build:items`
Expected: `items 258, engravings 36`. 오류가 나면 메시지의 시트와 행을 확인한다. 엑셀 내용 문제라면 사용자에게 보고하고 멈춘다(엑셀을 임의로 고치지 않는다). 변환 규칙 문제라면 Task 2 테스트에 그 경우를 추가하고 규칙을 고친다.

- [ ] **Step 4: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add data/ public/js/items.js tests/items.test.js package.json tools/
git commit -m "feat: generate item/engraving data from xlsx (CC BY-NC-SA 2.0 KR)"
```

---

### Task 4: 도감 검색·필터·해시 상태

**Files:**
- Create: `public/js/item-filter.js`, `public/js/item-state.js`, `tests/item-filter.test.js`, `tests/item-state.test.js`

**Interfaces:**
- Consumes: `ITEMS`, `ENGRAVINGS` 형식(Task 2), `normalize` from `common.js`
- Produces:
  - `item-filter.js`
    - `isRandomEngraving(name: string): boolean`: `/^랜덤[A-Z]?$/`로 판정한다.
    - `matchesItemQuery(item, query: string): boolean`: 정규화한 query가 비면 true다. 대상은 name, engravings, description 각 줄이고, `includes`로 매칭한다.
    - `filterItems(items, { grade, eng, query }): Item[]`: `grade` `'all'`은 전체, `eng` `''`은 전체다. 원래 순서를 유지한다.
    - `itemCountByEngraving(items): Map<string, number>`: 아이템 하나가 같은 각인을 두 번 가져도 1로 센다. 랜덤 각인은 세지 않는다.
    - `variantsOf(items, baseName: string): string[]`: `variantOf === baseName`인 아이템 이름 목록이다.
    - `matchesEngravingQuery(eng, query): boolean`: 대상은 name과 모든 tier의 effect 줄, note다.
    - `filterEngravings(engravings, query): Engraving[]`
  - `item-state.js`
    - `/** @typedef {{ view: 'items'|'engravings', grade: 'all'|GradeId, eng: string, query: string }} ItemState */`
    - `DEFAULT_ITEM_STATE = Object.freeze({ view:'items', grade:'all', eng:'', query:'' })`
    - `parseItemHash(hash: string, engravingNames: string[]): ItemState`: 키는 `view`, `grade`, `eng`, `q`다. `eng`는 `engravingNames`에 있을 때만 받는다. 허용되지 않은 값은 기본값이 된다.
    - `toItemHash(state: ItemState): string`: 기본값과 같은 키는 생략한다. 모두 기본값이면 `''`이다.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/item-filter.test.js` (실제 `ITEMS`/`ENGRAVINGS` 사용):
- query `'가시 견갑'`은 `가시견갑`을 포함한다(정규화). `'.*'`는 0개다. `'('`는 예외 없이 배열을 반환한다(설명에 `(쿨타임: …)`이 많으므로 0개가 아니다).
- query `'빙결'`은 설명에 빙결이 있는 `버려진 결혼반지`를 포함한다.
- `{grade:'omen'}`은 22개이고 모두 `grade==='omen'`이다.
- `{eng:'무구'}`는 `진홍빛 태양의 여명`을 한 번만 포함한다.
- `{grade:'legendary', eng:'보물'}`은 `['황금왕의 가호','황금왕의 심판','황금왕의 은총']`을 포함한다.
- `itemCountByEngraving(ITEMS)`에서 `'죄'`는 0(또는 없음)이다. `'랜덤A'` 키는 없다. `'무구'`는 무구 각인 아이템 수와 같다(중복 미포함).
- `isRandomEngraving('랜덤B')`는 true이고 `isRandomEngraving('랜덤각인')`은 false다.
- `variantsOf(ITEMS, '복제 도장')`의 결과는 `['복제 뼈','복제 복제']`다.
- `filterEngravings(ENGRAVINGS, '운석')`의 결과 이름은 `['마도구']`다. `'확인 필요'`는 note 검색으로 `요새`를 찾는다.

`tests/item-state.test.js` (`names = ['무구','마도구','죄']`):
- `parseItemHash('', names)`는 `DEFAULT_ITEM_STATE`와 같다.
- `parseItemHash('#view=engravings&grade=omen&eng=%EB%AC%B4%EA%B5%AC&q=a', names)`의 결과는 `{view:'engravings',grade:'omen',eng:'무구',query:'a'}`다.
- `#view=x&grade=epic&eng=%EB%9E%9C%EB%8D%A4A`(랜덤A)는 `DEFAULT_ITEM_STATE`와 같다. (Review Focus 4)
- `#q=%E0%A4%A`는 예외를 던지지 않는다.
- `toItemHash(DEFAULT_ITEM_STATE)`는 `''`이다.
- 상태 `{view:'items',grade:'rare',eng:'마도구',query:'돌격! &'}`는 `parseItemHash(toItemHash(s), names)`로 원래대로 돌아온다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/item-filter.js'` / `'../public/js/item-state.js'`

- [ ] **Step 3: 두 모듈 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add public/js/item-filter.js public/js/item-state.js tests/item-filter.test.js tests/item-state.test.js
git commit -m "feat: item/engraving search, filters and hash state"
```

---

### Task 5: 도감 렌더링

**Files:**
- Create: `public/js/item-render.js`, `tests/item-render.test.js`

**Interfaces:**
- Consumes: `ITEM_GRADES`, `ENGRAVING_CATEGORIES`, `escapeHtml`/`normalize`(common.js), `isRandomEngraving`, `variantsOf`
- Produces:
  - `renderItemCard(item, { query = '', variants = [] } = {}): string`
    - `<article class="card item grade-{grade}">`
    - 헤더 안에 `<h3>{name}</h3>`, `<span class="grade">{등급 라벨}</span>`, dlc면 `<span class="badge dlc">DLC</span>`가 들어간다. 이름이 검색어와 맞으면 `<h3 class="hit">`다.
    - `<p class="engravings">`: 각인마다 하나씩 만든다. 일반 각인은 `<button type="button" class="chip eng" data-eng="{name}">{name}</button>`, 랜덤 각인은 `<span class="chip random" title="무작위 각인">{name}</span>`이다. 중복도 그대로 2개 표시한다.
    - 설명: `<p class="desc">`에 줄마다 `<br>`로 잇는다.
    - variantOf가 있으면 `<p class="variant-of"><button type="button" class="link" data-query="{base}">「{base}」</button>의 강화·변환형</p>`를 넣는다.
    - variants가 있으면 `<p class="variants">강화·변환형: </p>` 안에 이름마다 같은 `button.link[data-query]`를 쉼표로 이어 넣는다.
  - `renderItemList(items, { query = '', allItems = items } = {}): string`: `ITEM_GRADES` 순서로 묶는다.
    - 등급마다 기존 스킬 페이지와 같은 마크업을 쓴다: `<section class="grade-section grade-{id}"><h2 class="grade-heading">{label} <span class="n">{count}</span></h2><div class="grid">…</div></section>`
    - 카드의 variants는 `variantsOf(allItems, item.name)`로 구한다.
    - 빈 배열이면 `<p class="empty">검색 결과가 없습니다.</p>`를 반환한다.
  - `renderEngravingCard(eng, itemCount: number, { query = '', itemsButton = true } = {}): string`
    - `<article class="card engraving" data-eng="{name}">`. 각인 이름은 id로 쓰지 않는다(한글·공백·괄호).
    - 헤더 안에 `<h3>{name}</h3>`, `<span class="badge">{category}</span>`, 그리고 moddable이면 `<span class="badge mod">개조 가능</span>`, 아니면 `<span class="badge nomod">개조 불가</span>`가 들어간다.
    - `<table class="tiers"><thead><tr><th>개수</th><th>구분</th><th>효과</th></tr></thead>`: 행마다 `{count}개 | {kind} | 효과 줄 <br>`이다. note가 있으면 효과 칸 끝에 `<span class="note">※ {note}</span>`를 붙인다. `개조` 행에는 `class="mod"`를 단다.
    - itemsButton이 true이고 itemCount가 1 이상이면 `<button type="button" class="show-items" data-eng="{name}">아이템 {itemCount}개 보기</button>`를 넣는다. itemCount가 0이면 `<p class="no-items">이 각인을 가진 아이템이 없습니다.</p>`를 넣는다.
  - `renderEngravingList(engravings, counts: Map<string, number>, { query = '' } = {}): string`: `ENGRAVING_CATEGORIES` 순서로 묶는다. 분류마다 `<section class="eng-section"><h2 class="grade-heading">{category} <span class="n">{count}</span></h2><div class="grid">…</div></section>`이다. 빈 배열이면 empty 문구를 반환한다.

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/item-render.test.js`, 실제 데이터 사용)
  - `복제 도장` 카드는 `<span class="chip random" title="무작위 각인">랜덤A</span>`를 두 번 포함하고 `data-eng="랜덤A"`는 포함하지 않는다. (Review Focus 4)
  - `진홍빛 태양의 여명` 카드에 `data-eng="무구"`가 정확히 2번 나온다.
  - `영원의 뼈: 광란` 카드는 `data-query="광란의 뼈"`를 포함하고 설명에 `[광란의 뼈`를 포함하지 않는다.
  - `renderItemCard(광란의 뼈, { variants: ['영원의 뼈: 광란'] })`는 `강화·변환형: `와 `data-query="영원의 뼈: 광란"`을 포함한다.
  - DLC 아이템 하나(`ITEMS.find(i => i.dlc)`)의 카드는 `class="badge dlc"`를 포함하고, DLC가 아닌 카드는 포함하지 않는다.
  - 가짜 아이템 `{name:'<b>x</b>', grade:'rare', engravings:['a&b'], description:['"q"'], variantOf:null, dlc:false}`의 카드는 `&lt;b&gt;x&lt;/b&gt;`, `a&amp;b`, `&quot;q&quot;`를 포함하고 `<b>x</b>`는 포함하지 않는다.
  - `renderItemList(filterItems(ITEMS,{grade:'all',eng:'',query:''}))`의 `grade-heading` 순서는 일반, 레어, 유니크, 레전더리, 흉조이고, 흉조 헤딩은 `<span class="n">22</span>`를 포함한다. `renderItemList([])`는 `검색 결과가 없습니다.`를 포함한다.
  - `renderEngravingCard(마도구, 5)`는 행 4개를 그리고, 마지막 행은 `class="mod"`이며 `6개`를 포함한다. 결과에 `아이템 5개 보기`가 들어 있다.
  - `renderEngravingCard(요새, 3)`은 `※ 방어막 5당 증가량은 원문 표기 오류로 확인 필요.`를 포함한다.
  - `renderEngravingCard(죄, 0)`은 `이 각인을 가진 아이템이 없습니다.`와 `개조 불가`를 포함하고 `show-items`는 포함하지 않는다. (Review Focus 4)
  - `renderEngravingCard(마도구, 5, { itemsButton: false })`는 `show-items`를 포함하지 않는다.
  - `renderEngravingList(ENGRAVINGS, itemCountByEngraving(ITEMS))`의 분류 헤딩 순서는 `ENGRAVING_CATEGORIES`와 같다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/item-render.js'`

- [ ] **Step 3: `public/js/item-render.js` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add public/js/item-render.js tests/item-render.test.js
git commit -m "feat: render item and engraving cards"
```

---

### Task 6: 도감 페이지 조립, 허브 연결, 배포

**Files:**
- Create: `public/items/index.html`, `public/js/item-page.js`, `public/css/items.css`
- Modify: `public/index.html`(허브 카드와 nav 추가), `public/skills/index.html`(nav 추가), `README.md`

**Interfaces:**
- Consumes: Task 3~5의 모든 export, `DEFAULT_ITEM_STATE`/`parseItemHash`/`toItemHash`
- Produces: 없음(최종 산출물)

**페이지 구성 (`public/items/index.html`):**
- `<title>아이템 · 각인 도감</title>`, description 메타, `../css/style.css`, `../css/items.css`, `../js/item-page.js`
- site-nav(`아이템·각인`에 `aria-current`)
- `<header class="site"><h1>아이템 · 각인 도감</h1><p class="source" id="items-source"></p></header>`. 출처 줄은 `ITEMS_META`로 채운다: `정리: 나무위키 「아이템과 각인」 외 5개 문서 · 2026-11-10 기준`.
- `<nav class="controls">`: 기존 스킬 페이지의 클래스를 재사용한다.
  - `.row.search`: `<input id="q" type="search" placeholder="아이템·각인 이름 또는 효과 검색">`, `#count`
  - `.row`: 보기 탭 `<div class="tabs views" role="group" aria-label="보기">`. 버튼은 `data-view="items"` `아이템`, `data-view="engravings"` `각인`이다.
  - `.row.item-filters`(view가 items일 때만 보임):
    - 등급 탭 `<div class="tabs grades">`: `전체` + `ITEM_GRADES` 라벨, 각 탭에 `.n` 개수
    - `<select id="eng" aria-label="각인">`: 첫 옵션 `각인: 전체`(value `''`). `ENGRAVING_CATEGORIES`마다 `<optgroup label>`을 두고, 그 안에 각인 이름을 시트 순서대로 넣는다.
- `<main id="list">`
  - view가 items이고 eng가 선택되어 있으면 목록 위에 `<section class="eng-summary">`를 둔다. 내용은 `renderEngravingCard(선택 각인, 개수, { itemsButton:false })`와 `<button type="button" class="clear-eng">각인 선택 해제</button>`이다.
  - 그 아래에 `renderItemList`를 둔다.
  - view가 engravings면 `renderEngravingList`를 둔다.
- 푸터: 비공식 고지, 그리고 `ITEMS_META.sources` 6개 링크, "나무위키 기여자", 라이선스 링크, 기준일. `item-page.js`가 채운다.

**`item-page.js` 동작** (스킬 페이지 `skill-page.js`의 update/writeHash/loadFromHash 패턴을 따른다):
- 상태는 `parseItemHash(location.hash, ENGRAVINGS.map(e => e.name))`로 읽는다. 바뀔 때마다 `history.replaceState`로 해시를 쓰고 다시 렌더링한다. `hashchange`가 오면 다시 읽는다.
- `#count`: items 보기면 `{n}개 아이템`, engravings 보기면 `{n}개 각인`이다.
- 등급 탭 개수: 다른 조건은 유지하고 등급만 바꿨을 때의 개수다(스킬 페이지와 같은 방식).
- `#list` 클릭 위임:
  - `.chip.eng`나 `.show-items`를 누르면 `update({ view:'items', eng, grade:'all' })` 후 맨 위로 스크롤한다.
  - `.link[data-query]`를 누르면 `update({ view:'items', query, eng:'', grade:'all' })`이다.
  - `.clear-eng`를 누르면 `update({ eng:'' })`이다.
- `<select id="eng">`의 change는 `update({ eng: value })`, 보기 탭은 `update({ view })`다.

**CSS (`items.css`)**: 기존 토큰과 컴포넌트를 재사용하고 새 클래스만 정의한다.
- `:root`에 `--omen: #b23a48`, 다크 모드에서는 `--omen: #f08791`을 정의한다. `.grade-omen { --g: var(--omen); }`
- `.chip.eng`는 버튼으로 보이게 한다(커서, hover 시 accent 테두리). `.chip.random`은 점선 테두리에 muted 색이다.
- `.badge`, `.badge.dlc`, `.badge.mod`, `.badge.nomod`를 정의한다.
- `.desc`: line-height 1.55
- `.tiers`: 기존 `.pool` 표와 같은 모양이다. `tr.mod`는 `--rec-row` 배경이다.
- `.note`: muted, 작은 글씨
- `.link`: 텍스트 버튼(밑줄, accent)
- `.eng-summary`: accent 테두리 강조
- `.item-filters[hidden]`를 처리한다.
- 360px 폭에서 가로 스크롤이 생기면 안 된다(표는 `.card` 안에서 `overflow-x:auto` 래퍼).

**허브와 nav 마무리:**
- `public/index.html` `.hub`에 두 번째 카드를 추가한다: `<a class="hub-card" href="items/"><h2>아이템 · 각인 도감</h2><p>아이템 효과와 각인 단계별 효과, 각인으로 아이템 찾기</p></a>`
- 허브 푸터에 도감 출처(나무위키 6개 문서, CC BY-NC-SA 2.0 KR)를 추가한다.
- 세 페이지 모두 site-nav 링크 세 개를 갖춘다.
- README:
  - 맨 위 소개를 세 페이지 구성으로 바꾼다.
  - "아이템 데이터 갱신" 절을 추가한다: 엑셀 수정 → `npm run build:items` → `npm test` → 스냅샷 테스트 값 갱신 → 커밋. 날짜를 바꿀 때는 `package.json`의 `--retrieved` 값도 바꾼다.
  - 출처와 라이선스 절에 `public/js/items.js`를 추가한다.

- [ ] **Step 1: 파일 작성과 수정**

- [ ] **Step 2: 회귀 확인**

Run: `npm test && npm run test:tools`
Expected: all pass

- [ ] **Step 3: 브라우저 수동 검증**

Run: `python -m http.server 8000 -d public`
Expected:
- 허브(`/`)에 카드 2개가 있고 각각 `/skills/`, `/items/`로 간다. 세 페이지의 nav가 서로 연결된다.
- `/items/`에 아이템이 등급별 5개 섹션으로 보이고, 흉조 섹션은 22개다. 콘솔 에러가 없다.
- `레전더리` 탭을 고르고 각인 select에서 `보물`을 고르면 아이템 5개(`욕망의 항아리`, `절대반지`, 황금왕 3종)와 보물 각인 요약 패널이 보인다. 주소는 `#grade=legendary&eng=%EB%B3%B4%EB%AC%BC`다.
- 아이템 카드의 각인 칩 `마도구`를 누르면 각인 필터가 마도구로 바뀌고 등급은 전체가 된다.
- `영원의 뼈: 광란`의 `「광란의 뼈」`를 누르면 검색어가 바뀌어 원본 아이템이 보인다.
- `각인` 보기로 바꾸면 분류 4개 섹션이 보인다. `죄` 카드에는 버튼 대신 안내 문구가 있다. `마도구`의 `아이템 N개 보기`를 누르면 아이템 보기로 돌아가 필터가 걸린다.
- `복제 도장`의 `랜덤A`는 눌리지 않는다.
- 검색어 `운석`: 아이템 보기에서는 관련 아이템, 각인 보기에서는 마도구가 보인다.
- 360px 폭에서 페이지 전체가 가로로 스크롤되지 않는다.
- 도감 푸터에 나무위키 문서 6개 링크와 라이선스가 있다.

- [ ] **Step 4: Commit**

```bash
git add public README.md
git commit -m "feat: item & engraving guide page linked from hub"
```

- [ ] **Step 5: 재배포 확인** (사용자 진행)

Run: `npx wrangler pages deploy public --project-name skul-skill-guide`
Expected:
- 배포 사이트에서 `/`, `/skills/`, `/items/`가 모두 200을 돌려주고, Step 3 체크리스트가 통과한다.
- 예전 주소 `https://<도메인>/#q=%EC%A3%84%EC%88%98`는 `/skills/`로 옮겨 간다.
- `/data/…xlsx`와 `/tools/…`는 404를 돌려준다.
