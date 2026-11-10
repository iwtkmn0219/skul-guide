// 공용 순수 함수: 이스케이프, 검색 비교, 검색어 표시.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ENTITIES[c]);
}

/** 검색 비교용: 소문자로 바꾸고 공백·`-`·`·`을 지운다. */
export function normalize(text) {
  return text.toLowerCase().replace(/[\s\-·]/g, '');
}

const SKIPPED = /[\s\-·]/;

/** 검색어와 맞은 부분을 <mark>로 감싼 이스케이프된 HTML. 일치 규칙은 normalize와 같다(공백·`-`·`·` 무시, 대소문자 무시). */
export function highlight(text, query) {
  const chars = [...String(text)];
  const q = normalize(query ?? '');
  if (!q) return escapeHtml(chars.join(''));
  // 정규화 문자열의 코드 유닛마다 원문 몇 번째 글자에서 왔는지 기록한다.
  let norm = '';
  const from = [];
  chars.forEach((c, i) => {
    if (SKIPPED.test(c)) return;
    const lower = c.toLowerCase();
    norm += lower;
    for (let k = 0; k < lower.length; k++) from.push(i);
  });
  const ranges = [];
  for (let p = norm.indexOf(q); p !== -1; p = norm.indexOf(q, p + q.length)) {
    ranges.push([from[p], from[p + q.length - 1]]);
  }
  let out = '';
  let pos = 0;
  for (const [start, end] of ranges) {
    if (start < pos) continue;
    out += escapeHtml(chars.slice(pos, start).join('')) + '<mark>' + escapeHtml(chars.slice(start, end + 1).join('')) + '</mark>';
    pos = end + 1;
  }
  return out + escapeHtml(chars.slice(pos).join(''));
}
