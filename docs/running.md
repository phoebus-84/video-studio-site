> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Running the agent

Three ways to run, in increasing order of moving parts. Check tool readiness
on your machine; an installed package is not proof that every provider works.

## 0. Once: install and point at a library

```bash
cd /path/to/sergio
mise install      # node, bun and python at the pinned versions
bun install
npm run doctor
```

`mise install` is not optional politeness. The runtimes are pinned in
`mise.toml` because they are not interchangeable — `packages/voice` pins its
Python dependencies with hashes compiled against CPython 3.12, and installing
them under a different Python fails partway through with a missing wheel, which
reads like a broken package rather than a wrong interpreter. If you do not use
mise, match the versions in `mise.toml` by hand.

The agent works on a **library** — the on-disk tree of channels, series and
episodes described in [the workspace layout](./workspace.md). It defaults to `./library`
relative to where you start the agent. If your library lives outside the
repository, link it in:

```bash
ln -sfn /path/to/your/library library
```

`library/` is gitignored: it is production data, and ADR-0021 keeps generated
media out of git. To keep it elsewhere permanently, set `AVG_LIBRARY_ROOT`.

Check the runtime agrees the library is well-formed:

```bash
node studio/runtime/dist/src/cli.js doctor --library "$PWD/library" --json
```

`doctor` is the one command that requires `--library` outright: it reads no
environment variable and refuses without the flag. Everywhere else `--library`
wins, `AVG_LIBRARY_ROOT` is the fallback, and with neither set the root is the
working directory — where there is usually no library, so every episode
reports `Pipeline not found`. Pass the flag. Which root is in effect matters
more than it used to: `vpr run` and `vpr complete` write the episode's
journal, and the journal is the only record of what ran — pointed at the wrong
tree, it is authoritative about the wrong episode.

## 1. Agent alone — the normal way to work

From the repository root:

```bash
pi -e studio/agent/extensions/index.ts
```

That drops you into Pi's TUI with the studio extension loaded: the production
tools and the slash commands below. Add a prompt to go straight to work, or
`-p` for one non-interactive answer:

```bash
pi -e studio/agent/extensions/index.ts -p "list the channels in the library"
```

To avoid retyping the flag, install the package once:

```bash
pi install ./studio/agent     # then just: pi
pi list                       # confirm it is registered
```

### Slash commands

| Command | Purpose |
|---|---|
| `/video create <channel>/<series>/<episode>` | Create an episode (and its channel and series when missing) |
| `/video resume <channel>/<series>/<episode>` | Resume production on an episode |
| `/video status [<path>]` | Production status, for one episode or all |
| `/vstatus` | Stage status for the current episode |
| `/ctx` | Show resolved channel / series / episode context |
| `/skills` | List discovered skills |
| `/request-approval` | Ask the operator to review a stage waiting at a gate |
| `/render` | Render the current timeline |
| `/dashboard` | Show or hide the production dashboard in the TUI |

### Tools the agent can call

Every tool the studio registers, by group. A tool's own description is the
authority on its parameters.

- **Health:** `pva_version`, `pva_diagnostics`, `pva_config`, `pva_health`,
  `pva_rpc_health`, `pva_capability_status`.
- **Workspace:** `pva_channels`, `pva_series`, `pva_episodes`,
  `pva_episode_detail`, `pva_create_channel`, `pva_create_series`,
  `pva_create_episode`, `pva_create_source`, `pva_sources`,
  `pva_gather_context`.
- **Skills:** `pva_list_skills`, `pva_load_skill`.
- **Pipeline:** `pva_snapshot`, `pva_run_pipeline`, `pva_run_stage`,
  `pva_claim_stage`, `pva_complete_stage`, `pva_request_approval`,
  `pva_plan_rerun`, `pva_check_staleness`, `pva_budget_status`,
  `pva_journal`. **These ten reach the execution service through the
  gateway** (`AVG_GATEWAY_URL`, with `AVG_GATEWAY_TOKEN` or `.gateway-token`):
  with no gateway running they fail, while every other tool works without one.
- **Pictures and clips:** `pva_generate_image`, `pva_generate_images`
  (several at once, drawn concurrently), `pva_generate_wan_video`,
  `pva_generate_minimax_h3_video`, `pva_generate_flux3_max_video`,
  `pva_stitch_video_clips`, `pva_render_graphics`, `pva_render_terminal`,
  `pva_render_vector_animation`, `pva_derive_media`.
- **Archive and local media:** `pva_search_media`, `pva_fetch_media`,
  `pva_search_local_media`, `pva_reuse_local_media`, `pva_mapillary`,
  `pva_poly_haven`, `pva_check_provenance`.
- **Voice and sound:** `pva_voices`, `pva_synthesize_speech`,
  `pva_write_narration_manifest`, `pva_register_take`, `pva_align_take`,
  `pva_verify_take`, `pva_edit_audio`, `pva_analyze_audio`,
  `pva_synthesize_nonverbal_audio`, `pva_synthesize_sound`.
