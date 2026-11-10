// 결과 목록(스컬·각인 줄)과 아이템 격자 HTML.
import { SOURCE, GRADES } from './data.js';
import { ITEM_GRADES, ENGRAVING_CATEGORIES } from './items.js';
import { isRandomEngraving } from './item-filter.js';
import { escapeHtml, highlight } from './common.js';
import { itemGlyph, itemImageUrl } from './images.js';
import { tabEntries, tabCounts, TABS, TAB_LABELS, MARK_LABELS } from './search.js';

/** @typedef {import('./search.js').Entry} Entry */

const SKULL_GRADE_LABEL = Object.fromEntries(GRADES.map(g => [g.id, g.label]));

/** 목록 줄의 대표 조합: 첫 빌드의 슬롯을 " + "로, 대안을 "/"로 잇는다. */
export function comboText(skull) {
  if (skull.builds.length === 0) return skull.pool ? '추천 표 참고' : '추천 없음';
  const first = skull.builds[0].slots.map(slot => slot.join('/')).join(' + ');
  return skull.builds.length > 1 ? `${first} · 빌드 ${skull.builds.length}` : first;
}

const markHtml = mark => mark
  ? `<span class="mark" title="${MARK_LABELS[mark]}"><span aria-hidden="true">${mark}</span><span class="sr-only">${MARK_LABELS[mark]}</span></span>`
  : '';

const DLC_HTML = '<span class="dlc" title="신화 DLC"><span aria-hidden="true">★</span><span class="sr-only">신화 DLC</span></span>';

function entryAttrs(classes, entry, ctx) {
  const focusable = entry.key === ctx.focusKey ? '0' : '-1';
  const current = entry.key === ctx.sel ? ' aria-current="true"' : '';
  return `type="button" class="entry ${classes}" data-key="${escapeHtml(entry.key)}" tabindex="${focusable}"${current}`;
}

function skullRow(entry, ctx, withGrade) {
  const s = entry.data;
  return `<button ${entryAttrs(`row grade-${s.grade}`, entry, ctx)}>`
    + '<span class="sq" aria-hidden="true"></span>'
    + `<span class="no">${s.no}</span>`
    + `<span class="nm">${highlight(s.name, ctx.query)}</span>`
    + markHtml(s.mark)
    + `<span class="combo">${highlight(comboText(s), ctx.query)}</span>`
    + (withGrade ? `<span class="gr">${escapeHtml(SKULL_GRADE_LABEL[s.grade])}</span>` : '')
    + '</button>';
}

export function engravingChip(name, query) {
  return isRandomEngraving(name)
    ? `<span class="chip random" title="무작위 각인">${highlight(name, query)}</span>`
    : `<span class="chip">${highlight(name, query)}</span>`;
}

function itemCell(entry, ctx) {
  const i = entry.data;
  const img = ctx.images ? `<img src="${escapeHtml(itemImageUrl(i.name))}" alt="" loading="lazy" onerror="this.remove()">` : '';
  return `<button ${entryAttrs(`cell grade-${i.grade}`, entry, ctx)}>`
    + `<span class="slot" aria-hidden="true">${escapeHtml(itemGlyph(i.name))}${img}</span>`
    + (i.dlc ? DLC_HTML : '')
    + `<span class="nm">${highlight(i.name, ctx.query)}</span>`
    + `<span class="engs">${i.engravings.map(n => engravingChip(n, ctx.query)).join('')}</span>`
    + '</button>';
}

function engRow(entry, ctx) {
  const e = entry.data;
  return `<button ${entryAttrs('row eng', entry, ctx)}>`
    + `<span class="nm">${highlight(e.name, ctx.query)}</span>`
    + `<span class="mod">${e.moddable ? '개조 가능' : '개조 불가'}</span>`
    + '</button>';
}

/** 묶음 순서대로 [묶음 id, 항목들]. 빈 묶음은 뺀다. */
function groupBy(entries, groupOf, ids) {
  return ids.map(id => [id, entries.filter(e => groupOf(e) === id)]).filter(([, list]) => list.length > 0);
}

