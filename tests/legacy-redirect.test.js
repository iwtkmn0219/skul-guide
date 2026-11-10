import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacySkillRedirect } from '../public/js/legacy-redirect.js';
import * as common from '../public/js/common.js';
import * as render from '../public/js/render.js';
import * as filter from '../public/js/filter.js';

test('old root hashes with skill-page keys move to skills/', () => {
  assert.equal(legacySkillRedirect('#grade=unique&q=%EC%A3%84%EC%88%98'), 'skills/#grade=unique&q=%EC%A3%84%EC%88%98');
  assert.equal(legacySkillRedirect('#skull=prisoner'), 'skills/#skull=prisoner');
  assert.equal(legacySkillRedirect('#mark=%E2%98%85'), 'skills/#mark=%E2%98%85');
});
test('empty or unrelated hashes stay on the hub', () => {
  for (const h of ['', '#', '#foo=1']) assert.equal(legacySkillRedirect(h), null, h);
});
test('malformed percent-encoding does not throw', () => {
  assert.equal(legacySkillRedirect('#q=%E0%A4%A'), 'skills/#q=%E0%A4%A');
});
test('render.js and filter.js re-export the shared helpers from common.js', () => {
  assert.equal(render.escapeHtml, common.escapeHtml);
  assert.equal(filter.normalize, common.normalize);
});
