# 나무위키 스킬 정보 통합 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 나무위키 「Skul: The Hero Slayer/스컬」 문서의 스킬 정보(패시브, 교대, 스킬별 쿨타임·효과, 각성 단계별)를 기존 추천 가이드 카드에 붙인다. 카드마다 그 스컬의 스킬을 전부 칩으로 보여 주고, 추천 스킬은 하이라이트하며, 세부 정보는 펼쳐서 단계 탭으로 본다.

**Architecture:** 개발용 Python 추출기(`tools/extract_namu.py`, 표준 라이브러리만 사용)가 로컬에 저장한 나무위키 HTML을 읽어 `public/js/skills.js`를 생성하고, 이 파일을 커밋한다. 사이트는 런타임에 나무위키에 접속하지 않는다. 추천 스킬과 나무위키 스킬 이름은 `public/js/skill-match.js`가 정규화와 별칭 표로 연결한다. 렌더링과 검색은 기존 순수 모듈을 확장하고, 단계 탭 전환만 `main.js`에서 처리한다.

**Tech Stack:** 기존 구성(Vanilla ES modules, `node:test`)에 Python 3.12 표준 라이브러리(`html.parser`, `unittest`)를 개발용으로만 추가한다.

**Spec:** 이 문서의 Global Constraints와, 원본 문서 `https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC`(2026-11-08 기준)가 스펙이다. 기존 계획 `docs/superpowers/plans/2026-11-08-skul-skill-guide.md`의 Global Constraints도 계속 적용된다.

## Global Constraints

- 표시 범위: 카드에는 그 스컬의 스킬 이름을 모두 칩으로 보여 준다. 추천 스킬 칩에는 `rec` 클래스를 붙여 강조한다. 패시브, 교대, 쿨타임, 효과는 `<details>`를 펼쳐야 보인다.
- 각성 단계: 단계마다 탭을 두고, 기본 선택은 마지막 정규 단계(레전더리)다. 특수 형태(예: 버서커의 `데빌`)는 정규 단계 뒤에 별도 탭으로 둔다.
- 추천 스킬로 보는 범위: 가이드 build의 모든 선택지(`아무거나` 제외)와 `fixedSkill`, 그리고 죄수 pool에서 `stars ≥ 1`인 스킬이다.
- 라이선스: 나무위키 본문은 CC BY-NC-SA 2.0 KR이다. 다음 세 곳 모두에 출처 문서 링크, "나무위키 기여자", 라이선스 이름과 링크 `https://creativecommons.org/licenses/by-nc-sa/2.0/kr/`, 기준일 `2026-11-08`을 적는다.
  - 사이트 푸터
  - README
  - `public/js/skills.js` 머리 주석
  
  README에는 `public/js/skills.js`가 같은 라이선스(CC BY-NC-SA 2.0 KR)를 따른다는 점도 적는다. 사이트에는 광고 등 상업 요소를 넣지 않는다.
- 수집 방식: 크롤러를 만들지 않는다. 원본 HTML은 사람이 한 번 저장한다(브라우저 저장 또는 `curl` 1회). 저장 위치는 `sources/namu-skul.html`이고 커밋하지 않는다(`.gitignore`에 `sources/` 추가). 추출기는 이 로컬 파일만 읽는다.
- 나무위키 문구는 그대로 쓴다. 각주 표식 `[숫자]`만 제거한다. 줄바꿈(`<br>`)은 효과 문자열 배열의 원소 경계가 된다.
- 런타임 의존성은 계속 0개다. Python은 데이터를 생성할 때만 쓴다.

## Review Focus

