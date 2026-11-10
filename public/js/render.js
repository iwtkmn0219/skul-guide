import { GRADES } from './data.js';
import { NAMU, SKILL_INFO } from './skills.js';
import { ANY, isRecommended } from './skill-match.js';
import { escapeHtml, normalize } from './common.js';

export { escapeHtml } from './common.js';

/** @typedef {import('./data.js').Skull} Skull */


export const gradeLabel = id => GRADES.find(g => g.id === id)?.label ?? id;

/** 메모가 NOTE_LIMIT + 1줄을 넘으면 NOTE_LIMIT줄만 보이고 나머지는 "더보기"로 접는다. 한 줄만 숨기는 접기는 하지 않는다. */
export const NOTE_LIMIT = 2;

/** 정규화된 검색어 q가 이름에 들어 있으면 ' hit'. */
const hit = (name, q) => (q && normalize(name).includes(q) ? ' hit' : '');

function renderNotes(notes) {
  if (!notes.length) return '';
  const items = notes.map(n => `<li>${escapeHtml(n)}</li>`).join('');
  if (notes.length <= NOTE_LIMIT + 1) return `<ul class="notes">${items}</ul>`;
  const more = notes.length - NOTE_LIMIT;
  return `<ul class="notes clamp">${items}</ul>`
    + `<button type="button" class="more" aria-expanded="false" data-more="${more}">더보기 (+${more})</button>`;
}

function renderOption(opt, fixedSkill, q) {
  if (opt === ANY) return `<span class="pill any">${escapeHtml(opt)}</span>`;
  const badge = opt === fixedSkill ? '<span class="fixed">고정</span>' : '';
  return `<span class="pill${hit(opt, q)}">${escapeHtml(opt)}${badge}</span>`;
}

function renderBuild(build, fixedSkill, q) {
  const label = build.label ? `<span class="label">${escapeHtml(build.label)}</span>` : '';
  const slots = build.slots
    .map(slot => `<span class="slot">${slot.map(o => renderOption(o, fixedSkill, q)).join('<span class="or">/</span>')}</span>`)
    .join('<span class="plus">+</span>');
  return `<li>${label}<div class="combo">${slots}</div>${renderNotes(build.notes)}</li>`;
}