- **Music:** `pva_music_check`, `pva_music_render`, `pva_music`. See
  [Music written as code](#music-written-as-code).
- **3D:** `pva_blender_probe`, `pva_blender_create_scene`,
  `pva_blender_render`.
- **Series episodes:** `pva_init_spec`, `pva_upgrade_spec`,
  `pva_check_episode`, `pva_propose_reference`.
- **Timeline and render:** `pva_build_timeline`, `pva_layout_sheet`,
  `pva_record_sheet_reading`, `pva_compose_video`, `pva_compare_versions`,
  `pva_compose_multitrack_video`, `pva_extend_episode`, `pva_probe_media`.
- **Films:** `pva_create_film`, `pva_create_scene`, `pva_create_shot`,
  `pva_film`, `pva_update_unit`, `pva_ingest_footage`, `pva_footage`,
  `pva_inspect_media`, `pva_assemble_cut`, `pva_edit_cut`, `pva_check_cut`,
  `pva_cut_frame`, `pva_cut_effects`, `pva_render_cut`. See
  [Making a film](#making-a-film).
- **Characters:** `pva_characters`, `pva_create_character`,
  `pva_update_character`, `pva_cast`. See
  [Characters and casts](#characters-and-casts).
- **Styles:** `pva_styles`, `pva_apply_style`, `pva_style`, `pva_set_style`,
  `pva_save_style`. See [Style templates](#style-templates).

`pva_synthesize_sound` makes a series' sounds at $0, locally: wind, sea, rain,
fire, steam, birds, thunder, applause, a whoosh, a shimmer, and a music bed (a
soft chord progression in a key, major or minor). The same id always gives
the same WAV, in `assets/sounds/<soundId>.wav`, with
`<soundId>.sound.json` beside it saying how it was made. They are synthesized
stand-ins a person hears as what they name, not recordings.

A tool whose capability is not ready will fail rather than silently degrade.
`npm run doctor` tells you which are ready; `pva_capability_status` tells the
agent the same thing from inside a session.

### Render memory

A render opens one Chrome tab per worker, each holding the frame's pictures
and kits: about 2 GB with large paintings.
- **The default.** An episode's render (`pva_compose_video`) uses as many
  tabs as the available memory allows, at most half the cores and at least one. On macOS,
  inactive pages count as available.
- **When memory is short,** for instance with a virtual machine running, it
  renders with one tab: slower, but Chrome does not crash.
- **Overriding it.** `AVG_RENDER_CONCURRENCY=<n>` forces the number of tabs.
- **Browsers.** The tabs are shared among up to four browsers, one per two
  tabs: Chrome draws all of a browser's tabs in a single GPU process, which
  past a few tabs is what holds a render back. `AVG_RENDER_BROWSERS=<n>`
  forces their number (`1` is the old single browser).
- **GPU.** Left alone, Chrome picks its own graphics path, which on some
  machines is software. `AVG_CHROMIUM_GL=angle` asks for the GPU (other
  values: `egl`, `angle-egl`, `vulkan`, `swangle`, `swiftshader`); on the
  machines measured it drew several times faster. Every tab then holds its
  pictures in video memory: on a card with little of it (2 GB), keep the tabs
  per browser low, for example four browsers with `AVG_RENDER_CONCURRENCY=4`
  rather than 8, or Chrome stops with "ran out of memory".
- **Large pictures.** Original image bytes are preserved: a kit may crop or
  zoom beyond 2×, and even an unzoomed panoramic image may need its full
  resolution to cover the frame. Prepare smaller assets explicitly when the
  intended use allows it.

### The layout sheet

Before a render is spent, look at the **layout sheet**: small stills of the
timeline a render would use, at the first and last frame, spread over its
sections and at the instants its series' template declares, with one grid of
them labelled by number, time and reason. Ask the agent for it
(`pva_layout_sheet`; the `review-layout-sheet` skill reads it tile by tile),
or let the `series-production` pipeline make it at its `sheet` stage. It is
written to `artifacts/layout-sheet/` in the episode:

- `sheet.jpg` — the grid to read;
- `frames/NNN.jpg` — each still at a quarter of the video's size;
- `sheet.json` — the timeline it shows (by hash), the rules, the kits, the
  composer's drawing code and the `inputsHash` that says when the sheet is stale.

The pipeline's `render` stage refuses a sheet that is missing, whose grid or
stills were replaced, or that no longer shows exactly what it would render —
a composer upgrade included. To
render any timeline at chosen times without an episode, the composer has a
command of its own:

```bash
node packages/remotion-composer/dist/sheet-cli.js timeline.json out/ --assets episode/ --times 0,2.5,10
```

A series (or, by inheritance, its channel) may set
`sheet: {approval: auto}` in `settings.yaml` to let the agent's recorded
reading stand for the operator's review. The episode's own settings cannot
enable it. Missing declarations inherit, a series `settings.yaml` of only
comments (the one `pva_create_series` writes) among them; unreadable or malformed settings
and invalid sheet policies require human review, even if the channel allows
`auto`. Missing or stale sheets are refused either way.

### Comparing two versions

After a correction, prove it changed only what was asked: render the new
version, then ask the agent to compare it with the render the person received
(`pva_compare_versions`, with `old` that render's id — or
`reference:<template>/<id>` for a golden reference — and `expect` the
sections the correction should touch; the `compare-versions` skill walks it).
Both videos are decoded with ffmpeg at the same instants — the layout sheet's,
about 24, or the `times` you ask for — aligned section by section through the
timeline every render keeps beside it (`output/<render-id>.timeline.json`).
Only those instants are seen; sections added, removed or resized are reported
whatever was sampled. The result is in `reviews/compare/<old>--<new>/` (a
reference is written `reference_<template>_<id>`):

- `report.json` — every pair of frames measured, the sections that changed
  shape, the verdict (`ok`, `unexpected-changes`, or `listed` without an
  expectation) and warnings;
- `pairs/NNN.jpg` and `changed.jpg` — each changed frame as old | new |
  difference.

### Speech: start the voice worker first

`speech.synthesize` is the one capability that is a **separate long-running
process**. Everything else the agent calls is either in-process or a remote
API; the TTS worker keeps MLX models warm, so it is started once and left
running — not spawned per tool call.

Once, to set it up:

```bash
mise run voice-setup                    # venv + pinned deps, on Python 3.12
cd packages/voice
.venv/bin/qwen-tts install 1.7B --profile custom_voice   # ~GBs, one time
```

Then, in its own terminal, before or alongside the agent:

```bash
mise run voice-serve
```

Confirm it is up and that both sides agree on where it is:

```bash
cd packages/voice && .venv/bin/qwen-tts doctor
```

Ports are the thing to watch. The worker's own default is **8000**; the studio
looks for speech on **5197** (`AVG_TTS_WORKER_URL`, and the gateway's health
probe). `mise.toml` sets `QTW_PORT` and `QTW_URL` to 5197 so the worker, its
CLI and the studio all agree. Running `qwen-tts serve` outside a mise
environment binds 8000, and the studio reports `tts: down` while the worker is
plainly running.

On macOS `qwen-tts serve` (and so `voice-serve`) reads its models, voices and
outputs from `~/Library/Application Support/QwenTTSWorker/`, where
`qwen-tts install` put them, unless `QTW_MODELS_DIR`, `QTW_VOICES_DIR` or
`QTW_OUTPUTS_DIR` say otherwise. `pva_capability_status` reports speech as
available only when the worker has a CustomVoice model installed, and
alignment only when it answers `/align`. Pass it a channel and series to see
which image route that series uses (fal.ai or openai-codex) and whether that
route is ready.

`pva_synthesize_speech` takes the speaker (`aiden`, `dylan`, `eric`,
`ono_anna`, `ryan`, `serena`, `sohee`, `uncle_fu`, `vivian`, or an alias such
as `narrator`) and a `language` (`italian`, `english`, …; `auto` by default).
Beside each `<scene>.wav` it writes `<scene>.synthesis.json`, the receipt: the
worker's job, model, speaker, language and the WAV's hash.

There is no supervisor that starts the worker for you: the agent will report
`speech.synthesize` as unavailable rather than launching a multi-gigabyte model
server behind your back.

### Registering a take

A speech tool leaves a file; a series reads takes. `pva_register_take` makes a
file a take of `artifacts/narration/takes.json` (avg-dcf.6.6):
- its audio is copied to `assets/takes/<take>.<hash8>.<ext>`, hashed and measured. Naming the file by its content means no take ever overwrites another's;
- its text, the voice that said it, and its language and role are recorded;
- it is placed in a unit's sequence. A short's `recital`, for example, is
  `titolo`, then `recita` with `pauseBefore` 1. `position` puts a take at a
  given place (0 = first).

Registering a take again replaces it in place. A timing that measured other
audio or text is dropped, so align the take again.

### Word timing: aligning a take

A take's word timing — when each word of its text is said — is measured by
forced alignment ([ADR-0038](./adr/0038-word-timing-comes-from-forced-alignment.md)).
Ask the agent to align a take (`pva_align_take`, with the take's id from
`artifacts/narration/takes.json`); the timing is written beside it
(`artifacts/timing/<take>.json`) and `takes.json` names it.

- By default the voice worker aligns it locally with Qwen3-ForcedAligner. The
  first alignment downloads the model (about 1.3 GB); after that it stays
  loaded like the speech model. `GET /align` on the worker says which model
  and whether it is loaded.
- With `provider: "elevenlabs"` ElevenLabs aligns it instead — only when you
  ask, never as a fallback. It needs `ELEVENLABS_API_KEY` in the agent's
  environment, and each call goes through the episode's spend ledger at an
  estimated price per minute of audio.
- At most 300 s of audio at a time; a take without a `language` needs one
  given (`it`, `en`…).

### Clone voices

The voice worker can speak with an enrolled clone voice, through the Qwen3-TTS
**Base** model.
- **Enrolling** (`POST /voices/enroll`) is the operator's act. It needs a
  reference of 3–30 s, its exact transcript, and a written consent that names
  the source (`self_recorded`, `licensed` or `synthetic`) and its terms.
- **Using it:** Pi lists the voices with `pva_voices` and speaks with one by
  passing `voice: "clone:<id>"` to `pva_synthesize_speech`.
- **Sampling:** `temperature` and `repetitionPenalty` can be set on any
  voice. Without them the worker's defaults apply: temperature 0.7, and a
  repetition penalty of 1.5 for a clone or 1.05 for a preset. Values out of
  range are refused before synthesis. For recited verse, a repetition
  penalty near 1.1, one stanza at a time with each verse on its own line, is
  a reasonable first try.
- **The receipt** names the voice's revision, the reference's hashes, the
  model, the seed, and the sampling when it was set.
- **A channel's characters** name their voice in `voices/registry.local.json`.

### Speech from a ComfyUI server

`pva_synthesize_speech` with `provider: "comfyui-qwen"` speaks through the
Qwen3-TTS nodes of a ComfyUI server you run (`packages/comfyui-speech`): free,
no spend ledger, and never chosen on its own.
- **The address** is `AVG_COMFYUI_URL`, or `url` in the library's
  `.render/comfyui.json` (`AVG_COMFYUI_CONFIG` names another file). That file
  also sets the nodes: `model`, `device`, `precision`, `attention`,
  `unloadModelAfterGenerate`, `outputPrefix`, `inputSubfolder`,
  `timeoutSeconds`.
- **A server that listens only on its own loopback** needs a tunnel you open:
  `ssh -N -L 18188:127.0.0.1:8188 <host>`, then
  `AVG_COMFYUI_URL=http://127.0.0.1:18188`.
- **Voices:** `voice` is a preset speaker or `saved:<name>` (a voice saved on
  the server); `referenceAudioPath` clones a recording of the workspace, with
  `referenceText` its exact words; `cleanReference: true` cuts it
  (`referenceStart`, `referenceDuration`) and separates the voice from music
  and noise first, `saveVoiceAs` keeps the learned voice on the server.
- **Consent is checked before upload or execution.** A reference clone or
  `saved:<name>` requires `voiceConsentPath`, a workspace-relative JSON file
  **created by the operator**, never approved by the agent on their behalf:
  ```json
  {
    "confirmed": true,
    "source": "synthetic",
    "statement": "I authorize this synthetic reference for this production.",
    "license_or_terms": "Applicable reference licence or permission",
    "recorded_at": "2026-11-16T00:00:00Z",
    "reference_audio_sha256": "<SHA-256 of the original reference file>"
  }
  ```
  `source` is `self_recorded`, `licensed` or `synthetic`. For a saved voice,
  replace `reference_audio_sha256` with `"saved_voice": "saved:<name>"`, exactly
  matching the request. Removing the file or setting `confirmed: false`
  blocks subsequent calls. This records authorization; it cannot independently
  prove ownership. Saved names can change on the server and have no verified
  waveform identity. Uploads and optionally saved voices remain on ComfyUI;
  revoking this local record does not delete them there.
- **The receipt** names the workflow hash, consent-record hash, reference
  hashes, seed and sampling. `requestedRuntime` is what the studio asked for;
  `runtimeVerified: false` means ComfyUI did not attest the actual checkpoint
  hashes or resolved runtime versions. Speech is validated non-silent mono
  PCM16/24 kHz WAV. Qwen times no words: register with `pva_register_take`,
  then align with `pva_align_take` and verify the take.
- **Same flow, explicit choice:** omitting `provider` keeps the local worker
  (MLX or Torch); `comfyui-qwen` is never a fallback. Episodes, channel sources
  and film units use the same synthesis/register/align/verify tools. This does
  not replace the worker's durable `/attempt-jobs` and mastering contracts.
- `pva_capability_status` says whether the server answers, which workflows it
  has the nodes for, and its saved voices; `pva_voices` lists them.
- **Clean only:** `pva_clean_voice` separates a recording's voice from music
  and noise on the same server (optionally cut first) into a new WAV under
  `assets/`, with `<file>.clean.json` beside it. Nothing is cloned.

### Editing audio

`pva_edit_audio` makes one audio file from others, from a recipe saved
beside it as `<file>.edit.json` (ADR-0047). The recipe can:
- cut takes on words (at the quietest point of the pause, with short
  crossfades);
- reshape pauses with the take's own room tone;
- layer tracks with gains, fades, gain curves and ducking;
- master the mix: loudness, true peak, trims, fades.

The file's report names clicks, level jumps and clipping, and the record
keeps the words carried from the takes. A take made this way registers like
any other and gets its timing with `pva_align_take` `provider: "derived"`.
`pva_analyze_audio` measures any file. The skill is `audio-editing`; the
engine is `@av/audio-edit`.

### Music written as code

Music is written, not generated: a piece is a file of
[Strudel](https://strudel.cc) code, `music/<name>.strudel` in an episode, a
channel source or a film unit, and the studio renders it locally at $0
(ADR-0053). The agent writes and edits the file; so can you, in the studio or
in an editor.

```js
setcpm(96/4)                       // 96 bpm: a cycle is a 4/4 bar
drums: s("sbd*2").gain(.7)
bass: note("<a1 f1 c2 g1>").s("sawtooth").lpf(380).decay(.25).sustain(.2)
keys: n("<[0,2,4] [-2,0,2]>").scale("A3:minor").s("triangle").room(.35)
```

Each labelled statement is a **part**. Three tools work on a piece:

- `pva_music_check` evaluates it without a sound: its tempo, how many events
  each part plays in every cycle, their notes and sounds, and what is wrong (a
  syntax error, a sound that does not exist, a silent part, a control the
  engine ignores, two reverbs asked of one orbit). It also takes `code`, to
  try something before saving it.
- `pva_music_render` writes a WAV (48 kHz stereo, 24-bit):
  - the whole piece or a stretch: `from`, and `cycles` or `seconds`;
  - every part or some: `only`, `mute`; with `stems`, each part alone too,
    at the gain it has in the mix;
  - with a `tail` for reverb to ring out, or as a seamless `loop`;
  - brought to −18 LUFS with one gain, its peaks under −1 dBFS (`loudness`,
    `peak` to change them), never compressed.

  The file goes to `assets/sounds/<piece>.wav` unless `output` says
  otherwise — `music/…` for a film's score, `assets/audio/…` for a scene's
  sound. `<file>.music.json` beside it names the piece and the file by hash
  and holds what was measured: the level and where the highest peak is, the
  spectrum by band, the stereo image, the level through time, the same for
  each stem, and what to listen for — a loop that does not come round, an
  ending cut while it sounds, peaks that kept it well under its loudness.
- `pva_music` lists a workspace's pieces and what was rendered from each,
  and which renders went stale when the piece changed.

The agent cannot hear: it mixes by those numbers, and tells you what to
listen for. The skills are `strudel-music`, `strudel-sounds` and
`strudel-forms`; the engine is `@av/strudel`.

Two things to know:

- **The engine's sounds are synthesized.** Strudel's usual drum machines and
  pianos are sample packs on other people's servers, of mixed licence, and
  are not fetched: a piece that names `bd` or `piano` does not check. A piece
  can load the workspace's own audio files as samples
  (`samples({ rain: 'assets/sounds/rain.wav' })`), and a render records which
  it used. `network: true` on a tool lets a piece fetch a pack; what it took
  is recorded, and its licence is yours to check.
- **Rendering needs a Chrome.** Remotion's is used once a video has been
  rendered; otherwise any Chrome or Chromium on the machine, or the one
  `STRUDEL_CHROME_PATH` names. `npm run doctor` shows which, under `music`.

In the web studio, a `.strudel` file opens with a player around its text:
`Ctrl+Enter` plays the text as it stands (and replaces what is playing),
`Ctrl+.` stops. The events are drawn part by part as it plays, parts can be
silenced or soloed, and **Render to a file** renders the saved piece. The
**Music** tab of an episode, a film, a scene or a shot lists the pieces with
their renders, to hear and compare.

From the shell, without the studio:

```bash
npx strudel-render check library/…/music/theme.strudel --cycles 8
npx strudel-render render library/…/music/theme.strudel -o /tmp/theme.wav --cycles 16 --tail 3 --stems
```

### Verifying a take

Before a take is used, ask the agent to verify it (`pva_verify_take`). The
voice worker transcribes it locally (Whisper, $0) without knowing the text,
and the studio compares the two. The report goes to
`artifacts/takes/<take>.verification.json`, with:
- **Words:** words or whole lines missing, extra or heard differently.
- **Squeezed runs:** words the alignment gave almost no time. Either they
  were not said, or, when the transcription heard them, the timing is wrong
  there.
- **Pauses:** every pause at a verse end, a stanza end and inside a line.
- **Edges:** the take's start and end, and whether it ends while still
  loud.

Which pauses are too short is the series' or the channel's rule, in its skill
or validator.

### Making a film

A film is one self-contained work, short or feature length, beside the
library's channels (ADR-0050). Ask for one in words — "make a two-minute
film from the footage in ~/shoot and this script" — and the agent loads the
`film-producer` skill and works through it. What it does, and what you can
do by hand at any point:

- **It is produced at three levels.** The film, its scenes, their shots:
  each has its own files, pipeline, cut (`artifacts/cut.json`) and renders.
  A shot's render is a source of its scene's cut, a scene's of the film's.
  Every tool takes a unit as film / scene / shot, and the pipeline, budget
  and approval tools take the same unit as channel / series / episode with
  `_` for the level itself (`tide/010-shore/_` is a scene).
- **Where it stands:** `pva_film` lists every scene and shot in running
  order with its state — no cut, blocked, ready to render, stale, preview
  only, current — and what stands between the film and its final render.
- **Real material:** `pva_ingest_footage` brings camera originals, location
  sound, stock and music into the film's `footage/`, each named by its
  content with a proxy a browser plays, a contact sheet, the instants its
  picture cuts and its loudness. `link: true` leaves large originals where
  they are. `pva_footage` searches and annotates the log.
- **Made material:** a shot's takes go under its `assets/`, made with the
  same image, video, Blender, graphics, terminal, voice and sound tools as
  an episode's, addressed to the shot.
- **The cut:** `pva_assemble_cut` makes a unit's cut from what is under it
  and keeps it in step; `pva_edit_cut` edits it with operations applied
  together or not at all; `pva_cut_effects` lists the picture and sound
  effects; `pva_cut_frame` composes one frame with every effect, to judge a
  grade without rendering.
- **An edit names the revision it read.** `pva_edit_cut` takes
  `expectedRevision` — printed as `cut revision N` by `pva_check_cut` and by
  every edit; 0 for a unit with no cut yet — or `latest: true` for an edit
  that is right on any revision. An edit that names neither is refused. The
  read, the check and the write are held together by a lock, so the agent
  and the browser cannot both write the next revision.
- **Rendering:** `pva_render_cut` renders a unit with FFmpeg, first
  rendering whatever under it is out of date and nothing that is not: a
  change to one shot costs that shot and the joins above it. `preview` is
  small and fast; `final` is the film's format and is what the level above
  is cut from. Everything here is local and $0.
- **One render of a film at a time.** A second one is refused, from any
  process — the agent's `pva_render_cut`, a stage, the browser — and the
  refusal says what is being rendered. A render that finishes after its cut
  was edited and rendered again does not take the newer render's place.
- **Who decides:** each level's `pipeline.yaml` names its pipeline and the
  one the levels under it run, from a person at every step to only a final
  review. See [the film families](./pipelines.md#the-film-families).

In the browser studio a film opens on its **board** — scenes and shots with
their state — and every level has a **Cut** view: sources, a monitor, the
timeline and an inspector. The monitor plays the draft from its sources
(cuts and timing only), the unit's render, or one composed frame, and says
which. You edit a draft with undo and save it as the next revision; a save is
refused if the agent wrote one meanwhile, and the agent's edit is refused the
same way. Lock a clip or a track and the agent and assembly leave it as it
is. **Footage** on the film lists the log with each clip's sheet and proxy.

### Characters and casts

A character is a record apart from how it appears (ADR-0052), owned by a
channel, a series or a film. Ask for one in words — "a guide for this
series, a voice and a dot" — and the agent loads `character-development`,
then `character-forms`. What it does:

- **Who it is:** `pva_create_character` writes
  `characters/<id>/character.yaml` with `character.md` (identity),
  `backstory.md` and `performance.md` beside it. A character with no form yet
  is valid. One drawn from a real person states its `likeness`: whose, and
  what permits it. The studio does not judge the permission.
- **How it appears:** `pva_update_character` adds a *form* — its medium is
  one of `rig-3d`, `model-3d`, `puppet-2d`, `sprites`, `vector`, `images`,
  `photo`, `graphic`, `sound`, `voice`, `other` — and what the form `can` do:
  the actions, expressions, mouth shapes and views it has, by the names a
  script uses.
- **Releases:** the same tool records a release of a form: a folder
  (`forms/<form>/<release>/` by default) with the hash of its entry file and
  of its whole tree, what made it and its licence. A release is never
  edited; a change is a new release.
- **Casting:** `pva_cast` writes a series' or a film's `cast.yaml`: each
  role's character, the form it wears there and the release it is pinned to.
  Another owner's character is named `owner/id` and read where it lives. With
  `asks` it checks what a script wants of each role against what its form
  can do; with `verify` it reads every pinned file again.
- **What is there:** `pva_characters` lists an owner's characters, or shows
  one in full and verifies its released files.

The studio keeps, hashes and pins a form; it does not play one it does not
understand (a `.blend`, an SVG component stay the job of the kit or tool that
knows the medium). Of the capabilities ADR-0052 names for making a form, two
are built. `pva_generate_model` turns one picture into a 3D model (Tripo H3.1
through fal, paid per model on the episode's budget): what comes back has no
skeleton, and can be placed, turned and lit, not posed. `pva_rig_model` gives
a model a skeleton and weights (Hyper3D or Meshy through fal, paid per rig)
and examines the rig before it answers; `pva_rig_sheet` then poses it in
Blender, at no cost, and renders the poses and the clips on sheets to read
before the rig is released. A rig gets its motion three ways: stock clips
asked for with it (`pva_stock_clips` lists them), a clip carried from
another skeleton (`pva_retarget_clip`, local), and a person's motion made
from a sentence (`pva_generate_motion`, Hunyuan Motion through fal, paid per
motion). `pva_release_model` makes the rig the character's in one step: it
stands the figure in its file (facing +z, feet on the ground, at the height
given), copies it with its clips, sheets and records into the character's
folder, and records the release. `pva_rig_shot` then films a role of the
cast, or a rig still in the episode, playing a clip, locally, into a clip of
video like any other: one character on an empty stage. `pva_stage_shot`
films several in one picture, on a set (a `.blend` with marks) or on an
empty stage: each stands on a mark and does one thing after another, a walk
goes at the pace read from its clip, and the tool says who was out of the
picture, hidden by the set, in another's place, or sliding.
Motion from a video, a face, and contact between a character and anything
else are not built. The browser studio has no view of a cast.

### Style templates

A style template is an optional, ready-made road to a look (ADR-0054): ask
for "a film in the risograph style", "this scene using 'Tide riso'", or for
nothing — a channel, a series, a film or a scene with no style is made as
before. The agent loads `style-templates`. What it does:

- **Which there are:** `pva_styles` lists the studio's templates
  (`studio/style/templates/`), the library's own (`library/_styles/`) and a
  channel's or film's (`<project>/styles/`), nearest winning; with `name` it
  finds one by the words a person uses and shows its brief and parameters.
- **Applying one:** the creation tools take `style` (a new film also takes
  the style's format), and `pva_apply_style` gives one to a level that
  exists. The level gets its own copy in `style/`: `STYLE.md` (the brief),
  `style.json`, `params/*.json` and `style.yaml` (where it came from). A
  scene's or a series' style wins over its project's; `fromParent` copies
  the level above's to change it.
- **Parametric:** the brief never writes a value inline. "Print it in
  <code v-pre>{{palette}}</code>" reads `params/palette.json`; a colour is <code v-pre>{{palette.accent}}</code>,
  a value <code v-pre>{{print.timing}}</code>. `pva_style` gives the brief a unit reads with
  every value filled in, and pins the style for it.
- **Changing it:** `pva_set_style` changes a parameter file's values, or the
  brief, checked. Every unit that read the style keeps a pin on it
  (`source/pins/style.json`), so a change makes the stages that read it — a
  film's `bible`, a scene's `direction`, a shot's `plan` and `media`, an
  episode's art direction — and everything downstream stale. Through the
  gateway the change is accepted at once (`POST /api/style/<project>/<series>/renew`
  does the same for an edit made by hand; so does `vpr pin renew <unit> style`).
- **Keeping one:** `pva_save_style` keeps a level's edited style as a
  template anyone can name.

In the browser studio, a channel's, a series', a film's or a scene's overview
has a Style panel: a template to choose, colour pickers for its palette and a
control for every value, the brief as it reads now, and how many units a
change will make stale.

## 1b. The same agent in Claude Code

The tools above are written once, against Pi's extension API, in
`studio/agent/`. Claude Code gets the same ones from an MCP server that hosts
that extension unchanged (`studio/agent/mcp/server.ts`, ADR-0048). From the
repository root:

```bash
claude
```

That is all: `.mcp.json` starts the `pva` server (Claude Code asks once to
trust it), and `.claude/settings.json` adds the hooks below. Start it from the
repository root, as with Pi: the server resolves `tsx` and the library from the
directory it starts in. `npm run studio:mcp` runs the server alone, for any
other MCP client.

`npm run studio:tool -- <pva_tool> '<json>'` (or `@params.json`) runs one tool
from the shell, the same registration, and exits: for jobs longer than an MCP
call should wait, such as an hour's render, started in the background with its
output in a log. Progress (the render bar, one line every 2%) goes to stderr,
the result to stdout.

| Under Pi | Under Claude Code |
|---|---|
| tools `pva_*` | `mcp__pva__pva_*` (same names, descriptions, schemas) |
| `/video`, `/render`, … | the server's prompts: `/mcp__pva__video create <c>/<s>/<e>`, `/mcp__pva__render …` |
| skills from `.pi/skills/` | `.claude/skills/<name>/SKILL.md`, written by `npm run compose` from the same sets, plus `pva-executive-producer` |
| the library-visibility warning at session start | a `SessionStart` hook (`studio/agent/claude/session-start.ts`) |
| review activity starts a turn | live with `npm run studio:claude` (see below); otherwise it waits for your next prompt (a `UserPromptSubmit` hook) |
| stage updates in the conversation | the same hook, on the next prompt |
| the status bar | `studio/agent/claude/statusline.mjs` (opt in, below) |
| `/login` for the Codex image route | Pi's login still works when Pi is installed; or `codex login`; or `AVG_CODEX_TOKEN` |

Read-only tools (`pva_channels`, `pva_journal`, `pva_budget_status`, …) are
allowed in `.claude/settings.json`; anything that writes or spends asks first,
as Claude Code does. Under Pi nothing asks.

**Live review activity.** Under Pi, an operator's review comment starts a turn
as it arrives. Claude Code takes such a push only from a *channel*, a research
preview that works in interactive sessions:

```bash
npm run studio:claude        # claude --dangerously-load-development-channels server:pva
```

Claude Code shows a confirmation at start. Without it the activity is not lost:
it reaches the agent with your next prompt.

**Status line.** It is a personal choice, so the repository does not set it.
In `.claude/settings.local.json`:

```json
{ "statusLine": { "type": "command",
    "command": "node \"$CLAUDE_PROJECT_DIR\"/studio/agent/claude/statusline.mjs" } }
```

**Long renders.** A tool call that runs past two minutes moves to the
background in Claude Code and its result arrives when it settles. When the
client asks for progress, the server reports it every minute, so a render is
not taken for an idle call (Claude Code gives a silent stdio call 30 minutes;
`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` changes that).

## 2. Agent plus gateway plus web studio

The gateway manages browser-facing agent sessions and streams events. It also
serves the agent's pipeline tools over HTTP. Start it
in its own terminal:

```bash
cd studio/gateway
npx tsx src/index.ts config.json      # or: npm run dev
```

Verify:

```bash
curl -s http://127.0.0.1:5198/health
```

Expect `"overall":"healthy"` with `gateway: ready` and `runtime: ready`.

Two entries are *expected* not to be ready yet, and are not your setup being
wrong:

- `pi: Pi RPC not yet wired (vsg-e57.6)` — the gateway cannot yet drive Pi as a
  subprocess. Until that lands, run the agent yourself as in section 1, or
  let the gateway run Claude (below).
- `adapter: degraded` — a provider whose requirement is unmet. `FAL_KEY` unset
  means `image.generate` is unavailable; nothing is substituted for it.

Then the browser studio:

```bash
cd studio/web
npm run dev            # http://localhost:5173
```

The agent finds the gateway at `http://127.0.0.1:5198`; `AVG_GATEWAY_URL`
overrides it. The gateway writes its token to `.gateway-token` in its own
working directory (`studio/gateway/` with the commands above). The pipeline
tools look for `.gateway-token` only in the agent's working directory, so set
`AVG_GATEWAY_TOKEN` to the gateway's token (or copy the file there).

### Which agent the studio drives

The studio's agent bar sends intents (`POST /api/intent`) to one session per
episode. By default that session is Pi's. With

```bash
AVG_AGENT_BACKEND=claude npx tsx src/index.ts config.json
```

it is a Claude Agent SDK session instead: the same tools (the MCP server of
section 1b), the repository's `CLAUDE.md`, skills and hooks, the library the
gateway serves, and the environment Pi would get (no operator key,
`AVG_HEADLESS=1`). Intents become turns — a prompt, guidance, an answer, a
rerun to plan, an edited artifact — cancel interrupts the turn in progress, and
operator review activity starts one. What the agent does is published on the
agent's event channel (`pi`): `agent_start`, `tool_execution_start`,
`message_end`, `agent_end` (with its cost), each with `backend: "claude"`.
`GET /` names the backend, and the agent bar says who it is talking to.

Nobody is there to approve a tool call, so the session runs in Claude Code's
`dontAsk` mode: the studio's tools, file reading and editing, the shell and
skills are allowed — what Pi has — and anything else is refused. Change that
with `AVG_CLAUDE_ALLOWED_TOOLS` and `AVG_CLAUDE_PERMISSION_MODE`. It uses the
Claude credentials of the user running the gateway (`claude` login or
`ANTHROPIC_API_KEY`); `AVG_CLAUDE_MODEL` picks the model.

## 3. Agent as an RPC subprocess

How the gateway will drive it once Pi RPC is wired. Useful for debugging the
protocol directly:

```bash
echo '{"id":"1","method":"health","params":{}}' \
  | node --import tsx studio/agent/src/agent.ts
```

JSONL request in, JSONL response out. Pi's own RPC mode is `pi --mode rpc`.

## 4. Driving stages by hand: `vpr run`, `complete`, `status`

The execution service owns what ran, when, and whether it counted. `vpr` is one
of its callers; the gateway and the agent are the others, and all three go
through the same service, so a stage claimed in one is visible to the rest.

Every command below takes `--library <path>` (see section 0) and `--json`.

**Which pipeline.** A command runs the pipeline the library declares for the
episode: the `pipeline:` key of `pipeline.yaml` in the episode, else its
series, else its channel (the files the gateway reads too). The key holds a
pipeline id, or a pipeline defined inline, which runs by its `id`. With no
declaration it runs `narrated-illustrated-video`; `--pipeline <name>` overrides
both. A `pipeline.yaml` that doesn't parse, or names something that isn't a
pipeline id, fails the command (exit 2) without claiming anything; the gateway
still passes over such a file. The built-in
pipelines are found through `@studio/pipelines`; `AVG_BUILTIN_PIPELINES`
points elsewhere.

**A series episode's stages follow its files.** An episode with an
`episode-spec.json` is made with the studio's tools (`pva_init_spec`,
`pva_generate_image`, `pva_register_take`, `pva_align_take`,
`pva_build_timeline`, `pva_layout_sheet`, `pva_compose_video`), which write
files, not the journal. So `vpr status`, the gateway's `/status`, Pi's
`pva_gather_context` and the web studio read its `series-production` stages
from those files (`"source": "files"`):
- the spec is done when it has no `__FILL__` left and loads;
- pictures when every asset it names is in `assets/`;
- takes when they are registered and aligned;
- the timeline when it matches what the compiler makes of them;
- the check when the series rules pass;
- the sheet when it pictures that timeline and the operator approved it (web
  Storyboard, or `vpr sheet approve`);
- the render when `output/current.json` names an audited render of that
  timeline.

A changed file makes its stage stale by itself. Each stage's `stateReason`
says what is missing and which tool makes it. The stage panel offers no run,
approve or reject for such an episode: those go through the journal. Claims
still do, for the stages the gateway can perform itself, but a sheet approved
only at the journal's gate (`vpr review`) is not seen here: approve it in the
Storyboard or with `vpr sheet approve`.

**`vpr run`** claims the next runnable stage — or the one named by `--stage` —
and prints the command that closes it:

```bash
node studio/runtime/dist/src/cli.js run my-channel/my-series/ep001 \
  --library "$PWD/library"
# Claimed "brief" until 2026-09-21T10:35:00.000Z. Perform it, then:
#   vpr complete my-channel/my-series/ep001 brief --library … --lease l-7 --outputs PATH
```

It claims; it does not perform. The lease is what the claim is worth: hold it,
do the work, and close the stage before it expires (`AVG_CLAIM_TTL_MS`, default
fifteen minutes). An abandoned claim needs no cleanup command — the lease lapses
and the stage becomes runnable again.

`--dry-run` says which stage it *would* claim and takes no lease.

**`vpr complete`** closes a claimed stage. `--outputs` is required unless you
pass `--failed`: the performer is the only party that knows what it produced,
and a completion with no outputs named is a claim that a stage ran with nothing
to show for it.

```bash
node studio/runtime/dist/src/cli.js complete my-channel/my-series/ep001 brief \
  --library "$PWD/library" --lease l-7 --outputs artifacts/brief.md
node studio/runtime/dist/src/cli.js complete my-channel/my-series/ep001 brief \
  --library "$PWD/library" --failed --error "the model refused"
```

Outputs must exist and must live inside the episode directory. A stage whose
pipeline declares a review gate completes as `awaiting_review`, and exits 0 —
completion is what happened, acceptance is a separate decision.

**`vpr status`** replays the episode's journal and reports each stage's state:

```bash
node studio/runtime/dist/src/cli.js status my-channel/my-series/ep001 \
  --library "$PWD/library" --json
```

It reports what the journal records, not what is on disk. **An episode full of
artifacts but with no journal reports every stage `pending`** — that is
correct, not a bug: files in a directory are not evidence that a stage ran
under a lease, and the previous behaviour (inferring completion from file
existence) is what made the CLI's report disagree with everything else.

Its output carries the episode's budget, from the spend ledger described in
"Budget" below.

**`vpr approve`** and **`vpr reject`** (which requires `--note <text>`)
decide a stage that completed with `gates.review: human` — the same call the gateway's
`/approve` and `/reject` routes and the browser studio make
(avg-qr4.3). Whether either one actually grants anything depends on who is
running it: see "The operator key" below.

### Takes

A stage that runs again does not destroy the result it replaces (avg-qr4.6).
Every completed attempt is kept read-only, as a **candidate**, under
`attempts/<stage>/<attempt>/` in the episode. The journal records which
candidate the stage currently stands on, called its **take**. By default each
new completion becomes the take, which is how it always worked.

**`vpr takes`** lists the candidates of each stage, or of one stage. For each it
shows which one is selected, who selected it, and whether the files on disk
still match it. The last of these is reported as `drifted`.

**`vpr reference`** manages a series' golden references (ADR-0037). Pi can
only propose one (`pva_propose_reference`, which freezes the episode's spec,
timeline and render in `reviews/references/<id>/`); the operator approves it,
signed with the operator key, and can later withdraw it. `verify` exits 0 only
for a trusted reference.

```bash
node studio/runtime/dist/src/cli.js reference approve my-channel/my-series/ep001 ep001-v1 \
  --note "the series' standard" --library "$PWD/library"
node studio/runtime/dist/src/cli.js reference verify my-channel/my-series my-template ep001-v1 --library "$PWD/library"
node studio/runtime/dist/src/cli.js reference list my-channel/my-series --library "$PWD/library" --json
node studio/runtime/dist/src/cli.js reference withdraw my-channel/my-series my-template ep001-v1 \
  --reason "the recital was re-recorded" --library "$PWD/library"
```

**`vpr sheet`** records the operator's review of an episode's layout sheet
(avg-3th.2). A spec-driven episode renders only when its current sheet was
approved: making the sheet again clears the review, and an edit that changes
what the sheet would show makes it stale. `approve` and `reject` sign with the
operator key exactly the sheet on disk (`artifacts/layout-sheet/review.json`);
a rejection needs a note. `status` exits 0 only for an approval. Pi only makes
and reads the sheet. The web studio does the same from an episode's
**Storyboard** tab (avg-goz): the stills, their state, and Approve / Reject
when the browser holds the operator key; its **Narration** tab plays the
registered takes, their words lit as they are said.

```bash
node studio/runtime/dist/src/cli.js sheet approve my-channel/my-series/ep001 --library "$PWD/library"
node studio/runtime/dist/src/cli.js sheet reject my-channel/my-series/ep001 \
  --note "the verse bar covers the hand at 0:12" --library "$PWD/library"
node studio/runtime/dist/src/cli.js sheet status my-channel/my-series/ep001 --library "$PWD/library"
```

**`vpr theme seal`** and **`vpr template release`** change a channel's look
(ADR-0040, avg-dcf.6.10). `theme seal` writes each file a theme release names,
with its hash, into its `theme.json`, and prints the hash a template release
pins; it refuses a release already sealed or already pinned. `template release`
copies a template release to a new version, pinned to a sealed theme with
`--theme`, or naming another compiler or validator version with `--compiler` /
`--validator` (a new layout is a new compiler version and a new release).
Episodes then move onto it with Pi's `pva_upgrade_spec`.

```bash
node studio/runtime/dist/src/cli.js theme seal my-channel/my-theme/1.1.0 --library "$PWD/library"
node studio/runtime/dist/src/cli.js template release my-channel/my-series my-template 1.1.0 \
  --from 1.0.0 --theme my-theme@1.1.0 --library "$PWD/library"
```

**`vpr template seal`** and **`vpr template verify`** handle a series
release's own code (ADR-0041). A release may hold its compiler and validator
as source, `compiler/index.ts` and `validator/index.ts`, exporting `compiler`
and `validator`.
- **`template seal`** builds each into one self-contained file
  (`compiler/compiler.cjs`), names it with its hash in `series-template.json`,
  and rehashes the release's files. Episodes on that release then compile with
  it, not with the application's registered compiler. It refuses a release an
  episode pins: make a new one with `template release --from`, change its code,
  seal it.
- **`template verify`** checks:
  - that the bundles are the sealed ones;
  - that the source still builds to them (a warning only: the studio code it
    inlines may have changed since, and the sealed bundle is what runs);
  - that each `fixtures/<name>/input.json` compiles, and passes the
    validator, to its `expected-timeline.json`.

  `--update` writes the goldens; once an episode pins the release, only the
  goldens it lacks, never rewriting one. `--dry-run` writes nothing.
- **`template fixture`** keeps a real episode's compile input (spec, takes,
  timings, assets, named relative to the episode) as
  `fixtures/<name>/input.json` of its release, or of another release of the
  same template with `--to <version>`; `verify --update` then writes its
  golden.

```bash
node studio/runtime/dist/src/cli.js template seal my-channel/my-series my-template 1.1.0 --library "$PWD/library"
node studio/runtime/dist/src/cli.js template verify my-channel/my-series my-template 1.1.0 --library "$PWD/library"
node studio/runtime/dist/src/cli.js template fixture my-channel/my-series/ep001 ep001 --library "$PWD/library"
```

**Writing a new series** is Pi's `author-series` skill. It decides first
whether the product is a spec-driven series at all, then writes, seals and
verifies everything the series needs in its channel's library, ending with a
series-local skill for its episodes.

**`vpr kit seal`** and **`vpr kit verify`** handle a kit a channel or a
series carries (ADR-0042). The kit lives in `library/<channel>/kits/<name>/<version>/`
(or the series' own `kits/`). Its source is `kit/index.tsx`, exporting
`kit`, the same shape as the composer's kits.
- **`kit seal`** builds `kit.cjs`, with React, Remotion and zod left to the
  studio, and writes `kit.json`.
- **A series release draws with the kit** once its `series-template.json`
  lists it, as `"kits": [{"name": "…", "version": "…", "level": "channel"}]`,
  and `template seal` fills in the hash.
- **`kit verify`** checks the bundle, warns if the source no longer builds to
  it, and checks the examples' props.

```bash
node studio/runtime/dist/src/cli.js kit seal my-channel my-card 1.0.0 --library "$PWD/library"
node studio/runtime/dist/src/cli.js kit verify my-channel/my-series my-hall 1.0.0 --library "$PWD/library"
```

**The toolbox** (ADR-0043) is what library code imports and never copies:
- a compiler or validator imports `@studio/series/toolbox/1.0.0`. It holds
  `frames`, `round3`, `tokens`, `normalizeWord`, `noise`, `lanes`,
  `findWord`, `kitsOf` and more; `template seal` inlines it;
- a kit imports the composer's libraries by version,
  `@av/remotion-composer/kits/lib/fonts/1.1.0`, `…/stage-math/1.0.0` and the
  rest; `kit seal` leaves them to the studio, so the fonts load once.

**A channel is its own git repository** (ADR-0045). `vpr channel init` sets
it up: its text in git, its heavy media out, each named by hash and size in
`media.lock.jsonl`, one line a file. After a `git pull`, `vpr channel media
--check` lists the media this machine lacks or holds in another version
(`--verify` rehashes every byte); after new media, `vpr channel media` updates
the list, to commit with the work. The list never forgets a file only because
this machine lacks it: `--prune` forgets the files deleted on purpose. An
optional [media remote](#channel-media-backup-and-restore) backs up and restores
the named bytes with `channel media push` and `channel media pull`.

```bash
node studio/runtime/dist/src/cli.js channel init my-channel --commit --library "$PWD/library"
node studio/runtime/dist/src/cli.js channel media my-channel --check --library "$PWD/library"
```

**A channel's sources** (ADR-0035) are material made once and pinned by the
episodes that use it: a poem's text, recital, timing and pictures, shared by a
short and a long. Each lives in `library/<channel>/sources/<name>/`.
- **Structure:** its structure is free. Its `README.md` says what it holds,
  how it was made and how to use it, with `status: draft` or `ready` in its
  frontmatter.
- **Making one:** Pi creates a source with `pva_create_source`, and makes its
  contents with the usual tools, passing `source: "<name>"` in place of
  `series` and `episode`. It follows the channel's procedure: a channel skill
  in `library/<channel>/skills/`, found after the series' skills and before
  the studio's.
- **Using one:** episodes pin it
  (`vpr pin add <channel>/<series>/<episode> <id> --source channel:<name> --used-by timeline`).
  Its takes, timings and pictures then reach the series' compiler like those
  of a pinned episode.
- **Context:** `pva_gather_context` names the README of the channel, the
  series and every pinned source.
- **Paid calls:** a source has no budget, so a paid call runs in an episode.

**Archive and stock media** (ADR-0046) come from public collections, free,
each with a licence anyone can verify: the Art Institute of Chicago, the Met,
the Cleveland Museum of Art, Wikimedia Commons, NASA, the Internet Archive,
Openverse, Rijksmuseum, Wellcome, iNaturalist, ccMixter, Iconify, Fluent/Noto/
OpenMoji emoji and LottieFiles, none of which needs a key; with a key, Pexels,
Pixabay, Unsplash, Coverr, Smithsonian, Jamendo, Mapillary and Freesound.
- **Finding and fetching.** Pi finds them with `pva_search_media` and fetches
  the original with `pva_fetch_media` (pass `rendition` to pick a listed
  provider rendition). The `find-archive-media` skill says how to choose.
- **Reuse before re-fetching.** `pva_search_local_media` finds an asset already
  licensed in the channel; `pva_reuse_local_media` copies its bytes, record and
  evidence without calling a provider, and never copies the same SHA-256 twice.
- **Vectors, emoji and animation.** Provider SVG is rasterized to an inert PNG
  (never saved as active XML); LottieFiles is fetched as its MP4 rendition.
- **Derivatives.** `pva_derive_media` trims and optionally centre-crops a
  fetched video or sound into a new recorded asset; the original is untouched.
- **Mapillary.** `pva_mapillary` (needs `MAPILLARY_TOKEN`) queries coverage,
  a sequence, photos, history, map features and detections, and produces into
  an episode: a still, a hyperlapse along a sequence, a pan inside a 360°
  image, or a tiny planet. Every output carries the CC BY-SA 4.0 credit and,
  for derivatives, the share-alike obligation.
- **What a file brings.** It arrives in `assets/` with `<name>.source.json`
  (its provider, licence and credit) and the provider's response as evidence
  in `artifacts/provenance/`. `ATTRIBUTIONS.md` is made from the records.
- **Freesound.** Its recorded effects and ambiences come in when
  `FREESOUND_API_KEY` is in Pi's environment. The key is free at
  freesound.org/apiv2/apply. The file is Freesound's high-quality preview,
  and its record says so.
- **Keys.** Besides Freesound: `PEXELS_API_KEY`, `PIXABAY_API_KEY`,
  `UNSPLASH_ACCESS_KEY`, `COVERR_KEY`, `SMITHSONIAN_KEY`, `JAMENDO_CLIENT_ID`,
  `MAPILLARY_TOKEN`. Platform licences (Pexels, Pixabay, Unsplash, Coverr,
  LottieFiles, icon sets) are opt-in, e.g. `provider:pexels`.
- **Policy.** A channel decides which licences it accepts in `settings.yaml`.
  The default is public domain, CC0, CC BY and CC BY-SA, with at least
  1600 px on an image's long side.
- **Checking.** `pva_check_provenance` checks that every file is still the one
  fetched.

```yaml
# library/<channel>/settings.yaml
archiveMedia:
  licences: [public-domain, CC0, CC-BY, CC-BY-SA]
  minImageLongSide: 1600
  minVideoHeight: 720
```

**`vpr select`** puts an earlier candidate back in place. The gateway offers
the same thing as `POST …/stages/:stage/select`, and `GET …/episodes/:episode/takes`
lists the candidates.

```bash
node studio/runtime/dist/src/cli.js takes my-channel/my-series/ep001 illustrations \
  --library "$PWD/library" --json
node studio/runtime/dist/src/cli.js select my-channel/my-series/ep001 illustrations 2 \
  --expect 3 --library "$PWD/library"
```

- **`--expect`** names the attempt you saw selected, or `none`. If someone else
  selected a different take in between, the command refuses instead of
  silently overwriting their choice.
- **The operator's selection is a lock.** It is signed with the operator key.
  From then on, a stage that runs again keeps its new result as a candidate and
  puts the operator's take back: neither an automatic run nor Pi replaces it.
  Only the operator can change it, by selecting another take.
- **A different take means downstream stages are out of date.** Selecting one
  marks the stages that depend on it stale. On a stage with a review gate it
  also records a new review request, because nobody has approved those bytes.
- **Candidates are never pruned.** An episode that runs a stage many times
  keeps every result.

### Channel media backup and restore

Version a `media.remote.json` in the channel repository, following the
[workspace contract](./workspace.md#media-remote). It selects an S3-compatible
bucket/prefix and tiers; credentials stay in the environment or your AWS
profile. The runtime never creates buckets, deletes objects, changes the lock
while transferring, or grants an approval.

```bash
# After making media, update and commit the lock with the editorial changes.
vpr channel media my-channel --library "$PWD/library"

# Inspect selection and remote availability before paying for uploads.
vpr channel media push my-channel --dry-run --library "$PWD/library"
vpr channel media push my-channel --library "$PWD/library"

# On a collaborator's clone, fetch just one episode (and its locked link targets).
vpr channel media pull my-channel --episode my-series/ep001 --dry-run --library "$PWD/library"
vpr channel media pull my-channel --episode my-series/ep001 --library "$PWD/library"
vpr channel media my-channel --check --episode my-series/ep001 --verify --library "$PWD/library"
```

Use `node studio/runtime/dist/src/cli.js` instead of `vpr` if the CLI is not
on your PATH. Set `AWS_PROFILE` or the standard AWS credential environment
variables in the shell that runs it; do not commit them. Region comes from
`media.remote.json`. Only run transfers against a remote you trust: its endpoint
is a versioned configuration choice, not a server discovered by the application.

**Selection.** `--tier paid,approved` (or repeated `--tier`) overrides the
remote's `keep`; `--tier all` includes everything, including derived files and
long deliveries. `--episode` works on push, pull and check. It scopes paths to
that episode and, for remote operations, includes transitive locked symlink
targets. It does not discover references embedded in arbitrary specs, pins or
templates: pull broader scope when those name shared assets outside the episode.

Default `keep` excludes deliveries and explicitly classified derived media;
unknown files are `other` and included. Configure `rules` for your actual
receipt-backed loop/atlas/soundtrack directories to avoid uploading thousands
of rebuildable PNGs. These explicit labels do not confer approval or a licence.
Every report includes excluded counts and bytes by tier. Push deduplicates
object bytes; pull counts bytes restored to each local path.

**Safety and resuming.** Local changed files are never overwritten. A merged
lock naming multiple versions of one path is reported `ambiguous`, never
resolved automatically. Choose the intended bytes and deliberately refresh the
lock before retrying. Downloads are hash/size-checked before exclusive atomic
publication. The destination filesystem must support hard links. Symlinked
parent directories, escaping/cyclic links and targets absent from the lock are
refused. Fix the layout or lock rather than disabling these checks.

Workers are bounded (`--concurrency 4` by default, 1–16 allowed). Large uploads
use multipart. A remote that does not answer at all (refused, no route, no
connection within 10 s after three attempts) fails the whole run at once with
`is unreachable`: check the tunnel or the endpoint, then rerun. Interrupt with Ctrl-C and rerun: completed objects/files are
skipped, but an incomplete object starts again. SIGINT/SIGTERM trigger best-effort
cleanup; a hard kill may leave a private upload snapshot in the system temp
directory or a `.media-pull-*.tmp` beside its destination. These leftovers are
not locked media and may be removed once no transfer is running. Upload
snapshots need free temporary disk space up to the combined size of active
uploads, in addition to the originals. `--dry-run` reads local media and remote
HEAD metadata but creates no files and issues no GETs or PUTs.

**Checking.** With a remote configured, `--check` distinguishes `remote`
(restorable, but missing locally) from `missing` (not available remotely either).
A link is restorable from git when its target is available. Remote availability
still exits 2: it is not local readiness. Authentication/service failures are
reported as errors, not as missing objects. `--check --offline` makes no network
requests; without a configured remote, checks remain local automatically.
`--verify` bypasses the local size/mtime hash cache. Checks write nothing.

**Provider requirements.** The S3 endpoint must support conditional
`If-None-Match: *` writes on PUT and multipart completion; unsupported conditions
fail rather than silently allowing overwrites. Optional request checksums can
be disabled with `checksum: false` for compatible servers that lack them, but
local verification cannot. Test the chosen provider before relying on it as a
backup; the automated tests use a fake HTTP S3 server, not a certification of
R2, B2, Garage, SeaweedFS or MinIO.

Read-only users need object-read permission; writers additionally need object
write and multipart-abort permission. S3 may return 403 instead of 404 for
absent objects without bucket-list permission, so allow the required bucket
metadata access if you want missing objects distinguished from access failures.
No remote objects are listed or deleted by these commands. Configure bucket
lifecycle to abort abandoned multipart uploads; do not automatically expire
completed hash objects. Local lock `--prune` never deletes a remote object.

**Full fresh-clone acceptance.** The issue's stronger goal is *every locked
file matching*, not merely a successful selective backup. For that test:

```bash
# Source machine: include all media needed by the test, not only default tiers.
vpr channel media push my-channel --tier all --library "$PWD/library"

# After cloning the channel text into another library:
vpr channel media pull my-channel --episode my-series/ep001 --tier all --library "$PWD/library"
vpr channel media my-channel --check --episode my-series/ep001 --verify --library "$PWD/library"
```

Alternatively rebuild excluded derivatives/deliveries, then verify their hashes.
The test on a real channel and acceptance of its existing signed layout
sheet by `pva_compose_video` remain an operator-run production check. No transfer
creates an approval, and approval verification still requires the existing
shared operator HMAC key (ADR-0045). A render on another machine need not be
byte-identical. Do not claim a backup exists for a locked file missing both
locally and remotely: hashes cannot recreate lost paid generations.

### Budget

Paid calls are journal records (avg-91o). Before a paid tool calls a provider,
it **reserves** the call's estimated price. Afterwards it **settles** the
reservation with what the provider charged. If the call never reached the
provider, or the provider refused it, the tool **releases** the reservation
instead. Today the paid tools are `pva_generate_image` on a fal model,
`pva_generate_minimax_h3_video` and `pva_generate_wan_video`. The Codex image provider bills your
ChatGPT plan, not money, so it reserves nothing.

The limit is the nearest `budget:` in `settings.yaml`, looked up in the
episode first, then the series, then the channel:

```yaml
budget:
  currency: USD
  limitMicros: 5000000   # $5.00
  warnAtMicros: 4000000  # optional
```

- **The check is atomic.** A reservation is checked and written under the
  episode's budget lock, so two sessions cannot both spend the last dollar.
  A call that would take committed spend (spent plus reserved) past the limit
  is refused before fal is called, and the refusal states the figures.
- **A paid stage stops when the budget is used up.** Once the budget is spent,
  a stage that declares a paid capability (`image.generate`, `image.edit`,
  `video.generate`) is reported `blocked` and refuses to start. Stages that
  spend nothing still run.
- **No `budget:` means no cap, not no record.** Every call is still recorded.
- **A model with no known price** is refused under a budget, because there is
  nothing to check it against. Without a budget it is recorded as unpriced.
- **An open reservation counts.** A process that died mid-call may still have
  been billed. `vpr budget` lists what is open. Check the provider's dashboard,
  then release the call yourself:

```bash
node studio/runtime/dist/src/cli.js budget my-channel/my-series/ep001 --library "$PWD/library"
node studio/runtime/dist/src/cli.js budget my-channel/my-series/ep001 release rsv_01J… \
  --note "no charge on the fal dashboard" --library "$PWD/library"
```

Only the operator can release a reservation, because releasing frees budget.
The gateway's `POST …/budget/reservations/:id/release` has the same rule.

**What the budget does not stop:** the ledger keeps Pi's *tools* honest. Pi's
environment holds `FAL_KEY`, so a `curl` from its shell reaches fal with no
reservation, and spend lines are not signed. This is the same same-user
boundary as the operator key (avg-qr4.8).

## Handing a creative stage to the agent

`Run stage` invokes an automatic adapter; it cannot write a brief or script.
For creative work, sign in as operator in the browser, select the stage, and
choose **Claim for agent**. This leases the stage without executing it. The
button is offered for runnable stages and stages blocked solely by the
attendance requirement; the gateway still checks dependencies, budget and
reviews. File-driven episodes do not use this action.

Give the returned `leaseId` and expiry to the agent, not your operator key.
The agent performs the work and calls `pva_complete_stage` with that exact
lease and its output paths. An expired lease needs a new operator claim.
Completing the work does not approve it: any human review gate still applies.
Signing in does not turn the agent's own requests into operator requests.

## The operator key

A human decision only counts when it is signed, and only the **operator** can
sign one. The operator is not a role anyone assigns — it is whoever can read
the operator key file, so treat that file the way you would treat a password.

- The gateway generates it the first time it starts, alongside the bearer
  token: `studio/gateway/.operator-key`, mode `0600`. Both files are 0600 for
  the same reason — either one readable by another user makes them the
  operator, not you.
- `vpr` reads it. The browser studio asks you for it once — paste the
  contents of the file into the operator-key field beside the gateway token —
  and keeps it in that browser's local storage. It is never built into the
  web bundle or served by the dev server.
- **What is closed for Pi, and what is not.** The API path is closed: Pi
  holds only the gateway token, which the gateway resolves to the `agent`
  principal, so `pva_request_approval` — or any call Pi makes to `/approve` —
  can only *request* a review, never grant one (avg-qr4.3, and the harness
  review's approval P0). Pi's own shell is guarded against accidents: the
  gateway spawns Pi with `AVG_HEADLESS=1`, and `vpr` run with that set is an
  `agent` without even reading the key file, so `vpr approve` from Pi's bash
  tool records a request. A Pi you start yourself with `pi -e …` inherits
  your shell's environment instead; export `AVG_HEADLESS=1` there to get the
  same guard. What this does **not** stop is a same-user process that
  deliberately reads the key file, or unsets `AVG_HEADLESS` first — that is
  outside this issue's boundary and is avg-qr4.8's OS-isolation work.
- Without it, `vpr approve`/`vpr reject` still run: the decision is recorded
  as a **request** rather than a grant, and the command exits non-zero — the
  same downgrade an unauthenticated gateway caller gets.
- **Rotation:** stop the gateway, delete the key file, start the gateway
  again, and paste the new key into the studio. This is not a maintenance
  no-op: every existing signed human decision on every episode now reads
  `does not verify` and must be re-granted. That is intended — the whole
  point of signing is that deleting the key is exactly as consequential as it
  looks. (`unsigned` is a different reason: it is what pre-v2 legacy records,
  written before approvals were signed, read under any key.)
- **The limit this does not close:** the key is a file, not a hardware
  secret. Anything running as your own user — a script, another agent, a
  compromised dependency — can read it and sign as you (avg-qr4.8 tracks
  hardening this further). It stops Pi from minting its own approvals; it
  does not stop your own account from doing so.

`AVG_OPERATOR_KEY_FILE` points the gateway and `vpr` at **one** key file,
which matters once either runs from somewhere other than its usual directory.
Without it:

- the gateway writes and reads `.operator-key` in **its own working
  directory** (so start it from `studio/gateway/`, or set the variable);
- `vpr` defaults to `studio/gateway/.operator-key`.

The gateway refuses to start when its token file or operator key file lies
inside the library root it serves: `/library/` is served without
authentication, so a credential there is one GET away from anything that can
reach the port.

Those two defaults only agree when the gateway is started from
`studio/gateway/`. If you start it elsewhere, set `AVG_OPERATOR_KEY_FILE` to
the same absolute path for every process that needs to be the operator.

## Environment

| Variable | Default | Effect |
|---|---|---|
| `AVG_LIBRARY_ROOT` | `./library` | Where channels and episodes live |
| `AVG_CLAIM_TTL_MS` | 900000 (15 min) | How long a `vpr run` claim holds its lease |
| `AVG_GATEWAY_URL` | `http://127.0.0.1:5198` | Gateway to stream events to |
| `AVG_GATEWAY_TOKEN` | `library/.gateway-token` | Gateway auth |
| `AVG_OPERATOR_KEY_FILE` | gateway: `.operator-key` in its cwd; `vpr`: `studio/gateway/.operator-key` | Which file makes a caller the operator — see "The operator key" above |
| `AVG_BUILTIN_PIPELINES` | `@studio/pipelines`' `pipelines/` | Where `vpr` finds the built-in pipelines |
| `AVG_HEADLESS` | unset (the gateway sets `1` for Pi) | Any value but empty or `0` makes `vpr` an agent without reading the operator key |
| `FAL_KEY` | — | Required for `image.generate` / `image.edit` |
| `AVG_TTS_WORKER_URL` | local worker | Speech synthesis endpoint |
| `STRUDEL_CHROME_PATH` | Remotion's Chrome, else Playwright's or the machine's | The Chrome music is rendered with |
| `AVG_AGENT_BACKEND` | `pi` | Which agent the gateway runs per episode: `pi` or `claude` |
| `AVG_CLAUDE_MODEL` | Claude Code's default | Model of the gateway's Claude sessions |
| `AVG_CLAUDE_PERMISSION_MODE` | `dontAsk` | Permission mode of the gateway's Claude sessions |
| `AVG_CLAUDE_ALLOWED_TOOLS` | `mcp__pva,Skill,Read,Write,Edit,Glob,Grep,Bash` | Tools those sessions use without asking |
| `AVG_CLAUDE_CHANNEL` | unset (`npm run studio:claude` sets `1`) | The MCP server pushes review activity as channel events |
| `AVG_CLAUDE_STATE_DIR` | `.claude/pva` | Where the MCP server leaves status and inbox for Claude Code's hooks |
| `AVG_CODEX_TOKEN` | — | OpenAI Codex token for the image route outside Pi |

Secrets are environment-only (ADR-0030). Put them in your shell profile or an
untracked `.env`, never in a committed file.

## If something is wrong

**The studio says `Failed to fetch`, and the gateway exits with
`ERR_MODULE_NOT_FOUND … @studio/…`** — usually right after switching branches.
The branch added or changed a workspace, and `node_modules` has neither its link
nor its `dist/`. Run `bun install` at the repository root: it links every
workspace and its postinstall builds the ones imported from `dist/`. Then
restart the gateway. The studio's error is only the symptom; the gateway's own
output names the missing package.

**`No packages installed` from `pi list`** — expected unless you ran
`pi install ./studio/agent`. The `-e` flag works without installing.

**Gateway: `Library root ... does not exist`** — `libraryRoots` in
`studio/gateway/config.json` resolves relative to the gateway directory, so the
repository root is `../../library`.

**`vpr exited with code 1`** — run it by hand with `--library` to see the real
error. Pass the flag rather than relying on `AVG_LIBRARY_ROOT`: the fallback
exists, but a command that journals into a library you did not mean is worse
than one that refuses.

**A capability fails mid-session** — check `npm run doctor`. The agent is
designed to fail rather than substitute a provider, so an unmet requirement
surfaces as an error, not a quietly worse video.

**`gateway:unauthorized … Gateway rejected the token (4001)`** — the agent and
the gateway disagree about the token. Almost always a gateway from an older
checkout still holding port 5198 with its own token:

```bash
lsof -ti:5198 | xargs -r ps -o pid=,command=   # see who owns the port
lsof -ti:5198 | xargs -r kill                  # stop it
```

Then start the gateway from this repository. It writes
`studio/gateway/.gateway-token`, which is the first place the agent looks. To
be explicit:

```bash
export AVG_GATEWAY_TOKEN="$(cat studio/gateway/.gateway-token)"
```

The agent no longer retries after a 4001 — a rejected token will not fix itself
— and it keeps working without the event stream, so this is a degraded mode
rather than a stopped one.
