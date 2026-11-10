import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { recipes, recipePhases, filterRecipes } from '../../docs/.vitepress/theme/recipes.mjs';
import { ownedPath } from '../sync-reference.mjs';

const read = path => readFile(new URL('../../' + path, import.meta.url), 'utf8');

test('every recipe belongs to one nonempty phase and has a matching, website-owned page', async () => {
  const phases = recipePhases.map(phase => phase.id);
  assert.equal(new Set(phases).size, phases.length);
  assert.equal(new Set(recipes.map(recipe => recipe.slug)).size, recipes.length);
  for (const phase of recipePhases) {
    assert.match(phase.id, /^[a-z-]+$/);
    assert.ok(phase.title && phase.text);
    assert.ok(recipes.some(recipe => recipe.phase === phase.id));
  }
  const pages = (await readdir(new URL('../../docs/recipes/', import.meta.url)))
    .filter(file => file.endsWith('.md') && file !== 'index.md');
  assert.deepEqual(pages.sort(), recipes.map(recipe => recipe.slug + '.md').sort());
  for (const recipe of recipes) {
    assert.ok(phases.includes(recipe.phase), recipe.slug);
    const path = `docs/recipes/${recipe.slug}.md`;
    assert.equal(ownedPath(path), false, 'reference refresh must not overwrite ' + path);
    const body = await read(path);
    assert.equal(body.match(/^# (.+)$/m)?.[1], recipe.title, recipe.slug);
    assert.match(body, /^description: \S.+$/m);
    assert.match(body, /^## Ingredients$/m);
    assert.match(body, /\*\*Costs:\*\*|makes no paid API calls/);
  }
  const config = await read('docs/.vitepress/config.mts');
  assert.match(config, /recipes\.map/);
});

test('recipe search is case-insensitive, trims whitespace and covers creative as well as technical needs', () => {
  assert.deepEqual(filterRecipes('   '), recipes);
  assert.deepEqual(filterRecipes('  BLENDER\n').map(recipe => recipe.slug), ['blender-scene']);
  assert.deepEqual(filterRecipes('pOeM').map(recipe => recipe.slug), ['poetry-lesson']);
  assert.ok(filterRecipes('voice').some(recipe => recipe.slug === 'create-a-character'));
  assert.ok(filterRecipes('channel').some(recipe => recipe.slug === 'build-a-channel'));
  assert.deepEqual(filterRecipes('no such recipe'), []);
  assert.deepEqual(filterRecipes('<script>'), []);
});

test('development guides teach proposals, human decisions and reusable preparation', async () => {
  assert.deepEqual(recipes.filter(recipe => recipe.phase === 'prepare').map(recipe => recipe.slug), [
    'build-a-channel', 'research-and-materials', 'create-a-character', 'repeatable-series'
  ]);
  const channel = await read('docs/recipes/build-a-channel.md');
  for (const slug of ['research-and-materials', 'create-a-character', 'repeatable-series', 'poetry-lesson']) {
    assert.ok(channel.includes(`(./${slug})`), slug);
  }
  assert.match(channel, /\*\*You decide:\*\*/);
  assert.match(channel, /fresh session/);
  const character = await read('docs/recipes/create-a-character.md');
  assert.match(character, /do not guarantee/);
  assert.match(character, /voice rights/);
  const series = await read('docs/recipes/repeatable-series.md');
  assert.match(series, /second subject/i);
  assert.match(series, /not edited in place/);
});

test('the poetry case distinguishes prepared context, two treatments and actual gallery evidence', async () => {
  const poem = await read('docs/recipes/poetry-lesson.md');
  assert.match(poem, /fai il sabato del villaggio, sia la poesia 9\/16 sia la lezione completa/);
  assert.match(poem, /9:16/);
  assert.match(poem, /16:9/);
  assert.match(poem, /not a claim that these particular Leopardi videos are already in the gallery/);
  assert.match(poem, /not bundled with a fresh studio installation/);
  assert.match(poem, /two treatments, not one crop/);
  assert.match(poem, /does not automatically cover a modern translation/);
  assert.match(poem, /not permission for the agent to invent a human approval/);
});
