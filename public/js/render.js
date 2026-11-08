import { GRADES } from './data.js';

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
  return `<article class="card grade-${escapeHtml(skull.grade)}" id="skull-${escapeHtml(skull.id)}">${parts.join('')}</article>`;
}

/** @param {Skull[]} skulls @param {{ images?: boolean }} [options] */
export function renderList(skulls, options) {
  if (!skulls.length) return '<p class="empty">검색 결과가 없습니다.</p>';
  return skulls.map(s => renderCard(s, options)).join('');
}
