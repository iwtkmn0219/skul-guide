# Skul: The Hero Slayer 정리

스컬: 더 히어로 슬레이어(Skul: The Hero Slayer) 비공식 팬 정리 사이트입니다. 사이트는 `/` 한 화면입니다.

- 검색창 하나로 스컬 45종, 아이템 258종, 각인 36종을 한 번에 찾습니다. 스컬은 이름과 스킬, 아이템은 이름·각인·설명, 각인은 이름과 효과를 찾습니다.
- 탭 "전체 · 스컬 · 아이템 · 각인"마다 결과 수가 붙습니다. 스컬과 각인은 목록, 아이템은 같은 크기 칸의 격자로 보이고, 고르면 오른쪽(휴대폰은 화면 전체)에 상세가 나옵니다.
- 스컬 상세에는 추천 빌드와 각성 단계별 스킬 정보(나무위키)가, 아이템 상세에는 각인 단계별 효과가, 각인 상세에는 그 각인이 붙은 아이템이 나옵니다.
- 키보드: 열면 검색창에 커서가 있습니다(데스크톱). `/` 검색창으로, `↑` `↓` 목록 이동(격자는 `←` `→`도), `Esc` 검색어 지우기(휴대폰 상세에서는 목록으로). 탭을 고르면 그 탭에서 전에 고른 항목(없거나 목록에 없으면 첫 항목)이 선택되고 포커스가 목록으로 갑니다.
- ★ = 신화 DLC, ◆ = 마석으로 해금되는 스컬입니다. 스컬 탭에서 "★ 신화 DLC", "◆ 마석 해금"으로 거를 수 있습니다. DLC 아이템도 신화 DLC라 같은 ★ 표시를 씁니다.

스킬 추천 원문:

- [디시인사이드 스컬 마이너 갤러리 「스컬별 스킬 추천」](https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295)
- 작성자: 정도 (수정 25.02.05, 26.01.26)
- 비공식 팬 정리 페이지이며, 게임 관련 권리는 SouthPAW Games에 있습니다.

### 주소

탭, 검색어, ★/◆ 거르기, 고른 항목을 주소 해시에 담습니다. 그래서 링크로 공유하거나 새로고침해도 같은 화면이 나옵니다.

- 형식: `/#tab=items&q=칼레온&sel=item:칼레온 계급장` (`tab`은 `all`·`skulls`·`items`·`engravings`, `mark`는 `★`·`◆`, `sel`은 `skull:{id}`·`item:{이름}`·`eng:{이름}`)
- 예전 주소도 새 화면으로 옮겨집니다.
  - `/skills/#grade=…&mark=…&q=…&skull=…` → 스컬 탭(검색어, ★/◆, 고른 스컬 유지. `grade`는 버림)
  - `/items/#view=…&grade=…&eng=…&q=…` → 아이템 탭 또는 각인 탭. `eng`가 있으면 그 각인을 고른 상태로 엶(`grade`는 버림)
  - 루트 시절 해시(`/#grade=…`, `/#skull=…` 등 `tab`이 없는 해시) → 스컬 탭

## 로컬 실행

ES 모듈은 `file://`로 열면 로드되지 않으므로 로컬 서버로 엽니다.

```bash
python -m http.server 8000 -d public
```

브라우저에서 <http://localhost:8000> 에 접속합니다.

## 테스트

Node 20 이상이 필요하며 의존성 설치는 필요 없습니다.

```bash
npm test             # 사이트 모듈(public/js) 테스트
npm run test:tools   # 개발 도구(나무위키 추출기, 엑셀 변환기, 글꼴 서브셋) 테스트(Python 3.12, 표준 라이브러리만)
```

## 구조

