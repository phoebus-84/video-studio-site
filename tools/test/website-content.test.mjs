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
    assert.doesNotMatch(text, new RegExp(`\\b${brand.name}\\b`), path + ' writes the name as %product%');
  }
  for (const path of ['HomePage.vue', 'SiteFooter.vue', 'ExamplesPage.vue', 'RecipesPage.vue']) {
    const text = await read('docs/.vitepress/theme/components/' + path);
    assert.doesNotMatch(text, new RegExp(`>[^<{]*\\b${brand.name}\\b`), path + ' takes the name from brand.mjs');
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

test('a generated 3D model is shown with the skeleton it can be given, and with what still does not move it', async () => {
  const home = await read('docs/.vitepress/theme/components/HomePage.vue');
  assert.match(home, /<ModelStrip \/>/);
  assert.match(home, /<RigStrip show="poses" \/>/);
  assert.match(home, /all six passed the check at rest/);
  assert.match(home, /Not built yet\.<\/b> Motion you ask for/);
  assert.doesNotMatch(home, /statue until rigging and motion exist/);
  const recipe = await read('docs/recipes/create-a-character.md');
  assert.match(recipe, /pva_generate_model/);
  assert.match(recipe, /No skeleton, no motion/);
  assert.match(recipe, /quad: true, faceLimit: 20000/);
  for (const figure of ['1,434,958 triangles', '18,889 quads', '28,986 triangles', '$0.30', '$0.35', '$0.20']) assert.ok(recipe.includes(figure), figure);
  // The rig: both tools, the six runs with their figures, and what is still missing.
  for (const tool of ['pva_rig_model', 'pva_rig_sheet']) assert.ok(recipe.includes(tool), tool);
  for (const show of ['poses', 'drawn', 'walk']) assert.ok(recipe.includes(`<RigStrip show="${show}" />`), show);
  for (const figure of ['| 810 | 685 | 27 | 19 | 40 | 16 |', '| 3 | 1 | 0 | 0 | 40 | 0 |', '| 19 | 2 | 4 | 9 | 1 | 0 |', 'tear at most 26', '$1.40']) assert.ok(recipe.includes(figure), figure);
  assert.match(recipe, /All\s+six passed the examination at rest/);
  assert.match(recipe, /It does not animate/);
  const limits = await read('docs/limits.md');
  assert.match(limits, /A generated character barely moves/);
  assert.match(limits, /no motion from\s+words/);
  assert.doesNotMatch(limits, /Rigging and motion are named in the design and not built/);
  const strip = await read('docs/.vitepress/theme/components/RigStrip.vue');
  for (const [, file] of strip.matchAll(/file: '([a-z]+(?:-[a-z]+)*)'/g)) await read(`docs/public/proof/${file}.jpg`);
  for (const moment of [0, 1, 2, 3, 4, 5]) await read(`docs/public/proof/walk-${moment}.jpg`);
});

test('music written as code is shown with a piece, its measurements and what nobody has judged', async () => {
  const home = await read('docs/.vitepress/theme/components/HomePage.vue');
  assert.match(home, /The score is a text file/);
  assert.match(home, /The agent cannot hear/);
  assert.match(home, /\/proof\/sting\.mp3/);
  await read('docs/public/proof/sting.mp3');
  const recipe = await read('docs/recipes/music-in-code.md');
  for (const tool of ['pva_music_check', 'pva_music_render', 'pva_music']) assert.ok(recipe.includes(tool), tool);
  // The site is served under a base path: a player written into Markdown with a root address plays nothing.
  assert.match(recipe, /<ScoreAudio \/>/);
  assert.match(await read('docs/.vitepress/theme/components/ScoreAudio.vue'), /withBase\('\/proof\/sting\.mp3'\)/);
  for (const figure of ['-18.0 LUFS', 'peak -3.0 dBFS at 1.02 s', '18 events']) assert.ok(recipe.includes(figure), figure);
  assert.match(recipe, /Nobody has judged the music/);
  assert.match(recipe, /no piano, no drum kit/i);
  assert.match(recipe, /AGPL-3\.0-or-later/);
  const limits = await read('docs/limits.md');
  assert.match(limits, /Music is written by something that cannot hear/);
});

test('no site-owned page names a media file from the root: the site is served under a base path', async () => {
  const pages = [
    ...(await readdir(new URL('../../docs/', import.meta.url))).filter(file => file.endsWith('.md')).map(file => `docs/${file}`),
    ...(await readdir(new URL('../../docs/recipes/', import.meta.url))).filter(file => file.endsWith('.md')).map(file => `docs/recipes/${file}`),
  ];
  assert.ok(pages.length > 20);
  for (const file of pages) assert.doesNotMatch(await read(file), /<(?:audio|video|source|img)\b[^>]*\s(?:src|poster)="\//, file);
});

test('what changed lately is on the home page and in the navigation, and points at the imported changelog', async () => {
  const home = await read('docs/.vitepress/theme/components/HomePage.vue');
  assert.match(home, /id="lately-title"/);
  assert.match(home, /withBase\('\/changelog'\)/);
  assert.match(await read('docs/.vitepress/config.mts'), /\{ text: "Changelog", link: "\/changelog" \}/);
  const changelog = await read('docs/changelog.md');
  for (const entry of ['Music written as code', 'A skeleton for a 3D model', 'A rig posed and looked at']) assert.ok(changelog.includes(entry), entry);
});

test('the old name is gone from every tracked file, the imported reference included, outside the GitHub addresses that have to work', async () => {
  const { execFileSync } = await import('node:child_process');
  const root = new URL('../../', import.meta.url);
  let lines = [];
  try {
    lines = execFileSync('git', ['grep', '-I', '-i', '-n', '-E', 'video[ _-]?studio'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim().split('\n');
  } catch (error) {
    if (error.status !== 1) throw error; // 1: nothing found
  }
  // Where the repositories are today: the application's, this site's, and its Pages path.
  const literal = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const site = brand.siteRepository.replace('https://', '');
  const application = brand.repository.replace('https://', '');
  const [owner, name] = site.split('/').slice(1);
  const addresses = new RegExp([site, application, `${owner}.github.io/${name}`, `${owner}/${name}`, `/${name}/`].map(literal).join('|'), 'g');
  const left = lines.filter(Boolean).filter(line => {
    const [path] = line.split(':');
    return /video[ _-]?studio/i.test(line.slice(line.indexOf(':', path.length + 1) + 1).replace(addresses, ''));
  });
  assert.deepEqual(left, []);
});
