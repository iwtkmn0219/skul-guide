import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { SKILL_INFO } from '../public/js/skills.js';
import { skillKey, ALIASES, recommendedKeys, isRecommended } from '../public/js/skill-match.js';

const byId = Object.fromEntries(SKULLS.map(s => [s.id, s]));

function guideNames(skull) {
  const names = [
    ...skull.builds.flatMap(b => b.slots.flat()),
    ...(skull.fixedSkill ? [skull.fixedSkill] : []),
    ...(skull.pool ?? []).flatMap(g => g.skills.filter(k => k.stars >= 1).map(k => k.name)),
  ];
  return [...new Set(names)].filter(n => n !== '아무거나');
}
const namuNames = skull => SKILL_INFO[skull.name].stages.flatMap(s => [...s.skills.map(k => k.name), ...(s.swap ? [s.swap.name] : [])]);

test('skillKey normalizes suffixes, parentheses, spacing and punctuation', () => {
  assert.equal(skillKey('이중 자동 쇠뇌Ⅱ~Ⅵ'), skillKey('이중자동쇠뇌'));
  assert.equal(skillKey('흡입(물리증폭)'), '흡입');
  assert.equal(skillKey('다크 차지'), '다크차지');
});
test('every guide recommendation links to at least one namu skill', () => {
  for (const skull of SKULLS) {
    const names = namuNames(skull);
    for (const guideName of guideNames(skull)) {
      const keys = (ALIASES[skull.id]?.[guideName] ?? [guideName]).map(skillKey);
      assert.ok(names.some(n => keys.includes(skillKey(n)) && isRecommended(skull, n)), `${skull.name}: ${guideName}`);
    }
  }
});
test('spelling aliases (노예)', () => {
  assert.equal(isRecommended(byId.spartan, '심장 추적'), true);
  assert.equal(isRecommended(byId.spartan, '가르기'), false);
});
test('prisoner pool: starred only', () => {
  assert.equal(isRecommended(byId.prisoner, '늑대 덫Ⅱ~Ⅵ'), true);
  assert.equal(isRecommended(byId.prisoner, '장검'), true);
  assert.equal(isRecommended(byId.prisoner, '대칭 기병창Ⅱ~Ⅵ'), false);
});
test('recruit squad names', () => {
  assert.equal(isRecommended(byId.recruit, '부대원-궁병'), true);
  assert.equal(isRecommended(byId.recruit, '부대원-암살자'), false);
});
test('아무거나 is never a key', () => {
  assert.ok(!recommendedKeys(byId.wizard).has(skillKey('아무거나')));
});
