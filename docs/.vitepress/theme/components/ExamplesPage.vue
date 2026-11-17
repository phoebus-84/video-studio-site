<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as projects } from '../showcase.data';
import MediaFrame from './MediaFrame.vue';
import FilmReceipt from './FilmReceipt.vue';
import ArrowIcon from './ArrowIcon.vue';
import SiteFooter from './SiteFooter.vue';
const filter = ref('All work');
const categories = ['All work', ...new Set(projects.map(p => p.category))];
const filtered = computed(() => filter.value === 'All work' ? projects : projects.filter(p => p.category === filter.value));
</script>
<template>
  <div class="site-page">
    <header class="collection-header page-width"><h1>Six films.<br><em>Six receipts.</em></h1><p>Real productions and experiments, each with what is on record about it: what it was made from, what it cost where a cost was recorded, and whose work is in it.</p></header>
    <div class="page-width">
      <div class="filter-bar" role="group" aria-label="Filter examples"><button v-for="category in categories" :key="category" @click="filter = category" :aria-pressed="filter === category">{{ category }}</button></div>
      <p class="results-count" role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'project' : 'projects' }} · web-optimised excerpts · playback starts only when you choose</p>
      <article v-for="project in filtered" :id="project.id" :key="project.id" class="project-feature">
        <MediaFrame :item="project" />
        <div class="project-story">
          <h2>{{ project.title }}</h2>
          <p class="project-format">{{ project.category }} / {{ project.format }}</p>
          <p>{{ project.description }}</p>
          <p v-if="project.status" class="project-status">{{ project.status }}</p>
          <dl>
            <dt>How it was made</dt><dd>{{ project.made }}</dd>
            <dt>What it shows</dt><dd>{{ project.shows }}</dd>
            <dt>On screen in the excerpt</dt><dd>{{ project.visual }}</dd>
            <template v-if="project.hasAudio"><dt>Sound</dt><dd>{{ project.audioDescription }}</dd></template>
          </dl>
          <h3 class="receipt-title">Receipt</h3>
          <FilmReceipt :film="project" />
          <div v-if="project.download" class="project-download">
            <a class="button" :href="project.download.url" :aria-label="project.download.label + ': ' + project.title" download>{{ project.download.label }} <ArrowIcon /></a>
            <p>{{ project.download.edition }} · {{ Math.ceil(project.download.bytes / 1000000) }} MB</p>
            <a :href="project.download.creditsUrl">Download credits &amp; licences</a>
          </div>
          <p v-if="project.publicationNote" class="publication-note">{{ project.publicationNote }}</p>
          <a class="text-link" :href="withBase(project.recipe)">Try the related recipe <ArrowIcon /></a>
          <details v-if="project.transcript"><summary>{{ project.narration ? 'Read the excerpt transcript' : 'Audio & visual description' }}</summary><p>{{ project.transcript }}</p></details>
          <details>
            <summary>Source &amp; credits</summary>
            <p>{{ project.sourceVersion }} · {{ project.source }}</p><p>{{ project.credit }}</p>
            <ul v-if="project.credits" class="source-credits"><li v-for="credit in project.credits" :key="credit.url"><a :href="credit.url">{{ credit.title }}</a> — <a :href="credit.licenseUrl">{{ credit.license }}</a></li></ul>
            <a v-if="project.creditUrl" :href="project.creditUrl">Source / technique reference</a>
            <p>Excerpt starts at {{ project.start }} seconds. Web compression{{ project.hasAudio ? ' and short audio edge fades' : '; original audio omitted' }}. Source productions are unchanged.</p>
          </details>
        </div>
      </article>
      <aside class="editorial-note"><h2>What a receipt is, and is not</h2><p>A row is a fact read from the film’s files, its credits or its episode’s journal. Rows nobody recorded are left out: no film here has a figure for a person’s time or for the machine’s, and only two have a recorded spend. The studio does not print these receipts yet; they were assembled by hand from its records.</p><p>These are examples, not bundled templates or a promise of a one-prompt result. The films, their stills and their music are not covered by this site’s licence: each keeps the credits and licence listed with it.</p><a :href="withBase('/site-maintenance')">How preview media is prepared</a></aside>
    </div>
    <SiteFooter />
  </div>
</template>
