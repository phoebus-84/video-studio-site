import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {showcase} from '../../docs/showcase.mjs';
import {sources, excerptCaptions} from '../prepare-site-media.mjs';

test('Sonnet preserves narration, original soundtrack and the declared component licences', async () => {
  const item = showcase.find(p => p.id === 'sonnet');
  assert.equal(item.hasAudio, true);
  assert.equal(item.narration, true);
  assert.match(item.credit, /operator-authorised voices/);
  assert.match(item.credit, /CC BY 3.0/);
  assert.match(item.credit, /CC0/);
  assert.ok(item.credits.some(c => c.url === 'https://ccmixter.org/files/_ghost/25389'));
  const srt = await readFile(new URL('../../' + sources.sonnet.siteCaptions, import.meta.url), 'utf8');
  const excerpt = excerptCaptions(srt, item.start, item.duration);
  assert.match(excerpt, /Sometime too hot the eye of heaven shines/);
  assert.match(excerpt, /00:00:00.000 -->/);
  assert.match(srt, /So long lives this, and this gives life to thee/);
  const preparer = await readFile(new URL('../prepare-public-media.mjs', import.meta.url), 'utf8');
  assert.match(preparer, /const silent = !item.hasAudio/);
  assert.ok(!preparer.includes("const silent = item.id === 'sonnet'"));
  assert.match(preparer, /hasAudio !== item.hasAudio/);
});
