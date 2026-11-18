<script setup>
// The five-second piece of docs/recipes/music-in-code.md, as it was rendered
// on 18 November 2026. A player in Markdown cannot name the file itself: the
// site is served under a base path, and only withBase knows it.
import { withBase } from 'vitepress';
</script>
<template>
  <audio class="score-audio" controls preload="none" :src="withBase('/proof/sting.mp3')">A five-second piece, as an MP3.</audio>
</template>
