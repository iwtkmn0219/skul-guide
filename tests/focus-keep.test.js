import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keepFocus } from '../public/js/focus-keep.js';

// 아주 작은 가짜 DOM: contains는 소속 영역으로, focus는 doc.active를 바꾼다.
function fakeDoc() {
  const doc = { active: null };
  const el = (name, region = null) => ({
    name,
    region,
    focused: null,
    focus(opts) { doc.active = this; this.focused = opts; },
  });
  const region = name => ({ name, contains: x => !!x && x.region === name });
  return { doc, el, region };
}

test('focus returns to the region target when the focused element was redrawn away', () => {
  const { doc, el, region } = fakeDoc();
  const list = region('list');
  const row = el('row', 'list');
  const selected = el('selected', 'list');
  doc.active = row;
  keepFocus([{ region: list, target: () => selected }], () => doc.active, () => { doc.active = el('body'); });
  assert.equal(doc.active, selected);
  assert.deepEqual(selected.focused, { preventScroll: true });
});

test('nothing moves when focus was outside every redrawn region', () => {
  const { doc, el, region } = fakeDoc();
  const input = el('input', 'head');
  doc.active = input;
  const target = el('selected', 'list');
  keepFocus([{ region: region('list'), target: () => target }], () => doc.active, () => {});
  assert.equal(doc.active, input);
  assert.equal(target.focused, null);
});

test('nothing moves when focus is still inside the region after the redraw', () => {
  const { doc, el, region } = fakeDoc();
  const row = el('row', 'list');
  doc.active = row;
  const target = el('selected', 'list');
  keepFocus([{ region: region('list'), target: () => target }], () => doc.active, () => {});
  assert.equal(doc.active, row);
});

test('the matching region is used, and a missing target is skipped safely', () => {
  const { doc, el, region } = fakeDoc();
  const title = el('title', 'detail');
  doc.active = el('link', 'detail');
  keepFocus([
    { region: region('list'), target: () => null },
    { region: region('detail'), target: () => title },
  ], () => doc.active, () => { doc.active = el('body'); });
  assert.equal(doc.active, title);
  doc.active = el('row', 'list');
  assert.doesNotThrow(() => keepFocus([{ region: region('list'), target: () => null }], () => doc.active, () => { doc.active = el('body'); }));
});
