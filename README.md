# 스컬별 스킬 추천

스컬: 더 히어로 슬레이어(Skul: The Hero Slayer)의 스컬 45종 추천 스킬 조합을 등급 탭·원문 표기(★/◆)·검색으로 볼 수 있게 정리한 정적 페이지입니다.
카드마다 그 스컬의 스킬 전체(나무위키)를 칩으로 보여 주고 추천 스킬은 ★로 강조하며, `스킬 정보`를 펼치면 각성 단계별 패시브·교대·쿨타임·효과를 볼 수 있습니다.

- 원문: [디시인사이드 스컬 마이너 갤러리 「스컬별 스킬 추천」](https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295)
- 작성자: 정도 (수정 25.02.05, 26.01.26)
- 비공식 팬 정리 페이지이며, 게임 관련 권리는 SouthPAW Games에 있습니다.

필터 상태는 주소 해시에 저장되므로 링크로 공유할 수 있습니다. 예: `#grade=unique&q=죄수`

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
npm run test:tools   # 나무위키 추출기 테스트(Python 3.12, 표준 라이브러리만)
```

## 구조

| 파일 | 역할 |
|---|---|
| `public/js/data.js` | 원문 전사 데이터(`GRADES`, `SOURCE`, `SKULLS`) |
| `public/js/filter.js` | 검색 정규화, 필터링 |
| `public/js/state.js` | URL 해시 ↔ 필터 상태 |
| `public/js/render.js` | 카드 HTML 생성(이스케이프 포함) |
| `public/js/skills.js` | 나무위키에서 생성한 스킬 정보(`NAMU`, `SKILL_INFO`) — 손으로 고치지 않음 |
| `public/js/skill-match.js` | 가이드 스킬 이름 ↔ 나무위키 스킬 이름 연결(정규화, 별칭) |
| `public/js/main.js` | DOM 이벤트 연결, 단계 탭 전환 |
| `tests/` | 위 순수 모듈 테스트 |
| `tools/extract_namu.py` | 저장한 나무위키 HTML → `skills.js` 생성기(개발용, 배포 안 됨) |

배포되는 것은 `public/` 폴더뿐입니다.

## 이미지 넣기(선택)

디시인사이드 이미지는 핫링크하지 않습니다. 초상화를 표시하려면:

1. `public/img/{id}.png` 파일을 넣습니다. `id` 목록은 `public/js/data.js`의 각 스컬 `id`(예: `skeleton-sword`, `prisoner`)를 참고합니다.
2. `public/js/main.js` 맨 위의 `IMAGES`를 `true`로 바꿉니다.

로드에 실패한 이미지는 자동으로 숨겨집니다. `public/img/`는 `.gitignore`에 들어 있어 저장소에 올라가지 않습니다.

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

## 출처와 라이선스

- 추천 스킬 내용: [디시인사이드 스컬 마이너 갤러리 「스컬별 스킬 추천」](https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295), 작성자 정도.
- 스킬 정보(`public/js/skills.js`): [나무위키 「Skul: The Hero Slayer/스컬」](https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC), 나무위키 기여자, 2026-11-08 기준.
  이 파일은 원문과 같은 [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) 라이선스를 따릅니다(저작자 표시, 비영리, 동일조건 변경허락).
  따라서 사이트에는 광고 등 상업 요소를 넣지 않습니다.
- 그 밖의 코드(`public/js/skills.js` 제외)는 위 라이선스와 별개입니다.
- 게임 관련 권리는 SouthPAW Games에 있습니다.

## 배포 (Cloudflare Pages 무료 플랜)

**대시보드 Git 연동:** 저장소를 연결하고 빌드 명령은 비워 두며, 출력 디렉터리는 `public`으로 설정합니다.
이 방식은 저장소 내용만 배포하므로 `.gitignore`에 있는 `public/img/`는 올라가지 않습니다. 이미지를 쓰려면 아래 CLI 배포를 쓰세요.

**CLI:**

```bash
npx wrangler pages deploy public --project-name skul-skill-guide
```

`public/_headers`가 `/js/*`, `/css/*`에 짧은 캐시(`max-age=300`)를 지정합니다.
