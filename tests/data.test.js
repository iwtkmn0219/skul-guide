import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS, GRADES } from '../public/js/data.js';

const byId = Object.fromEntries(SKULLS.map(s => [s.id, s]));
const ids = g => SKULLS.filter(g).map(s => s.id).sort();

test('45 skulls, 13/14/10/8 per grade', () => {
  assert.equal(SKULLS.length, 45);
  assert.deepEqual(GRADES.map(g => SKULLS.filter(s => s.grade === g.id).length), [13, 14, 10, 8]);
});
test('ids unique kebab-case', () => {
  assert.equal(new Set(SKULLS.map(s => s.id)).size, 45);
  SKULLS.forEach(s => assert.match(s.id, /^[a-z0-9]+(-[a-z0-9]+)*$/));
});
test('no is 1..n contiguous within grade, in array order', () => {
  for (const g of GRADES) assert.deepEqual(SKULLS.filter(s => s.grade === g.id).map(s => s.no), [...Array(SKULLS.filter(s => s.grade === g.id).length)].map((_, i) => i + 1));
});
test('marks', () => {
  assert.deepEqual(ids(s => s.mark === '★'), ['guan-yu', 'hercules', 'king-arthur', 'spartan', 'thor']);
  assert.deepEqual(ids(s => s.mark === '◆'), ['davy-jones', 'dominator', 'grave-digger', 'stone-monkey']);
});
test('fixed skills sit in first slot of every build', () => {
  const fixed = { 'ghost-rider': '헬바이크', alchemist: '불안정한소환', 'rock-star': '앰프', samurai: '일섬', berserker: '악마의뼈' };
  assert.deepEqual(ids(s => s.fixedSkill), Object.keys(fixed).sort());
  for (const [id, name] of Object.entries(fixed)) {
    assert.equal(byId[id].fixedSkill, name);
    byId[id].builds.forEach(b => assert.deepEqual(b.slots[0], [name]));
  }
});
test('every skull except skul/prisoner has builds; no empty slots', () => {
  assert.deepEqual(ids(s => s.builds.length === 0), ['prisoner', 'skul']);
  SKULLS.forEach(s => s.builds.forEach(b => { assert.ok(b.slots.length > 0); b.slots.forEach(sl => assert.ok(sl.length > 0 && sl.every(Boolean))); }));
});
test('prisoner pool', () => {
  const p = byId.prisoner.pool;
  assert.deepEqual(p.map(g => [g.type, g.skills.length]), [['즉발형', 6], ['지속형', 3], ['증폭기', 2]]);
  const stars = Object.fromEntries(p.flatMap(g => g.skills).filter(k => k.stars).map(k => [k.name, k.stars]));
  assert.deepEqual(stars, { 장검: 1, 중형쇠뇌: 1, 피의검: 1, 도축기: 1, 이중자동쇠뇌: 2, '늑대 덫': 2 });
  assert.equal(SKULLS.filter(s => s.pool).length, 1);
});
test('spot checks', () => {
  assert.deepEqual(byId.werewolf.builds.map(b => b.label), ['물리', '마딜']);
  assert.deepEqual(byId.werewolf.builds[1].slots, [['사냥'], ['포식', '찢기']]);
  assert.deepEqual(byId.hunter.builds.map(b => b.label), ['추가타 빌드', '강타 빌드']);
  assert.deepEqual(byId.ghoul.builds[0].slots, [['흡입(물리증폭)'], ['크게썰기(공속증가)']]);
  assert.equal(byId.warrior.builds[1].notes.at(-1), '딜 자체는 혼신>>강타>제압=라이징');
  assert.deepEqual(SKULLS.filter(s => s.grade === 'legendary').map(s => s.id), ['grim-reaper', 'fighter', 'yaksha', 'arch-lich', 'gambler', 'davy-jones', 'king-arthur', 'dominator']);
  assert.deepEqual(byId.prisoner.pool[0].skills[5], { name: '피의검', value: '풀히트시 6타', stars: 1 });
  assert.deepEqual(byId.prisoner.pool[2].skills[0], { name: '선봉대의 방패', value: '증폭40%', stars: 0 });
  assert.deepEqual(byId.alchemist.builds[0].slots, [['불안정한소환'], ['마비', '화염', '오염물질']]);
  assert.ok(!byId.werewolf.builds[0].notes.includes('마딜'));
});
