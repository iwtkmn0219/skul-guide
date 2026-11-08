import { SKULLS, GRADES, SOURCE } from './data.js';
import { filterSkulls } from './filter.js';
import { DEFAULT_STATE, parseHash, toHash } from './state.js';
import { escapeHtml, renderList } from './render.js';

// public/img/{id}.png 를 넣은 뒤 true로 바꾸면 초상화를 표시한다.
const IMAGES = false;

const $ = sel => document.querySelector(sel);
const tabs = $('.tabs');
const markSelect = $('#mark');
const queryInput = $('#q');
const count = $('#count');
const list = $('#list');

let state = { ...DEFAULT_STATE };

function renderHeader() {
  $('#source').innerHTML =
    `원문: <a href="${escapeHtml(SOURCE.url)}" target="_blank" rel="noopener">디시 스컬 갤러리 · ${escapeHtml(SOURCE.author)}</a>` +
    ` · 수정 ${escapeHtml(SOURCE.updated.join(', '))}`;
  $('#headline').textContent = SOURCE.headline;
  for (const g of GRADES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.grade = g.id;
    button.textContent = g.label;
    tabs.append(button);
  }
}

function syncControls() {
  for (const button of tabs.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.grade === state.grade));
  }
  markSelect.value = state.mark;
  if (queryInput.value !== state.query) queryInput.value = state.query;
}

function render() {
  const skulls = filterSkulls(SKULLS, state);
  list.innerHTML = renderList(skulls, { images: IMAGES });
  count.textContent = `${skulls.length}개`;
}

function update(patch) {
  state = { ...state, ...patch };
  history.replaceState(null, '', toHash(state) || location.pathname + location.search);
  syncControls();
  render();
}

function loadFromHash() {
  state = parseHash(location.hash);
  syncControls();
  render();
}

renderHeader();
tabs.addEventListener('click', e => {
  const button = e.target.closest('button[data-grade]');
  if (button) update({ grade: button.dataset.grade });
});
markSelect.addEventListener('change', () => update({ mark: markSelect.value }));
queryInput.addEventListener('input', () => update({ query: queryInput.value }));
window.addEventListener('hashchange', loadFromHash);
loadFromHash();
