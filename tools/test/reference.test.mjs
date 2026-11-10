import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ownedPath, rewriteLinks } from '../sync-reference.mjs';

test('reference import cannot overwrite the homepage, recipes, media or unrelated files', () => {
  for (const path of ['docs/architecture.md', 'docs/adr/0049-media.md', 'docs/reference/agent/readme.md']) assert.ok(ownedPath(path));
  for (const path of ['docs/harness-review.md','docs/index.md','docs/guide.md','docs/recipes/first-render.md','docs/reference/../index.md','docs/reference/.private/secret.md','docs/reference/agent/plan.md','docs/public/showcase/a.mp4','package.json']) assert.ok(!ownedPath(path), path);
});
test('reference links retain local pages and move excluded plans to the pinned source', () => {
  const known = new Set(['docs/guide.md','docs/reference/index.md','docs/running.md']);
  const revision = 'a'.repeat(40);
  const result = rewriteLinks('[Run](./running#budget) [Overview](./index.md#packages) [Reference](./reference/) [Plan](superpowers/old.md)', 'docs/architecture.md', known, p=>p, revision);
  assert.equal(rewriteLinks('[Example](/resolve-handoff.example.json)', 'docs/resolve-handoff.md', new Set(['docs/public/resolve-handoff.example.json']), p=>p, revision), '[Example](/resolve-handoff.example.json)');
  assert.equal(result, `[Run](./running.md#budget) [Overview](./guide.md#packages) [Reference](./reference/index.md) [Plan](https://github.com/phoebus-84/video-studio/blob/${revision}/docs/superpowers/old.md)`);
});
test('internal review stays out of the published snapshot and navigation', async () => {
  await assert.rejects(readFile(new URL('../../docs/harness-review.md', import.meta.url)), {code: 'ENOENT'});
  for (const path of ['docs/.vitepress/config.mts', 'docs/guide.md', 'docs/how-it-works.md']) {
    const text = await readFile(new URL('../../' + path, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /harness[- ]review/i, path);
  }
  // A stale known-page list must not bring a retired route back into the site.
  const revision = 'b'.repeat(40);
  for (const target of ['./harness-review', './harness-review.md', '/harness-review.md']) {
    assert.equal(rewriteLinks(`[Review](${target}#limits)`, 'docs/architecture.md', new Set(['docs/harness-review.md']), p=>p, revision),
      `[Review](https://github.com/phoebus-84/video-studio/blob/${revision}/docs/harness-review.md#limits)`);
  }
});
test('committed reference snapshot is complete and hash-verified without a studio checkout', async () => {
  const snapshot = JSON.parse(await readFile(new URL('../../data/studio-reference.json',import.meta.url)));
  assert.ok(snapshot.files.length > 30 && snapshot.commandNames.length > 0 && snapshot.gatewayTools.length > 0);
  assert.match(snapshot.revision,/^[a-f0-9]{40}$/);
  for (const entry of snapshot.files) {
    assert.ok(ownedPath(entry.path));
    const bytes = await readFile(new URL('../../'+entry.path,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.path);
  }
});
test('media preparation refuses implicit sibling or library roots', () => {
  const env = {...process.env};
  delete env.SITE_TESTS_ROOT; delete env.SITE_LIBRARY_ROOT;
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../prepare-site-media.mjs',import.meta.url)), '--dry-run'], {env,encoding:'utf8'});
  assert.equal(result.status,1);
  assert.match(result.stderr,/Set SITE_TESTS_ROOT and SITE_LIBRARY_ROOT explicitly/);
});
test('website dependencies and build commands do not import studio workspaces', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json',import.meta.url)));
  assert.equal(pkg.workspaces,undefined);
  for (const spec of Object.values({...pkg.dependencies,...pkg.devDependencies})) assert.doesNotMatch(spec,/^(workspace:|file:|link:)/);
  assert.doesNotMatch(pkg.scripts.build,/sync|\.\.\//);
  const browser = await readFile(new URL('../website-browser-smoke.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(browser,/createRequire|studio\/web/);
});
