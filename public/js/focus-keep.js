// 다시 그리기로 포커스가 있던 요소가 사라지면, 그 영역의 대표 요소로 포커스를 돌려준다.

/**
 * @param {Array<{ region: { contains(el: unknown): boolean }, target: () => ({ focus(o?: object): void } | null) }>} regions
 * @param {() => unknown} getActive 지금 포커스가 있는 요소(document.activeElement)
 * @param {() => void} redraw
 */
export function keepFocus(regions, getActive, redraw) {
  const before = getActive();
  const owner = regions.find(r => r.region.contains(before));
  redraw();
  if (!owner || owner.region.contains(getActive())) return;
  owner.target()?.focus({ preventScroll: true });
}
