/** @typedef {import('./data.js').Skull} Skull */

/** 가이드 표기와 나무위키 표기를 비교하기 위한 키. */
export function skillKey(name) {
  return name
    .replace(/Ⅱ~Ⅵ/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[\s\-!·:]/g, '')
    .toLowerCase();
}

/** skullId → 가이드 스킬 이름 → 나무위키 스킬 이름들. skillKey만으로 연결되지 않는 것만 둔다. */
export const ALIASES = {
  recruit: {
    궁병: ['전우조-궁병', '분대원-궁병', '중대원-궁병', '부대원-궁병'],
    중갑병: ['전우조-중보병', '분대원-중보병', '중대원-중보병', '부대원-중보병'],
  },
  thief: { 뒷구르기: ['뒤구르기'] },
  'grave-digger': { 맥베스: ['멕베스'] },
  spartan: { 심장추적자: ['심장 추적'] },
  alchemist: {
    마비: ['신경마비 플라스크'],
    화염: ['긴급점화 플라스크'],
    오염물질: ['오염물질 플라스크'],
  },
  'dark-paladin': { 다크차치: ['다크 차지'] },
  'davy-jones': { '백병전!': ['백병전을 준비하라!'] },
};

const ANY = '아무거나';

/** 가이드 build 선택지(아무거나 제외), fixedSkill, 죄수 pool의 stars ≥ 1 스킬. */
function recommendedNames(skull) {
  return [
    ...skull.builds.flatMap(b => b.slots.flat()),
    ...(skull.fixedSkill ? [skull.fixedSkill] : []),
    ...(skull.pool ?? []).flatMap(g => g.skills.filter(k => k.stars >= 1).map(k => k.name)),
  ].filter(name => name !== ANY);
}

/** @param {Skull} skull @returns {Set<string>} */
export function recommendedKeys(skull) {
  const aliases = ALIASES[skull.id] ?? {};
  return new Set(recommendedNames(skull).flatMap(name => aliases[name] ?? [name]).map(skillKey));
}

/** @param {Skull} skull @param {string} namuName */
export function isRecommended(skull, namuName) {
  return recommendedKeys(skull).has(skillKey(namuName));
}
