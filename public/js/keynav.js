// 방향키로 갈 다음 항목 계산. 목록 줄과 격자 칸이 섞여 있어도 화면 위치로 판단한다.

/** @typedef {{ left: number, top: number, bottom: number }} Box */

const SAME_ROW = 2;

/**
 * @param {Box[]} boxes 항목 위치(DOM 순서)
 * @param {boolean[]} isCell 격자 칸이면 true
 * @param {number} current 지금 항목 index
 * @param {'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'} key
 * @returns {number} 다음 항목 index, 없으면 -1
 */
export function nextIndex(boxes, isCell, current, key) {
  const here = boxes[current];
  if (!here) return -1;
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const next = current + (key === 'ArrowLeft' ? -1 : 1);
    return next >= 0 && next < boxes.length && isCell[current] && isCell[next] ? next : -1;
  }
  const down = key === 'ArrowDown';
  // 가야 할 줄의 top: 아래로는 가장 작은 top, 위로는 가장 큰 top
  let rowTop = null;
  for (const b of boxes) {
    const beyond = down ? b.top > here.top + SAME_ROW : b.top < here.top - SAME_ROW;
    if (beyond && (rowTop === null || (down ? b.top < rowTop : b.top > rowTop))) rowTop = b.top;
  }
  if (rowTop === null) return -1;
  let best = -1;
  boxes.forEach((b, i) => {
    if (Math.abs(b.top - rowTop) > SAME_ROW) return;
    if (best === -1 || Math.abs(b.left - here.left) < Math.abs(boxes[best].left - here.left)) best = i;
  });
  return best;
}
