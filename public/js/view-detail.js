// 상세 칸 HTML: 스컬(빌드와 스킬 정보), 아이템(각인 효과), 각인(붙은 아이템), 안내.
import { GRADES } from './data.js';
import { ITEMS, ITEM_GRADES } from './items.js';
import { NAMU, SKILL_INFO } from './skills.js';
import { ANY, isRecommended } from './skill-match.js';
import { isRandomEngraving, variantsOf } from './item-filter.js';
import { escapeHtml, highlight } from './common.js';
import { itemGlyph, itemImageUrl, skullImageUrl } from './images.js';
import { lookup, itemsOfEngraving, MARK_LABELS } from './search.js';

/** @typedef {import('./search.js').Entry} Entry */

const SKULL_GRADE_LABEL = Object.fromEntries(GRADES.map(g => [g.id, g.label]));
const ITEM_GRADE_LABEL = Object.fromEntries(ITEM_GRADES.map(g => [g.id, g.label]));

const PLACEHOLDER = '<div class="placeholder"><p>목록에서 고르면 여기에 나옵니다.</p>'
  + '<p class="keys"><kbd>/</kbd> 검색 · <kbd>↑</kbd><kbd>↓</kbd> 이동</p></div>';

const lines = (arr, query = '') => arr.map(t => highlight(t, query)).join('<br>');
const count = n => ` <span class="n">${n}</span>`;
const gradeBadge = (grade, label) => `<span class="badge grade grade-${escapeHtml(grade)}">${escapeHtml(label)}</span>`;
const markBadge = mark => `<span class="badge mark">${mark} ${MARK_LABELS[mark]}</span>`;
const modText = moddable => (moddable ? '개조 가능' : '개조 불가');
const jumpLink = name => `<button type="button" class="link jump" data-key="item:${escapeHtml(name)}">${escapeHtml(name)}</button>`;
const itemImg = (name, images) => (images ? `<img src="${escapeHtml(itemImageUrl(name))}" alt="" loading="lazy" onerror="this.remove()">` : '');

function head({ slot = '', kind, name, badges }) {
  return `<header class="detail-head">${slot}<div><p class="kind">${escapeHtml(kind)}</p>`
    + `<h2 id="detail-title" tabindex="-1">${name}</h2><p class="badges">${badges}</p></div></header>`;
}

function tableScroll(table) {
  return `<div class="table-scroll">${table}</div>`;
}

/** 단계 표(아이템·각인 공통). query는 각인 상세에서만 넘긴다. */
function tiersHtml(eng, query = '') {
  const rows = eng.tiers.map(t => (t.kind === '개조'
    ? `<tr class="mod"><td>${t.count}개 개조</td><td>${lines(t.effect, query)}</td></tr>`
    : `<tr><td>${t.count}개</td><td>${lines(t.effect, query)}</td></tr>`)).join('');
  const notes = eng.tiers.filter(t => t.note).map(t => `<p class="note">※ ${highlight(t.note, query)}</p>`).join('');
  return tableScroll(`<table class="tiers"><tbody>${rows}</tbody></table>`) + notes;
}

// ── 스컬 ──

function renderNotes(notes) {
  return notes.length ? `<ul class="notes">${notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>` : '';
}

function renderOption(opt, fixedSkill, query) {
  if (opt === ANY) return `<span class="chip any">${escapeHtml(opt)}</span>`;
  const fixed = opt === fixedSkill ? '<span class="fixed">고정</span>' : '';
  return `<span class="chip rec">${highlight(opt, query)}${fixed}</span>`;
}

function renderBuild(build, fixedSkill, query) {
  const tag = build.label ? `<span class="tag">${escapeHtml(build.label)}</span>` : '';
  const slots = build.slots
    .map(slot => slot.map(o => renderOption(o, fixedSkill, query)).join('<span class="or">/</span>'))
    .join('<span class="plus">+</span>');
  return `<li class="build">${tag}<p class="combo">${slots}</p>${renderNotes(build.notes)}</li>`;
}

function renderPool(pool, query) {
  const rows = pool.flatMap(group => group.skills.map(k =>
    `<tr><td>${escapeHtml(group.type)}</td><td class="name">${highlight(k.name, query)}</td><td>${escapeHtml(k.value)}</td><td class="stars">${'★'.repeat(k.stars)}</td></tr>`));
  return tableScroll(`<table class="pool"><thead><tr><th>유형</th><th>스킬</th><th>수치</th><th>추천</th></tr></thead><tbody>${rows.join('')}</tbody></table>`);
}

