import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL('../../' + path, import.meta.url), 'utf8');

test('published slash commands exist in the current registrations', async () => {
  const snapshot = JSON.parse(await read('data/studio-reference.json'));
  const registered = new Set(snapshot.commandNames);
  const guide = await read('docs/running.md');
  const published = [...guide.matchAll(/^\| `\/([^\s`]+)[^`]*` \|/gm)].map(m => m[1]);
  assert.ok(published.length > 0);
  for (const command of published) assert.ok(registered.has(command), `Unregistered command: /${command}`);
  for (const name of snapshot.gatewayTools) assert.ok(guide.includes(name), `Missing gateway-dependent tool: ${name}`);
});

test('package overview covers the composition manifest without inventing pages', async () => {
  const config = JSON.parse(await read('data/studio-reference.json'));
  const guide = await read('docs/guide.md');
  for (const [name, entry] of Object.entries(config.components)) {
    if (entry.standalone) assert.ok(guide.includes(`(./packages/${name})`), `Document ${name} in the package overview`);
  }
  for (const [, name] of guide.matchAll(/\(\.\/packages\/([^)]+)\)/g)) assert.ok(config.components[name]?.standalone, `No composed package: ${name}`);
});

test('public system explanations distinguish current execution from historical promises', async () => {
  for (const path of ['docs/architecture.md', 'docs/how-it-works.md', 'docs/quick-start.md']) {
    const text = await read(path);
    assert.match(text, /gateway/i, path);
    assert.match(text, /pipeline tools/i, path);
    assert.doesNotMatch(text, /superpowers\//, path);
  }
  const architecture = await read('docs/architecture.md');
  assert.match(architecture, /Remotion renders/);
  assert.match(architecture, /FFmpeg processes/);
  assert.match(architecture, /vertical-1080x1920/);
  assert.match(architecture, /not a blanket lock/i);
  assert.doesNotMatch(await read('docs/workspace.md'), /forthcoming series compilers/);
  assert.doesNotMatch(await read('docs/pipelines.md'), /legacy gateway autopilot/);
  assert.doesNotMatch(await read('docs/guide.md'), /48 accepted/);
  assert.doesNotMatch(await read('README.md'), /FFmpeg compiles the\s+result|Turns one prompt/);
});