| 파일 | 역할 |
|---|---|
| `public/index.html` | 한 화면 앱 |
| `public/css/base.css` | 색·글꼴 토큰, 갈무리 `@font-face`, 돌벽과 횃불, 픽셀 테두리, 머리 띠, 탭, 바닥 띠, 포커스 |
| `public/css/app.css` | 두 칸 배치, 목록 줄, 아이템 격자, 상세, 스킬 정보, 단계 표, 휴대폰 배치 |
| `public/fonts/` | 갈무리 서브셋(woff2)과 라이선스(`OFL.txt`) |
| `public/js/app.js` | DOM 연결(검색, 탭, 선택, 키보드, history, 휴대폰 상세 덮개) |
| `public/js/search.js` | 검색, 탭별 결과와 개수, 자동 선택, 상세 안 링크 이동 상태 |
| `public/js/app-state.js` | 주소 해시와 화면 상태 변환, 예전 주소 변환(데이터를 불러오지 않음) |
| `public/js/view-list.js`, `view-detail.js` | 목록·격자 HTML, 상세 HTML(이스케이프 포함) |
| `public/js/keynav.js` | 방향키로 갈 다음 칸 계산 |
| `public/js/images.js` | 그림 설정(`IMAGES`), 그림 자리 글자, 그림 경로 |
| `public/js/common.js` | 공용 함수(`escapeHtml`, `normalize`, `highlight`) |
| `public/js/filter.js`, `item-filter.js` | 스컬·아이템·각인 검색 일치 규칙, 강화·변환형 찾기 |
| `public/js/skill-match.js` | 가이드 스킬 이름 ↔ 나무위키 스킬 이름 연결(정규화, 별칭) |
| `public/js/data.js` | 원문 전사 데이터(`GRADES`, `SOURCE`, `SKULLS`) |
| `public/js/skills.js` | 나무위키에서 생성한 스킬 정보(`NAMU`, `SKILL_INFO`) — 손으로 고치지 않음 |
| `public/js/items.js` | 엑셀에서 생성한 아이템·각인 데이터(`ITEMS_META`, `ITEM_GRADES`, `ENGRAVING_CATEGORIES`, `ITEMS`, `ENGRAVINGS`) — 손으로 고치지 않음 |
| `public/skills/index.html`, `public/items/index.html` | 예전 주소를 새 화면으로 옮기는 페이지 |
| `data/Skul_아이템_각인_DB형.xlsx` | 아이템·각인 원본 엑셀(커밋함, 배포 안 됨) |
| `tools/convert_items.py` | 엑셀 → `items.js` 변환기(검증 포함, 개발용) |
| `tools/extract_namu.py` | 저장한 나무위키 HTML → `skills.js` 생성기(개발용) |
| `tools/subset_fonts.py`, `tools/font-chars.txt` | 글꼴 서브셋 도구와 남긴 글자 목록(개발용) |
| `tests/` | 위 순수 모듈 테스트 |

배포되는 것은 `public/` 폴더뿐입니다.

## 그림 넣기(선택)

게임 그림은 저장소에 넣지 않고, 디시인사이드 이미지도 핫링크하지 않습니다. 지금은 아이템 그림 자리에 이름 마지막 낱말의 첫 글자를 등급 색으로 보여 줍니다. 그림을 보여 주려면:

1. 스컬 초상화는 `public/img/skulls/{id}.png`에 넣습니다. `id`는 `public/js/data.js`의 각 스컬 `id`(예: `skeleton-sword`, `prisoner`)입니다.
2. 아이템 그림은 `public/img/items/{파일 이름}`에 넣습니다. 파일 이름은 아이템 이름에서 `\ / : * ? " < > |`를 빼고 공백을 하나로 줄인 뒤 `.png`를 붙입니다(`public/js/images.js`의 `itemImageFile`). 예: `영원의 뼈: 광란` → `영원의 뼈 광란.png`
3. `public/js/images.js`의 `IMAGES`를 `true`로 바꿉니다.

불러오지 못한 그림은 자동으로 숨겨지고 글자가 보입니다. `public/img/`는 `.gitignore`에 들어 있어 저장소에 올라가지 않습니다.

