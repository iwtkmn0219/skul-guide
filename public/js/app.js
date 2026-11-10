// 한 화면 앱의 DOM 연결: 검색창, 탭, 목록·격자, 상세, 주소 해시.
import { NAMU } from './skills.js';
import { ITEMS_META } from './items.js';
import { escapeHtml } from './common.js';
import { IMAGES } from './images.js';
import { parseAppHash, toAppHash } from './app-state.js';
import { TABS, TAB_LABELS, search, tabEntries, tabCounts, lookup, jumpTo, chooseSelection, tabSelection } from './search.js';
import { nextIndex } from './keynav.js';
import { renderResults } from './view-list.js';
import { renderDetail } from './view-detail.js';
import { createHistoryWriter } from './history-writer.js';
import { keepFocus } from './focus-keep.js';

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
// CSS와 같은 경계(범위 문법이라 760과 761 사이 소수점 폭에도 빈틈이 없다)
const desktop = matchMedia('(width > 760px)');

/** @type {import('./app-state.js').AppState} */
let state = parseAppHash('', isKnownKey);
/** 탭별 마지막 선택 */
const remembered = { all: '', skulls: '', items: '', engravings: '' };
/** 지금 탭의 기억을 갱신한다. 빈 선택은 기억을 지우지 않는다(결과가 다시 생기면 그 항목으로 돌아가게). */
const rememberSel = () => { if (state.sel) remembered[state.tab] = state.sel; };

let results = search('');
let resultsQuery = '';
let listKey = null;      // 목록을 마지막으로 그린 [tab, query, mark]
let detailKey = null;    // 상세를 마지막으로 그린 [sel, query]
let detailSel = null;    // 상세를 마지막으로 그린 sel(바뀌면 상세 스크롤을 맨 위로)
let historyToken = null; // 마지막으로 처리하거나 쓴 history 값

// 비교 기준은 구분자 없는 JSON으로 만든다(검색어에 '|' 등이 있어도 섞이지 않게).
const tokenNow = () => JSON.stringify([location.hash, history.state]);
const writer = createHistoryWriter({ history, delay: 200, onWrite: () => { historyToken = tokenNow(); } });

function entryEl(key) {
  return [...resultsEl.querySelectorAll('.entry')].find(el => el.dataset.key === key) ?? null;
}

const hashUrl = () => toAppHash(state) || location.pathname + location.search;

/** push면 바로 한 칸 쌓는다(pushState의 상태는 pushedState). 아니면 지금 칸의 주소를 바꾼다(모아서 씀). */
function writeHistory(push = false, pushedState = null) {
  if (push) writer.push(pushedState, hashUrl());
  else writer.replace(hashUrl());
}

// ── 휴대폰 상세 덮개 ──
const detailDepth = () => (Number.isInteger(history.state?.detail) ? history.state.detail : 0);
const phoneOverlay = () => !desktop.matches && document.body.classList.contains('detail-open');

/** 휴대폰에서 상세가 덮고 있을 때만 뒤쪽 화면을 inert로 둔다. */
function syncOverlay() {
  const on = phoneOverlay();
  for (const el of [$('.site-head'), resultsPane, $('body > footer.site')]) el.inert = on;
}

function setDetailOpen(open) {
  document.body.classList.toggle('detail-open', open);
  syncOverlay();
}

/** 휴대폰: 항목을 고르고 상세를 연다. 뒤로 가기로 목록에 돌아오도록 history를 한 칸 쌓는다. */
function openDetail(key) {
  state = { ...state, sel: key };
  rememberSel();
  syncSelectionMarks();
  renderDetailPane();
  detailPane.scrollTop = 0;
  writer.replace(hashUrl(), null);   // 돌아왔을 때 그 줄이 골라져 있도록. 아래 push가 먼저 써 준다.
  writeHistory(true, { detail: 1 });
  setDetailOpen(true);
  $('#detail-title')?.focus({ preventScroll: true });
}

