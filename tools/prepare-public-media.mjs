#!/usr/bin/env node
// Explicit release staging only. Never called by a build; never uploads.
import { mkdir, readFile, writeFile, stat, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { sources, hashFile, probe } from './prepare-site-media.mjs';
import { showcase } from '../docs/showcase.mjs';

const flags = process.argv.slice(2);
if (flags.some(flag => flag !== '--verify-staged')) throw new Error('Use only --verify-staged to validate and finalize existing staged derivatives.');
const verifyStaged = flags.includes('--verify-staged');
const root = resolve(import.meta.dirname, '..');
const policyFile = join(root, 'data/public-media.json');
const policy = JSON.parse(await readFile(policyFile, 'utf8'));
if (!process.env.SITE_TESTS_ROOT || !process.env.SITE_LIBRARY_ROOT) {
  throw new Error('Provide explicit SITE_TESTS_ROOT and SITE_LIBRARY_ROOT.');
}
const roots = { tests: resolve(process.env.SITE_TESTS_ROOT), library: resolve(process.env.SITE_LIBRARY_ROOT) };
const staging = join(root, '.site-media');
const previews = join(staging, 'previews');
await mkdir(previews, { recursive: true });
function run(binary, args) {
  const result = spawnSync(binary, args, { stdio: 'inherit', env: { ...process.env, COPYFILE_DISABLE: '1' } });
  if (result.error || result.status !== 0) throw new Error(binary + ' failed');
}
const credits = ['Video Studio — selected full-length website editions', '',
  'Website distribution is not production approval. Originals remain unchanged.',
  'Third-party materials retain the licences and attribution listed below.',
  'Retain these credits and applicable share-alike terms when redistributing.', ''];
const checksums = [];
for (const item of showcase) {
  const selection = policy.items[item.id];
  if (!selection?.preview) continue;
  for (const extension of ['jpg', 'mp4', 'credits.txt', ...(item.hasAudio ? ['vtt'] : [])]) {
    const name = item.id + '.' + extension;
    await copyFile(join(root, 'docs/public/showcase', name), join(previews, name));
  }
  credits.push(item.title, item.credit,
    ...(item.credits || []).map(c => c.title + '\n' + c.url + '\n' + c.license + ': ' + c.licenseUrl),
    item.creditUrl || '', '');
  if (!selection.download) continue;
  const source = sources[item.id];
  const input = join(roots[source.root], source.path);
  const inputHash = await hashFile(input);
  const before = probe(input);
  const output = join(staging, selection.download.asset);
  const silent = !item.hasAudio;
  const encode = item.id === 'ambient-kowloon';
  const captionInput = source.siteCaptions ? ['-i', join(root, source.siteCaptions)] : [];
  const captionOutput = source.siteCaptions ? ['-map', '1:0', '-c:s', 'mov_text'] : [];
  console.log('Preparing ' + item.id);
  if (!verifyStaged) run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', input, ...captionInput,
    '-map', '0:v:0', ...(silent ? ['-an', '-sn'] : ['-map', '0:a:0', '-map', '0:s?']),
    ...(encode ? ['-vf', 'scale=1280:720', '-c:v', 'libx264', '-threads', '6', '-preset', 'veryfast', '-crf', '26', '-c:a', 'copy'] : ['-c', 'copy']),
    ...captionOutput, '-map_metadata', '-1', '-map_chapters', '-1',
    ...(source.siteCaptions ? ['-metadata:s:s:0', 'language=eng'] : []), '-movflags', '+faststart', output]);
  const after = probe(output);
  const sourceVideo = before.streams.find(s => s.codec_type === 'video');
  const outputVideo = after.streams.find(s => s.codec_type === 'video');
  const expectedDuration = silent ? sourceVideo.duration : before.format.duration;
  if (Math.abs(Number(after.format.duration) - Number(expectedDuration)) > 0.1) throw new Error('Full duration changed: ' + item.id);
  if (sourceVideo.nb_frames !== outputVideo.nb_frames) throw new Error('Video frame count changed: ' + item.id);
  const hasAudio = after.streams.some(s => s.codec_type === 'audio');
  if (hasAudio !== item.hasAudio) throw new Error('Full-film audio does not match the editorial selection: ' + item.id);
  if (source.siteCaptions && !after.streams.some(s => s.codec_type === 'subtitle')) throw new Error('Missing full-film captions: ' + item.id);
  const bytes = (await stat(output)).size;
  if (bytes >= 2 ** 31) throw new Error('Exceeds GitHub release asset limit: ' + item.id);
  const sha256 = await hashFile(output);
  // Reuse a previous full-decode receipt only when both exact files still match.
  const alreadyVerified = verifyStaged && selection.download.sha256 === sha256 && selection.download.sourceSha256 === inputHash;
  if (!alreadyVerified) run('ffmpeg', ['-v', 'error', '-xerror', '-i', output, '-f', 'null', '-']);
  if (await hashFile(input) !== inputHash) throw new Error('Original changed: ' + item.id);
  Object.assign(selection.download, { bytes, sha256, sourceSha256: inputHash, duration: Number(after.format.duration), hasAudio });
  checksums.push(sha256 + '  ' + selection.download.asset);
  credits.push('Download: ' + selection.download.asset, selection.download.edition, '');
  if (item.id === 'ambient-kowloon') {
    // Named sidecar for this selected episode only; never walk the library.
    credits.push(await readFile(resolve(input, '../../ATTRIBUTIONS.md'), 'utf8'), '');
  }
  if (silent) credits.push('Full-length visual edition; original audio intentionally omitted, as in the excerpt.', '');
}
await writeFile(join(staging, 'media-credits.txt'), credits.join('\n') + '\n');
run('tar', ['-czf', join(staging, policy.previews.asset), '-C', previews, '.']);
policy.previews.sha256 = await hashFile(join(staging, policy.previews.asset));
checksums.push(policy.previews.sha256 + '  ' + policy.previews.asset);
checksums.push(await hashFile(join(staging, 'media-credits.txt')) + '  media-credits.txt');
await writeFile(join(staging, 'SHA256SUMS'), checksums.join('\n') + '\n');
await writeFile(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log('Release staged and verified. Upload is a separate operator action.');