## 데이터 갱신

1. 원문이 바뀌면 `docs/superpowers/specs/2026-11-08-skul-skill-source.txt`를 먼저 고칩니다.
2. 바뀐 내용을 `public/js/data.js`에 반영합니다(문구는 원문 그대로).
3. `npm test`로 확인합니다.

## 스킬 데이터 갱신 (나무위키)

크롤러는 없습니다. 원본 HTML을 한 번 저장하고 로컬 파일에서 생성합니다. `sources/`는 `.gitignore`에 들어 있어 커밋되지 않습니다.

1. 원본 저장(둘 중 하나):
   ```bash
   curl -sL -A "Mozilla/5.0" "https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC" -o sources/namu-skul.html
   ```
   또는 브라우저에서 "다른 이름으로 저장(HTML만)"으로 `sources/namu-skul.html`에 저장합니다.
2. 생성(날짜는 저장한 날):
   ```bash
   python -X utf8 tools/extract_namu.py sources/namu-skul.html --retrieved 2026-11-08 > public/js/skills.js
   ```
3. `npm test && npm run test:tools`로 확인합니다. 테스트가 실패하면 `skills.js`를 손으로 고치지 말고 추출 규칙을 고친 뒤 다시 생성합니다.
4. 날짜를 바꿨다면 아래 출처 절의 기준일도 같이 고칩니다.

## 아이템 데이터 갱신 (엑셀)

엑셀 `data/Skul_아이템_각인_DB형.xlsx`이 유일한 원본입니다. `public/js/items.js`는 손으로 고치지 않습니다.

1. 엑셀을 고칩니다. 시트와 열은 이름으로 찾으므로 열 순서를 바꾸거나 열을 추가해도 됩니다.
2. `npm run build:items`로 다시 생성합니다. 오류가 있으면 시트 이름과 행 번호가 출력되고 `items.js`는 바뀌지 않습니다.
3. `npm test`로 확인합니다. 아이템 수 등이 의도적으로 바뀌었다면 `tests/items.test.js`의 스냅샷 테스트 값을 같은 커밋에서 갱신합니다.
4. 커밋합니다.

정리 기준일을 바꿀 때는 `package.json`의 `build:items` 스크립트에 있는 `--retrieved` 값도 바꿉니다.

## 출처와 라이선스

- 추천 스킬 내용: [디시인사이드 스컬 마이너 갤러리 「스컬별 스킬 추천」](https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295), 작성자 정도.
- 스킬 정보(`public/js/skills.js`): [나무위키 「Skul: The Hero Slayer/스컬」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC), 나무위키 기여자, 2026-11-08 기준.
  이 파일은 원문과 같은 [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) 라이선스를 따릅니다(저작자 표시, 비영리, 동일조건 변경허락).
  따라서 사이트에는 광고 등 상업 요소를 넣지 않습니다.
- 아이템·각인 정보(`public/js/items.js`, 원본 `data/Skul_아이템_각인_DB형.xlsx`): 나무위키 다음 문서 6개, 나무위키 기여자, 2026-11-10 기준.
  - [「Skul: The Hero Slayer/아이템과 각인」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8)
  - [「Skul: The Hero Slayer/아이템과 각인/레어 아이템」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%96%B4%20%EC%95%84%EC%9D%B4%ED%85%9C)
  - [「Skul: The Hero Slayer/아이템과 각인/유니크 아이템」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EC%9C%A0%EB%8B%88%ED%81%AC%20%EC%95%84%EC%9D%B4%ED%85%9C)
  - [「Skul: The Hero Slayer/아이템과 각인/레전더리 아이템」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%A0%84%EB%8D%94%EB%A6%AC%20%EC%95%84%EC%9D%B4%ED%85%9C)
  - [「Skul: The Hero Slayer/아이템과 각인/흉조 아이템」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%ED%9D%89%EC%A1%B0%20%EC%95%84%EC%9D%B4%ED%85%9C)
  - [「Skul: The Hero Slayer/아이템과 각인/DLC 아이템」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/DLC%20%EC%95%84%EC%9D%B4%ED%85%9C)
  이 파일도 [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) 라이선스를 따릅니다.
