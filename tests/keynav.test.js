import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextIndex } from '../public/js/keynav.js';

const row = top => ({ left: 0, top, bottom: top + 42 });
const cell = (left, top) => ({ left, top, bottom: top + 172 });
// 목록 줄 3개, 그 아래 3칸 격자(5칸)
const boxes = [row(0), row(42), row(84), cell(0, 200), cell(160, 200), cell(320, 200), cell(0, 384), cell(160, 384)];
const isCell = [false, false, false, true, true, true, true, true];
const n = (i, key) => nextIndex(boxes, isCell, i, key);

test('down/up move by visual row, keeping the column', () => {
  assert.equal(n(0, 'ArrowDown'), 1);
  assert.equal(n(2, 'ArrowDown'), 3);    // 목록 → 격자 첫 칸
  assert.equal(n(4, 'ArrowDown'), 7);    // 같은 열
  assert.equal(n(5, 'ArrowDown'), 7);    // 아래 줄에 열이 없으면 가장 가까운 칸
  assert.equal(n(7, 'ArrowDown'), -1);
  assert.equal(n(0, 'ArrowUp'), -1);
  assert.equal(n(4, 'ArrowUp'), 2);      // 격자 → 위 목록 줄
});

test('left/right only inside grids', () => {
  assert.equal(n(4, 'ArrowLeft'), 3);
  assert.equal(n(3, 'ArrowLeft'), -1);   // 앞이 목록 줄
  assert.equal(n(5, 'ArrowRight'), 6);   // 다음 줄로 이어짐
  assert.equal(n(7, 'ArrowRight'), -1);
  assert.equal(n(1, 'ArrowRight'), -1);  // 목록에서는 무시
});