1. 표 구조가 단계마다 다른 경우: 노예는 타입 행이 스킬 표 뒤에 온다. 그러므로 단계 경계는 `스킬 | 쿨타임 | 효과` 헤더 행으로 잡아야 하고, 단계마다 스킬 4개가 나와야 한다. 테스트는 Task 2에 있다.
2. 한 스킬이 여러 행으로 나뉜 경우: 그림리퍼의 강화 1·2단계, 리빙아머의 연소/안정 상태가 그렇다. 이런 행은 같은 스킬의 `variants`로 묶어야 하고, 쿨타임 칸이 병합되어 있으면 부모 스킬의 쿨타임을 물려받아야 한다. 테스트는 Task 1과 Task 2에 있다.
3. 이름 표기 차이: `뒷구르기`/`뒤구르기`, `심장추적자`/`심장 추적`, 죄수의 `Ⅱ~Ⅵ` 접미사처럼 표기가 다른 추천 스킬도 하이라이트되어야 한다. 가이드의 모든 추천 스킬이 나무위키 스킬과 하나 이상 연결되는지 테스트한다. 테스트는 Task 3에 있다.
4. 단계 이름 행이 없는 스컬: 리틀본은 단계 이름 행이 없다. 이 경우 `기본` 탭 하나로 표시하고, `3.1.1 ???` 같은 하위 섹션의 표는 섞이지 않아야 한다. 테스트는 Task 1과 Task 2에 있다.
5. 나무위키 문구의 이스케이프: 효과에 `<`, `&`, `( ↓ + X )` 같은 문자가 들어가도 그대로 보여야 한다. 테스트는 Task 4에 있다.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `tools/extract_namu.py` | 저장된 HTML → `skills.js` 생성(개발용, 배포 안 됨) |
| `tools/test_extract_namu.py` | 합성 HTML 조각으로 추출 규칙 단위 테스트 |
| `public/js/skills.js` | 생성 산출물: `NAMU`, `SKILL_INFO` |
| `public/js/skill-match.js` | 이름 정규화, 별칭, 추천 판정 |
| `public/js/render.js` (수정) | 스킬 칩과 상세 패널 렌더링 |
| `public/js/filter.js` (수정) | 나무위키 스킬 이름도 검색 |
| `public/js/main.js`, `public/css/style.css`, `public/index.html`, `README.md` (수정) | 탭 전환, 스타일, 출처·라이선스 |
| `tests/skills.test.js`, `tests/skill-match.test.js` | 생성 데이터 골든 테스트, 매칭 테스트 |

---

### Task 1: 나무위키 HTML 추출기

**Files:**
- Create: `tools/extract_namu.py`, `tools/test_extract_namu.py`
- Modify: `package.json`(`"test:tools": "python -X utf8 -m unittest discover -s tools -p test_*.py"` 추가), `.gitignore`(`sources/`, `__pycache__/` 추가)

**Interfaces:**
- Produces:
  - `parse(html: str) -> dict[str, dict]`: 키는 스컬 이름(제목에서 `N.M.`, 끝의 ` ★`/` ◆`, `[편집]`을 뗀 값. 예: `'노예'`)이다. 값은 `{"stages": [Stage]}`이다.
    - `Stage = {"label": str, "form": str|None, "kind": "stage"|"form", "passive": list[str], "swap": {"name": str, "effect": list[str]}|None, "skills": [Skill]}`
    - `Skill = {"name": str, "cooldown": str, "effect": list[str], "variants": [{"cooldown": str, "effect": list[str]}]}`
  - `to_module(data: dict, retrieved: str) -> str`: 머리 주석(출처, 라이선스, 생성 명령), `export const NAMU = {url, title:'Skul: The Hero Slayer/스컬', license:'CC BY-NC-SA 2.0 KR', licenseUrl, retrieved}`, `export const SKILL_INFO = <JSON>;`을 차례로 출력한다.
  - CLI: `python -X utf8 tools/extract_namu.py sources/namu-skul.html --retrieved 2026-11-08 > public/js/skills.js`

