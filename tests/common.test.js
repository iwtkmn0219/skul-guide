import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlight } from '../public/js/common.js';

test('highlight wraps normalized matches in <mark>', () => {
  assert.equal(highlight('보급형 칼레온 검', '칼레온'), '보급형 <mark>칼레온</mark> 검');
  assert.equal(highlight('스켈레톤-검', '톤검'), '스켈레<mark>톤-검</mark>');
  assert.equal(highlight('ABC', 'b'), 'A<mark>B</mark>C');
  assert.equal(highlight('aXaXa', 'a'), '<mark>a</mark>X<mark>a</mark>X<mark>a</mark>');
  assert.equal(highlight('a<b', '<'), 'a<mark>&lt;</mark>b');
  assert.equal(highlight('a&b', ''), 'a&amp;b');
  assert.equal(highlight('없음', 'zz'), '없음');
});
