import { ITEM_GRADES, ENGRAVING_CATEGORIES } from './items.js';
import { escapeHtml, normalize } from './common.js';
import { isRandomEngraving, variantsOf } from './item-filter.js';

/** @typedef {import('./item-filter.js').Item} Item */
/** @typedef {import('./item-filter.js').Engraving} Engraving */

const EMPTY = '<p class="empty">검색 결과가 없습니다.</p>';
const gradeLabel = id => ITEM_GRADES.find(g => g.id === id)?.label ?? id;
const lines = arr => arr.map(escapeHtml).join('<br>');
const queryLink = name => `<button type="button" class="link" data-query="${escapeHtml(name)}">「${escapeHtml(name)}」</button>`;

function engravingChip(name) {
  return isRandomEngraving(name)
    ? `<span class="chip random" title="무작위 각인">${escapeHtml(name)}</span>`
    : `<button type="button" class="chip eng" data-eng="${escapeHtml(name)}">${escapeHtml(name)}</button>`;
}

/** @param {Item} item @param {{ query?: string, variants?: string[] }} [options] */
export function renderItemCard(item, { query = '', variants = [] } = {}) {
  const q = normalize(query);
  const hit = q && normalize(item.name).includes(q) ? ' class="hit"' : '';
  const dlc = item.dlc ? '<span class="badge dlc">DLC</span>' : '';
  const parts = [
    `<header><h3${hit}>${escapeHtml(item.name)}</h3><span class="grade">${escapeHtml(gradeLabel(item.grade))}</span>${dlc}</header>`,
  ];
  if (item.engravings.length) parts.push(`<p class="engravings">${item.engravings.map(engravingChip).join('')}</p>`);
  parts.push(`<p class="desc">${lines(item.description)}</p>`);
  if (item.variantOf) parts.push(`<p class="variant-of">${queryLink(item.variantOf)}의 강화·변환형</p>`);
  if (variants.length) parts.push(`<p class="variants">강화·변환형: ${variants.map(queryLink).join(', ')}</p>`);
  return `<article class="card item grade-${escapeHtml(item.grade)}">${parts.join('')}</article>`;
}

/** 등급 순서대로 섹션을 나눈다. 강화·변환형 목록은 allItems 전체에서 찾는다. */
export function renderItemList(items, { query = '', allItems = items } = {}) {
  if (!items.length) return EMPTY;
  return ITEM_GRADES.map(g => {
    const group = items.filter(i => i.grade === g.id);
    if (!group.length) return '';
    const cards = group.map(i => renderItemCard(i, { query, variants: variantsOf(allItems, i.name) })).join('');
    return `<section class="grade-section grade-${g.id}"><h2 class="grade-heading">${escapeHtml(g.label)} <span class="n">${group.length}</span></h2>`
      + `<div class="grid">${cards}</div></section>`;
  }).join('');
}

/** @param {Engraving} eng @param {number} itemCount @param {{ query?: string, itemsButton?: boolean }} [options] */
export function renderEngravingCard(eng, itemCount, { query = '', itemsButton = true } = {}) {
  const q = normalize(query);
  const hit = q && normalize(eng.name).includes(q) ? ' class="hit"' : '';
  const mod = eng.moddable ? '<span class="badge mod">개조 가능</span>' : '<span class="badge nomod">개조 불가</span>';
  const rows = eng.tiers.map(t => {
    const note = t.note ? `<span class="note">※ ${escapeHtml(t.note)}</span>` : '';
    const effect = [lines(t.effect), note].filter(Boolean).join('<br>');
    return `<tr${t.kind === '개조' ? ' class="mod"' : ''}><td>${t.count}개</td><td>${escapeHtml(t.kind)}</td><td>${effect}</td></tr>`;
  }).join('');
  const parts = [
    `<header><h3${hit}>${escapeHtml(eng.name)}</h3><span class="badge">${escapeHtml(eng.category)}</span>${mod}</header>`,
    `<div class="tiers-scroll"><table class="tiers"><thead><tr><th>개수</th><th>구분</th><th>효과</th></tr></thead><tbody>${rows}</tbody></table></div>`,
  ];
  if (itemCount > 0) {
    if (itemsButton) parts.push(`<button type="button" class="show-items" data-eng="${escapeHtml(eng.name)}">아이템 ${itemCount}개 보기</button>`);
  } else {
    parts.push('<p class="no-items">이 각인을 가진 아이템이 없습니다.</p>');
  }
  return `<article class="card engraving" data-eng="${escapeHtml(eng.name)}">${parts.join('')}</article>`;
}

/** 분류 순서대로 섹션을 나눈다. @param {Engraving[]} engravings @param {Map<string, number>} counts */
export function renderEngravingList(engravings, counts, { query = '' } = {}) {
  if (!engravings.length) return EMPTY;
  return ENGRAVING_CATEGORIES.map(category => {
    const group = engravings.filter(e => e.category === category);
    if (!group.length) return '';
    const cards = group.map(e => renderEngravingCard(e, counts.get(e.name) ?? 0, { query })).join('');
    return `<section class="eng-section"><h2 class="grade-heading">${escapeHtml(category)} <span class="n">${group.length}</span></h2>`
      + `<div class="grid">${cards}</div></section>`;
  }).join('');
}
