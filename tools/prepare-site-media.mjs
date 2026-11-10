#!/usr/bin/env node
// Explicit local preparation. No uploads, AI generation, or edits to production originals.
import { mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { showcase } from '../docs/showcase.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const sources = {
  lontano: { root: 'tests', path: 'lontano-a-dicembre/output/lontano-a-dicembre-v03.mp4' },
  'ambient-kowloon': { root: 'library', path: 'ambient-through-time/series/notti-di-citta/episodes/01-kowloon-1987-pioggia/output/final-1h-20261016-102835.mp4' },
  jaromail: { root: 'library', path: 'dyne/series/software/episodes/jaromail/output/jaromail-pixel-v4.mp4', captions: 'dyne/series/software/episodes/jaromail/output/jaromail-pixel-v4.srt' },
  'nothing-is-only-one-thing': { root: 'library', path: 'dyne/series/open-culture/episodes/nothing-is-only-one-thing/output/v006/nothing-is-only-one-thing-v006.mp4', captions: 'dyne/series/open-culture/episodes/nothing-is-only-one-thing/output/v006/nothing-is-only-one-thing-v006.en.srt' },
  underwater: { root: 'tests', path: 'blender-tutorial-OeQfq-Sc-lM/renders/underwater-15s.mp4' },
  sonnet: { root: 'library', path: 'poesie-al-museo/consegna/sala-shakespeare/10-video-finali/short-sonnet-18.mp4' },
};
const output = join(root, 'docs/public/showcase');
const extensions = item => ['jpg', 'mp4', 'credits.txt', ...(item.hasAudio ? ['vtt'] : [])];
function run(binary, args) {
  const result = spawnSync(binary, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${binary}: ${result.error?.message || result.stderr || 'failed'}`);
  return result.stdout;
}
export async function hashFile(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
export function probe(file) {
  return JSON.parse(run('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]));
}
export function verifyExcerpt(info, duration, hasAudio = false) {
  const video = info.streams.find(s => s.codec_type === 'video');
  const audio = info.streams.filter(s => s.codec_type === 'audio');
  if (!video || video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p') throw new Error('Expected H.264 yuv420p video');
  if (hasAudio ? audio.length !== 1 || audio[0].codec_name !== 'aac' : audio.length !== 0) {
    throw new Error(hasAudio ? 'Expected one AAC audio stream' : 'This excerpt must be silent');
  }
  if (!Number.isFinite(Number(info.format?.duration)) || Math.abs(Number(info.format.duration) - duration) > 0.1) throw new Error('Unexpected excerpt duration');
  if (!(video.width > 0 && video.height > 0) || video.width > 1280 || video.height > 720) throw new Error('Excerpt exceeds web size limit');
}
function vttTime(seconds) {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
}
/** Retimes overlapping SRT cues to the excerpt, clipping both boundaries. */
export function excerptCaptions(srt, start, duration) {
  if (!(Number.isFinite(start) && start >= 0 && Number.isFinite(duration) && duration > 0)) throw new Error('Invalid caption excerpt range');
  const seconds = value => { const [h,m,s] = value.replace(',', '.').split(':').map(Number); return h * 3600 + m * 60 + s; };
  const cues = [];
  for (const block of srt.trim().split(/\r?\n\s*\r?\n/)) {
    const lines = block.split(/\r?\n/);
    const index = lines.findIndex(line => line.includes('-->'));
    if (index < 0) continue;
    const times = lines[index].match(/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/);
    if (!times) throw new Error('Malformed SRT timing');
    const from = Math.max(0, seconds(times[1]) - start);
    const to = Math.min(duration, seconds(times[2]) - start);
    if (from >= to) continue;
    const text = lines.slice(index + 1).join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!text.trim()) throw new Error('Empty SRT cue');
    cues.push(`${cues.length + 1}\n${vttTime(from)} --> ${vttTime(to)}\n${text}`);
  }
  if (!cues.length) throw new Error('No captions overlap the selected excerpt');
  return `WEBVTT\n\n${cues.join('\n\n')}\n`;
}
async function main() {
  const flags = process.argv.slice(2);
  if (flags.some(f => !['--help', '--check', '--dry-run'].includes(f))) throw new Error('Unknown argument. Use --help.');
  if (flags.includes('--help')) {
    console.log('npm run media:prepare [-- --dry-run | --check]\nRequires FFmpeg/ffprobe. Reads only curated sources.\nPreparation requires explicit SITE_TESTS_ROOT and SITE_LIBRARY_ROOT; --check only reads local derivatives. Outputs ignored derivatives in docs/public/showcase/.\nAudio is retained only for explicitly selected works, with captions and credits. No uploads or changes to originals.');
    return;
  }
  if (flags.includes('--check')) {
    const manifest = JSON.parse(await readFile(join(output, 'manifest.json'), 'utf8'));
    for (const item of showcase) {
      const record = manifest.items.find(r => r.id === item.id);
      if (!record) throw new Error(`Missing receipt for ${item.id}`);
      if (record.source.path !== sources[item.id].path || record.start !== item.start || record.duration !== item.duration || record.hasAudio !== item.hasAudio) throw new Error(`Outdated selection: ${item.id}`);
      for (const ext of extensions(item)) {
        const filename = `${item.id}.${ext}`;
        if (await hashFile(join(output, filename)) !== record.files[ext]?.sha256) throw new Error(`Hash mismatch: ${filename}`);
      }
      verifyExcerpt(probe(join(output, item.id + '.mp4')), item.duration, item.hasAudio);
      run('ffmpeg', ['-v', 'error', '-xerror', '-i', join(output, item.id + '.mp4'), '-f', 'null', '-']);
    }
    console.log(`All ${showcase.length} previews decode, match their receipts and meet the web profile.`);
    return;
  }
  if (!process.env.SITE_TESTS_ROOT || !process.env.SITE_LIBRARY_ROOT) {
    throw new Error('Set SITE_TESTS_ROOT and SITE_LIBRARY_ROOT explicitly. The website never assumes a neighbouring studio checkout or reads a library during a build.');
  }
  const roots = {
    tests: resolve(process.env.SITE_TESTS_ROOT),
    library: resolve(process.env.SITE_LIBRARY_ROOT),
  };
  const inputs = [];
  // Preflight every source before publishing any derivative. Captions are snapshotted in memory.
  for (const item of showcase) {
    const source = sources[item.id];
    const file = join(roots[source.root], source.path);
    if (!(await stat(file)).isFile()) throw new Error(`Missing source: ${file}`);
    const info = probe(file);
    if (!Number.isFinite(Number(info.format.duration)) || Number(info.format.duration) < item.start + item.duration) throw new Error(`Source too short: ${item.id}`);
    if (item.hasAudio && !info.streams.some(s => s.codec_type === 'audio')) throw new Error(`Missing source audio: ${item.id}`);
    let captions;
    let captionsSha256;
    if (source.captions) {
      const srt = await readFile(join(roots[source.root], source.captions), 'utf8');
      captionsSha256 = createHash('sha256').update(srt).digest('hex');
      captions = excerptCaptions(srt, item.start, item.duration);
    } else if (item.hasAudio) {
      captions = `WEBVTT\n\n00:00:00.000 --> ${vttTime(item.duration)}\n[${item.audioDescription}]\n`;
    }
    inputs.push({ item, file, captions, captionsSha256 });
    console.log(`${item.id}: ${file} — ${item.start}s + ${item.duration}s, ${item.hasAudio ? 'with source audio' : 'silent'}`);
  }
  if (flags.includes('--dry-run')) return;
  await mkdir(output, { recursive: true });
  const previous = await readFile(join(output, 'manifest.json'), 'utf8').then(JSON.parse).catch(() => ({ items: [] }));
  const staging = await mkdtemp(join(output, '.prepare-'));
  const receipts = [];
  try {
    for (const { item, file, captions, captionsSha256 } of inputs) {
      const sourceSha256 = await hashFile(file);
      const clip = join(staging, item.id + '.mp4');
      const audioArgs = item.hasAudio
        ? ['-map', '0:a:0', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-af', `afade=t=in:st=0:d=0.15,afade=t=out:st=${item.duration - 0.25}:d=0.25`]
        : ['-an'];
      run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-ss', String(item.start), '-i', file,
        '-t', String(item.duration), '-map', '0:v:0', ...audioArgs, '-sn', '-dn',
        '-vf', "scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24",
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p',
        '-map_metadata', '-1', '-map_chapters', '-1', '-movflags', '+faststart', clip]);
      verifyExcerpt(probe(clip), item.duration, item.hasAudio);
      run('ffmpeg', ['-v', 'error', '-xerror', '-i', clip, '-f', 'null', '-']);
      const poster = join(staging, item.id + '.jpg');
      run('ffmpeg', ['-v', 'error', '-ss', String(item.posterAt), '-i', clip,
        '-frames:v', '1', '-q:v', '3', '-map_metadata', '-1', poster]);
      if (captions) await writeFile(join(staging, item.id + '.vtt'), captions);
      const credits = [item.title, item.sourceVersion, item.source, '', item.credit,
        ...(item.credits || []).map(c => `${c.title}\n${c.url}\n${c.license}: ${c.licenseUrl}`),
        item.creditUrl || '', '', `Web excerpt: ${item.start}s + ${item.duration}s. ${item.hasAudio ? 'Original audio retained with short edge fades.' : 'Silent; original audio omitted.'} Source unchanged.`];
      await writeFile(join(staging, item.id + '.credits.txt'), credits.join('\n') + '\n');
      const files = {};
      for (const ext of extensions(item)) {
        const path = join(staging, `${item.id}.${ext}`);
        files[ext] = { sha256: await hashFile(path), bytes: (await stat(path)).size };
      }
      if (await hashFile(file) !== sourceSha256) throw new Error('Source changed while preparing ' + item.id);
      receipts.push({ id: item.id, source: sources[item.id], sourceSha256, captionsSha256,
        start: item.start, duration: item.duration, hasAudio: item.hasAudio, files });
    }
    // All clips have passed before any public file is replaced.
    for (const item of showcase) for (const ext of extensions(item)) {
      const filename = `${item.id}.${ext}`;
      await rename(join(staging, filename), join(output, filename));
    }
    await writeFile(join(staging, 'manifest.json'), JSON.stringify({ version: 2, items: receipts }, null, 2) + '\n');
    await rename(join(staging, 'manifest.json'), join(output, 'manifest.json'));
    // Retire only named derivatives from the previous generated bundle, never production sources.
    for (const old of previous.items || []) {
      if (!/^[a-z-]+$/.test(old.id) || showcase.some(item => item.id === old.id)) continue;
      for (const ext of ['jpg', 'mp4', 'vtt', 'credits.txt']) await rm(join(output, `${old.id}.${ext}`), { force: true });
    }
    console.log(`Prepared ${showcase.length} verified previews with credits. Originals are unchanged. Rebuild the site to include them.`);
  } finally { await rm(staging, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
