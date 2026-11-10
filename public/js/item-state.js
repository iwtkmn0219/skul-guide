import { ITEM_GRADES } from './items.js';

/** @typedef {{ view: 'items'|'engravings', grade: 'all'|'common'|'rare'|'unique'|'legendary'|'omen', eng: string, query: string }} ItemState */

/** @type {ItemState} */
export const DEFAULT_ITEM_STATE = Object.freeze({ view: 'items', grade: 'all', eng: '', query: '' });

const VIEWS = ['items', 'engravings'];
const GRADES = ['all', ...ITEM_GRADES.map(g => g.id)];

/** `#view=engravings&grade=omen&eng=무구&q=…` 해시를 상태로 바꾼다. eng는 engravingNames에 있을 때만 받는다. */
export function parseItemHash(hash, engravingNames) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const view = params.get('view');
  const grade = params.get('grade');
  const eng = params.get('eng');
  return {
    view: VIEWS.includes(view) ? view : DEFAULT_ITEM_STATE.view,
    grade: GRADES.includes(grade) ? grade : DEFAULT_ITEM_STATE.grade,
    eng: engravingNames.includes(eng) ? eng : DEFAULT_ITEM_STATE.eng,
    query: params.get('q') ?? DEFAULT_ITEM_STATE.query,
  };
}

/** 기본값과 같은 키는 생략한다. 모두 기본값이면 ''. */
export function toItemHash(state) {
  const params = new URLSearchParams();
  if (state.view !== DEFAULT_ITEM_STATE.view) params.set('view', state.view);
  if (state.grade !== DEFAULT_ITEM_STATE.grade) params.set('grade', state.grade);
  if (state.eng !== DEFAULT_ITEM_STATE.eng) params.set('eng', state.eng);
  if (state.query !== DEFAULT_ITEM_STATE.query) params.set('q', state.query);
  const s = params.toString();
  return s ? `#${s}` : '';
}
