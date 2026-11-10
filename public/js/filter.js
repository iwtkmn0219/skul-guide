import { SKILL_INFO } from './skills.js';
import { normalize } from './common.js';

export { normalize } from './common.js';

/** @typedef {import('./data.js').Skull} Skull */
/** @typedef {import('./state.js').FilterState} FilterState */

function searchTargets(skull) {
  return [
    skull.name,
    ...skull.builds.flatMap(b => b.slots.flat()),
    ...(skull.pool ?? []).flatMap(g => g.skills.map(k => k.name)),
    ...(SKILL_INFO[skull.name]?.stages ?? []).flatMap(s => [...s.skills.map(k => k.name), ...(s.swap ? [s.swap.name] : [])]),
  ];
}

/** 이름·빌드 선택지·풀 스킬 이름·나무위키 스킬/교대 이름에서 문자 그대로 찾는다(정규식 미사용). notes는 검색하지 않는다. */
export function matchesQuery(skull, query) {
  const q = normalize(query);
  if (!q) return true;
  return searchTargets(skull).some(t => normalize(t).includes(q));
}

/** @param {Skull[]} skulls @param {FilterState} state @returns {Skull[]} */
export function filterSkulls(skulls, state) {
  return skulls.filter(s =>
    (state.grade === 'all' || s.grade === state.grade) &&
    (state.mark === 'all' || s.mark === state.mark) &&
    matchesQuery(s, state.query));
}
