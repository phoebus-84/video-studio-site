import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { excerptCaptions, sources } from '../prepare-site-media.mjs';
import { showcase } from '../../docs/showcase.mjs';

test('captions are clipped and retimed to the exact excerpt; markup is escaped', () => {
  const srt = '1\n00:00:35,000 --> 00:00:39,000\nFirst & <line>\n\n2\n00:00:40,250 --> 00:00:45,000\nSecond line\n\n3\n00:00:50,000 --> 00:00:52,000\nOutside';
  assert.equal(excerptCaptions(srt, 37, 5), 'WEBVTT\n\n1\n00:00:00.000 --> 00:00:02.000\nFirst &amp; &lt;line&gt;\n\n2\n00:00:03.250 --> 00:00:05.000\nSecond line\n');
  assert.throws(() => excerptCaptions(srt, 60, 3), /No captions/);
  assert.throws(() => excerptCaptions(srt, -1, 2), /range/);
  assert.throws(() => excerptCaptions('1\nbad --> timing\ntext', 0, 2), /Malformed/);
});

test('the operator-selected films lead the programme and retain exact versions', () => {
  assert.deepEqual(showcase.filter(p => p.featured).map(p => p.id), ['lontano', 'ambient-kowloon', 'jaromail']);
  assert.match(sources.lontano.path, /lontano-a-dicembre-v03\.mp4$/);
  assert.match(sources.jaromail.path, /jaromail-pixel-v4\.mp4$/);
  assert.match(sources['ambient-kowloon'].path, /final-1h-20261016-102835\.mp4$/);
  assert.ok(sources.jaromail.captions.endsWith('v4.srt'));
  const essay = showcase.find(p => p.id === 'nothing-is-only-one-thing');
  assert.ok(essay?.hasAudio && essay.narration && essay.transcript);
  assert.match(sources[essay.id].path, /output\/v006\/nothing-is-only-one-thing-v006\.mp4$/);
  assert.match(sources[essay.id].captions, /-v006\.en\.srt$/);
  assert.deepEqual([essay.start, essay.duration], [39, 31]);
  assert.match(essay.note, /not an approved release/);
  assert.match(essay.credit, /no public redistribution licence/);
  assert.ok(!showcase.some(p => p.id === 'negative-space'));
});

test('collaboration is prominent and its guide distinguishes Git, media and authority', async () => {
  const home = await readFile(new URL('../../docs/.vitepress/theme/components/HomePage.vue', import.meta.url), 'utf8');
  const guide = await readFile(new URL('../../docs/collaboration.md', import.meta.url), 'utf8');
  for (const text of ['Git', 'S3', 'media.lock.jsonl', '/collaboration']) assert.ok(home.includes(text));
  for (const text of ['channel media push', 'channel media pull', '--verify', '--tier all', 'operator HMAC key', 'not a hosted real-time']) assert.ok(guide.includes(text));
});
