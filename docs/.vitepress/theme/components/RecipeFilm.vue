<script setup>
// The film a recipe ends with: its excerpt, one line, and the way to its receipt.
import { withBase } from 'vitepress';
import { data as films } from '../showcase.data';
import MediaFrame from './MediaFrame.vue';
const props = defineProps({ id: { type: String, required: true } });
const film = films.find(item => item.id === props.id);
</script>
<template>
  <figure v-if="film" class="recipe-film">
    <MediaFrame :item="film" />
    <figcaption><strong>{{ film.title }}</strong> · {{ film.sourceDuration }}. {{ film.shows }} <a :href="withBase('/examples') + '#' + film.id">Its receipt and credits</a></figcaption>
  </figure>
</template>
