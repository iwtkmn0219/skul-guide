import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_APP_STATE, parseAppHash, toAppHash, fromSkillsPage, fromItemsPage,
} from '../public/js/app-state.js';
import { lookup } from '../public/js/search.js';

const known = k => lookup(k) !== null;

test('empty hash → defaults; default → empty hash', () => {
  for (const h of ['', '#']) assert.deepEqual(parseAppHash(h, known), DEFAULT_APP_STATE);
  assert.equal(toAppHash(DEFAULT_APP_STATE), '');
});

test('non-default state always writes tab first', () => {
  assert.equal(toAppHash({ ...DEFAULT_APP_STATE, query: '칼레온' }), '#tab=all&q=%EC%B9%BC%EB%A0%88%EC%98%A8');
});

test('round-trip', () => {
  const s = { tab: 'skulls', query: '사냥 + 도약', mark: '★', sel: 'skull:werewolf' };
  assert.deepEqual(parseAppHash(toAppHash(s), known), s);
  const i = { tab: 'all', query: '', mark: 'all', sel: 'item:영원의 뼈: 광란' };
  assert.deepEqual(parseAppHash(toAppHash(i), known), i);
});

test('invalid values fall back', () => {
  assert.deepEqual(parseAppHash('#tab=nope&mark=x&sel=item:없는것', known), DEFAULT_APP_STATE);
  assert.equal(parseAppHash('#tab=items&sel=skull:werewolf', known).sel, '');   // 탭과 종류가 다름
  assert.equal(parseAppHash('#tab=all&sel=eng:보물', known).sel, 'eng:보물');
  assert.doesNotThrow(() => parseAppHash('#tab=all&q=%E0%A4%A', known));
});

test('root-era skill hashes (no tab) open the skull tab', () => {
  assert.deepEqual(parseAppHash('#grade=unique&q=%EC%A3%84%EC%88%98', known), { tab: 'skulls', query: '죄수', mark: 'all', sel: '' });
  assert.equal(parseAppHash('#skull=prisoner', known).sel, 'skull:prisoner');
  assert.equal(parseAppHash('#mark=%E2%98%85', known).mark, '★');
  assert.deepEqual(parseAppHash('#foo=1', known), DEFAULT_APP_STATE);
});

test('/skills/ and /items/ hashes', () => {
  assert.equal(toAppHash(fromSkillsPage('')), '#tab=skulls');
  assert.equal(fromSkillsPage('#skull=Bad!').sel, '');
  assert.equal(toAppHash(fromItemsPage('')), '#tab=items');
  assert.deepEqual(fromItemsPage('#view=engravings&q=%EB%8F%85'), { tab: 'engravings', query: '독', mark: 'all', sel: '' });
  assert.deepEqual(fromItemsPage('#grade=legendary&eng=%EB%B3%B4%EB%AC%BC'), { tab: 'engravings', query: '', mark: 'all', sel: 'eng:보물' });
  assert.deepEqual(parseAppHash(toAppHash(fromItemsPage('#eng=%EB%9E%9C%EB%8D%A4A')), known), { tab: 'engravings', query: '', mark: 'all', sel: '' });
});
