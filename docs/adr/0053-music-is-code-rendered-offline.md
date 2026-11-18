> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0053: Music is Strudel code, rendered offline by the engine the studio plays it with

## Status

Accepted. Implemented:
- `@av/strudel`: a piece evaluated, described and rendered in a headless
  Chrome; `analyzeAudio`, `levelAudio`; `@av/strudel/session` for a browser;
- the `MusicRender` record and `@studio/episode`'s `checkMusic`,
  `renderMusic`, `listMusic`;
- `pva_music_check`, `pva_music_render`, `pva_music`;
- the gateway's `/music` routes, the studio's piece viewer and Music tab;
- the skills `strudel-music`, `strudel-sounds`, `strudel-forms`.

## Context

A production needs music and designed sound that fit it: a bed under a voice
at the episode's length, a cue that enters on a cut, a loop for an hour of
ambience, one instrument of a theme, a riser under a title. The studio had a
single chord progression (`pva_synthesize_sound`'s `music-bed`) and whatever a
licensed archive offered.

The agent can write code, and cannot hear. So music here is something the
agent writes as text, that a person can read, change and play, and whose
result is described in numbers.

Two languages of the same family were considered:

- **TidalCycles** is Haskell, and makes no sound itself: it sends events to
  SuperDirt, a SuperCollider program that plays them in real time. Rendering a
  file means recording that server while it plays. It needs GHC and
  SuperCollider beside the studio's three runtimes, an audio server running,
  and has no engine a browser could host.
- **Strudel** is the same pattern language in JavaScript, with its own engine
  on Web Audio. It runs in a browser tab, renders offline faster than it
  plays, and is the same code in the studio's page and in a headless Chrome —
  which the studio already needs to render video.

## Decision

- **Strudel**, pinned to one version (`@strudel/web` 1.3.0). The control plane
  stays TypeScript (ADR-0018) and no runtime is added.
- **A piece is a file**: `music/<name>.strudel` in an episode, a channel
  source or a film unit. Its parts are labelled statements (`bass: …`). The
  agent writes and edits it with its file tools; a person does in the studio.
  It is text, versioned like any other.
- **One engine, three uses.** A check, a render and the studio's player
  evaluate a piece with the same code (`@av/strudel/session`) on the same
  Strudel build. What a person plays is what a render writes.
- **Rendered offline, in a page closed to the world.** The page is served the
  pinned bundle and the audio files of the workspace, and nothing else: the
  network is off unless a request allows it, and what a piece fetched is then
  recorded by address and hash.
- **Not Strudel's own export.** That one triggers every event before
  rendering begins, and so loses what the engine does on the main thread
  while a piece plays: ducking, the release of finished voices, the reverb's
  impulse; an event at the very start that ducks another is dropped. Here the
  offline context is stepped every 10 ms, the next events are triggered and
  the callbacks that came due run, after a short pre-roll that is cut off.
- **Seeded.** The engine's randomness (noise, reverb, detune) is seeded, in
  the page and in its audio worklets, where every voice has a stream of its
  own: voices that start together are processed in an order Chrome does not
  fix, and with one shared stream a chord of supersaws came out different
  every time. Two renders of a piece differ by less than −130 dBFS: Chrome's
  audio arithmetic is not bit-exact from run to run, and no claim of
  identical bytes is made. The record carries the hash of the file that was
  written.
- **A render is any part of a piece**: a stretch of cycles, some of its
  parts, a lead-in, a tail, or a seamless loop (the tail folded over the
  start), and each part alone as a stem at the gain it has in the mix.
- **Levelled with one gain, never a compressor.** A file is brought to a
  loudness (−18 LUFS unless asked otherwise) when its peaks allow it; when
  they do not it stays under the ceiling (−1 dBFS), quieter than asked, and
  its record says by how much and where its highest peak is. −18 is what
  music with drums reaches under that ceiling without being squeezed, and
  the level the pieces of a long version are set to.
- **`<file>.music.json`** beside every rendered file: the piece and the file
  by hash, what was asked, the tempo, the parts, the level, the measurements
  (loudness, spectrum by band, stereo image, the level through time; for
  each stem its loudness, bands and width), the workspace samples it
  loaded, and what to listen for.
- **A check and a render say what the numbers show is wrong**: a sound that
  does not exist, a control the engine ignores, parts that ask one orbit
  for two reverbs, a loop whose parts do not play after its last cycle what
  they played from its first (their events are compared over two passes),
  an ending cut while it sounds.
- **Synthesis first.** The engine's own sounds are oscillators and noise.
  Strudel's usual drum machines, pianos and soundfonts are sample packs on
  other people's servers, of mixed and often unstated licence: none is
  bundled or fetched by default. A piece may use audio files of its own
  workspace as samples, which have the provenance the studio already keeps
  (ADR-0046).
- **`@av/strudel` is AGPL-3.0-or-later**, as Strudel is: the exception to
  `packages/` being Apache-2.0. A piece of music is its author's, and so is
  what is rendered from it.

## Consequences

- Music costs nothing, needs no account, and is made to measure: the agent
  sets a piece's length, key, tempo and form, and renders again after a note
  from the operator.
- Whoever cannot listen still works by evidence: a check lists the events
  and the notes an expression really produced; a render reports where the
  energy is and how each stem sits. What the numbers cannot tell — whether it
  is good — is the operator's to hear, and the record says what to listen to.
- Rendering needs a Chrome. Remotion's is used when it is there, else
  Playwright's or the machine's own; `npm run doctor` says which.
- The sound is a synthesizer's. A film that needs an orchestra or a singer
  needs a composer or a licensed recording, and the skills say so.
- Stems are rendered one part at a time. Parts made of noise, a supersaw or
  reverb draw on the seeded randomness in the order events come, so a stem
  sounds like its part in the mix without being the same samples.
- A render holds at most fifteen minutes. Longer music is a loop, repeated
  where it is used.
- The pinned Strudel version is part of a piece's meaning. Raising it can
  change how a piece sounds: it is a release that says so. The skills hold
  only what was measured on this version, and
  `tools/test/music-skills.test.mjs` evaluates and renders every example in
  them, so a change of engine shows there first.