- 그 밖의 코드(`public/js/skills.js`, `public/js/items.js` 제외)는 위 라이선스와 별개입니다.
- 게임 관련 권리는 SouthPAW Games에 있습니다.

## 글꼴

- 픽셀 글꼴 [갈무리](https://github.com/quiple/galmuri) 2.40.3(Galmuri11, Galmuri11-Bold, Galmuri14)을 씁니다. 라이선스는 SIL Open Font License 1.1이고, 전문은 `public/fonts/OFL.txt`에 있습니다.
- `public/fonts/*.woff2`는 서브셋입니다. ASCII, KS X 1001 한글 2,350자, `public/`의 html·js·css에 실제로 쓰인 글자만 남겼습니다. 남긴 글자 목록은 `tools/font-chars.txt`입니다.
- 다시 만들려면 개발용 도구와 원본 글꼴이 필요합니다(`sources/`는 저장소에 넣지 않습니다).

  ```bash
  python -m pip install --user fonttools brotli
  mkdir -p sources/galmuri && cd sources/galmuri
  npm pack galmuri@2.40.3
  tar -xzf galmuri-2.40.3.tgz package/dist/Galmuri11.woff2 package/dist/Galmuri11-Bold.woff2 package/dist/Galmuri14.woff2 package/dist/LICENSE.txt
  mv package/dist/* . && rm -r package galmuri-2.40.3.tgz && cd ../..
  npm run build:fonts
  ```

- 화면 문구나 데이터에 새 글자가 들어가면 `tests/fonts.test.js`가 실패하며 빠진 글자를 알려 줍니다. 그때 `npm run build:fonts`를 다시 실행하고, 바뀐 `public/fonts/*.woff2`와 `tools/font-chars.txt`를 함께 커밋합니다.

## 배포 (Cloudflare Workers 정적 자산)

사이트는 Cloudflare Workers의 `skul-guide` Worker에 정적 자산으로 올라가 있습니다. Worker 코드는 없고 `public/` 폴더만 배포합니다.

- 주소: <https://skul-guide.iwtkmn0219.workers.dev/>
- GitHub 연동(자동 빌드)은 쓰지 않습니다. 커밋하거나 푸시해도 자동으로 배포되지 않으므로, 아래 명령으로 직접 배포합니다.

```bash
npx wrangler login   # 처음 한 번
npx wrangler deploy --name skul-guide --assets public --compatibility-date 2026-11-04
```

- `--compatibility-date`는 기존 Worker 설정과 같은 값입니다.
- `public/_headers`가 `/js/*`, `/css/*`에 짧은 캐시(`max-age=300`)를 지정합니다.
- `public/_headers`가 `/fonts/*`에 1주 캐시(`max-age=604800`)를 지정합니다.
- `/skills`처럼 끝에 `/`가 없는 주소는 `/skills/`로 자동으로 옮겨 갑니다.
- 로컬의 `public/img/`에 그림을 넣어 두었다면 이 명령으로 함께 올라갑니다(`.gitignore`에 있어 저장소에는 올라가지 않음).

배포한 뒤에는 다음을 확인합니다.

- `/`가 열린다.
- `/skills/#q=%EC%A3%84%EC%88%98`는 스컬 탭(검색어 `죄수`)으로, `/items/#eng=%EB%B3%B4%EB%AC%BC`는 각인 탭의 보물 상세로 옮겨진다.
- `/fonts/Galmuri14.woff2`는 200이다.
- `/data/…xlsx`, `/tools/…`, `/package.json`, `/sources/…`는 404다.
