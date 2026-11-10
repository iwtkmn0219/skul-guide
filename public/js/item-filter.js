import { normalize } from './common.js';

/** @typedef {{ name: string, grade: string, engravings: string[], description: string[], variantOf: string|null, dlc: boolean }} Item */
/** @typedef {{ name: string, category: string, moddable: boolean, tiers: Array<{ kind: string, count: number, effect: string[], note: string|null }> }} Engraving */

const RANDOM_RE = /^랜덤[A-Z]?$/;

/** 랜덤 각인(랜덤, 랜덤A, 랜덤B …): 표시만 하고 필터나 링크로 쓰지 않는다. */
export function isRandomEngraving(name) {
  return RANDOM_RE.test(name);
}

const matches = (targets, query) => {
  const q = normalize(query);
  return !q || targets.some(t => normalize(t).includes(q));
};

/** 이름·각인·설명 줄에서 문자 그대로 찾는다(정규식 미사용). */
export function matchesItemQuery(item, query) {
  return matches([item.name, ...item.engravings, ...item.description], query);
}

/** baseName의 강화·변환형 아이템 이름들. */
export function variantsOf(items, baseName) {
  return items.filter(i => i.variantOf === baseName).map(i => i.name);
}

/** 이름·모든 단계의 효과 줄·비고에서 찾는다. */
export function matchesEngravingQuery(eng, query) {
  return matches([eng.name, ...eng.tiers.flatMap(t => [...t.effect, ...(t.note ? [t.note] : [])])], query);
}

/** @param {Engraving[]} engravings @param {string} query */
export function filterEngravings(engravings, query) {
  return engravings.filter(e => matchesEngravingQuery(e, query));
}
