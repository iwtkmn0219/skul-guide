// 한 화면 앱의 DOM 연결: 검색창, 탭, 목록·격자, 상세, 주소 해시.
import { NAMU } from './skills.js';
import { ITEMS_META } from './items.js';
import { escapeHtml } from './common.js';
import { IMAGES } from './images.js';
import { parseAppHash, toAppHash } from './app-state.js';
import { TABS, TAB_LABELS, search, tabEntries, tabCounts, lookup, jumpTo } from './search.js';
import { renderResults } from './view-list.js';
import { renderDetail } from './view-detail.js';

const $ = sel => document.querySelector(sel);
const queryInput = $('#q');
const tabsEl = $('.tabs');
const marksEl = $('.marks');
const statusEl = $('#status');
const resultsEl = $('#results');
const resultsPane = $('#results-pane');
const detailEl = $('#detail');
const detailPane = $('#detail-pane');

const isKnownKey = key => lookup(key) !== null;

/** @type {import('./app-state.js').AppState} */
let state = parseAppHash('', isKnownKey);
/** 탭별 마지막 선택 */
const remembered = { all: '', skulls: '', items: '', engravings: '' };

let results = search('');
let resultsQuery = '';
let listKey = null;     // 목록을 마지막으로 그린 tab|query|mark
let detailKey = null;   // 상세를 마지막으로 그린 sel|query
let historyToken = null; // 마지막으로 처리하거나 쓴 history 값

const tokenNow = () => location.hash + '|' + JSON.stringify(history.state);

function entryEl(key) {
  return [...resultsEl.querySelectorAll('.entry')].find(el => el.dataset.key === key) ?? null;
}

function writeHistory(push = false) {
  const url = toAppHash(state) || location.pathname + location.search;
  if (push) history.pushState(null, '', url);
  else history.replaceState(history.state, '', url);
  historyToken = tokenNow();
}

function currentResults() {
  if (resultsQuery !== state.query) {
    results = search(state.query);
    resultsQuery = state.query;
  }
  return results;
}

/** 목록을 다시 그리지 않고 선택 표시(aria-current)와 roving tabindex만 옮긴다. */
function syncSelectionMarks() {
  const entries = [...resultsEl.querySelectorAll('.entry')];
  const current = entries.find(el => el.dataset.key === state.sel) ?? null;
  for (const el of entries) {
    if (el === current) el.setAttribute('aria-current', 'true');
    else el.removeAttribute('aria-current');
    el.tabIndex = -1;
  }
  const focusable = current ?? entries[0];
  if (focusable) focusable.tabIndex = 0;
}