function renderPool(pool, q) {
  const rows = pool.flatMap(group => group.skills.map(k =>
    `<tr><td>${escapeHtml(group.type)}</td><td class="name${hit(k.name, q)}">${escapeHtml(k.name)}</td><td>${escapeHtml(k.value)}</td><td class="stars">${'★'.repeat(k.stars)}</td></tr>`));
  return `<table class="pool"><thead><tr><th>유형</th><th>스킬</th><th>수치</th><th>추천</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

/** 기본으로 보여 줄 단계: 마지막 정규 단계(보통 레전더리). 없으면 0. */
export function defaultStageIndex(stages) {
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i].kind === 'stage') return i;
  return 0;
}

/** 기본 단계의 나무위키 스킬 중 추천 조합에 없는 것. 죄수는 풀 표에 이미 다 있으므로 생략. */
function renderOthers(skull, info, q) {
  if (!info || skull.pool) return '';
  const stage = info.stages[defaultStageIndex(info.stages)];
  const names = (stage?.skills ?? []).map(k => k.name).filter(n => !isRecommended(skull, n));
  if (!names.length) return '';
  const label = skull.builds.length ? '그 외' : '스킬';
  return `<p class="others"><span class="others-label">${label}</span>`
    + names.map(n => `<span class="chip${hit(n, q)}">${escapeHtml(n)}</span>`).join('') + '</p>';
}

/** @param {Skull} skull @param {{ images?: boolean, query?: string }} [options] */
export function renderCard(skull, { images = false, query = '' } = {}) {
  const q = normalize(query);
  const info = SKILL_INFO[skull.name];
  const parts = [];
  const portrait = images ? `<img class="portrait" src="img/${escapeHtml(skull.id)}.png" alt="" loading="lazy" onerror="this.remove()">` : '';
  const mark = skull.mark ? `<span class="mark" title="원문 표기">${escapeHtml(skull.mark)}</span>` : '';
  parts.push(`<header>${portrait}<span class="no">${skull.no}</span><h3>${escapeHtml(skull.name)}</h3>${mark}</header>`);
  if (skull.builds.length) parts.push(`<ul class="builds">${skull.builds.map(b => renderBuild(b, skull.fixedSkill, q)).join('')}</ul>`);
  if (skull.pool) parts.push(renderPool(skull.pool, q));
  if (!skull.builds.length && !skull.pool) parts.push('<p class="no-build">별도 추천 없음</p>');
  parts.push(renderNotes(skull.notes));
  parts.push(renderOthers(skull, info, q));
  if (info) parts.push(`<button type="button" class="open-skills" data-skull="${escapeHtml(skull.id)}" aria-haspopup="dialog">스킬 정보</button>`);
  return `<article class="card grade-${escapeHtml(skull.grade)}" id="skull-${escapeHtml(skull.id)}">${parts.join('')}</article>`;
}

/** 등급별 섹션으로 묶어 그린다. @param {Skull[]} skulls @param {{ images?: boolean, query?: string }} [options] */
export function renderList(skulls, options) {
  if (!skulls.length) return '<p class="empty">검색 결과가 없습니다.</p>';
  return GRADES.map(g => {
    const group = skulls.filter(s => s.grade === g.id);
    if (!group.length) return '';
    return `<section class="grade-section grade-${g.id}" aria-labelledby="grade-${g.id}">`
      + `<h2 class="grade-heading" id="grade-${g.id}">${escapeHtml(g.label)} <span class="n">${group.length}</span></h2>`
      + `<div class="grid">${group.map(s => renderCard(s, options)).join('')}</div></section>`;
  }).join('');
}

const lines = arr => arr.map(escapeHtml).join('<br>');

function renderSkillRows(skull, skill) {
  const rec = isRecommended(skull, skill.name);
  const tag = rec ? ' <span class="tag">추천</span>' : '';
  const main = `<tr${rec ? ' class="rec"' : ''}><td>${escapeHtml(skill.name)}${tag}</td><td>${escapeHtml(skill.cooldown)}</td><td>${lines(skill.effect)}</td></tr>`;
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
  return `<div class="stage" id="stage-panel-${i}" data-stage="${i}" role="tabpanel" aria-labelledby="stage-tab-${i}" tabindex="0"${i === selected ? '' : ' hidden'}>${parts.join('')}</div>`;
}

/** 스킬 정보 대화상자 내용. 한 번에 하나만 열리므로 id가 겹치지 않는다. @param {Skull} skull @param {{ stages: object[] } | undefined} info */
export function renderSkillDialog(skull, info) {
  if (!info) return '';
  const { stages } = info;
  const selected = defaultStageIndex(stages);
  const tabs = stages.map((s, i) =>
    `<button type="button" role="tab" id="stage-tab-${i}" aria-controls="stage-panel-${i}" data-stage="${i}" aria-selected="${i === selected}" tabindex="${i === selected ? 0 : -1}">${escapeHtml(s.form ? `${s.label} · ${s.form}` : s.label)}</button>`).join('');
  return `<div class="sheet grade-${escapeHtml(skull.grade)}">`
    + `<header class="sheet-head"><h2 id="sheet-title">${escapeHtml(skull.name)}</h2><span class="grade">${escapeHtml(gradeLabel(skull.grade))}</span>`
    + '<button type="button" class="close" aria-label="닫기">×</button></header>'
    + `<div class="stage-tabs" role="tablist" aria-label="단계">${tabs}</div>`
    + `<div class="sheet-body">${stages.map((s, i) => renderStage(skull, s, i, selected)).join('')}</div>`
    + `<p class="attribution">출처: <a href="${escapeHtml(NAMU.url)}" target="_blank" rel="noopener">나무위키</a> · ${escapeHtml(NAMU.license)}</p></div>`;
}
