import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources, verifyExcerpt } from '../prepare-site-media.mjs';
import { showcase } from '../../docs/showcase.mjs';
import { recipes } from '../../docs/.vitepress/theme/recipes.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('every public recipe and project points to committed documentation', async () => {
  assert.equal(new Set(showcase.map(p => p.id)).size, showcase.length);
  assert.deepEqual(Object.keys(sources).sort(), showcase.map(p => p.id).sort());
  for (const item of showcase) {
    assert.match(item.id, /^[a-z-]+$/);
    assert.ok(item.visual.length > 30 && item.credit.length > 30);
    assert.ok(item.duration > 0 && item.duration <= 40);
    assert.ok(item.posterAt >= 0 && item.posterAt < item.duration);
    assert.equal(typeof item.hasAudio, 'boolean');
    if (item.hasAudio) assert.ok(item.audioDescription.length > 10 && item.transcript);
    assert.ok(existsSync(resolve(root, 'docs', item.recipe.slice(1) + '.md')));
    assert.ok(!sources[item.id].path.includes('..'));
  }
  for (const recipe of recipes) {
    const text = await readFile(resolve(root, 'docs/recipes', recipe.slug + '.md'), 'utf8');
    assert.match(text, /## Ingredients/);
    assert.ok(recipe.needs && recipe.level && recipe.text);
  }
});
test('web excerpt validation enforces declared audio, duration, codecs and dimensions', () => {
  const valid = () => ({ streams: [{codec_type:'video',codec_name:'h264',pix_fmt:'yuv420p',width:1280,height:720}], format:{duration:'12'} });
  assert.doesNotThrow(() => verifyExcerpt(valid(), 12));
  const sound = valid(); sound.streams.push({codec_type:'audio'});
  assert.throws(() => verifyExcerpt(sound, 12), /silent/);
  assert.throws(() => verifyExcerpt(valid(), 12, true), /AAC/);
  sound.streams[1].codec_name = 'aac';
  assert.doesNotThrow(() => verifyExcerpt(sound, 12, true));
  const duration = valid(); duration.format.duration = '13';
  assert.throws(() => verifyExcerpt(duration, 12), /duration/);
  const missingDuration = valid(); missingDuration.format.duration = 'N/A';
  assert.throws(() => verifyExcerpt(missingDuration, 12), /duration/);
  const size = valid(); size.streams[0].width = 1920;
  assert.throws(() => verifyExcerpt(size, 12), /size/);
  const codec = valid(); codec.streams[0].codec_name = 'hevc';
  assert.throws(() => verifyExcerpt(codec, 12), /H.264/);
});
test('fonts are local and carry their redistribution licences', async () => {
  for (const name of ['fraunces-latin-400-normal.woff2','fraunces-latin-400-italic.woff2','inter-latin-400-normal.woff2','inter-latin-600-normal.woff2','Fraunces-LICENSE.txt','Inter-LICENSE.txt']) {
    assert.ok((await stat(resolve(root, 'docs/public/fonts', name))).size > 0);
  }
  const css = await readFile(resolve(root,'docs/.vitepress/theme/style.css'), 'utf8');
  assert.ok(!css.includes('fonts.googleapis.com'));
  assert.match(css, /prefers-reduced-motion/);
});
