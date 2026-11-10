import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { showcase } from '../../docs/showcase.mjs';
const read = path => readFile(new URL('../../' + path, import.meta.url), 'utf8');

test('public selection excludes unlicensed audio and pins every full download', async () => {
  const policy = JSON.parse(await read('data/public-media.json'));
  assert.equal(policy.repository, 'phoebus-84/video-studio-site');
  assert.match(policy.previews.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(Object.keys(policy.items).sort(), showcase.map(p => p.id).sort());
  assert.equal(policy.items['nothing-is-only-one-thing'].preview, false);
  assert.equal(policy.items['nothing-is-only-one-thing'].download, undefined);
  for (const [id, item] of Object.entries(policy.items)) {
    if (!item.download) continue;
    assert.equal(item.preview, true);
    assert.match(item.download.asset, /^[a-z0-9-]+\.mp4$/);
    assert.match(item.download.sha256, /^[a-f0-9]{64}$/);
    assert.ok(item.download.bytes > 0 && item.download.bytes < 2 ** 31);
    assert.ok(item.download.duration >= showcase.find(p => p.id === id).duration);
  }
  assert.ok(policy.items['ambient-kowloon'].download.duration >= 3600);
  assert.match(policy.items.sonnet.download.edition, /original audio omitted/);
});

test('Pages deploy restores pinned media, uses the repository base and least-privilege deployment', async () => {
  const workflow = await read('.github/workflows/pages.yml');
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run media:restore-public/);
  assert.match(workflow, /DOCS_BASE: \/video-studio-site\//);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  const restore = await read('tools/restore-public-media.mjs');
  assert.match(restore, /createHash\('sha256'\)/);
  assert.match(restore, /Unexpected archive entry/);
  assert.match(restore, /rm\(output, \{ recursive: true, force: true \}\)/);
  assert.match(await read('.gitignore'), /\.site-media\//);
});