**추출 규칙** (`html.parser.HTMLParser`로 `h2~h5`와 `tr`/`td`를 읽는다. 셀마다 텍스트와 `rowspan`을 기록한다):
- 섹션: 제목 번호가 `3.x`, `4.x`, `5.x`, `6.x`처럼 두 단계인 제목만 스컬 섹션으로 연다. `3.1.1.`처럼 더 깊은 제목이 나오면 다음 두 단계 제목이 나올 때까지 행을 버린다. `7.`, `8.` 이후는 무시한다.
- 셀 텍스트: `<br>`에서 줄을 나누고, 줄마다 공백을 접고 trim한 뒤 `\[\d+\]`를 지운다. 빈 줄은 버린다.
- 단계 이름 행: 셀이 모두 `^(노말|레어|유니크|레전더리) : (.+)$`에 맞는 행이다. `(label, form)` 목록으로 저장한다.
- 표 헤더 행: 셀 텍스트가 `['스킬','쿨타임','효과']`인 행이다. 이 행이 나오면 새 Stage를 연다. i번째 Stage는 단계 목록에 i번째 항목이 있으면 그 label과 form을 쓰고 `kind:'stage'`가 된다. 단계 목록이 비어 있으면 `label:'기본'`이다. 단계 목록 길이를 넘는 Stage는 직전에 본 단일 셀 `^(.+) : (.+)$` 행의 두 번째 그룹을 label로 쓰고 `kind:'form'`이 된다.
- Stage 안의 행:
  - 첫 셀이 `패시브`면 마지막 셀 줄 목록을 passive로 쓴다.
  - 첫 셀이 `교대`면 `{name: 둘째 셀, effect: 마지막 셀}`을 swap으로 쓴다.
  - 첫 셀이 `스킬`이고 셀이 4개면 나머지 3칸으로 스킬을 만든다.
  - 직전 행이 스킬이고 셀이 3개면 그 3칸으로 스킬을 만든다.
  - 그 밖의 행이 나오면 Stage 읽기를 멈춘다(`타입`, `장점` 등).
- variants: 스킬 이름 셀의 `rowspan=N`이 1보다 크면 다음 N-1행이 variants다. 2칸 행은 `{cooldown, effect}`이고, 1칸 행은 쿨타임 칸이 병합된 경우라서 cooldown을 부모 스킬의 값으로 채운다.
- `skills`가 빈 Stage는 버린다(잊혀진 왕의 영웅왕처럼 타입만 있는 표).

- [ ] **Step 1: 실패하는 단위 테스트 작성** (`tools/test_extract_namu.py`)

테스트 HTML 조각은 실제 문서 구조를 흉내 내서 각 테스트 안에 문자열로 만든다(`<h3>3.5. 웨어울프[편집]</h3><table><tr><td>노말 : 웨어울프</td>…`).
- `test_stage_labels`: 두 단계 표가 있는 섹션의 결과는 `[s["label"] for s in stages] == ["노말","레어"]`이고, `stages[0]["form"] == "웨어울프"`이다.
- `test_type_row_after_table`: 타입 행이 헤더보다 뒤에 오는 표 2개도 Stage 2개와 각 스킬 4개로 읽힌다.
- `test_skill_rows_and_br`: 효과 `"A<br>B[75]"`는 `["A","B"]`가 된다. 이름 `"이중 자동 쇠뇌Ⅱ~Ⅵ<a>[75]</a>"`는 `"이중 자동 쇠뇌Ⅱ~Ⅵ"`가 된다.
- `test_variants_with_and_without_cooldown`: `rowspan=3`인 이름 셀 뒤에 2칸 행 2개가 오면 variants 2개가 되고 cooldown은 `"44초"`다. 이름과 쿨타임 셀이 모두 `rowspan=3`이고 뒤에 1칸 행이 오면 variant의 cooldown은 부모 값 `"13초"`다.
- `test_form_stage`: 단계 이름 1개, 헤더 2개, 그 사이에 `"악마의 뼈(스킬) : 데빌"` 행이 있으면 두 번째 Stage는 `{"label":"데빌","kind":"form"}`이다.
- `test_no_stage_row_and_subsection_ignored`: `3.1. 스컬(리틀본)` 표 1개 뒤에 `3.1.1. ???` 표가 오면 결과 키는 `'스컬(리틀본)'` 하나이고 Stage도 1개(`label '기본'`)다.
- `test_marks_stripped`: 제목 `"3.12. 노예 ★[편집]"`의 키는 `"노예"`다.
- `test_to_module`: 결과는 `"CC BY-NC-SA 2.0 KR"`, `"export const SKILL_INFO = "`, `"retrieved: '2026-11-08'"`을 포함한다.

- [ ] **Step 2: 실패 확인**

Run: `npm run test:tools`
Expected: FAIL, `ModuleNotFoundError: No module named 'extract_namu'`

- [ ] **Step 3: `tools/extract_namu.py` 구현** (`parse`, `to_module`, `argparse` CLI)

