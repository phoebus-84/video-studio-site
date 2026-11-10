#!/usr/bin/env node
// Restore only the immutable, checksum-pinned public preview bundle.
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { showcase } from '../docs/showcase.mjs';
const root = resolve(import.meta.dirname, '..');
const policy = JSON.parse(await readFile(join(root, 'data/public-media.json'), 'utf8'));
const url = `https://github.com/${policy.repository}/releases/download/${policy.release}/${policy.previews.asset}`;
const response = await fetch(url);
if (!response.ok) throw new Error('Preview bundle: HTTP ' + response.status);
const bytes = Buffer.from(await response.arrayBuffer());
if (createHash('sha256').update(bytes).digest('hex') !== policy.previews.sha256) throw new Error('Preview checksum mismatch');
const staging = join(root, '.site-media');
await mkdir(staging, { recursive: true });
const archive = join(staging, 'previews.tar.gz');
await writeFile(archive, bytes);
const allowed = new Set(showcase.filter(p => policy.items[p.id]?.preview).flatMap(p =>
  ['jpg', 'mp4', 'credits.txt', ...(p.hasAudio ? ['vtt'] : [])].map(ext => p.id + '.' + ext)));
function tar(args) {
  const result = spawnSync('tar', args, { encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr);
  return result.stdout;
}
const entries = tar(['-tzf', archive]).trim().split('\n').filter(p => p !== './');
for (const entry of entries) {
  if (!allowed.has(entry.replace(/^\.\//, ''))) throw new Error('Unexpected archive entry: ' + entry);
}
if (entries.length !== allowed.size || new Set(entries.map(p => p.replace(/^\.\//, ''))).size !== allowed.size) throw new Error('Incomplete or duplicate archive entries');
const output = join(root, 'docs/public/showcase');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
tar(['-xzf', archive, '-C', output]);
console.log('Restored the public preview selection. Full films are served by GitHub Releases, not Pages.');
