<script setup>
// The second take, as it was rendered: docs/correction-shown.md says how.
// Seconds 2 and 3 carry the title that changed; the stills are of take 2.
import { withBase } from 'vitepress';
const seconds = [0, 1, 2, 3, 4, 5].map(second => ({ second, redone: second === 2 || second === 3 }));
</script>
<template>
  <ol class="take-strip" aria-label="Six seconds of film, rendered twice. Seconds three and four were rendered again; the other four were reused.">
    <li v-for="cell in seconds" :key="cell.second" :class="{ redone: cell.redone }">
      <img :src="withBase('/proof/take-2-second-' + cell.second + '.jpg')" alt="" width="480" height="270" loading="lazy" decoding="async">
      <span>00:0{{ cell.second }} <b>{{ cell.redone ? 'rendered again' : 'reused' }}</b></span>
    </li>
  </ol>
</template>
