// 스킬 추천 페이지가 루트(/)에 있던 시절에 공유된 링크(/#grade=…, /#skull=…)를 /skills/로 옮긴다.

export const LEGACY_KEYS = ['grade', 'mark', 'q', 'skull'];

/** 옛 스킬 페이지 해시면 `'skills/' + hash`, 아니면 null. */
export function legacySkillRedirect(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return LEGACY_KEYS.some(key => params.has(key)) ? `skills/${hash}` : null;
}
