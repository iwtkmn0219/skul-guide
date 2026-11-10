// 주소 기록: replaceState는 잠깐 모았다가 한 번에 쓰고, pushState는 바로 쓴다.
// 브라우저는 짧은 시간에 history를 너무 많이 바꾸면 막는다(Firefox, Safari는 예외를 던진다).

/**
 * @param {{ history: History, delay?: number, timers?: { setTimeout: Function, clearTimeout: Function }, onWrite?: () => void }} options
 *   onWrite: 실제로 쓴 뒤(실패해도) 부른다. 비교 기준 값을 갱신하는 데 쓴다.
 */
export function createHistoryWriter({ history, delay = 200, timers = globalThis, onWrite = () => {} }) {
  let timer = null;
  /** @type {{ url: string, state: unknown, keepState: boolean } | null} */
  let pending = null;

  function call(method, state, url) {
    try {
      history[method](state, '', url);
    } catch {
      // 빈도 제한 등으로 막혀도 화면은 이미 그렸으므로 그대로 둔다. 다음 쓰기에서 따라잡는다.
    }
    onWrite();
  }

  function clearTimer() {
    if (timer !== null) timers.clearTimeout(timer);
    timer = null;
  }

  function flush() {
    clearTimer();
    if (!pending) return;
    const { url, state, keepState } = pending;
    pending = null;
    call('replaceState', keepState ? history.state : state, url);
  }

  return {
    /** 지금 칸의 주소를 바꾼다(모아서 씀). state를 주지 않으면 그때의 history.state를 유지한다. */
    replace(url, ...rest) {
      pending = { url, state: rest[0], keepState: rest.length === 0 };
      clearTimer();
      timer = timers.setTimeout(flush, delay);
    },
    /** 한 칸 쌓는다. 대기 중인 replace를 먼저 쓴다. */
    push(state, url) {
      flush();
      call('pushState', state, url);
    },
    flush,
    /** 대기 중인 replace를 버린다(뒤로 가기 등으로 다른 칸에 왔을 때). */
    cancel() {
      clearTimer();
      pending = null;
    },
  };
}
