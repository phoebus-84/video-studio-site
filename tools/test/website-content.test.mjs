import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { showcase } from '../../docs/showcase.mjs';
import { brand } from '../../docs/.vitepress/theme/brand.mjs';
import { ownedPath } from '../sync-reference.mjs';

const read = path => readFile(new URL('../../' + path, import.meta.url), 'utf8');

test('what a visitor reads about a film is about the film, not about which file was selected', () => {
  // Version bookkeeping lives in sourceVersion, source and status; prose that says
  // "v03, not the earlier…" reads as noise to anyone who was not in the edit.
  const bookkeeping = /\bv\d{1,3}\b|\bV\d{3}\b|pointer|latest (?:candidate|delivery|render)|earlier (?:master|test)/i;
  for (const film of showcase) {
    for (const field of ['description', 'made', 'shows']) {
      assert.ok(film[field]?.length > 40, `${film.id}.${field}`);
      assert.doesNotMatch(film[field], bookkeeping, `${film.id}.${field}`);
    }
    assert.ok(film.sourceVersion && film.source, film.id + ' keeps its bookkeeping as data');
  }
});

test('a receipt states facts on record and never a figure nobody recorded', () => {
  for (const film of showcase) {
    assert.ok(film.receipt.length >= 3, film.id);
    for (const row of film.receipt) {
      assert.ok(row.label && row.value, film.id);
      // The studio measures neither; a row for them would be invented.
      assert.doesNotMatch(row.label, /human time|machine time|made by/i, film.id);
    }
    assert.equal(film.receipt[0].label, 'Length', film.id);
  }
  const spend = film => film.receipt.find(row => row.label === 'Paid generation')?.value;
  assert.match(spend(showcase.find(f => f.id === 'ambient-kowloon')), /\$1\.50 recorded in the episode’s journal/);
  assert.match(spend(showcase.find(f => f.id === 'nothing-is-only-one-thing')), /\$1\.60 recorded in the episode’s journal/);
});

test('the product is named in one place', async () => {
  assert.ok(brand.name && brand.descriptor && brand.repository.startsWith('https://github.com/'));
  const config = await read('docs/.vitepress/config.mts');
  assert.match(config, /title: brand\.name/);
  assert.match(config, /siteTitle: brand\.name/);
  const owned = ['docs/index.md', 'docs/examples.md', 'docs/quick-start.md', 'docs/how-it-works.md', 'docs/collaboration.md',
    'docs/limits.md', 'docs/compare.md', 'docs/retake.md', 'docs/licence.md', 'docs/correction-shown.md',
    ...(await readdir(new URL('../../docs/recipes/', import.meta.url))).map(file => 'docs/recipes/' + file)];
  for (const path of owned) {
    assert.equal(ownedPath(path), false, path + ' is the website’s own page');
    const text = await read(path);
    assert.doesNotMatch(text, new RegExp(`\\b${brand.name}\\b|Video Studio`), path + ' writes the name as %product%');
  }
  for (const path of ['HomePage.vue', 'SiteFooter.vue', 'ExamplesPage.vue', 'RecipesPage.vue']) {
    const text = await read('docs/.vitepress/theme/components/' + path);
    assert.doesNotMatch(text, new RegExp(`>[^<{]*\\b(?:${brand.name}|Video Studio)\\b`), path + ' takes the name from brand.mjs');
  }
});

test('the first page keeps the plan’s order and promises nothing that is not built', async () => {
  const home = await read('docs/.vitepress/theme/components/HomePage.vue');
  const order = ['Make episode twenty', 'Fix second 47.', 'A production house,', 'Three receipts.', 'The same character, every episode.',
    'You keep the studio.', 'When you should use', 'Your first render'];
  let at = -1;
  for (const phrase of order) {
    const next = home.indexOf(phrase, at + 1);
    assert.ok(next > at, phrase);
    at = next;
  }
  assert.equal((home.match(/Not built yet\./g) ?? []).length, 2);
  assert.doesNotMatch(home, /npx create-|first-video|autoplay/);
  assert.doesNotMatch(home, /\b(?:revolutionary|magic|powerful|seamless|effortless)\b/i);
});

test('the benchmark page is a specification and the comparison is dated and sourced', async () => {
  const retake = await read('docs/retake.md');
  assert.match(retake, /Nothing on this page is a result/);
  assert.match(retake, /does not exist yet/);
  assert.doesNotMatch(retake, /\d+(?:\.\d+)?\s?%\s+(?:better|faster|cheaper)|we measured/i);
  const compare = await read('docs/compare.md');
  assert.match(compare, /16 November 2026/);
  for (const source of ['github.com/OpenMontageInc/OpenMontage', 'github.com/TensaikunYT/Videohub', 'github.com/invideoio/cli', 'github.com/higgsfield-ai/skills']) {
    assert.ok(compare.includes(source), source);
  }
  assert.match(compare, /vendor’s claims|vendor's claims/);
  assert.match(compare, /specified and not run/);
  const limits = await read('docs/limits.md');
  for (const text of ['It is not unattended', 'Receipts are assembled by hand', 'Nothing is measured yet', 'Remotion is not free software']) {
    assert.ok(limits.includes(text), text);
  }
});

test('the site is licensed, and its licence does not reach the films', async () => {
  assert.match(await read('LICENSE'), /GNU AFFERO GENERAL PUBLIC LICENSE\s+Version 3/);
  const page = await read('docs/licence.md');
  assert.match(page, /films, their stills and their music are not covered/);
  assert.match(await read('README.md'), /films, their stills and their music are not covered/);
  assert.match(await read('docs/.vitepress/theme/components/SiteFooter.vue'), /films, their stills and their music are not covered/);
});

test('recipes name real tools and say where they go wrong', async () => {
  const receipt = JSON.parse(await read('data/studio-reference.json'));
  const running = await read('docs/running.md');
  const changelog = await read('docs/changelog.md');
  const files = (await readdir(new URL('../../docs/recipes/', import.meta.url))).filter(file => file !== 'index.md' && file !== 'poetry-lesson.md');
  for (const file of files) {
    const text = await read('docs/recipes/' + file);
    assert.match(text, /^\*\*You end with:\*\*/m, file);
    assert.match(text, /^## Where it goes wrong$/m, file);
    for (const [tool] of text.matchAll(/\bpva_[a-z0-9_]+/g)) {
      assert.ok(running.includes(tool) || changelog.includes(tool) || receipt.gatewayTools.includes(tool), `${file}: ${tool} is not a tool of the imported reference`);
    }
  }
});