- [ ] **Step 4: 통과 확인**

Run: `npm run test:tools`
Expected: `OK` (8 tests)

- [ ] **Step 5: Commit**

```bash
git add tools/ package.json .gitignore docs/superpowers/plans/2026-11-08-namu-skill-info.md
git commit -m "feat: add namu wiki skill table extractor"
```

---

### Task 2: `skills.js` 생성 + 골든 테스트

**Files:**
- Create: `public/js/skills.js`(생성물), `tests/skills.test.js`
- Modify: `tools/extract_namu.py`(골든 테스트가 드러낸 규칙 누락이 있을 때만)

**Interfaces:**
- Consumes: Task 1 CLI, `SKULLS` from `public/js/data.js`
- Produces: `public/js/skills.js`
  - `export const NAMU: { url: string, title: string, license: string, licenseUrl: string, retrieved: string }`
  - `export const SKILL_INFO: Record<string /* Skull.name */, { stages: Stage[] }>` (Stage와 Skill 필드 이름은 Task 1과 같다)

- [ ] **Step 1: 원본 저장**

Run: `curl -sL -A "Mozilla/5.0" "https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC" -o sources/namu-skul.html`
Expected: 파일 크기가 1MB 이상이고 `짐승의 도약`이 들어 있다. 실패하면 브라우저에서 "다른 이름으로 저장(HTML만)"으로 같은 경로에 저장한다.

