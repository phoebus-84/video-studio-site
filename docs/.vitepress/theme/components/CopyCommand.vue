<script setup>
import { ref } from 'vue';
const props = defineProps({ command: { type: String, required: true }, label: { type: String, default: 'Terminal' } });
const state = ref('');
async function copy() {
  try {
    await navigator.clipboard.writeText(props.command);
    state.value = 'Copied to clipboard.';
  } catch { state.value = 'Copy unavailable. Select the command and copy it manually.'; }
}
</script>
<template>
  <div class="copy-command">
    <div class="command-bar"><span>{{ label }}</span><button type="button" @click="copy" :aria-label="'Copy ' + label + ' command'">Copy</button></div>
    <pre tabindex="0"><code>{{ command }}</code></pre>
    <span class="copy-status" role="status">{{ state }}</span>
  </div>
</template>
