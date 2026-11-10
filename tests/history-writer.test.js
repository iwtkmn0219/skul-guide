import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHistoryWriter } from '../public/js/history-writer.js';

function fakeHistory({ limit = Infinity } = {}) {
  const calls = [];
  const h = {
    state: null,
    calls,
    replaceState(state, _title, url) {
      if (calls.length >= limit) throw new Error('SecurityError: too many calls');
      calls.push(['replace', state, url]);
      h.state = state;
    },
    pushState(state, _title, url) {
      if (calls.length >= limit) throw new Error('SecurityError: too many calls');
      calls.push(['push', state, url]);
      h.state = state;
    },
  };
  return h;
}

function fakeTimers() {
  let next = 1;
  const pending = new Map();
  return {
    setTimeout(fn) { const id = next++; pending.set(id, fn); return id; },
    clearTimeout(id) { pending.delete(id); },
    run() { const fns = [...pending.values()]; pending.clear(); fns.forEach(fn => fn()); },
    get size() { return pending.size; },
  };
}

const setup = opts => {
  const history = fakeHistory(opts);
  const timers = fakeTimers();
  let writes = 0;
  const writer = createHistoryWriter({ history, timers, delay: 200, onWrite: () => { writes++; } });
  return { history, timers, writer, writes: () => writes };
};

test('replace calls are batched into one trailing write with the last url', () => {
  const { history, timers, writer, writes } = setup();
  for (let i = 0; i < 50; i++) writer.replace(`#sel=${i}`);
  assert.equal(history.calls.length, 0);
  assert.equal(timers.size, 1);
  timers.run();
  assert.deepEqual(history.calls, [['replace', null, '#sel=49']]);
  assert.equal(writes(), 1);
});

test('replace keeps the current history.state unless a state is given', () => {
  const { history, timers, writer } = setup();
  history.state = { detail: 2 };
  writer.replace('#a');
  timers.run();
  assert.deepEqual(history.calls.at(-1), ['replace', { detail: 2 }, '#a']);
  writer.replace('#b', null);
  timers.run();
  assert.deepEqual(history.calls.at(-1), ['replace', null, '#b']);
});

test('push flushes a pending replace first, then pushes immediately', () => {
  const { history, timers, writer, writes } = setup();
  writer.replace('#list', null);
  writer.push({ detail: 1 }, '#list');
  assert.deepEqual(history.calls, [['replace', null, '#list'], ['push', { detail: 1 }, '#list']]);
  assert.equal(timers.size, 0);
  assert.equal(writes(), 2);
});

test('flush writes now and only once; cancel drops the pending write', () => {
  const { history, timers, writer } = setup();
  writer.replace('#x');
  writer.flush();
  writer.flush();
  timers.run();
  assert.equal(history.calls.length, 1);
  writer.replace('#y');
  writer.cancel();
  timers.run();
  writer.flush();
  assert.equal(history.calls.length, 1);
});

test('history errors (browser rate limits) never throw', () => {
  const { history, timers, writer, writes } = setup({ limit: 0 });
  writer.replace('#a');
  assert.doesNotThrow(() => timers.run());
  assert.doesNotThrow(() => writer.push({ detail: 1 }, '#b'));
  assert.equal(history.calls.length, 0);
  assert.equal(writes(), 2);   // onWrite still refreshes the comparison value from the real history
});