/** 상세 덮개를 닫고 고른 줄로 포커스와 스크롤을 돌려놓는다. */
function closeDetail() {
  setDetailOpen(false);
  const el = entryEl(state.sel);
  if (el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center' });
  }
}

/** "◀ 목록"과 Esc: 상세를 연 뒤 쌓은 칸만큼 한 번에 돌아간다. */
function backToList() {
  const depth = detailDepth();
  writer.flush();
  if (depth > 0) history.go(-depth);
  else closeDetail();
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
  const key = JSON.stringify([state.tab, state.query, state.mark]);
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
  const key = JSON.stringify([state.sel, state.query]);
  if (key === detailKey) return;
  const selChanged = detailSel !== state.sel;
  detailKey = key;
  detailSel = state.sel;
  detailEl.innerHTML = renderDetail(lookup(state.sel), { query: state.query, images: IMAGES });
  if (selChanged) detailPane.scrollTop = 0;
}

/** 다시 그리기로 포커스가 있던 요소가 사라지면 목록은 고른 항목(없으면 첫 항목), 상세는 제목으로 돌려준다. */
const FOCUS_REGIONS = [
  { region: resultsEl, target: () => entryEl(state.sel) ?? resultsEl.querySelector('.entry') },
  { region: detailEl, target: () => $('#detail-title') },
];

function render() {
  keepFocus(FOCUS_REGIONS, () => document.activeElement, () => {
    renderControls();
    renderList();
    renderDetailPane();
  });
}

/** 상태를 바꾸고 해시를 쓰고 필요한 부분을 다시 그린다. */
function update(patch, { push = false, pushedState = null } = {}) {
  state = { ...state, ...patch };
  rememberSel();
  render();   // 화면을 먼저 그리고 주소를 쓴다
  writeHistory(push, pushedState);
}

/** 선택만 바꾼다. 목록은 다시 그리지 않는다. */
function select(key) {
  state = { ...state, sel: key };
  rememberSel();
  syncSelectionMarks();
  renderDetailPane();
  writeHistory(false);
}

function loadFromLocation() {
  historyToken = tokenNow();
  state = parseAppHash(location.hash, isKnownKey);
  rememberSel();
  render();
  const wasOpen = document.body.classList.contains('detail-open');
  const open = detailDepth() >= 1;
  if (wasOpen && !open && !desktop.matches) {
    closeDetail();
  } else {
    setDetailOpen(open);
    // 휴대폰에서 '앞으로'로 상세가 다시 열리면 덮개 안으로 포커스를 옮긴다(뒤쪽은 inert).
    if (!wasOpen && open && !desktop.matches) $('#detail-title')?.focus({ preventScroll: true });
  }
}

function onHistoryChange() {
  if (tokenNow() === historyToken) return;   // popstate와 hashchange가 같이 오거나, 스스로 쓴 history
  writer.cancel();   // 다른 칸으로 왔으므로 이전 칸에 쓰려던 주소는 버린다
  loadFromLocation();
}

/** 데스크톱에서 검색어·탭·거르기가 바뀌면 결과에 맞춰 고른다. 포커스는 옮기지 않는다. */
function autoSelect(reason) {
  const key = chooseSelection({
    entries: tabEntries(currentResults(), state.tab, state.mark),
    query: state.query,
    remembered: remembered[state.tab],
    reason,
    auto: desktop.matches,
  });
  if (key !== state.sel) select(key);
  if (key) entryEl(key)?.scrollIntoView({ block: 'nearest' });
}

/** 탭을 고르면 그 탭에서 전에 고른 항목(목록에 없으면 첫 항목)을 고르고 포커스를 준다. 목록이 비면 선택을 비우고 포커스는 탭 버튼에 둔다. */
function goToTab(tab) {
  const key = tabSelection(tabEntries(currentResults(), tab, state.mark), remembered[tab]);
  update({ tab, sel: key });   // 다시 그리기의 포커스 복원이 먼저 끝난다
  if (!key) return;
  resultsPane.scrollTop = 0;
  const el = entryEl(key);
  if (el) {
    el.focus();
    el.scrollIntoView({ block: 'nearest' });
  }
}

