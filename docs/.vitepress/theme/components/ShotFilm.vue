<script setup>
// Rigged characters filmed on 18 November 2026, as the tools made them and
// scaled to 960×540, with no sound. docs/recipes/create-a-character.md gives
// the runs.
//   walk:    pva_rig_shot, the second test figure playing the walk that came
//            with its rig, three times over.
//   meeting: pva_stage_shot, that figure released twice — 1.2 m and 0.95 m
//            tall — as two characters on a set, with a camera that goes with
//            them.
import { withBase } from 'vitepress';
const props = defineProps({ show: { type: String, default: 'walk' } });
const films = {
  walk: {
    file: 'shot-walk',
    label: 'Three seconds of film: a small boy in a blue jacket, a yellow scarf and a grey cap walks on the spot on a pale floor, seen from three-quarter, his shadow under him.',
    fallback: 'The filmed walk, as an MP4.',
  },
  meeting: {
    file: 'stage-meeting',
    label: 'Ten seconds of film: on a street at dusk, a boy in a grey cap walks in from the left to a lamppost while a smaller boy waits by a door. The smaller one runs to him, the camera comes nearer, and the taller one raises a hand to his cap.',
    fallback: 'The meeting under the lamp, as an MP4.',
  },
};
const film = films[props.show] ?? films.walk;
</script>
<template>
  <figure class="shot-film">
    <video controls muted loop playsinline preload="none" width="960" height="540" :poster="withBase('/proof/' + film.file + '.jpg')" :src="withBase('/proof/' + film.file + '.mp4')" :aria-label="film.label">{{ film.fallback }}</video>
  </figure>
</template>