/** 기본으로 보여 줄 단계: 마지막 정규 단계(보통 레전더리). 없으면 0. */
export function defaultStageIndex(stages) {
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i].kind === 'stage') return i;
  return 0;
}

/** 기본 단계의 나무위키 스킬 중 추천 조합에 없는 것. 죄수는 추천 표에 이미 다 있으므로 생략. */
function renderOthers(skull, info, query) {
  if (!info || skull.pool) return '';
  const stage = info.stages[defaultStageIndex(info.stages)];
  const names = (stage?.skills ?? []).map(k => k.name).filter(n => !isRecommended(skull, n));
  if (!names.length) return '';
  const label = skull.builds.length ? '그 외' : '스킬';
  return `<p class="others"><span class="others-label">${label}</span>`
    + names.map(n => `<span class="chip">${highlight(n, query)}</span>`).join('') + '</p>';
}

function renderSkillRows(skull, skill, query) {
  const rec = isRecommended(skull, skill.name);
  const tag = rec ? ' <span class="tag">추천</span>' : '';
  const main = `<tr${rec ? ' class="rec"' : ''}><td>${highlight(skill.name, query)}${tag}</td><td>${escapeHtml(skill.cooldown)}</td><td>${lines(skill.effect)}</td></tr>`;
  const variants = skill.variants.map(v =>
    `<tr class="variant"><td></td><td>${escapeHtml(v.cooldown)}</td><td>${lines(v.effect)}</td></tr>`);
  return main + variants.join('');
}

function renderStage(skull, stage, i, selected, query) {
  const parts = [];
  if (stage.passive.length) parts.push(`<p class="passive"><strong>패시브</strong> ${lines(stage.passive)}</p>`);
  if (stage.swap) parts.push(`<p class="swap"><strong>교대</strong> ${highlight(stage.swap.name, query)} — ${lines(stage.swap.effect)}</p>`);
  parts.push(tableScroll(`<table class="skill-table"><thead><tr><th>스킬</th><th>${escapeHtml(stage.cooldownLabel ?? '쿨타임')}</th><th>효과</th></tr></thead>`
    + `<tbody>${stage.skills.map(k => renderSkillRows(skull, k, query)).join('')}</tbody></table>`));
  return `<div class="stage" id="stage-panel-${i}" data-stage="${i}" role="tabpanel" aria-labelledby="stage-tab-${i}" tabindex="0"${i === selected ? '' : ' hidden'}>${parts.join('')}</div>`;
}

function renderSkillInfo(skull, info, query) {
  if (!info) return '';
  const { stages } = info;
  const selected = defaultStageIndex(stages);
  const tabs = stages.map((s, i) =>
    `<button type="button" role="tab" id="stage-tab-${i}" aria-controls="stage-panel-${i}" data-stage="${i}" aria-selected="${i === selected}" tabindex="${i === selected ? 0 : -1}">${escapeHtml(s.form ? `${s.label} · ${s.form}` : s.label)}</button>`).join('');
  return '<section class="skill-info" aria-labelledby="skill-info-title"><h3 id="skill-info-title">스킬 정보</h3>'
    + `<div class="stage-tabs" role="tablist" aria-label="각성 단계">${tabs}</div>`
    + stages.map((s, i) => renderStage(skull, s, i, selected, query)).join('')
    + `<p class="attribution">출처: <a href="${escapeHtml(NAMU.url)}" target="_blank" rel="noopener">나무위키 「${escapeHtml(NAMU.title)}」</a> · 나무위키 기여자 · ${escapeHtml(NAMU.license)}</p></section>`;
}

