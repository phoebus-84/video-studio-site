<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as films } from '../showcase.data';
import { brand } from '../brand.mjs';
import MediaFrame from './MediaFrame.vue';
import FilmReceipt from './FilmReceipt.vue';
import TakeStrip from './TakeStrip.vue';
import ModelStrip from './ModelStrip.vue';
import RigStrip from './RigStrip.vue';
import ShotFilm from './ShotFilm.vue';
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
        <h3>Then a skeleton. Then it is posed, and looked at.</h3>
        <RigStrip show="poses" />
        <p class="take-caption">A second test figure, 18 November 2026. Its model was given a skeleton by a rigging service in about twenty seconds, for $0.20 on the episode’s ledger, and then put in seven known poses on your own machine, at no cost, with a count of how far each pulled its surface out of shape. Six rigs were made that day and all six passed the check at rest. It was the poses that told them apart. <a :href="withBase('/recipes/create-a-character') + '#_4-a-skeleton-and-the-poses-that-test-it'">The six rigs, pose by pose</a></p>
        <h3>Then it moves. Then it is filmed.</h3>
        <ShotFilm />
        <p class="take-caption">The second figure with its textures, 18 November 2026. Three seconds of film from one request, rendered locally in about twenty seconds, at no cost: the camera was asked for in words (three-quarter, the whole figure, following it) and no script was written by hand. This walk came with the rig. A motion can also be picked by name from a free catalogue, carried over from another skeleton, or asked for in a sentence for $0.08. <a :href="withBase('/recipes/create-a-character') + '#_5-give-it-motion'">How it was asked for</a></p>
        <h3>Then two of them, in a place.</h3>
        <ShotFilm show="meeting" />
        <p class="take-caption">The same figure released twice, 1.2 m and 0.95 m tall, as two characters of a cast, 18 November 2026. One request names a set, who stands on which of its marks and what each does: walk to the lamp, wait, run over, turn, wave. The walk takes the time its own steps say (0.83 m/s, read from the foot on the ground), and the camera comes nearer as they meet. The set is a Blender scene the agent built; what happens on it was described, not scripted. Ten seconds, rendered in 54 seconds on a 32-core machine and in about two and a half minutes on a laptop. A character with nothing to do stands with its arms down. Look at the wave: a motion made for a person’s proportions, on a child with a large head. The tool says where it goes wrong (his hand 10.7 cm into his head, for two and a half seconds) and does not yet correct it. <a :href="withBase('/recipes/create-a-character') + '#_9-put-two-of-them-in-a-place'">How it was asked for</a></p>
        <p class="not-yet"><b>Not built yet.</b> A face, and touch. A generated rig has no bones for the mouth or the eyes, so the character cannot speak. And nobody touches anything: a hand on a door, an object carried, two bodies in contact are still a Blender scene the agent builds. <a :href="withBase('/limits') + '#a-generated-character-has-no-face-and-touches-nothing'">What is missing</a></p>
      </div>
    </section>

    <section class="screen score" aria-labelledby="score-title">
      <div class="page-width score-grid">
        <div>
          <p class="screen-label">Music</p>
          <h2 id="score-title">The score is a text file.<br><em>So it can be corrected like one.</em></h2>
          <p class="screen-lede">Music here is procedural: the agent writes it as <a :href="'https://strudel.cc'">Strudel</a> code and your machine renders it, at no cost and with no service. A bed under a voice at the episode’s length, a cue on a cut, a loop for an hour, a riser or an impact for a scene. Each part has a name, so “the bass is too loud after the second chorus” is a change to one line.</p>
          <p class="screen-lede">The agent cannot hear, and is told so. Every render comes with measurements it mixes by (loudness, the peak and when it falls, the spectrum by band, each part alone) and with what a person should listen for.</p>
          <a class="text-link" :href="withBase('/recipes/music-in-code')">Write a score in code <ArrowIcon /></a>
        </div>
        <div>
          <pre class="score-code" aria-label="Three of the six parts of a five-second piece written as code"><code><i>// A logo sting: a one-second rising run into a chord that lands at 1.0 s.</i>
