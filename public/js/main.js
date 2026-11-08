import { SKULLS, GRADES, SOURCE } from './data.js';
import { filterSkulls } from './filter.js';
import { DEFAULT_STATE, parseHash, toHash } from './state.js';
import { escapeHtml, renderList } from './render.js';
import { NAMU } from './skills.js';

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
  $('#namu-credit').innerHTML =
    `스킬 정보: <a href="${escapeHtml(NAMU.url)}" target="_blank" rel="noopener">나무위키 「${escapeHtml(NAMU.title)}」</a>` +
    ` (나무위키 기여자, <a href="${escapeHtml(NAMU.licenseUrl)}" target="_blank" rel="noopener">${escapeHtml(NAMU.license)}</a>, ${escapeHtml(NAMU.retrieved)} 기준).`;
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

// 단계 탭: 같은 카드의 .skill-detail 안에서만 선택을 바꾼다. 목록을 다시 그리면 기본 단계로 돌아간다.
function selectStage(button) {
  const detail = button.closest('.skill-detail');
  const stage = button.dataset.stage;
  for (const tab of detail.querySelectorAll('.stage-tabs button')) {
    tab.setAttribute('aria-selected', String(tab === button));
  }
  for (const panel of detail.querySelectorAll('.stage')) {
    panel.hidden = panel.dataset.stage !== stage;
  }
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
list.addEventListener('click', e => {
  const button = e.target.closest('.stage-tabs button[data-stage]');
  if (button) selectStage(button);
});
markSelect.addEventListener('change', () => update({ mark: markSelect.value }));
queryInput.addEventListener('input', () => update({ query: queryInput.value }));
window.addEventListener('hashchange', loadFromHash);
loadFromHash();
