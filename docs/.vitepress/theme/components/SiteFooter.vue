<script setup>import { withBase } from 'vitepress';</script>
<template>
  <footer class="site-footer">
    <a class="footer-wordmark" :href="withBase('/')">Video Studio<span>Make something worth watching.</span></a>
    <div><a :href="withBase('/quick-start')">Get started</a><a :href="withBase('/guide')">Documentation</a><a href="https://github.com/phoebus-84/video-studio">GitHub</a></div>
    <p>Local production. Optional cloud tools. Your editorial decisions.</p>
  </footer>
</template>
