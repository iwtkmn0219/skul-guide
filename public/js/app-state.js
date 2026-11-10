// 주소 해시와 화면 상태 변환, 예전 주소 변환. /skills/·/items/ 옮기는 페이지도 이 모듈만 불러오므로 아무것도 import하지 않는다.

/** @typedef {{ tab: 'all'|'skulls'|'items'|'engravings', query: string, mark: 'all'|'★'|'◆', sel: string }} AppState */

export const DEFAULT_APP_STATE = Object.freeze({ tab: 'all', query: '', mark: 'all', sel: '' });

const TAB_VALUES = ['all', 'skulls', 'items', 'engravings'];
const MARK_VALUES = ['all', '★', '◆'];
const KIND_OF_TAB = { skulls: 'skull', items: 'item', engravings: 'eng' };
const LEGACY_SKILL_KEYS = ['grade', 'mark', 'q', 'skull'];

const paramsOf = hash => new URLSearchParams(String(hash).replace(/^#/, ''));

function validSel(sel, tab, isKnownKey) {
  if (!sel || !isKnownKey(sel)) return '';
  return tab === 'all' || sel.startsWith(KIND_OF_TAB[tab] + ':') ? sel : '';
}

/** @returns {AppState} */
export function parseAppHash(hash, isKnownKey) {
  const p = paramsOf(hash);
  if (!p.has('tab') && LEGACY_SKILL_KEYS.some(k => p.has(k))) {
    const s = fromSkillsPage(hash);
    return { ...s, sel: validSel(s.sel, s.tab, isKnownKey) };
  }
  const tab = TAB_VALUES.includes(p.get('tab')) ? p.get('tab') : DEFAULT_APP_STATE.tab;
  const mark = MARK_VALUES.includes(p.get('mark')) ? p.get('mark') : DEFAULT_APP_STATE.mark;
  return { tab, query: p.get('q') ?? '', mark, sel: validSel(p.get('sel') ?? '', tab, isKnownKey) };
}

/** @param {AppState} state */
export function toAppHash(state) {
  const d = DEFAULT_APP_STATE;
  if (state.tab === d.tab && state.query === d.query && state.mark === d.mark && state.sel === d.sel) return '';
  const p = new URLSearchParams({ tab: state.tab });
  if (state.query) p.set('q', state.query);
  if (state.mark !== d.mark) p.set('mark', state.mark);
  if (state.sel) p.set('sel', state.sel);
  return '#' + p.toString();
}

/** 예전 스킬 추천 페이지(/skills/, 루트 시절 /) 해시. grade는 버린다. @returns {AppState} */
export function fromSkillsPage(hash) {
  const p = paramsOf(hash);
  const mark = ['★', '◆'].includes(p.get('mark')) ? p.get('mark') : 'all';
  const skull = p.get('skull') ?? '';
  return { tab: 'skulls', query: p.get('q') ?? '', mark, sel: /^[a-z0-9-]+$/.test(skull) ? 'skull:' + skull : '' };
}

/** 예전 아이템·각인 도감(/items/) 해시. grade는 버리고, 검증은 parseAppHash가 한다. @returns {AppState} */
export function fromItemsPage(hash) {
  const p = paramsOf(hash);
  const eng = p.get('eng') ?? '';
  if (eng) return { tab: 'engravings', query: '', mark: 'all', sel: 'eng:' + eng };
  return { tab: p.get('view') === 'engravings' ? 'engravings' : 'items', query: p.get('q') ?? '', mark: 'all', sel: '' };
}