/** 목록의 항목을 고르고 포커스를 준다. */
function selectAndFocus(el) {
  select(el.dataset.key);
  el.focus();
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

queryInput.addEventListener('input', () => {
  update({ query: queryInput.value });
  autoSelect('query');
});

queryInput.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown') return;
  const el = entryEl(state.sel) ?? resultsEl.querySelector('.entry');
  if (!el) return;
  e.preventDefault();
  selectAndFocus(el);
});

resultsEl.addEventListener('keydown', e => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
  const el = e.target.closest('.entry');
  if (!el) return;
  const entries = [...resultsEl.querySelectorAll('.entry')];
  const current = entries.indexOf(el);
  // 고른 항목이 목록에 없을 때 포커스가 있는 첫 항목에서는, 방향키가 먼저 그 항목을 고른다.
  if (el.dataset.key !== state.sel && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    selectAndFocus(el);
    return;
  }
  const boxes = entries.map(x => x.getBoundingClientRect());
  const next = nextIndex(boxes, entries.map(x => x.classList.contains('cell')), current, e.key);
  if (next >= 0) {
    e.preventDefault();
    selectAndFocus(entries[next]);
  } else if (e.key === 'ArrowUp' && current === 0) {
    e.preventDefault();
    queryInput.focus();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && phoneOverlay()) {
    e.preventDefault();
    backToList();
    return;
  }
  if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const t = e.target;
    if (t instanceof Element && (t.closest('input, textarea, select') || t.isContentEditable)) return;
    e.preventDefault();
    queryInput.focus();
    queryInput.select();
    return;
  }
  if (e.key === 'Escape' && state.query) {
    e.preventDefault();
    update({ query: '' });
  }
});

tabsEl.addEventListener('click', e => {
  const button = e.target.closest('button[data-tab]');
  if (button) goToTab(button.dataset.tab);
});

marksEl.addEventListener('click', e => {
  const button = e.target.closest('button[data-mark]');
  if (!button) return;
  update({ mark: state.mark === button.dataset.mark ? 'all' : button.dataset.mark });
  autoSelect('tab');
});

resultsEl.addEventListener('click', e => {
  const toTab = e.target.closest('.to-tab');
  if (toTab) return goToTab(toTab.dataset.tab);
  const entry = e.target.closest('.entry');
  if (!entry) return;
  if (desktop.matches) select(entry.dataset.key);
  else openDetail(entry.dataset.key);
});

detailEl.addEventListener('click', e => {
  const jump = e.target.closest('.jump');
  if (jump) {
    // 휴대폰 상세 안에서는 쌓은 칸 수를 세어 "◀ 목록"이 한 번에 돌아가게 한다.
    const pushed = phoneOverlay() ? { detail: detailDepth() + 1 } : null;
    update(jumpTo(state, jump.dataset.key), { push: true, pushedState: pushed });
    setDetailOpen(detailDepth() >= 1);
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

$('.back').addEventListener('click', backToList);
desktop.addEventListener('change', syncOverlay);

window.addEventListener('popstate', onHistoryChange);
// 떠나거나 숨겨질 때 대기 중인 주소를 바로 쓴다(새로고침·공유 시 최신 상태).
window.addEventListener('pagehide', () => writer.flush());
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') writer.flush(); });
window.addEventListener('hashchange', onHistoryChange);

loadFromLocation();
// 휴대폰은 화면 자판이 목록을 가리므로 처음에 검색창에 포커스를 주지 않는다.
if (desktop.matches) queryInput.focus();
// 처음 연 주소가 정규화와 다르면(예전 해시, 잘못된 값) 정리된 해시로 바꿔 둔다.
writeHistory(false);
