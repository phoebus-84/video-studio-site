#!/usr/bin/env node
// Explicit, read-only import of studio documentation. Normal builds never read a studio checkout.
import { readFile, writeFile, readdir, mkdir, realpath, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative, join, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const receiptPath = join(root, 'data/studio-reference.json');
const repository = 'https://github.com/phoebus-84/video-studio';
export const pages = ['architecture', 'context', 'contributing', 'install', 'pipelines', 'repository-layout', 'resolve-handoff', 'running', 'workspace'];
// Former imports, not website pages. Allow their checked removal, never reimport them.
const retiredPaths = new Set(['docs/harness-review.md']);
const hash = text => createHash('sha256').update(text).digest('hex');
export function ownedPath(path) {
  if (retiredPaths.has(path)) return false;
  return path === 'docs/public/resolve-handoff.example.json' || pages.some(page => path === `docs/${page}.md`) ||
    /^docs\/adr\/(?:\d{4}-[\w-]+|index)\.md$/.test(path) ||
    /^docs\/(?:packages|studio)\/[\w-]+\.md$/.test(path) ||
    (/^docs\/reference\/[\w./-]+\.md$/.test(path) && !path.split('/').some(p => p.startsWith('.')) && !/(^|\/)plan\.md$/i.test(path));
}
const inside = (base, path) => { const rel = relative(base, path); return !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../'); };
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'plan.md') result.push(path);
  }
  return result;
}
export function rewriteLinks(text, file, known, sourceOf, revision) {
  return text.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (whole, label, target) => {
    if (/^(?:https?:|mailto:|#)/i.test(target)) return whole;
    const [path, fragment] = target.split('#');
    if (!path || (path.startsWith('/') && known.has(`docs/public${path}`))) return whole;
    const suffix = fragment ? `#${fragment}` : '';
    let dest = path.startsWith('/') ? `docs${path}` : relative(root, resolve(root, dirname(file), path));
    if (!/\.[^/]+$/.test(dest)) dest = path.endsWith('/') || path === '.' || path === '..' ? dest + '/index.md' : dest + '.md';
    if (dest === 'docs/index.md') dest = 'docs/guide.md';
    if (known.has(dest) && !retiredPaths.has(dest)) {
      let link = relative(dirname(file), dest).replace(/\\/g, '/');
      if (!link.startsWith('.')) link = './' + link;
      return `[${label}](${link}${suffix})`;
    }
    // Do not publish planning exhaust or silently resurrect deleted pages.
    // A reference to excluded material goes to the pinned source repository instead.
    const source = sourceOf(dest);
    if (!source || source.startsWith('../') || isAbsolute(source)) return `${label} (in the studio repository)`;
    const url = `${repository}/blob/${revision}/${source.split('/').map(encodeURIComponent).join('/')}${suffix}`;
    return `[${label}](${url})`;
  });
}
async function check() {
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  if (receipt.version !== 1 || !/^[a-f0-9]{40}$/.test(receipt.revision)) throw new Error('Invalid reference receipt');
  for (const entry of receipt.files) {
    if (!ownedPath(entry.path)) throw new Error(`Unsafe reference path: ${entry.path}`);
    if (hash(await readFile(join(root, entry.path))) !== entry.sha256) throw new Error(`Reference changed: ${entry.path}. Refresh explicitly; do not edit the imported copy.`);
  }
  console.log(`Verified ${receipt.files.length} reference files from ${receipt.revision.slice(0, 7)}. No studio checkout needed.`);
}
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--check') return check();
  if (args.length !== 2 || args[0] !== '--from') throw new Error('Usage: npm run reference:sync -- --from /path/to/video-studio\nFirst run npm run docs:generate in that checkout. Or use npm run reference:check.');
  const from = await realpath(resolve(args[1]));
  if (from === root) throw new Error('Choose the studio repository, not the website');
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: from, encoding: 'utf8' }).trim();
  const dirty = Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: from, encoding: 'utf8' }).trim());
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: from, encoding: 'utf8' }).split('\0');
  const caseMap = new Map(tracked.map(path => [path.toLowerCase(), path]));
  const manifest = JSON.parse(await readFile(join(from, 'compose.config.json'), 'utf8'));
  const components = Object.fromEntries(Object.entries(manifest.components).map(([name, c]) => [name, { path: c.path, standalone: c.standalone, capabilities: c.capabilities, summary: c.summary }]));
  const sourceOf = dest => {
    const match = dest.match(/^docs\/reference\/([^/]+)\/(.*)$/);
    if (match && components[match[1]]) {
      const path = `${components[match[1]].path}/${match[2]}`;
      return caseMap.get(path.toLowerCase()) ?? path;
    }
    return caseMap.get(dest.toLowerCase()) ?? dest;
  };
  const selected = pages.map(page => join(from, 'docs', page + '.md'));
  selected.push(join(from, 'docs/public/resolve-handoff.example.json'));
  for (const dir of ['adr', 'packages', 'studio', 'reference']) selected.push(...await walk(join(from, 'docs', dir)));
  const inputs = [];
  for (const path of [...new Set(selected)].sort()) {
    const dest = relative(from, path);
    if (!ownedPath(dest)) continue;
    if (!inside(from, await realpath(path))) throw new Error(`Source escapes checkout: ${dest}`);
    const input = await readFile(path, 'utf8');
    inputs.push({ path: dest, input, source: sourceOf(dest), sourceSha256: hash(input) });
  }
  const known = new Set(inputs.map(i => i.path));
  for (const file of await walk(join(root, 'docs'))) {
    const dest = relative(root, file);
    if (!ownedPath(dest) && !retiredPaths.has(dest)) known.add(dest);
  }
  const output = inputs.map(entry => {
    let body = entry.input;
    if (!entry.path.endsWith('.md')) return { ...entry, content: body, sha256: hash(body) };
    if (entry.path === 'docs/reference/index.md') body = '# Component reference\n\n' + Object.entries(components).map(([name,c]) => `- [${name}](./${name}/readme.md) — ${c.summary}`).join('\n') + '\n';
    body = rewriteLinks(body, entry.path, known, sourceOf, revision);
    const banner = `> Imported studio reference, based on [${revision.slice(0,7)}](${repository}/tree/${revision})${dirty ? ' with local source edits' : ''}. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).\n\n`;
    // Keep any YAML frontmatter first; headings and relative anchors remain unchanged.
    const frontmatter = body.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    const content = (frontmatter ? frontmatter[0] + '\n' + banner + body.slice(frontmatter[0].length) : banner + body).trimEnd() + '\n';
    return { ...entry, content, sha256: hash(content) };
  });
  const readSource = async path => {
    const full = join(from, path);
    if (!inside(from, await realpath(full))) throw new Error(`Source escapes checkout: ${path}`);
    return readFile(full, 'utf8');
  };
  const commands = (await Promise.all(['studio/agent/src/slash-commands.ts', 'studio/agent/src/tui-status.ts'].map(readSource))).join('\n');
  const pipeline = await readSource('studio/agent/src/pipeline-tools.ts');
  const commandNames = [...commands.matchAll(/registerCommand\?\.\("([^"]+)"/g)].map(m => m[1]);
  const gatewayTools = [...pipeline.matchAll(/name: "(pva_[^"]+)"/g)].map(m => m[1]);
  const previous = await readFile(receiptPath, 'utf8').then(JSON.parse).catch(error => {
    if (error.code === 'ENOENT') return { files: [] };
    throw error;
  });
  for (const entry of previous.files) {
    if (!ownedPath(entry.path) && !retiredPaths.has(entry.path)) throw new Error(`Unsafe previous receipt: ${entry.path}`);
    const current = await readFile(join(root, entry.path)).catch(e => { if (e.code === 'ENOENT') return null; throw e; });
    if (current && hash(current) !== entry.sha256) throw new Error(`Local edit in ${entry.path}; preserve or revert it before refreshing.`);
  }
  // All source reads and validation finish before replacing any imported copy.
  for (const entry of output) {
    await mkdir(dirname(join(root, entry.path)), { recursive: true });
    await writeFile(join(root, entry.path), entry.content);
  }
  for (const entry of previous.files) if (!output.some(i => i.path === entry.path)) await rm(join(root, entry.path), { force: true });
  await mkdir(dirname(receiptPath), { recursive: true });
  await writeFile(receiptPath, JSON.stringify({ version: 1, repository, revision, includesLocalEdits: dirty, components, commandNames, gatewayTools,
    files: output.map(({path, source, sourceSha256, sha256}) => ({path, source, sourceSha256, sha256})) }, null, 2) + '\n');
  console.log(`Imported ${output.length} reference files. Review and commit the snapshot. No source files were modified.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
