import { SKULLS, GRADES, SOURCE } from './data.js';
import { filterSkulls } from './filter.js';
import { DEFAULT_STATE, parseHash, toHash } from './state.js';
import { escapeHtml, renderList, renderSkillDialog } from './render.js';
import { NAMU, SKILL_INFO } from './skills.js';

// public/img/{id}.png 를 넣은 뒤 true로 바꾸면 초상화를 표시한다.
const IMAGES = false;

const FILTER_KEYS = ['grade', 'mark', 'query'];
const byId = new Map(SKULLS.map(s => [s.id, s]));

const $ = sel => document.querySelector(sel);
const controls = $('nav.controls');
const tabs = $('.tabs');
const marks = $('.marks');
const queryInput = $('#q');
const count = $('#count');
const list = $('#list');
const dialog = $('#skill-dialog');

let state = { ...DEFAULT_STATE };
/** 지금 대화상자에 그려져 있는 스컬 id. 닫히면 ''. */
let dialogSkull = '';

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
    button.innerHTML = `${escapeHtml(g.label)}<span class="n"></span>`;
    tabs.append(button);
  }
}

function syncControls() {
  for (const button of tabs.querySelectorAll('button')) {
    const active = button.dataset.grade === state.grade;
    button.setAttribute('aria-pressed', String(active));
    // 좁은 화면에서 가로 스크롤되는 탭 줄: 선택된 탭이 잘려 보이지 않게 가로로만 옮긴다.
    if (active) {
      const tab = button.getBoundingClientRect();
      const row = tabs.getBoundingClientRect();
      if (tab.left < row.left || tab.right > row.right) tabs.scrollLeft += tab.left - row.left - (row.width - tab.width) / 2;
    }
  }
  for (const button of marks.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.mark === state.mark));
  }
  if (queryInput.value !== state.query) queryInput.value = state.query;
}

function render() {
  const skulls = filterSkulls(SKULLS, state);
  list.innerHTML = renderList(skulls, { images: IMAGES, query: state.query });
  count.textContent = `${skulls.length}개`;
  // 등급 탭 숫자: 표기·검색 조건은 그대로 두고 등급만 바꿨을 때의 개수
  for (const button of tabs.querySelectorAll('button')) {
    button.querySelector('.n').textContent = filterSkulls(SKULLS, { ...state, grade: button.dataset.grade }).length;
  }
}

function writeHash() {
  history.replaceState(null, '', toHash(state) || location.pathname + location.search);
}

function syncDialog() {
  const skull = byId.get(state.skull);
  const info = skull && SKILL_INFO[skull.name];
  if (!info) {
    if (state.skull) {
      state = { ...state, skull: '' };
      writeHash();
    }
    if (dialog.open) dialog.close();
    return;
  }
  if (dialogSkull !== skull.id) {
    dialog.innerHTML = renderSkillDialog(skull, info);
    dialogSkull = skull.id;
  }
  if (!dialog.open) dialog.showModal();
}

function update(patch) {
  const prev = state;
  state = { ...state, ...patch };
  writeHash();
  syncControls();
  if (FILTER_KEYS.some(k => prev[k] !== state[k])) render();
  syncDialog();
}

function loadFromHash() {
  state = parseHash(location.hash);
  syncControls();
  render();
  syncDialog();
}

function selectStage(button, focus = false) {
  for (const tab of dialog.querySelectorAll('[role="tab"]')) {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  for (const panel of dialog.querySelectorAll('[role="tabpanel"]')) {
    panel.hidden = panel.dataset.stage !== button.dataset.stage;
  }
  if (focus) button.focus();
}

function toggleNotes(button) {
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.previousElementSibling.classList.toggle('open', open);
  button.setAttribute('aria-expanded', String(open));
  button.textContent = open ? '접기' : `더보기 (+${button.dataset.more})`;
}

renderHeader();
tabs.addEventListener('click', e => {
  const button = e.target.closest('button[data-grade]');
  if (button) update({ grade: button.dataset.grade });
});
marks.addEventListener('click', e => {
  const button = e.target.closest('button[data-mark]');
  if (button) update({ mark: state.mark === button.dataset.mark ? 'all' : button.dataset.mark });
});
queryInput.addEventListener('input', () => update({ query: queryInput.value }));
list.addEventListener('click', e => {
  const open = e.target.closest('.open-skills');
  if (open) return update({ skull: open.dataset.skull });
  const more = e.target.closest('.more');
  if (more) toggleNotes(more);
});

dialog.addEventListener('click', e => {
  // 바깥(backdrop)을 누르면 이벤트 대상이 dialog 자신이 된다.
  if (e.target === dialog || e.target.closest('.close')) return dialog.close();
  const tab = e.target.closest('[role="tab"]');
  if (tab) selectStage(tab);
});
dialog.addEventListener('keydown', e => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const all = [...dialog.querySelectorAll('[role="tab"]')];
  const i = all.indexOf(tab);
  const next = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: all.length - 1 }[e.key];
  selectStage(all[(next + all.length) % all.length], true);
});
dialog.addEventListener('close', () => {
  const id = dialogSkull;
  dialogSkull = '';
  if (state.skull) update({ skull: '' });
  list.querySelector(`.open-skills[data-skull="${CSS.escape(id)}"]`)?.focus();
});

// 등급 소제목이 sticky 툴바 바로 아래에 붙도록 툴바 높이를 CSS 변수로 넘긴다.
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--toolbar-h', `${controls.offsetHeight}px`);
}).observe(controls);

window.addEventListener('hashchange', loadFromHash);
loadFromHash();
