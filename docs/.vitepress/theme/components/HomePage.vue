<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as films } from '../showcase.data';
import { brand } from '../brand.mjs';
import MediaFrame from './MediaFrame.vue';
import FilmReceipt from './FilmReceipt.vue';
import TakeStrip from './TakeStrip.vue';
import ModelStrip from './ModelStrip.vue';
import CopyCommand from './CopyCommand.vue';
import ArrowIcon from './ArrowIcon.vue';
import SiteFooter from './SiteFooter.vue';

// On screen: the operator's three selected films, in the operator's order.
const programme = films.filter(film => film.featured);
const selected = ref(0);
const active = computed(() => programme[selected.value]);

// With receipts: one film per kind of work, the software explainer first.
const withReceipts = ['jaromail', 'ambient-kowloon', 'nothing-is-only-one-thing']
  .map(id => films.find(film => film.id === id));
const guide = films.find(film => film.id === 'sonnet');

const installation = `git clone ${brand.repository}.git ${brand.directory}\ncd ${brand.directory}\nmise install\nbun install\nnpm run compose -- --profile=studio\nnpm run doctor\nnpm run demo:render`;
</script>
<template>
  <div class="site-page home-page">
    <section id="now-showing" class="reel screening" aria-label="Now showing">
      <div class="reel-stage">
        <MediaFrame :item="active" />
        <div class="reel-copy">
          <p class="reel-kicker">{{ brand.name }} <span>{{ brand.descriptor }}</span></p>
          <h1>Make episode twenty<br class="wide"> as good as <em>episode one.</em></h1>
          <p class="reel-lede">And fix second 47 without touching the rest. {{ brand.name }} keeps what your agent forgets: every attempt, what each paid call cost, the licence of each borrowed asset, each decision you approved.</p>
          <div class="reel-actions"><a class="button primary" href="#install">Install it <ArrowIcon class="arrow-down" /></a><a class="text-link" href="#films">Three films, three receipts <ArrowIcon class="arrow-down" /></a></div>
        </div>
      </div>
      <div class="programme" role="group" aria-label="Choose the film on screen">
        <button v-for="(film, index) in programme" :key="film.id" type="button" :aria-pressed="selected === index" @click="selected = index">
          <span class="programme-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ film.title }}</strong>
          <span class="programme-detail">{{ film.category }} · {{ film.sourceDuration }}</span>
        </button>
      </div>
    </section>

    <section class="screen correction" aria-labelledby="correction-title">
      <div class="page-width">
        <p class="screen-label">The second take</p>
        <h2 id="correction-title">Fix second 47.<br><em>Keep everything else.</em></h2>
        <TakeStrip />
        <p class="take-caption">A real run, not an illustration. The six-second film that <code>npm run demo:render</code> makes, rendered twice with one title changed: two of its six one-second segments were rendered again, and the 96 frames of the other four are identical in both takes. <a :href="withBase('/correction-shown')">Run it yourself</a></p>
        <ol class="ruled-three">
          <li><h3>It knows what depends on what.</h3><p>Change a sentence and the stages downstream of it are marked stale. The rerun is planned before anything is spent.</p></li>
          <li><h3>It redoes only that.</h3><p>Picture is cached by the second; a film re-renders the shots that changed and the joins above them. The version you delivered is kept, not overwritten.</p></li>
          <li><h3>It shows the rest did not move.</h3><p>Old and new renders are decoded at the same instants and compared. A change outside the part you named is reported as unexpected.</p></li>
        </ol>
        <p class="not-yet"><b>Not built yet.</b> Drawing a note on the frame and having this happen by itself. Today you tell the agent what to change. <a :href="withBase('/limits')">What else is missing</a></p>
      </div>
    </section>

    <section class="screen pillars" aria-labelledby="pillars-title">
      <div class="page-width">
        <p class="screen-label">What it is</p>
        <h2 id="pillars-title">A production house,<br><em>not a slot machine.</em></h2>
        <ol class="pillar-list">
          <li><span>It repeats</span><p>A format is a pinned release: its compiler, its validator, its kits. An episode is a data file checked against it. Episode twenty goes through the same code as episode one.</p><a class="text-link" :href="withBase('/recipes/repeatable-series')">A format worth repeating <ArrowIcon /></a></li>
          <li><span>It corrects</span><p>Every attempt is kept. What depends on what is known. Change one thing and only what depends on it is made again.</p><a class="text-link" :href="withBase('/recipes/revise-with-confidence')">Change the line, keep the film <ArrowIcon /></a></li>
          <li><span>It accounts</span><p>A budget per episode, reserved before a paid call is made. A licence and its evidence for every borrowed asset. An approval only the operator can give.</p><a class="text-link" :href="withBase('/how-it-works')">How it works <ArrowIcon /></a></li>
        </ol>
      </div>
    </section>

    <section id="films" class="screen films" aria-labelledby="films-title">
      <div class="page-width">
        <p class="screen-label">Made with it</p>
        <h2 id="films-title">Three films.<br><em>Three receipts.</em></h2>
        <p class="screen-lede">Each row is a fact on record: read from the film’s files, its credits or its episode’s journal. What nobody recorded is not shown. There is no row for a person’s time, because the studio does not measure it yet.</p>
        <article v-for="film in withReceipts" :key="film.id" class="film-row">
          <a class="film-still" :href="withBase('/examples') + '#' + film.id" :aria-label="'Watch ' + film.title">
            <img v-if="film.available" :src="withBase('/showcase/' + film.id + '.jpg')" :alt="film.visual" width="1280" height="720" loading="lazy" decoding="async">
            <span v-else class="film-still-missing">{{ film.title }}<small>This build does not include the stills.</small></span>
          </a>
          <div class="film-story">
            <p class="film-kind">{{ film.category }}</p>
            <h3>{{ film.title }}</h3>
            <p>{{ film.shows }}</p>
            <FilmReceipt :film="film" />
            <a class="text-link" :href="withBase('/examples') + '#' + film.id">Watch it, with its credits <ArrowIcon /></a>
          </div>
        </article>
        <a class="button on-dark" :href="withBase('/examples')">All six films <ArrowIcon /></a>
      </div>
    </section>

    <section class="screen cast" aria-labelledby="cast-title">
      <div class="page-width cast-grid">
        <div>
          <p class="screen-label">Characters</p>
          <h2 id="cast-title">The same character, every episode.<br><em>Because it’s the same file.</em></h2>
          <p class="screen-lede">A character is a record: who it is, apart from how it appears. It takes any form (a rig, a puppet, sprites, a drawing made by code, a photograph, a dot, a sound, a voice and nothing else) and each form is released in a folder that is never edited. A series casts it in a role and pins the release it wears.</p>
          <a class="text-link" :href="withBase('/recipes/create-a-character')">Give a series its cast <ArrowIcon /></a>
        </div>
        <figure v-if="guide.available" class="cast-still">
          <img :src="withBase('/showcase/' + guide.id + '.jpg')" :alt="guide.visual" width="406" height="720" loading="lazy" decoding="async">
          <figcaption>The recurring guide of a poetry channel, in <a :href="withBase('/examples') + '#' + guide.id">Sonnet 18</a>.</figcaption>
        </figure>
      </div>
      <div class="page-width model-made">
        <h3>One picture in. A model out.</h3>
        <ModelStrip />
        <p class="take-caption">A test figure, run against the real service on 17 November 2026. From one picture, a model with its textures came back in 2 min 20 s: 18,889 quads, 2.8 MB, $0.35 on the episode’s ledger. It can be placed, turned and lit. <a :href="withBase('/recipes/create-a-character') + '#_3-a-3d-form-from-one-picture'">How it was asked for</a></p>
        <p class="not-yet"><b>Not built yet.</b> A skeleton, and motion. The model has neither: it is a statue until rigging and motion exist, and a script that asks it to walk is refused.</p>
      </div>
    </section>

    <section class="screen keep" aria-labelledby="keep-title">
      <div class="page-width">
        <p class="screen-label">Where it lives</p>
        <h2 id="keep-title">Your agent makes the video.<br><em>You keep the studio.</em></h2>
        <ol class="ruled-three">
          <li><h3>Git</h3><p>Scripts, episode data, formats, timelines and production records are text. A channel can be its own repository: commit, branch, review, merge.</p></li>
          <li><h3>S3-compatible storage</h3><p>Pictures, voice, footage and masters stay out of Git. Upload once; a collaborator restores what the work needs.</p></li>
          <li><h3><code>media.lock.jsonl</code></h3><p>Paths and SHA-256 hashes tie the edit to the exact media. Clone the channel, restore the files, verify the match.</p></li>
        </ol>
        <a class="text-link" :href="withBase('/collaboration')">How two people share a channel <ArrowIcon /></a>
      </div>
    </section>

    <section class="screen elsewhere" aria-labelledby="elsewhere-title">
      <div class="page-width">
        <p class="screen-label">Before you install</p>
        <h2 id="elsewhere-title">When you should use<br><em>something else.</em></h2>
        <ul class="elsewhere-list">
          <li><h3>You want one clip, now.</h3><p>A hosted generator gets you there sooner. This pays off the second time you make the same kind of video.</p></li>
          <li><h3>You want every model there is.</h3><p>It works with a few providers, chosen on purpose, and with what runs on your own machine.</p></li>
          <li><h3>You don’t want a terminal.</h3><p>You install it, and you direct an agent in Claude Code or Pi. The browser studio is a view of the work, not a replacement for either.</p></li>
          <li><h3>You want proof it beats the model on its own.</h3><p>There is none yet. Anyone can get a first take; the test for the second is written down before it is run, and it has produced no number.</p></li>
        </ul>
        <div class="elsewhere-links"><a class="text-link" :href="withBase('/compare')">{{ brand.name }} and the others <ArrowIcon /></a><a class="text-link" :href="withBase('/limits')">What does not work yet <ArrowIcon /></a><a class="text-link" :href="withBase('/retake')">Retake, the benchmark <ArrowIcon /></a></div>
      </div>
    </section>

    <section id="install" class="screen install" aria-labelledby="install-title">
      <div class="page-width install-grid">
        <div>
          <p class="screen-label">Install</p>
          <h2 id="install-title">Your first render<br><em>needs no key.</em></h2>
          <p class="screen-lede">The last line renders six seconds of titles on your machine and audits the file: no account, no provider, no paid call. An agent and any generation service are yours to add afterwards.</p>
          <p class="install-needs">Needs Git, mise and FFmpeg. Open source: the tools are Apache-2.0, the studio AGPL-3.0.</p>
          <div class="install-links"><a class="button primary" :href="withBase('/quick-start')">Follow the quick start <ArrowIcon /></a><a class="text-link" :href="brand.repository">Read the code <ArrowIcon /></a></div>
        </div>
        <CopyCommand :command="installation" label="Install the studio" />
      </div>
    </section>
    <SiteFooter />
  </div>
</template>
