import { ITEMS_META, ITEM_GRADES, ENGRAVING_CATEGORIES, ITEMS, ENGRAVINGS } from './items.js';
import { escapeHtml } from './common.js';
import { filterItems, itemCountByEngraving, filterEngravings } from './item-filter.js';
import { DEFAULT_ITEM_STATE, parseItemHash, toItemHash } from './item-state.js';
import { renderItemList, renderEngravingCard, renderEngravingList } from './item-render.js';

const ENGRAVING_NAMES = ENGRAVINGS.map(e => e.name);
const COUNTS = itemCountByEngraving(ITEMS);
const byName = new Map(ENGRAVINGS.map(e => [e.name, e]));

const $ = sel => document.querySelector(sel);
const controls = $('nav.controls');
const views = $('.tabs.views');
const grades = $('.tabs.grades');
const engSelect = $('#eng');
const filters = $('.item-filters');
const queryInput = $('#q');
const count = $('#count');
const list = $('#list');

let state = { ...DEFAULT_ITEM_STATE };

function renderHeader() {
  const [main] = ITEMS_META.sources;
  $('#items-source').innerHTML =
    `정리: 나무위키 <a href="${escapeHtml(main.url)}" target="_blank" rel="noopener">「아이템과 각인」</a> 외 ${ITEMS_META.sources.length - 1}개 문서 · ${escapeHtml(ITEMS_META.retrieved)} 기준`;
  const links = ITEMS_META.sources
    .map(s => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">나무위키 「${escapeHtml(s.title)}」</a></li>`).join('');
  $('#items-credit').innerHTML =
    `<p>아이템·각인 정보: 나무위키 기여자, <a href="${escapeHtml(ITEMS_META.licenseUrl)}" target="_blank" rel="noopener">${escapeHtml(ITEMS_META.license)}</a>, ${escapeHtml(ITEMS_META.retrieved)} 기준. 출처 문서:</p>`
    + `<ul class="sources">${links}</ul>`;
  for (const g of ITEM_GRADES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.grade = g.id;
    button.innerHTML = `${escapeHtml(g.label)}<span class="n"></span>`;
    grades.append(button);
  }
  engSelect.insertAdjacentHTML('beforeend', ENGRAVING_CATEGORIES.map(category =>
    `<optgroup label="${escapeHtml(category)}">`
    + ENGRAVINGS.filter(e => e.category === category)
      .map(e => `<option value="${escapeHtml(e.name)}">${escapeHtml(e.name)}</option>`).join('')
    + '</optgroup>').join(''));
}

function syncControls() {
  for (const button of views.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.view === state.view));
  }
  for (const button of grades.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.grade === state.grade));
  }
  filters.hidden = state.view !== 'items';
  engSelect.value = state.eng;
  if (queryInput.value !== state.query) queryInput.value = state.query;
}

function render() {
  if (state.view === 'engravings') {
    const engravings = filterEngravings(ENGRAVINGS, state.query);
    list.innerHTML = renderEngravingList(engravings, COUNTS, { query: state.query });
    count.textContent = `${engravings.length}개 각인`;
    return;
  }
  const items = filterItems(ITEMS, state);
  const selected = byName.get(state.eng);
  const summary = selected
    ? `<section class="eng-summary">${renderEngravingCard(selected, COUNTS.get(selected.name) ?? 0, { itemsButton: false })}`
      + '<button type="button" class="clear-eng">각인 선택 해제</button></section>'
    : '';
  list.innerHTML = summary + renderItemList(items, { query: state.query, allItems: ITEMS });
  count.textContent = `${items.length}개 아이템`;
  // 등급 탭 숫자: 각인·검색 조건은 그대로 두고 등급만 바꿨을 때의 개수
  for (const button of grades.querySelectorAll('button')) {
    button.querySelector('.n').textContent = filterItems(ITEMS, { ...state, grade: button.dataset.grade }).length;
  }
}

function writeHash() {
  history.replaceState(null, '', toItemHash(state) || location.pathname + location.search);
}

function update(patch) {
  state = { ...state, ...patch };
  writeHash();
  syncControls();
  render();
}

function loadFromHash() {
  state = parseItemHash(location.hash, ENGRAVING_NAMES);
  syncControls();
  render();
}

renderHeader();
views.addEventListener('click', e => {
  const button = e.target.closest('button[data-view]');
  if (button) update({ view: button.dataset.view });
});
grades.addEventListener('click', e => {
  const button = e.target.closest('button[data-grade]');
  if (button) update({ grade: button.dataset.grade });
});
engSelect.addEventListener('change', () => update({ eng: engSelect.value }));
queryInput.addEventListener('input', () => update({ query: queryInput.value }));
list.addEventListener('click', e => {
  const engButton = e.target.closest('.chip.eng, .show-items');
  if (engButton) {
    update({ view: 'items', eng: engButton.dataset.eng, grade: 'all' });
    window.scrollTo({ top: 0 });
    return;
  }
  const link = e.target.closest('.link[data-query]');
  if (link) {
    update({ view: 'items', query: link.dataset.query, eng: '', grade: 'all' });
    return;
  }
  if (e.target.closest('.clear-eng')) update({ eng: '' });
});

// 섹션 소제목이 sticky 툴바 바로 아래에 붙도록 툴바 높이를 CSS 변수로 넘긴다.
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--toolbar-h', `${controls.offsetHeight}px`);
}).observe(controls);

window.addEventListener('hashchange', loadFromHash);
loadFromHash();