function renderSkull(skull, query, images) {
  const info = SKILL_INFO[skull.name];
  const portrait = images ? `<img class="portrait" src="${escapeHtml(skullImageUrl(skull.id))}" alt="" onerror="this.remove()">` : '';
  const badges = gradeBadge(skull.grade, SKULL_GRADE_LABEL[skull.grade]) + (skull.mark ? markBadge(skull.mark) : '');
  const parts = [head({ slot: portrait, kind: '스컬', name: escapeHtml(skull.name), badges })];
  if (skull.builds.length) parts.push(`<ul class="builds">${skull.builds.map(b => renderBuild(b, skull.fixedSkill, query)).join('')}</ul>`);
  if (skull.pool) parts.push(renderPool(skull.pool, query));
  if (!skull.builds.length && !skull.pool) parts.push('<p class="no-build">별도 추천 없음</p>');
  parts.push(renderNotes(skull.notes));
  parts.push(renderOthers(skull, info, query));
  parts.push(renderSkillInfo(skull, info, query));
  return parts.join('');
}

// ── 아이템 ──

function itemEngravingChip(name, query) {
  return isRandomEngraving(name)
    ? `<span class="chip random" title="무작위 각인">${highlight(name, query)}</span>`
    : `<button type="button" class="chip jump" data-key="eng:${escapeHtml(name)}">${highlight(name, query)}</button>`;
}

function renderItem(item, query, images) {
  const slot = `<span class="slot grade-${escapeHtml(item.grade)}" aria-hidden="true">${escapeHtml(itemGlyph(item.name))}${itemImg(item.name, images)}</span>`;
  const badges = gradeBadge(item.grade, ITEM_GRADE_LABEL[item.grade] ?? item.grade) + (item.dlc ? markBadge('★') : '');
  const parts = [head({ slot, kind: '아이템', name: highlight(item.name, query), badges })];
  parts.push(`<p class="desc">${lines(item.description, query)}</p>`);
  if (item.engravings.length) parts.push(`<p class="engs">${item.engravings.map(n => itemEngravingChip(n, query)).join('')}</p>`);
  const engravings = [...new Set(item.engravings)]
    .filter(n => !isRandomEngraving(n))
    .map(n => lookup('eng:' + n)?.data)
    .filter(Boolean);
  if (engravings.length) {
    parts.push('<h3>각인 효과</h3>');
    for (const eng of engravings) {
      parts.push(`<section class="tier-box"><h4>${escapeHtml(eng.name)}<span class="mod">${modText(eng.moddable)}</span></h4>${tiersHtml(eng)}</section>`);
    }
  }
  if (item.variantOf) parts.push(`<p class="variant-of">${jumpLink(item.variantOf)}의 강화·변환형</p>`);
  const variants = variantsOf(ITEMS, item.name);
  if (variants.length) parts.push(`<p class="variants">강화·변환형: ${variants.map(jumpLink).join(', ')}</p>`);
  return parts.join('');
}

// ── 각인 ──

function miniCell(entry, images) {
  const i = entry.data;
  return `<button type="button" class="jump mini grade-${escapeHtml(i.grade)}" data-key="${escapeHtml(entry.key)}">`
    + `<span class="slot" aria-hidden="true">${escapeHtml(itemGlyph(i.name))}${itemImg(i.name, images)}</span>`
    + `<span class="nm">${escapeHtml(i.name)}</span></button>`;
}

function renderEngraving(eng, query, images) {
  const parts = [head({
    kind: `각인 · ${eng.category}`,
    name: highlight(eng.name, query),
    badges: `<span class="badge mod">${modText(eng.moddable)}</span>`,
  })];
  parts.push(tiersHtml(eng, query));
  const items = itemsOfEngraving(eng.name);
  parts.push(`<h3>이 각인이 붙은 아이템${count(items.length)}</h3>`);
  if (!items.length) {
    parts.push('<p class="no-items">이 각인을 가진 아이템이 없습니다.</p>');
  } else {
    for (const g of ITEM_GRADES) {
      const group = items.filter(e => e.data.grade === g.id);
      if (!group.length) continue;
      parts.push(`<h4 class="sub grade-${g.id}">${escapeHtml(g.label)}${count(group.length)}</h4>`
        + `<div class="mini-grid">${group.map(e => miniCell(e, images)).join('')}</div>`);
    }
  }
  return parts.join('');
}

/** @param {Entry|null} entry @param {{ query?: string, images?: boolean }} [options] */
export function renderDetail(entry, { query = '', images = false } = {}) {
  if (!entry) return PLACEHOLDER;
  if (entry.kind === 'skull') return renderSkull(entry.data, query, images);
  if (entry.kind === 'item') return renderItem(entry.data, query, images);
  return renderEngraving(entry.data, query, images);
}
