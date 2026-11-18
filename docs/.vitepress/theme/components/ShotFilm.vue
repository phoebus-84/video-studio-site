<script setup>
// A rigged character filmed by pva_rig_shot on 18 November 2026: the second
// test figure, textured, playing the walk that came with its rig three times
// over. The published file is that shot scaled to 960×540, with no sound, as
// it was made. docs/recipes/create-a-character.md gives the run.
import { withBase } from 'vitepress';
</script>
<template>
  <figure class="shot-film">
    <video controls muted loop playsinline preload="none" width="960" height="540" :poster="withBase('/proof/shot-walk.jpg')" :src="withBase('/proof/shot-walk.mp4')" aria-label="Three seconds of film: a small boy in a blue jacket, a yellow scarf and a grey cap walks on the spot on a pale floor, seen from three-quarter, his shadow under him.">The filmed walk, as an MP4.</video>
  </figure>
</template>
