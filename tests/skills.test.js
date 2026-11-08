import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKULLS } from '../public/js/data.js';
import { SKILL_INFO, NAMU } from '../public/js/skills.js';

const info = name => SKILL_INFO[name];
const regular = name => info(name).stages.filter(s => s.kind === 'stage');
const last = name => regular(name).at(-1);

test('every guide skull has skill info', () => {
  for (const s of SKULLS) assert.ok(info(s.name), s.name);
});
test('regular stage count follows grade', () => {
  const expected = { common: 4, rare: 3, unique: 2, legendary: 1 };
  for (const s of SKULLS.filter(s => s.id !== 'skul')) assert.equal(regular(s.name).length, expected[s.grade], s.name);
  assert.deepEqual(info('스컬(리틀본)').stages.map(s => s.label), ['기본']);
});
test('stage labels and forms', () => {
  assert.deepEqual(regular('웨어울프').map(s => s.label), ['노말', '레어', '유니크', '레전더리']);
  assert.equal(last('웨어울프').form, '영원의 웨어울프');
  const forms = info('버서커').stages.filter(s => s.kind === 'form');
  assert.deepEqual(forms.map(s => s.label), ['데빌']);
  assert.equal(forms[0].skills[0].name, '악마의 울음');
});
test('type row after table (노예)', () => {
  assert.deepEqual(regular('노예').map(s => s.skills.length), [4, 4, 4, 4]);
});
test('variants', () => {
  const harvest = last('그림리퍼').skills.find(k => k.name === '수확');
  assert.equal(harvest.cooldown, '15초');
  assert.deepEqual(harvest.variants.map(v => v.cooldown), ['44초', '44초']);
  const charge = last('리빙아머').skills.find(k => k.name === '소울 차지');
  assert.deepEqual(charge.variants.map(v => v.cooldown), ['13초', '13초']);
});
test('irregular counts', () => {
  assert.equal(last('닌자').skills.length, 8);
  assert.equal(last('죄수').skills.length, 19);
  assert.ok(last('죄수').skills.some(k => k.name === '이중 자동 쇠뇌Ⅱ~Ⅵ'));
  assert.equal(last('웨어울프').swap.name, '야생의 질주');
  assert.ok(last('웨어울프').passive.length >= 1);
});
test('no footnote markers, no empty lines', () => {
  const lines = Object.values(SKILL_INFO).flatMap(i => i.stages.flatMap(s =>
    [...s.passive, ...(s.swap?.effect ?? []), ...s.skills.flatMap(k => [k.name, ...k.effect, ...k.variants.flatMap(v => v.effect)])]));
  assert.ok(lines.every(l => l && !/\[\d+\]/.test(l)));
});
test('attribution metadata', () => {
  assert.equal(NAMU.license, 'CC BY-NC-SA 2.0 KR');
  assert.equal(NAMU.retrieved, '2026-11-08');
});
