/** @typedef {{ grade: 'all'|'common'|'rare'|'unique'|'legendary', mark: 'all'|'★'|'◆', query: string }} FilterState */

/** @type {FilterState} */
export const DEFAULT_STATE = Object.freeze({ grade: 'all', mark: 'all', query: '' });

const GRADE_VALUES = ['all', 'common', 'rare', 'unique', 'legendary'];
const MARK_VALUES = ['all', '★', '◆'];

/** `#grade=unique&q=죄수` 형태의 해시를 상태로 바꾼다. 허용되지 않은 값은 기본값이 된다. */
export function parseHash(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const grade = params.get('grade');
  const mark = params.get('mark');
  return {
    grade: GRADE_VALUES.includes(grade) ? grade : DEFAULT_STATE.grade,
    mark: MARK_VALUES.includes(mark) ? mark : DEFAULT_STATE.mark,
    query: params.get('q') ?? DEFAULT_STATE.query,
  };
}

/** 기본값과 같은 키는 생략한다. 모두 기본값이면 ''. */
export function toHash(state) {
  const params = new URLSearchParams();
  if (state.grade !== DEFAULT_STATE.grade) params.set('grade', state.grade);
  if (state.mark !== DEFAULT_STATE.mark) params.set('mark', state.mark);
  if (state.query !== DEFAULT_STATE.query) params.set('q', state.query);
  const s = params.toString();
  return s ? `#${s}` : '';
}