- [ ] **Step 2: 실패하는 골든 테스트 작성** (`tests/skills.test.js`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { SKILL_INFO, NAMU } from '../public/js/skills.js';

const info = name => SKILL_INFO[name];
const regular = name => info(name).stages.filter(s => s.kind === 'stage');
const last = name => regular(name).at(-1);

test('every guide skull has skill info', () => {
  for (const s of SKULLS) assert.ok(info(s.name), s.name);
});
test('regular stage count follows grade', () => {
  const expected = { common: 4, rare: 3, unique: 2, legendary: 1 };
  for (const s of SKULLS.filter(s => s.id !== 'skul')) assert.equal(regular(s.name).length, expected[s.grade], s.name);
  assert.deepEqual(info('스컬(리틀본)').stages.map(s => s.label), ['기본']);
});
test('stage labels and forms', () => {
  assert.deepEqual(regular('웨어울프').map(s => s.label), ['노말', '레어', '유니크', '레전더리']);
  assert.equal(last('웨어울프').form, '영원의 웨어울프');
  const forms = info('버서커').stages.filter(s => s.kind === 'form');
  assert.deepEqual(forms.map(s => s.label), ['데빌']);
  assert.equal(forms[0].skills[0].name, '악마의 울음');
});
test('type row after table (노예)', () => {
  assert.deepEqual(regular('노예').map(s => s.skills.length), [4, 4, 4, 4]);
});
test('variants', () => {
  const harvest = last('그림리퍼').skills.find(k => k.name === '수확');
  assert.equal(harvest.cooldown, '15초');
  assert.deepEqual(harvest.variants.map(v => v.cooldown), ['44초', '44초']);
  const charge = last('리빙아머').skills.find(k => k.name === '소울 차지');
  assert.deepEqual(charge.variants.map(v => v.cooldown), ['13초', '13초']);
});
test('irregular counts', () => {
  assert.equal(last('닌자').skills.length, 8);
  assert.equal(last('죄수').skills.length, 19);
  assert.ok(last('죄수').skills.some(k => k.name === '이중 자동 쇠뇌Ⅱ~Ⅵ'));
  assert.equal(last('웨어울프').swap.name, '야생의 질주');
  assert.ok(last('웨어울프').passive.length >= 1);
});
test('no footnote markers, no empty lines', () => {
  const lines = Object.values(SKILL_INFO).flatMap(i => i.stages.flatMap(s =>
    [...s.passive, ...(s.swap?.effect ?? []), ...s.skills.flatMap(k => [k.name, ...k.effect, ...k.variants.flatMap(v => v.effect)])]));
  assert.ok(lines.every(l => l && !/\[\d+\]/.test(l)));
});
test('attribution metadata', () => {
  assert.equal(NAMU.license, 'CC BY-NC-SA 2.0 KR');
  assert.equal(NAMU.retrieved, '2026-11-08');
});
```

- [ ] **Step 3: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/skills.js'`

- [ ] **Step 4: 생성**

Run: `python -X utf8 tools/extract_namu.py sources/namu-skul.html --retrieved 2026-11-08 > public/js/skills.js`

- [ ] **Step 5: 통과 확인**

Run: `npm test && npm run test:tools`
Expected: all pass. 골든 테스트가 실패하면 `skills.js`를 손으로 고치지 않는다. 추출 규칙을 고치고, 그 경우를 Task 1 단위 테스트에 추가한 뒤 다시 생성한다.

- [ ] **Step 6: Commit**

```bash
git add public/js/skills.js tests/skills.test.js tools/
git commit -m "feat: generate skill info from namu wiki snapshot (CC BY-NC-SA 2.0 KR)"
```

---

### Task 3: 추천 스킬 매칭

**Files:**
- Create: `public/js/skill-match.js`, `tests/skill-match.test.js`

**Interfaces:**
- Consumes: `Skull`, `SKILL_INFO`
- Produces:
  - `skillKey(name: string): string`: 다음 순서로 바꾼다.
    1. `Ⅱ~Ⅵ`를 지운다.
    2. 괄호 `(…)` 구간을 지운다.
    3. 공백과 `- ! · : `를 지운다.
    4. 소문자로 바꾼다.
  - `ALIASES: Record<skullId, Record<guideName, string[] /* 나무위키 이름 */>>` 값은 정확히 다음과 같다.
    - `recruit`: `궁병` → `['전우조-궁병','분대원-궁병','중대원-궁병','부대원-궁병']`, `중갑병` → `['전우조-중보병','분대원-중보병','중대원-중보병','부대원-중보병']`
    - `thief`: `뒷구르기` → `['뒤구르기']`
    - `grave-digger`: `맥베스` → `['멕베스']`
    - `spartan`: `심장추적자` → `['심장 추적']`
    - `alchemist`: `마비` → `['신경마비 플라스크']`, `화염` → `['긴급점화 플라스크']`, `오염물질` → `['오염물질 플라스크']`
    - 죄수는 별칭이 필요 없다. 추천(★) 스킬 6개가 모두 `skillKey`만으로 연결된다. 표기가 다른 `기병창`과 `위상변화기`는 stars가 0이라 추천 대상이 아니다.
    - `davy-jones`: `백병전!` → `['백병전을 준비하라!']`
  - `recommendedKeys(skull: Skull): Set<string>`: 추천 범위(Global Constraints)의 이름마다 별칭이 있으면 별칭 목록을, 없으면 이름 자체를 `skillKey`로 바꿔 모은다. `아무거나`는 뺀다.
  - `isRecommended(skull: Skull, namuName: string): boolean`: `recommendedKeys(skull).has(skillKey(namuName))`

- [ ] **Step 1: 실패하는 테스트 작성**
  - `skillKey('이중 자동 쇠뇌Ⅱ~Ⅵ') === skillKey('이중자동쇠뇌')`, `skillKey('흡입(물리증폭)') === '흡입'`, `skillKey('다크 차지') === '다크차지'`
  - 완전성 테스트(Review Focus 3): 모든 SKULLS의 추천 이름(`아무거나` 제외)마다, 그 스컬의 어느 Stage에 있는 skills 이름이나 swap 이름 중 하나 이상이 `isRecommended`로 연결된다. 실패하면 메시지에 `${skull.name}: ${guideName}`을 담는다.
  - `isRecommended(spartan, '심장 추적')`은 true이고 `isRecommended(spartan, '가르기')`는 false다.
  - 죄수: `'늑대 덫Ⅱ~Ⅵ'`와 `'장검'`은 true다. `'기병창'`은 stars가 0이라서 `'대칭 기병창Ⅱ~Ⅵ'`는 false다.
  - 칼레온 신병: 레전더리 단계의 `'부대원-궁병'`은 true이고 `'부대원-암살자'`는 false다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL, `Cannot find module '../public/js/skill-match.js'`

- [ ] **Step 3: `public/js/skill-match.js` 구현**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add public/js/skill-match.js tests/skill-match.test.js
git commit -m "feat: match guide skill names to namu wiki skills"
```

---

### Task 4: 카드 렌더링과 검색 확장

**Files:**
- Modify: `public/js/render.js`, `public/js/filter.js`, `tests/render.test.js`, `tests/filter.test.js`

**Interfaces:**
- Consumes: `SKILL_INFO`, `isRecommended`
- Produces:
  - `defaultStageIndex(stages: Stage[]): number`: 마지막 `kind:'stage'`의 인덱스를 반환한다. 없으면 0이다.
  - `renderSkillSection(skull: Skull, info: {stages: Stage[]} | undefined): string`: info가 없으면 `''`을 반환한다. 마크업 순서는 다음과 같다.
    1. `<ul class="skill-chips">`: 기본 단계 skills마다 `<li class="chip">` 또는 `<li class="chip rec" title="추천">`
    2. `<details class="skill-detail"><summary>스킬 정보</summary>`
    3. `<div class="stage-tabs" role="tablist">`: 단계마다 `<button type="button" role="tab" data-stage="{i}" aria-selected="{i===기본}">`을 둔다. 라벨은 `label`이고, form이 있으면 `label · form`이다(`레전더리 · 영원의 웨어울프`).
    4. 단계마다 `<div class="stage" data-stage="{i}" role="tabpanel">`를 둔다. 기본 단계가 아니면 `hidden`을 붙인다. 내용은 다음과 같다.
       - `<p class="passive"><b>패시브</b> …</p>` (passive가 있을 때)
       - `<p class="swap"><b>교대</b> {name} — …</p>` (swap이 있을 때)
       - `<table class="skill-table"><thead><tr><th>스킬</th><th>쿨타임</th><th>효과</th></tr></thead>`. 행마다 `<tr class="rec?">`이고, variants는 같은 스킬 아래에 이름 칸이 빈 `<tr class="variant">`로 붙인다. 효과 줄은 `<br>`로 잇는다.
    5. 끝에 `<p class="attribution">출처: <a href="{NAMU.url}">나무위키</a> · {NAMU.license}</p></details>`
  - `renderCard`는 기존 builds/pool/notes 다음에 `renderSkillSection(skull, SKILL_INFO[skull.name])`를 넣는다. 기존 시그니처는 그대로 둔다.
  - `filterSkulls`: `matchesQuery`의 검색 대상에 `SKILL_INFO[skull.name]`의 모든 Stage에 있는 skill 이름과 swap 이름을 추가한다. 기존 시그니처는 바꾸지 않는다(filter.js에서 `SKILL_INFO`를 직접 import).

- [ ] **Step 1: 실패하는 테스트 추가**

`tests/render.test.js`:
- 웨어울프 카드는 `<li class="chip rec" title="추천">사냥</li>`과 `role="tab" data-stage="3" aria-selected="true"`를 포함하고, `data-stage="0" role="tabpanel" hidden`을 포함한다.
- 노예 카드는 `<li class="chip rec" title="추천">심장 추적</li>`과 `<li class="chip">가르기</li>`를 포함한다.
- 버서커 카드는 `>데빌</button>`을 포함하고, `defaultStageIndex(SKILL_INFO['버서커'].stages)`는 1이다.
- 그림리퍼 카드는 `class="variant"`를 포함한다.
- 리틀본 카드는 `별도 추천 없음`과 `class="skill-chips"`를 함께 포함한다.
- 가짜 info `{stages:[{label:'기본',form:null,kind:'stage',passive:['( ↓ + X ) <a&b>'],swap:null,skills:[]}]}`로 `renderSkillSection`을 호출하면 `( ↓ + X ) &lt;a&amp;b&gt;`를 포함한다. (Review Focus 5)
- `renderSkillSection(byId.werewolf, undefined)`의 결과는 `''`이다.
- 카드는 `CC BY-NC-SA 2.0 KR`을 포함한다.

`tests/filter.test.js`:
- query `'환영교차'`의 결과 id는 `['ninja']`다.
- query `'야생의 질주'`는 `werewolf`를 포함한다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: 새로 추가한 테스트만 FAIL

- [ ] **Step 3: `render.js`, `filter.js` 수정**

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: all pass (기존 30개 포함)

- [ ] **Step 5: Commit**

```bash
git add public/js/render.js public/js/filter.js tests/render.test.js tests/filter.test.js
git commit -m "feat: show namu skill chips and stage-tabbed details on cards"
```

---

### Task 5: 탭 전환, 스타일, 출처 표기, 배포

**Files:**
- Modify: `public/js/main.js`, `public/css/style.css`, `public/index.html`, `README.md`

**Interfaces:**
- Consumes: Task 4 마크업(`.stage-tabs button[data-stage]`, `.stage[data-stage]`), `NAMU`
- Produces: 없음(최종 산출물)

**동작과 표기:**
- `main.js`: `#list`에서 클릭을 위임받는다. `.stage-tabs button`이 눌리면 같은 `.skill-detail` 안에서 다음을 처리한다.
  - 버튼들의 `aria-selected`를 바꾼다.
  - 눌린 버튼과 같은 `data-stage`를 가진 `.stage`에서만 `hidden`을 뺀다.
  
  필터를 바꿔 목록이 다시 렌더링되면 탭 선택이 기본 단계로 돌아간다. 이는 의도한 동작이다.
- CSS:
  - `.chip`: 작은 둥근 배지
  - `.chip.rec`: 강조색 배경과 굵은 글씨. 색만으로 구분하지 않도록 앞에 `★ `를 붙인다(`::before`).
  - `.skill-table`: 폭 100%. 360px 화면에서 표가 넘치면 표만 가로로 스크롤되게 `details` 안쪽 래퍼에 `overflow-x:auto`를 준다.
  - `tr.rec`: 배경을 강조한다.
  - `.variant td`: 글씨를 작게 하고 들여 쓴다.
  - `.stage-tabs [aria-selected=true]`: 선택 상태를 표시한다.
  - 다크 모드 색도 함께 정한다.
- 푸터에 다음 문장을 추가한다. `스킬 정보: <a href=NAMU.url>나무위키 「Skul: The Hero Slayer/스컬」</a> (나무위키 기여자, <a href=licenseUrl>CC BY-NC-SA 2.0 KR</a>, 2026-11-08 기준).` `main.js`의 `renderHeader`에서 `NAMU`로 채운다.
- README에 다음 세 가지를 추가한다.
  - 출처와 라이선스 절. 코드와 `public/js/skills.js`의 라이선스가 다르다는 점을 밝힌다.
  - 스킬 데이터 갱신 절차: 원본 저장, 생성 명령, `npm test`.
  - `npm run test:tools`.

- [ ] **Step 1: 4개 파일 수정**

- [ ] **Step 2: 회귀 확인**

Run: `npm test && npm run test:tools`
Expected: all pass

- [ ] **Step 3: 브라우저 수동 검증**

Run: `python -m http.server 8000 -d public` 후 `http://localhost:8000`
Expected:
- 웨어울프 카드에 칩 4개가 있고, 추천 칩에 ★ 강조가 보인다.
- `스킬 정보`를 펼치면 `레전더리 · 영원의 웨어울프` 탭이 선택되어 있다.
- `노말` 탭을 누르면 짐승의 도약 쿨타임이 `12초`로 바뀌고, 다른 카드의 탭은 그대로다.
- 그림리퍼 상세에서 수확 아래에 강화 단계 행 2개가 보인다.
- 검색어 `환영교차`로 닌자만 남는다.
- 360px 폭에서 페이지 전체는 가로로 스크롤되지 않고, 표만 스크롤된다.
- 푸터에 나무위키 출처와 라이선스 링크가 있다.
- 콘솔 에러가 없다.

- [ ] **Step 4: Commit**

```bash
git add public/js/main.js public/css/style.css public/index.html README.md
git commit -m "feat: stage tab switching, skill styles, namu attribution"
```

- [ ] **Step 5: 재배포 확인** (사용자 진행)

Run: `npx wrangler pages deploy public --project-name skul-skill-guide`
Expected: 배포된 사이트에서 Step 3 체크리스트가 통과하고, `/js/skills.js`가 200을 돌려준다. `tools/`, `sources/`는 404를 돌려준다.
