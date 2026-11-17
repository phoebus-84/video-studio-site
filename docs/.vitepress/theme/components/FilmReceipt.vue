<script setup>
defineProps({ film: { type: Object, required: true } });
</script>
<template>
  <dl v-if="film.receipt" class="receipt" :aria-label="'Receipt for ' + film.title">
    <div v-for="row in film.receipt" :key="row.label"><dt>{{ row.label }}</dt><dd>{{ row.value }}</dd></div>
  </dl>
</template>
