<script setup>
import { withBase } from 'vitepress';
import { brand } from '../brand.mjs';
</script>
<template>
  <footer class="site-footer">
    <a class="footer-wordmark" :href="withBase('/')">{{ brand.name }}<span>{{ brand.descriptor }}</span></a>
    <div><a :href="withBase('/quick-start')">Get started</a><a :href="withBase('/guide')">Documentation</a><a :href="withBase('/limits')">Limits</a><a :href="withBase('/changelog')">Changelog</a><a :href="brand.repository">GitHub</a></div>
    <p>Site code and text: AGPL-3.0. The films, their stills and their music are not covered: each keeps its own credits and licence. <a :href="withBase('/licence')">Licence</a></p>
  </footer>
</template>