setcpm(120/4)
run:   n("0 2 4 7 9 11 14 16").scale("D4:major").fast(2).mask("1 0")
         .s("triangle").lpf(3000).decay(.12).sustain(.2).release(.1)
         .gain(saw.range(.25, .6).fast(2)).pan(saw.range(.3, .7).fast(2))
chord: n("[0,4,7,9,11]").scale("D3:major").struct("~ x")
         .s("supersaw").lpf(4000).attack(.005).decay(2).sustain(0).release(1.2)
         .room(.5).rsize(3).gain(.32)
low:   note("d2").struct("~ x").s("sine").attack(.005).decay(1.8).sustain(0).release(1).gain(.42)
<i>// and three more: a whoosh, a thump, a bell. Six parts, eighteen events.</i></code></pre>
          <figure class="score-play">
            <audio controls preload="none" :src="withBase('/proof/sting.mp3')">The five-second piece, as an MP3.</audio>
            <figcaption>That piece, rendered on 18 November 2026: five seconds, brought to −18 LUFS. The code says the chord lands at one second; the measurement puts the peak at 1.02 s. Nobody has mixed it by ear.</figcaption>
          </figure>
        </div>
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

    <section class="screen lately" aria-labelledby="lately-title">
      <div class="page-width">
        <p class="screen-label">Lately</p>
        <h2 id="lately-title">What changed,<br><em>and when.</em></h2>
        <ol class="lately-list">
          <li><p class="lately-when"><b>On the main branch</b>20 November 2026 · to be 0.3.0</p><div><h3>A character that stands, and a hand found in its head</h3><p>Between its clips a character stands with its arms down, not in the pose it was rigged in. The rig’s sheet and a scene’s report say when a hand goes into the head or the body, and how deep. <a :href="withBase('/recipes/create-a-character') + '#_9-put-two-of-them-in-a-place'">Put two of them in a place</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>18 November 2026 · to be 0.3.0</p><div><h3>Characters in one picture, and in a place</h3><p>Several roles of a cast on the marks of a set, each doing one thing after another. A walk goes at its clip’s own pace, and the tool says who was out of the picture, hidden, or sliding. <a :href="withBase('/recipes/create-a-character') + '#_9-put-two-of-them-in-a-place'">Put two of them in a place</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>18 November 2026 · to be 0.3.0</p><div><h3>A rig released as a character’s form in one step</h3><p>Stood once in its file (facing front, feet on the ground, at its own height), copied with its clips, sheets and records, and put on the character’s record. <a :href="withBase('/recipes/create-a-character') + '#_7-release-it-in-one-step'">Release it</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>18 November 2026 · to be 0.3.0</p><div><h3>A rigged character, filmed</h3><p>One request films a rig playing a clip, on your machine and at no cost, from a camera asked for in a shot’s words. A picture becomes a model, a rig, a motion and footage with no script written by hand. <a :href="withBase('/recipes/create-a-character') + '#_6-film-it'">Film it</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>18 November 2026 · to be 0.3.0</p><div><h3>Motion for a rig, three ways</h3><p>Clips picked by name from a free catalogue, a clip carried from one skeleton to another, and a person’s motion asked for in a sentence. <a :href="withBase('/recipes/create-a-character') + '#_5-give-it-motion'">Give it motion</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>18 November 2026 · to be 0.3.0</p><div><h3>A skeleton for a generated model, and a sheet of poses to judge it by</h3><p>Two rigging services behind one tool, a check of every rig before it is used, and the rig posed and measured on your machine. <a :href="withBase('/recipes/create-a-character')">A character people recognise</a></p></div></li>
          <li><p class="lately-when"><b>On the main branch</b>17 November 2026 · to be 0.3.0</p><div><h3>Music written as code</h3><p>A piece is a file of Strudel code, checked without a sound and rendered locally with its measurements; the browser studio plays it on the same engine. <a :href="withBase('/recipes/music-in-code')">Write a score in code</a></p></div></li>
        </ol>
        <a class="text-link" :href="withBase('/changelog')">The whole changelog, with what needs action <ArrowIcon /></a>
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
