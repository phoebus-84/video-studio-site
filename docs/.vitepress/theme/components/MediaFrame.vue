<script setup>
import { nextTick, ref, watch } from 'vue';
import { withBase } from 'vitepress';
const props = defineProps({ item: { type: Object, required: true } });
const playing = ref(false);
const failed = ref(false);
const video = ref(null);
const retryCount = ref(0);
watch(() => props.item.id, () => { playing.value = false; failed.value = false; retryCount.value = 0; });
function fail() { failed.value = true; playing.value = false; }
function retry() { playing.value = false; failed.value = false; retryCount.value += 1; }
async function play() {
  const target = video.value;
  if (!target) return;
  try { await target.play(); }
  catch { if (video.value === target) fail(); }
}
function onPlay() {
  playing.value = true;
  document.querySelectorAll('.media-frame video').forEach(other => {
    if (other !== video.value) other.pause();
  });
  nextTick(() => video.value?.focus());
}
</script>
<template>
  <div class="media-frame" :class="{ portrait: item.format === '9:16', 'is-playing': playing }">
    <template v-if="item.available && !failed">
      <video :key="item.id + retryCount" ref="video" :src="withBase('/showcase/' + item.id + '.mp4') + (retryCount ? '?retry=' + retryCount : '')"
        :poster="withBase('/showcase/' + item.id + '.jpg')" :aria-label="item.title + ': ' + item.visual"
        preload="none" playsinline :muted="!item.hasAudio" :controls="playing" @play="onPlay" @error="fail">
        <track v-if="item.hasAudio" kind="captions" :src="withBase('/showcase/' + item.id + '.vtt')" srclang="en" label="English" :default="!!item.narration">
      </video>
      <button v-if="!playing" class="play-button" type="button" @click="play" :aria-label="'Play ' + item.title + (item.hasAudio ? ' excerpt with sound' : ' silent excerpt')">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor"/></svg>
        <span>{{ item.hasAudio ? 'Watch & listen' : 'Watch excerpt' }} <small>{{ item.duration }} sec · {{ item.hasAudio ? 'sound on' : 'silent' }}</small></span>
      </button>
    </template>
    <div v-else class="media-unavailable">
      <p>{{ item.title }}</p>
      <span>{{ failed ? 'The preview could not load.' : (item.publicationNote || 'This build does not include the preview media.') }}</span>
      <a :href="withBase(item.recipe)">Explore the workflow</a>
      <button v-if="failed" @click="retry" type="button">Try preview again</button>
    </div>
  </div>
</template>
