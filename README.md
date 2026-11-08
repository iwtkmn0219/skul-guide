# 스컬별 스킬 추천

스컬: 더 히어로 슬레이어(Skul: The Hero Slayer)의 스컬 45종 추천 스킬 조합을 등급 탭·원문 표기(★/◆)·검색으로 볼 수 있게 정리한 정적 페이지입니다.

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
npm test
```

## 구조

| 파일 | 역할 |
|---|---|
| `public/js/data.js` | 원문 전사 데이터(`GRADES`, `SOURCE`, `SKULLS`) |
| `public/js/filter.js` | 검색 정규화, 필터링 |
| `public/js/state.js` | URL 해시 ↔ 필터 상태 |
| `public/js/render.js` | 카드 HTML 생성(이스케이프 포함) |
| `public/js/main.js` | DOM 이벤트 연결 |
| `tests/` | 위 순수 모듈 테스트 |

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

## 배포 (Cloudflare Pages 무료 플랜)

**대시보드 Git 연동:** 저장소를 연결하고 빌드 명령은 비워 두며, 출력 디렉터리는 `public`으로 설정합니다.
이 방식은 저장소 내용만 배포하므로 `.gitignore`에 있는 `public/img/`는 올라가지 않습니다. 이미지를 쓰려면 아래 CLI 배포를 쓰세요.

**CLI:**

```bash
npx wrangler pages deploy public --project-name skul-skill-guide
```

`public/_headers`가 `/js/*`, `/css/*`에 짧은 캐시(`max-age=300`)를 지정합니다.
