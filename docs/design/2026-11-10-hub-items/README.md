# 허브 · 아이템·각인 도감 디자인 시안 (2026-11-10)

계획 `docs/superpowers/plans/2026-11-10-hub-and-item-guide.md`의 마크업과 클래스 이름을 바꾸지 않고, CSS만으로 만든 시안이다.

## 보는 법

```bash
python -m http.server 8766          # 저장소 루트에서
```

- 허브: http://localhost:8766/docs/design/2026-11-10-hub-items/hub.html
- 도감: http://localhost:8766/docs/design/2026-11-10-hub-items/items.html
  - `#grade=legendary&eng=보물`: 각인 요약 패널
  - `#view=engravings`: 각인 보기

`items.html`은 실제 `public/items/index.html`의 마크업과 `public/js/item-page.js`를 그대로 쓰고, CSS만 이 폴더의 파일로 바꾼다.

## 파일

| 파일 | 반영할 곳 | 영향 범위 |
|---|---|---|
| `style-additions.css` | `public/css/style.css` | 세 페이지 모두. 스킬 페이지도 바뀐다. |
| `home.css` | `public/css/home.css` (교체) | 허브 |
| `items.css` | `public/css/items.css` (교체) | 도감 |

## 계획과 다른 점

- 허브 `.hub`: `auto-fill` 대신 `auto-fit`을 쓴다(카드 2장이 한 줄을 채움). `.hub-card`에는 위쪽 강조 테두리와 "바로 가기 →"를 넣었다.
- 도감 툴바: 640px 이하에서는 sticky를 해제하고 등급 탭을 두 줄로 감싼다.
- 각인 보기: 섹션 헤딩과 겹치는 카드의 분류 배지를 CSS로 숨긴다. 마크업은 그대로이고, 요약 패널에서는 보인다.
- `style.css`:
  - 라이트 모드 등급 글자색 토큰(`--*-text`)을 추가한다. 기존 등급색은 글자 대비가 2.6~3.9:1이라 기준(4.5:1)에 못 미친다.
  - 한글 `word-break: keep-all`
  - site-nav 밑줄 표시
  - select 포커스 표시
  - 푸터 구분선
