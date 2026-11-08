import { GRADES } from './data.js';
import { NAMU, SKILL_INFO } from './skills.js';
import { isRecommended } from './skill-match.js';

/** @typedef {import('./data.js').Skull} Skull */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ENTITIES[c]);
}

const gradeLabel = id => GRADES.find(g => g.id === id)?.label ?? id;

function renderNotes(notes) {
  if (!notes.length) return '';
  return `<ul class="notes">${notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>`;
}

function renderOption(opt, fixedSkill) {
  const badge = opt === fixedSkill ? '<span class="fixed">고정</span>' : '';
  return `<span class="opt">${escapeHtml(opt)}${badge}</span>`;
}

function renderBuild(build, fixedSkill) {
  const label = build.label ? `<span class="label">${escapeHtml(build.label)}</span>` : '';
  const slots = build.slots
    .map(slot => `<span class="slot">${slot.map(o => renderOption(o, fixedSkill)).join(' / ')}</span>`)
    .join(' + ');
  return `<li>${label}<div class="combo">${slots}</div>${renderNotes(build.notes)}</li>`;
}

function renderPool(pool) {
  const rows = pool.flatMap(group => group.skills.map(k =>
    `<tr><td>${escapeHtml(group.type)}</td><td>${escapeHtml(k.name)}</td><td>${escapeHtml(k.value)}</td><td class="stars">${'★'.repeat(k.stars)}</td></tr>`));
  return `<table class="pool"><thead><tr><th>유형</th><th>스킬</th><th>수치</th><th>추천</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

/** 기본으로 보여 줄 단계: 마지막 정규 단계(보통 레전더리). 없으면 0. */
export function defaultStageIndex(stages) {
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i].kind === 'stage') return i;
  return 0;
}

const lines = arr => arr.map(escapeHtml).join('<br>');

function renderSkillRows(skull, skill) {
  const rec = isRecommended(skull, skill.name);
  const main = `<tr${rec ? ' class="rec"' : ''}><td>${escapeHtml(skill.name)}</td><td>${escapeHtml(skill.cooldown)}</td><td>${lines(skill.effect)}</td></tr>`;
  const variants = skill.variants.map(v =>
    `<tr class="variant"><td></td><td>${escapeHtml(v.cooldown)}</td><td>${lines(v.effect)}</td></tr>`);
  return main + variants.join('');
}

function renderStage(skull, stage, i, selected) {
  const parts = [];
  if (stage.passive.length) parts.push(`<p class="passive"><b>패시브</b> ${lines(stage.passive)}</p>`);
  if (stage.swap) parts.push(`<p class="swap"><b>교대</b> ${escapeHtml(stage.swap.name)} — ${lines(stage.swap.effect)}</p>`);
  parts.push(`<table class="skill-table"><thead><tr><th>스킬</th><th>${escapeHtml(stage.cooldownLabel ?? '쿨타임')}</th><th>효과</th></tr></thead>`
    + `<tbody>${stage.skills.map(k => renderSkillRows(skull, k)).join('')}</tbody></table>`);
  return `<div class="stage" data-stage="${i}" role="tabpanel"${i === selected ? '' : ' hidden'}>${parts.join('')}</div>`;
}

/** @param {Skull} skull @param {{ stages: object[] } | undefined} info */
export function renderSkillSection(skull, info) {
  if (!info) return '';
  const { stages } = info;
  const selected = defaultStageIndex(stages);
  const chips = (stages[selected]?.skills ?? []).map(k => isRecommended(skull, k.name)
    ? `<li class="chip rec" title="추천">${escapeHtml(k.name)}</li>`
    : `<li class="chip">${escapeHtml(k.name)}</li>`).join('');
  const tabs = stages.map((s, i) =>
    `<button type="button" role="tab" data-stage="${i}" aria-selected="${i === selected}">${escapeHtml(s.form ? `${s.label} · ${s.form}` : s.label)}</button>`).join('');
  return `<ul class="skill-chips">${chips}</ul>`
    + '<details class="skill-detail"><summary>스킬 정보</summary>'
    + `<div class="stage-tabs" role="tablist">${tabs}</div>`
    + `<div class="stage-scroll">${stages.map((s, i) => renderStage(skull, s, i, selected)).join('')}</div>`
    + `<p class="attribution">출처: <a href="${escapeHtml(NAMU.url)}" target="_blank" rel="noopener">나무위키</a> · ${escapeHtml(NAMU.license)}</p></details>`;
}

/** @param {Skull} skull @param {{ images?: boolean }} [options] */
export function renderCard(skull, { images = false } = {}) {
  const parts = [];
  if (images) parts.push(`<img class="portrait" src="img/${escapeHtml(skull.id)}.png" alt="" loading="lazy" onerror="this.remove()">`);
  const mark = skull.mark ? `<span class="mark">${escapeHtml(skull.mark)}</span>` : '';
  parts.push(`<header><span class="no">${skull.no}</span><h2>${escapeHtml(skull.name)}</h2>${mark}<span class="grade">${escapeHtml(gradeLabel(skull.grade))}</span></header>`);
  if (skull.builds.length) parts.push(`<ul class="builds">${skull.builds.map(b => renderBuild(b, skull.fixedSkill)).join('')}</ul>`);
  if (skull.pool) parts.push(renderPool(skull.pool));
  if (!skull.builds.length && !skull.pool) parts.push('<p class="no-build">별도 추천 없음</p>');
  parts.push(renderNotes(skull.notes));
  parts.push(renderSkillSection(skull, SKILL_INFO[skull.name]));
  return `<article class="card grade-${escapeHtml(skull.grade)}" id="skull-${escapeHtml(skull.id)}">${parts.join('')}</article>`;
}

/** @param {Skull[]} skulls @param {{ images?: boolean }} [options] */
export function renderList(skulls, options) {
  if (!skulls.length) return '<p class="empty">검색 결과가 없습니다.</p>';
  return skulls.map(s => renderCard(s, options)).join('');
}
