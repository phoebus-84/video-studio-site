<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as projects } from '../showcase.data';
import MediaFrame from './MediaFrame.vue';
import ArrowIcon from './ArrowIcon.vue';
import SiteFooter from './SiteFooter.vue';
const filter = ref('All work');
const categories = ['All work', ...new Set(projects.map(p => p.category))];
const filtered = computed(() => filter.value === 'All work' ? projects : projects.filter(p => p.category === filter.value));
</script>
<template>
  <div class="site-page">
    <header class="collection-header page-width"><h1>Made with intention.<br><em>Made in the studio.</em></h1><p>A small selection of real productions and experiments. Different visual languages, different tools, the same principle: keep the process as considered as the result.</p></header>
    <div class="page-width">
      <div class="filter-bar" role="group" aria-label="Filter examples"><button v-for="category in categories" :key="category" @click="filter = category" :aria-pressed="filter === category">{{ category }}</button></div>
      <p class="results-count" role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'project' : 'projects' }} · web-optimised excerpts · playback starts only when you choose</p>
      <article v-for="project in filtered" :id="project.id" :key="project.id" class="project-feature">
        <MediaFrame :item="project" />
        <div class="project-story">
          <h2>{{ project.title }}</h2>
          <p class="project-format">{{ project.category }} / {{ project.format }}</p>
          <p>{{ project.description }}</p>
          <dl>
            <dt>Selected version</dt><dd>{{ project.sourceVersion }}<span v-if="project.sourceDuration"> · full work: {{ project.sourceDuration }}</span></dd>
            <dt>Made with</dt><dd>{{ project.technique }}</dd>
            <dt>What this example shows</dt><dd>{{ project.note }}</dd>
            <dt>Visual description</dt><dd>{{ project.visual }}</dd>
            <template v-if="project.hasAudio"><dt>Sound</dt><dd>{{ project.audioDescription }}</dd></template>
          </dl>
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
            <p>{{ project.source }}</p><p>{{ project.credit }}</p>
            <ul v-if="project.credits" class="source-credits"><li v-for="credit in project.credits" :key="credit.url"><a :href="credit.url">{{ credit.title }}</a> — <a :href="credit.licenseUrl">{{ credit.license }}</a></li></ul>
            <a v-if="project.creditUrl" :href="project.creditUrl">Source / technique reference</a>
            <p>Excerpt starts at {{ project.start }} seconds. Web compression{{ project.hasAudio ? ' and short audio edge fades' : '; original audio omitted' }}. Source productions are unchanged.</p>
          </details>
        </div>
      </article>
      <aside class="editorial-note"><h2>A note on the selection</h2><p>These are examples, not bundled templates or a guarantee of a one-prompt result. The recipes explain the techniques; the original library formats and experiment files remain separate. Public release of any project still requires checking its source credits and permissions.</p><a :href="withBase('/site-maintenance')">How preview media is prepared</a></aside>
    </div>
    <SiteFooter />
  </div>
</template>