const count = n => ` <span class="n">${n}</span>`;

function sourceLine() {
  return `<p class="list-source"><a href="${escapeHtml(SOURCE.url)}" target="_blank" rel="noopener">디시 스컬 갤러리 「${escapeHtml(SOURCE.title)}」</a>`
    + ` · ${escapeHtml(SOURCE.author)} · 수정 ${escapeHtml(SOURCE.updated.join(', '))} · ${escapeHtml(SOURCE.headline)}</p>`;
}

function skullGroups(entries, ctx, tag) {
  return groupBy(entries, e => e.data.grade, GRADES.map(g => g.id)).map(([id, list]) =>
    `<section class="group"><${tag} class="sub grade-${id}">${escapeHtml(SKULL_GRADE_LABEL[id])}${count(list.length)}</${tag}>`
    + `<div class="rows">${list.map(e => skullRow(e, ctx, false)).join('')}</div></section>`).join('');
}

function itemGroups(entries, ctx, tag, wrap) {
  return groupBy(entries, e => e.data.grade, ITEM_GRADES.map(g => g.id)).map(([id, list]) => {
    const label = ITEM_GRADES.find(g => g.id === id).label;
    const body = `<${tag} class="sub grade-${id}">${escapeHtml(label)}${count(list.length)}</${tag}>`
      + `<div class="grid">${list.map(e => itemCell(e, ctx)).join('')}</div>`;
    return wrap ? `<section class="group">${body}</section>` : body;
  }).join('');
}

function engGroups(entries, ctx) {
  return groupBy(entries, e => e.data.category, ENGRAVING_CATEGORIES).map(([category, list]) =>
    `<section class="group"><h2 class="sub">${escapeHtml(category)}${count(list.length)}</h2>`
    + `<div class="rows">${list.map(e => engRow(e, ctx)).join('')}</div></section>`).join('');
}

function kindGroup(label, list, body) {
  return list.length ? `<section class="kind-group"><h2 class="kind-head">${label}${count(list.length)}</h2>${body}</section>` : '';
}

function emptyHtml(tab, results, mark) {
  const counts = tabCounts(results, mark);
  const others = TABS.filter(t => t !== 'all' && t !== tab && counts[t] > 0);
  const hint = tab !== 'all' && others.length
    ? '<p class="empty-hint">다른 탭에 결과가 있습니다. '
      + others.map(t => `<button type="button" class="to-tab" data-tab="${t}">${TAB_LABELS[t]} ${counts[t]}</button>`).join(' ')
      + '</p>'
    : '';
  return '<p class="empty">검색 결과가 없습니다.</p>' + hint;
}

/**
 * @param {{ tab: string, results: import('./search.js').Results, mark: string, query: string, sel: string, images: boolean }} opts
 */
export function renderResults({ tab, results, mark, query, sel, images }) {
  const entries = tabEntries(results, tab, mark);
  const head = tab === 'skulls' ? sourceLine() : '';
  if (entries.length === 0) return head + emptyHtml(tab, results, mark);
  // roving tabindex: 고른 항목이 목록에 있으면 그 항목, 없으면 첫 항목만 Tab으로 들어온다.
  const focusKey = entries.some(e => e.key === sel) ? sel : entries[0].key;
  const ctx = { query, sel, images, focusKey };
  if (tab === 'skulls') return head + skullGroups(entries, ctx, 'h2');
  if (tab === 'items') return itemGroups(entries, ctx, 'h2', true);
  if (tab === 'engravings') return engGroups(entries, ctx);
  return kindGroup('스컬', results.skulls, `<div class="rows">${results.skulls.map(e => skullRow(e, ctx, true)).join('')}</div>`)
    + kindGroup('아이템', results.items, itemGroups(results.items, ctx, 'h3', false))
    + kindGroup('각인', results.engravings, `<div class="rows">${results.engravings.map(e => engRow(e, ctx)).join('')}</div>`);
}
