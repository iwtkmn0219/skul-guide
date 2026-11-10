// 페이지 공용 순수 함수: 스킬 추천 페이지와 아이템·각인 도감이 함께 쓴다.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ENTITIES[c]);
}

/** 검색 비교용: 소문자로 바꾸고 공백·`-`·`·`을 지운다. */
export function normalize(text) {
  return text.toLowerCase().replace(/[\s\-·]/g, '');
}
