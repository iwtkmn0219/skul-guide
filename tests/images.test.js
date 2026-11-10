import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../public/js/items.js';
import { IMAGES, itemGlyph, itemImageFile, itemImageUrl, skullImageUrl } from '../public/js/images.js';

test('glyph is the first letter of the last word, without 흉조:', () => {
  const cases = { '칼레온 계급장': '계', '보급형 칼레온 검': '검', '흉조: 월식': '월', '영원의 뼈: 광란': '광', '고통 & 절망': '절' };
  for (const [name, g] of Object.entries(cases)) assert.equal(itemGlyph(name), g, name);
});

test('image file names are filesystem-safe and unique', () => {
  assert.equal(itemImageFile('영원의 뼈: 광란'), '영원의 뼈 광란.png');
  assert.equal(itemImageFile('흉조: 월식'), '흉조 월식.png');
  assert.equal(new Set(ITEMS.map(i => itemImageFile(i.name))).size, 258);
  assert.equal(itemImageUrl('고통 & 절망'), 'img/items/' + encodeURIComponent('고통 & 절망.png'));
  assert.equal(skullImageUrl('werewolf'), 'img/skulls/werewolf.png');
  assert.equal(IMAGES, false);
});
