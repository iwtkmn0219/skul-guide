// 그림 자리. 게임 그림은 저장소에 넣지 않는다(public/img/는 .gitignore).

/** public/img/에 그림을 넣은 뒤 true로 바꾸면 스컬 초상화와 아이템 그림을 보여 준다. */
export const IMAGES = false;

/** 그림 자리 글자: "흉조:" 접두어를 뗀 이름의 마지막 낱말 첫 글자. */
export function itemGlyph(name) {
  const words = name.replace(/^흉조:\s*/, '').trim().split(/\s+/);
  return [...words[words.length - 1]][0] ?? '';
}

/** 아이템 그림 파일 이름: 파일 이름에 못 쓰는 글자를 지우고 공백을 하나로 줄인다. */
export function itemImageFile(name) {
  return name.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim() + '.png';
}

export function itemImageUrl(name) {
  return 'img/items/' + encodeURIComponent(itemImageFile(name));
}

export function skullImageUrl(id) {
  return 'img/skulls/' + id + '.png';
}
