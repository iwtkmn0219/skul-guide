// 한 화면 검색: 스컬·아이템·각인 결과, 탭별 목록과 개수, 자동 선택, 상세 안 링크 이동.
import { SKULLS, GRADES } from './data.js';
import { ITEMS, ENGRAVINGS, ITEM_GRADES, ENGRAVING_CATEGORIES } from './items.js';
import { matchesQuery } from './filter.js';
import { matchesItemQuery, matchesEngravingQuery, isRandomEngraving } from './item-filter.js';
import { normalize } from './common.js';

/** @typedef {'skull'|'item'|'eng'} Kind */
/** @typedef {{ kind: Kind, key: string, name: string, data: object }} Entry */
/** @typedef {import('./app-state.js').AppState} AppState */
/** @typedef {{ skulls: Entry[], items: Entry[], engravings: Entry[] }} Results */

export const TABS = ['all', 'skulls', 'items', 'engravings'];
export const TAB_LABELS = { all: '전체', skulls: '스컬', items: '아이템', engravings: '각인' };
export const MARK_LABELS = { '★': '신화 DLC', '◆': '마석 해금' };

const KIND_TABS = { skull: 'skulls', item: 'items', eng: 'engravings' };

export function keyOf(kind, data) {
  return `${kind}:${kind === 'skull' ? data.id : data.name}`;
}

export function tabOfKind(kind) {
  return KIND_TABS[kind];
}

/** 묶음 순서(등급·분류)로 안정 정렬한다. 같은 묶음 안은 데이터 순서다. */
function ordered(kind, list, groupOf, groups) {
  const rank = new Map(groups.map((g, i) => [g, i]));
  return list
    .map((data, i) => ({ data, i }))
    .sort((a, b) => (rank.get(groupOf(a.data)) - rank.get(groupOf(b.data))) || (a.i - b.i))
    .map(({ data }) => ({ kind, key: keyOf(kind, data), name: data.name, data }));
}

const SKULL_ENTRIES = ordered('skull', SKULLS, s => s.grade, GRADES.map(g => g.id));
const ITEM_ENTRIES = ordered('item', ITEMS, i => i.grade, ITEM_GRADES.map(g => g.id));
const ENG_ENTRIES = ordered('eng', ENGRAVINGS, e => e.category, ENGRAVING_CATEGORIES);
const BY_KEY = new Map([...SKULL_ENTRIES, ...ITEM_ENTRIES, ...ENG_ENTRIES].map(e => [e.key, e]));

/** @returns {Entry|null} 모르는 키, 랜덤 각인, 형식 오류는 null */
export function lookup(key) {
  if (typeof key !== 'string') return null;
  if (key.startsWith('eng:') && isRandomEngraving(key.slice(4))) return null;
  return BY_KEY.get(key) ?? null;
}

/** @returns {Results} 화면 순서의 검색 결과 */
export function search(query) {
  return {
    skulls: SKULL_ENTRIES.filter(e => matchesQuery(e.data, query)),
    items: ITEM_ENTRIES.filter(e => matchesItemQuery(e.data, query)),
    engravings: ENG_ENTRIES.filter(e => matchesEngravingQuery(e.data, query)),
  };
}

/** mark('all'|'★'|'◆')는 스컬 탭에만 적용한다. */
export function tabEntries(results, tab, mark) {
  if (tab === 'all') return [...results.skulls, ...results.items, ...results.engravings];
  if (tab === 'skulls') return mark === 'all' ? results.skulls : results.skulls.filter(e => e.data.mark === mark);
  return results[tab] ?? [];
}

export function tabCounts(results, mark) {
  const skulls = tabEntries(results, 'skulls', mark).length;
  return {
    all: results.skulls.length + results.items.length + results.engravings.length,
    skulls,
    items: results.items.length,
    engravings: results.engravings.length,
  };
}

/** 이름이 검색어와 맞는 첫 항목의 키. 없으면 첫 항목, 항목이 없으면 ''. */
export function autoPick(entries, query) {
  const q = normalize(query);
  const named = q ? entries.find(e => normalize(e.name).includes(q)) : undefined;
  return (named ?? entries[0])?.key ?? '';
}

/** reason: 'query'(검색어가 바뀜) | 'tab'(탭이나 ★/◆가 바뀜) */
export function chooseSelection({ entries, query, remembered, reason, auto }) {
  const pick = auto && normalize(query) !== '' && entries.length > 0
    && (reason === 'query' || !entries.some(e => e.key === remembered));
  return pick ? autoPick(entries, query) : remembered;
}

/** 그 각인이 붙은 아이템(중복 없이, 등급 순서). */
export function itemsOfEngraving(name) {
  return ITEM_ENTRIES.filter(e => e.data.engravings.includes(name));
}

/** 상세 안 링크로 key에 갈 때의 상태. @param {AppState} state @returns {AppState} */
export function jumpTo(state, key) {
  const kind = key.slice(0, key.indexOf(':'));
  const tab = state.tab === 'all' ? 'all' : tabOfKind(kind);
  const stays = tabEntries(search(state.query), tab, state.mark).some(e => e.key === key);
  return { tab, query: stays ? state.query : '', mark: state.mark, sel: key };
}
