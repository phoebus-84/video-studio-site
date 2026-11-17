<script setup>
import { computed, nextTick, ref } from 'vue';
import { withBase } from 'vitepress';
import { recipePhases, filterRecipes } from '../recipes.mjs';
import ArrowIcon from './ArrowIcon.vue';
import SiteFooter from './SiteFooter.vue';
const query = ref('');
const filtered = computed(() => filterRecipes(query.value));
const groups = computed(() => recipePhases.map(phase => ({
  ...phase, recipes: filtered.value.filter(recipe => recipe.phase === phase.id)
})).filter(phase => phase.recipes.length));
async function showPhase(id) {
  query.value = '';
  await nextTick();
  window.location.hash = id;
  document.getElementById(id)?.scrollIntoView();
}
function resetSearch() {
  query.value = '';
  document.getElementById('recipe-query')?.focus();
}
</script>
<template>
  <div class="site-page">
    <header class="collection-header page-width">
      <h1>What you end with.<br><em>And how.</em></h1>
      <p>One recipe per kind of film, and per thing a film needs before it. Each names what you end with, what the agent runs, what it costs and where it goes wrong. The commands and the tool names are the real ones.</p>
      <nav class="recipe-paths" aria-label="Recipe paths"><a v-for="phase in recipePhases" :key="phase.id" :href="'#' + phase.id" @click.prevent="showPhase(phase.id)">{{ phase.title }} <ArrowIcon class="arrow-down" /></a></nav>
    </header>
    <section class="page-width recipe-collection" aria-label="Recipe collection">
      <div class="recipe-search"><label for="recipe-query">Find a recipe</label><input id="recipe-query" v-model="query" type="search" placeholder="Try “repository”, “footage” or “Blender”"><p role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'recipe' : 'recipes' }}</p></div>
      <section v-for="group in groups" :id="group.id" :key="group.id" class="recipe-group" :aria-labelledby="group.id + '-title'">
        <header class="recipe-group-heading"><h2 :id="group.id + '-title'">{{ group.title }}</h2><p>{{ group.text }}</p></header>
        <a v-for="recipe in group.recipes" :key="recipe.slug" class="recipe-row" :href="withBase('/recipes/' + recipe.slug)"><span class="recipe-type">{{ recipe.category }}<small>{{ recipe.level }}</small></span><h3>{{ recipe.title }}</h3><div><p>{{ recipe.text }}</p><span class="recipe-needs">{{ recipe.needs }}</span></div><ArrowIcon /></a>
      </section>
      <div v-if="!filtered.length" class="empty-results"><h2>No recipe matches “{{ query }}”.</h2><p>Try a subject, a tool, or a production stage.</p><button class="button" @click="resetSearch">Show all recipes</button></div>
    </section>
    <section class="page-width editorial-note"><h2>Start with six seconds</h2><p>The first render needs no agent, no account and no key. It proves the machine before a production depends on it, and it is the film the home page corrects.</p><a class="text-link" :href="withBase('/recipes/first-render')">Make your first local render <ArrowIcon /></a></section>
    <SiteFooter />
  </div>
</template>