function renderControls() {
  const counts = tabCounts(currentResults(), state.mark);
  for (const button of tabsEl.querySelectorAll('button[data-tab]')) {
    const tab = button.dataset.tab;
    button.querySelector('.n').textContent = counts[tab];
    button.classList.toggle('zero', counts[tab] === 0);
    button.setAttribute('aria-pressed', String(tab === state.tab));
  }
  marksEl.hidden = state.tab !== 'skulls';
  for (const button of marksEl.querySelectorAll('button[data-mark]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mark === state.mark));
  }
  document.body.dataset.tab = state.tab;
  if (queryInput.value !== state.query) queryInput.value = state.query;
}

function renderList() {
  const key = `${state.tab}|${state.query}|${state.mark}`;
  if (key === listKey) {
    syncSelectionMarks();
    return;
  }
  listKey = key;
  const res = currentResults();
  resultsEl.innerHTML = renderResults({ tab: state.tab, results: res, mark: state.mark, query: state.query, sel: state.sel, images: IMAGES });
  statusEl.textContent = `${TAB_LABELS[state.tab]} ${tabEntries(res, state.tab, state.mark).length}개`;
}

function renderDetailPane() {
  const key = `${state.sel}|${state.query}`;
  if (key === detailKey) return;
  const selChanged = !detailKey || detailKey.slice(0, detailKey.lastIndexOf('|')) !== state.sel;
  detailKey = key;
  detailEl.innerHTML = renderDetail(lookup(state.sel), { query: state.query, images: IMAGES });
  if (selChanged) detailPane.scrollTop = 0;
}

function render() {
  renderControls();
  renderList();
  renderDetailPane();
}

/** 상태를 바꾸고 해시를 쓰고 필요한 부분을 다시 그린다. */
function update(patch, { push = false } = {}) {
  state = { ...state, ...patch };
  remembered[state.tab] = state.sel;
  writeHistory(push);
  render();
}

/** 선택만 바꾼다. 목록은 다시 그리지 않는다. */
function select(key) {
  state = { ...state, sel: key };
  remembered[state.tab] = state.sel;
  writeHistory(false);
  syncSelectionMarks();
  renderDetailPane();
}

function loadFromLocation() {
  historyToken = tokenNow();
  state = parseAppHash(location.hash, isKnownKey);
  remembered[state.tab] = state.sel;
  render();
}

function onHistoryChange() {
  if (tokenNow() === historyToken) return;   // popstate와 hashchange가 같이 오거나, 스스로 쓴 history
  loadFromLocation();
}

function goToTab(tab) {
  update({ tab, sel: remembered[tab] });
}

// ── 단계 탭(스킬 정보) ──
function selectStage(button, focus = false) {
  for (const tab of detailEl.querySelectorAll('[role="tab"]')) {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  for (const panel of detailEl.querySelectorAll('[role="tabpanel"]')) {
    panel.hidden = panel.dataset.stage !== button.dataset.stage;
  }
  if (focus) button.focus();
}

// ── 시작 ──
function buildChrome() {
  tabsEl.innerHTML = TABS.map(tab =>
    `<button type="button" data-tab="${tab}" aria-pressed="false">${TAB_LABELS[tab]}<span class="n"></span></button>`).join('');
  const sources = [{ ...NAMU, retrieved: NAMU.retrieved }, ...ITEMS_META.sources.map(s => ({ ...s, retrieved: ITEMS_META.retrieved }))];
  $('#namu-sources').innerHTML = sources.map(s =>
    `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">나무위키 「${escapeHtml(s.title)}」</a> · ${escapeHtml(s.retrieved)} 기준</li>`).join('');
  $('#namu-count').textContent = `나무위키 문서 ${sources.length}개`;
  // 휴대폰 상세 맨 끝에 둘 바닥 띠 복사본(id 중복 방지)
  const copy = $('footer.site').cloneNode(true);
  for (const el of [copy, ...copy.querySelectorAll('[id]')]) el.removeAttribute('id');
  $('.detail-foot').append(copy);
}

buildChrome();

queryInput.addEventListener('input', () => update({ query: queryInput.value }));

tabsEl.addEventListener('click', e => {
  const button = e.target.closest('button[data-tab]');
  if (button) goToTab(button.dataset.tab);
});

marksEl.addEventListener('click', e => {
  const button = e.target.closest('button[data-mark]');
  if (button) update({ mark: state.mark === button.dataset.mark ? 'all' : button.dataset.mark });
});

resultsEl.addEventListener('click', e => {
  const toTab = e.target.closest('.to-tab');
  if (toTab) return goToTab(toTab.dataset.tab);
  const entry = e.target.closest('.entry');
  if (entry) select(entry.dataset.key);
});

detailEl.addEventListener('click', e => {
  const jump = e.target.closest('.jump');
  if (jump) {
    update(jumpTo(state, jump.dataset.key), { push: true });
    entryEl(state.sel)?.scrollIntoView({ block: 'nearest' });
    $('#detail-title')?.focus({ preventScroll: true });
    return;
  }
  const tab = e.target.closest('[role="tab"]');
  if (tab) selectStage(tab);
});

detailEl.addEventListener('keydown', e => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  e.stopPropagation();
  const all = [...detailEl.querySelectorAll('[role="tab"]')];
  const i = all.indexOf(tab);
  const next = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: all.length - 1 }[e.key];
  selectStage(all[(next + all.length) % all.length], true);
});

window.addEventListener('popstate', onHistoryChange);
window.addEventListener('hashchange', onHistoryChange);

loadFromLocation();
// 처음 연 주소가 정규화와 다르면(예전 해시, 잘못된 값) 정리된 해시로 바꿔 둔다.
writeHistory(false);
