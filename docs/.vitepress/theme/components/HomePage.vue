<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as allProjects } from '../showcase.data';
import MediaFrame from './MediaFrame.vue';
import CopyCommand from './CopyCommand.vue';
import ArrowIcon from './ArrowIcon.vue';
import SiteFooter from './SiteFooter.vue';
const projects = allProjects.filter(project => project.featured);
const selected = ref(0);
const active = computed(() => projects[selected.value]);
const installation = 'git clone https://github.com/phoebus-84/video-studio.git\ncd video-studio\nmise install\nbun install\nnpm run compose -- --profile=studio\nnpm run doctor';
</script>
<template>
  <div class="site-page home-page">
    <section class="opening page-width">
      <h1>A production studio.<br><em>Directed by you.</em></h1>
      <div class="opening-bottom">
        <p>Turn an idea into a video you can actually shape. An AI agent brings together writing, visuals, voice and editing. You keep the files, the history—and the final say.</p>
        <div class="opening-actions"><a class="button primary" :href="withBase('/quick-start')">Start creating <ArrowIcon /></a><a class="text-link" href="#selected-work">See what’s possible <ArrowIcon class="arrow-down" /></a></div>
      </div>
    </section>

    <section id="selected-work" class="screening page-width" aria-label="Selected work">
      <div class="screening-heading"><span>Selected work from the studio</span><a :href="withBase('/examples')">Explore the films <ArrowIcon /></a></div>
      <div class="screening-body">
        <MediaFrame :item="active" />
        <div class="programme">
          <button v-for="(project, index) in projects" :key="project.id" type="button" :aria-pressed="selected === index" @click="selected = index">
            <span class="programme-meta">{{ project.category }} <span>{{ project.format }}</span></span>
            <strong>{{ project.title }}</strong><span class="programme-technique">{{ project.technique }}</span>
            <span v-if="selected === index" class="now-showing">On screen <ArrowIcon /></span>
          </button>
          <p>Real projects. Selected excerpts.<br>Not one-click promises.</p>
        </div>
      </div>
      <p class="screening-caption">{{ active.visual }}</p>
    </section>

    <section class="intro-section page-width">
      <h2>The space between<br>“what if” and <em>the final cut.</em></h2>
      <div class="intro-copy"><p>Video Studio is a production system that runs on your machine. Work with an agent in Pi or Claude Code, give it source material and a direction, and build the film in stages.</p><p>It isn’t one model that does everything. It’s a coordinated set of tools: choose existing footage, generate a scene, record narration, compose the edit, then review what you made.</p><a class="text-link" :href="withBase('/how-it-works')">Meet your new workflow <ArrowIcon /></a></div>
    </section>

    <section class="collaboration-section page-width">
      <div class="collaboration-copy">
        <h2>Your studio.<br><em>Not just your machine.</em></h2>
        <p>Bring another person into the project without sending a folder called “final-final”. Each channel can have its own Git repository. Version the editorial work, share the media through S3-compatible storage, and let a collaborator pick up the same production.</p>
        <a class="text-link" :href="withBase('/collaboration')">See how collaboration works <ArrowIcon /></a>
      </div>
      <div class="handoff-map" aria-label="Git versions editorial files. A media lock connects them to exact media bytes in S3-compatible storage.">
        <div><h3>Git</h3><p>The decisions and their history</p><ul><li>Scripts &amp; episode specs</li><li>Templates, themes &amp; kits</li><li>Timelines &amp; production records</li></ul><span>Commit · branch · review · merge</span></div>
        <div><h3>S3-compatible storage</h3><p>The media, outside Git</p><ul><li>Images, voice &amp; footage</li><li>Editable Blender sources</li><li>Selected masters &amp; deliveries</li></ul><span>Upload once · restore what you need</span></div>
        <div class="media-lock"><code>media.lock.jsonl</code><p>Versioned paths + SHA-256 hashes link the edit to the exact media. A collaborator clones the channel, restores the files and verifies the match.</p></div>
      </div>
    </section>

    <section class="workflow-section">
      <div class="page-width">
        <div class="section-heading"><h2>One idea.<br><em>A real production process.</em></h2><p>Creative decisions stay human.<br>Repetitive work gets a capable assistant.</p></div>
        <ol class="workflow-steps">
          <li><span class="step-number">01</span><h3>Give it direction</h3><p>A brief, a poem, a repository, your footage. Start with the material and the audience, not a wall of settings.</p></li>
          <li><span class="step-number">02</span><h3>Build the pieces</h3><p>The agent works with the tools you’ve enabled. Inspect scripts, images, narration and editable sources as they take shape.</p></li>
          <li><span class="step-number">03</span><h3>Review the edit</h3><p>Check the layout before rendering. Request a correction. Human review gates wait for you, not another AI.</p></li>
          <li><span class="step-number">04</span><h3>Make the next one</h3><p>Keep useful formats as series templates. Reuse the standards without turning every story into the same video.</p></li>
        </ol>
        <a class="text-link" :href="withBase('/how-it-works')">What stays on your machine <ArrowIcon /></a>
      </div>
    </section>

    <section class="recipe-preview page-width">
      <div class="section-heading"><h2>Build the world.<br><em>Then make the films.</em></h2><a class="text-link" :href="withBase('/recipes/')">Explore the guides <ArrowIcon /></a></div>
      <a class="recipe-row" :href="withBase('/recipes/build-a-channel')"><span class="recipe-type">Channel</span><h3>Build a channel with a point of view</h3><p>Research, references and creative proposals. Turn your choices into a direction worth returning to.</p><ArrowIcon /></a>
      <a class="recipe-row" :href="withBase('/recipes/create-a-character')"><span class="recipe-type">Characters</span><h3>A character people recognise</h3><p>Find the role, compare identities, audition a voice. Give your series a cast.</p><ArrowIcon /></a>
      <a class="recipe-row" :href="withBase('/recipes/repeatable-series')"><span class="recipe-type">Series</span><h3>A format worth repeating</h3><p>Review a pilot, test a second subject and save the decisions that make the next episode easier.</p><ArrowIcon /></a>
      <a class="recipe-row" :href="withBase('/recipes/poetry-lesson')"><span class="recipe-type">In practice</span><h3>One poem. Two films.</h3><p>Inside Poesie al museo: the preparation behind a short request for a recital and a complete lesson.</p><ArrowIcon /></a>
    </section>

    <section class="ownership-section page-width">
      <h2>A finished video.<br><em>Not a black box.</em></h2>
      <div class="ownership-list">
        <article><h3>Your work has a history.</h3><p>Scripts, specs, timelines and production records are versionable files. Each channel can live in its own Git repository; your team’s work stays separate from the application.</p></article>
        <article><h3>Choose the tools you need.</h3><p>Local graphics and rendering, optional generation providers, editable Blender scenes. Missing capabilities are reported, not quietly substituted.</p></article>
        <article><h3>Know what you’re approving.</h3><p>Review gates belong to the operator. Supported paid tools record spend; set an episode budget before asking them to generate.</p></article>
      </div>
    </section>

    <section class="start-section">
      <div class="page-width start-grid"><div><h2>Your next project<br><em>starts here.</em></h2><p>Install the workspace. Check your machine. Add only the capabilities your first project needs.</p><a class="button primary" :href="withBase('/quick-start')">Follow the quick start <ArrowIcon /></a><p class="small-note">Requires Git, mise and FFmpeg. Agent accounts and generation services are separate.</p></div><CopyCommand :command="installation" label="Install the studio" /></div>
    </section>
    <section class="faq-section page-width">
      <h2>A few things worth knowing.</h2>
      <details><summary>Is this a hosted, one-click video generator?</summary><p>No. It is a local production workspace with an agent coordinating specialised tools. You install it, choose capabilities and review the work. There is no hosted account to create here.</p></details>
      <details><summary>Do I need paid AI services to get started?</summary><p>Not for the first-render recipe. Agent conversations require your chosen agent’s model access; cloud image and video tools have their own credentials and costs. You can work with existing media instead.</p></details>
      <details><summary>Can I use Claude Code instead of Pi?</summary><p>Yes. The repository’s MCP configuration exposes the same production tools to Claude Code. Start it from the repository root. The quick start covers both options.</p></details>
      <details><summary>Can a team work on the same channel?</summary><p>Yes: share the channel’s Git repository and configure a media remote to restore its large files. Work through branches, reviews and explicit handoffs—not simultaneous cloud editing. <a :href="withBase('/collaboration')">Follow the collaboration guide.</a></p></details>
      <details><summary>Does everything run on every computer?</summary><p>No. Requirements vary by capability. In particular, local MLX speech needs Apple Silicon. Use the studio profile without that worker and run doctor before choosing a recipe.</p></details>
      <details><summary>Can I take the edit into DaVinci Resolve?</summary><p>There is an optional handoff workflow through upstream MCP integrations. It needs its own setup and a live Resolve session; it is not a bundled one-click export. <a :href="withBase('/resolve-handoff')">Read the handoff guide.</a></p></details>
    </section>
    <SiteFooter />
  </div>
</template>
