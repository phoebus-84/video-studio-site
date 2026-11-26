> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Changelog

What changed for someone who uses the studio, newest first. How a release is
cut and what its number promises: [contributing](./contributing.md#releases).

## Unreleased — to be 0.3.0

### Needs action

- **The product is called Sergio.** The name it had is gone from the code,
  the documentation and what the tools say. Nothing a library keeps is
  renamed: the tools are still `pva_*`, the variables `AVG_*`, the packages
  `@av/*` and `@studio/*`, the manifests `studio.video/v1alpha1`. What moves:
  - **The render engine's defaults.** The clone on an engine is looked for in
    `~/sergio` and its cache in `~/.cache/sergio/render`. An engine whose
    entry in `render-hosts.json` names `repo` and `cache` is not affected;
    one that relied on the defaults moves its clone there, or names where it
    is.
  - **The archive cache** is `~/.cache/sergio/archive-media`. The old folder
    can be deleted; the new one fills as media is fetched.
  - **The gateway's `/health`** answers `service: "sergio-gateway"`.
  - **The root package** is named `sergio`.

### Added

- **Every agent harness, not just Pi and Claude Code.** The repository now
  carries the project file each harness reads to start the studio's tools:
  `.codex/config.toml` for Codex, `.gemini/settings.json` for Gemini CLI,
  `.cursor/mcp.json` for Cursor, `opencode.json` for OpenCode (both
  versions), and `.mcp.json`, which VS Code with Copilot reads as Claude Code
  does. Start the harness from the repository root and the `pva` tools are
  there; Codex runs the read-only ones without asking, as Claude Code does
  (ADR-0057).
  - **One set of instructions.** `AGENTS.md` holds what `CLAUDE.md` held;
    `CLAUDE.md` imports it, and Gemini CLI is pointed at it.
  - **Skills for every harness.** `npm run compose` also writes
    `.agents/skills/`, the layout Codex, Gemini CLI, OpenCode, Goose, Zed and
    the others read.
  - **Studio activity outside Claude Code.** A harness without Claude Code's
    hooks gets operator review comments and stage updates at the end of its
    next pva tool result, and in the first one a warning when the studio does
    not serve this session's library.
  - **Any other MCP client** (Goose, Zed, Kiro, Windsurf, …) starts the server
    with `node /path/to/sergio/studio/agent/mcp/start.mjs`, from any
    directory.
- **The browser studio can drive Codex, Gemini CLI, OpenCode and other
  agents.** `AVG_AGENT_BACKEND=codex` (or `gemini`, `opencode`, `goose`,
  `qwen`, `copilot`, `cursor`, `kiro`) runs each episode's session in that
  agent over the Agent Client Protocol, with the studio's tools; `acp` with
  `AVG_ACP_COMMAND` runs any other agent that speaks it. The agent uses its own
  login. Its permission requests are answered by tool kind:
  what Pi has, without web fetches (`AVG_ACP_ALLOWED_KINDS`).
- **Your other machines, declared once.** `library/.render/machines.json`
  (`AVG_MACHINES` names another file) says which machines you have, how SSH
  reaches each (an alias of your SSH config), what each is for (`remotion`,
  `blender`, `comfyui`, `heavy-cpu`, `heavy-gpu`) and in which order to use
  them, `"local"` included. The tools route by it, so you no longer tell the
  agent "use that machine, connect with ssh …", and the skills tell it never
  to ssh there by hand (ADR-0056). Nothing changes until you write the file.
  - **ComfyUI speech** reaches a server that listens only on its machine's
    loopback through a tunnel the tool opens on a free port when it is
    needed. The tool checks the tunnel, reuses it and closes it when the
    studio exits; no `ssh -N -L` by hand. It holds the machine's GPU lock
    (`gpuLock`, taken with `flock`) around each call, and the receipt names
    the machine. `AVG_COMFYUI_URL` still goes over the file; `comfyui.json`
    keeps the nodes' settings and is the fallback for the address.
  - **Renders.** A `remotion` machine is an engine by its name; its settings
    go over `render-hosts.json`, which still works on its own; `auto` tries it
    first. Without `host`, `pva_compose_video` renders where
    `prefer.remotion` says (here when it says nothing), and `host: "local"`
    renders here.
  - **Reports.** `pva_capability_status` and `pva_config` list each machine,
    whether it answers over SSH (and ssh's reason when it does not), its
    system, cores and Blender version, and where each role goes.
  - **Blender.** `pva_stage_shot`, `pva_rig_shot`, `pva_rig_sheet` and
    `pva_blender_render` run where `prefer.blender` says: on the first
    `blender` machine that answers with a Blender the tools take, with its
    `bin` and its GPU lock, else here
    ([#121](https://github.com/phoebus-84/sergio/issues/121)). The code
    goes to the machine's engine clone by git push, the files once by content,
    and the output comes back checked byte for byte; the tool keeps it as a
    local result, with `machine` in its provenance, and says where Blender ran.
    A tool's `machine` (`"local"` or a name) picks the place. Files a `.blend`
    names go with it when they are in the channel or film, named relative to
    it. A Blender job, like a render, runs committed code only:
    `packages/blender` too.
  - `@av/machines` is the new package. render-worker's SSH transport moved
    there and render-worker re-exports it, so an engine now needs
    `packages/machines` committed too.
- **Any ComfyUI workflow, through the studio's tools** (ADR-0055). The
  operator's ComfyUI server ran only speech; it now runs any graph written
  down as a workflow — an API-format export with `{{placeholders}}`, its
  inputs, outputs and the nodes and models it needs.
  - `pva_comfyui_workflows` lists the built-in workflows, the operator's
    (`library/.render/comfyui/workflows/`) and a channel's or film's own
    (`<channel>/comfyui/workflows/`), and whether the server has each one's
    nodes and models, read from `/object_info` without running anything.
  - `pva_comfyui_run` runs one in an episode, a channel source or a film
    unit: files of the workspace uploaded under their hash, what it made
    written by kind with `<file>.comfyui.json` beside it (workflow and graph
    by hash, values, seeds, models, server version, GPU time). $0; the GPU
    time also goes to an episode's or film unit's journal. The server is the
    one speech finds, a machine of `machines.json` included: the tool opens
    the tunnel, holds the machine's GPU lock for the whole run (waiting for
    it as long as a run may take) and names the machine in the receipt.
  - The server is asked first, through `/object_info`, for every node, every
    input its version requires and every model file: what is missing is
    said before anything runs, with the files each loader has.
  - Model files are inputs with defaults: a server that names them
    otherwise sets its names once in `.render/comfyui.json`
    (`workflowDefaults`), with no copy of the workflow.
  - Built in: Z-Image Turbo (text to image), FLUX.2 [klein] 4B (image edit)
    and Wan 2.2 TI2V 5B (video), run on a real server; ACE-Step v1 (music),
    not yet.
  - `pva_synthesize_speech` with `provider: "comfyui-qwen"` takes
    `voiceDesign`: a voice made from a description, kept on the server with
    `saveVoiceAs` (under consent bound to that name) for every later line.
  - `pva_capability_status` says which workflows the server can run.
  - New package `@av/comfyui`: the ComfyUI client and templates, moved out of
    `@av/comfyui-speech`, which depends on it unchanged.

- **Generated music is a source of its own.** Music composed as Strudel code
  stays the default, no longer the only music the studio makes: a cue may
  be generated with a model (a music workflow, `pva_comfyui_run`) as it may
  be licensed or supplied, with its workflow, model, seed, tags and lyrics in
  its receipt. It goes in `music/` and on the cut's music track like any
  cue; `pva_music` lists it. ADR-0053 is amended accordingly.

- **Style templates: a ready-made look, never required.** A channel, a
  series, a film or a scene may take a style — "make it in the risograph
  style", "prepare this scene using 'Tide riso'" — and nothing has to
  (ADR-0054).
  - A template is a brief (`STYLE.md`) whose values all come from parameter
    files: a palette of named colours, and values with the control each asks
    for. Nine ship with the studio (woodblock print, risograph, flat
    minimal, oil pastel, cut paper, storybook cel, neon city, chalkboard
    explainer, bold flat explainer); a library keeps its own in `_styles/`,
    a channel or film in `styles/`.
  - `pva_styles`, `pva_apply_style`, `pva_style` (the brief a unit reads,
    every value filled in), `pva_set_style`, `pva_save_style`; the creation
    tools take `style`, and a new film takes its style's format.
  - Changing a style makes what read it stale, in chain: each unit keeps a
    pin on the style it read (`source/pins/style.json`), and a changed
    colour makes a film's bible, its scenes' direction, its shots' plans and
    takes and the renders above them stale until redone.
  - In the web studio: a style picker when a film is made, and a Style panel
    on a channel's, series', film's and scene's overview — colour pickers,
    a control for every value, the brief as it will read, and what saving
    makes stale.

- **Music written as code.** A piece is a file of [Strudel](https://strudel.cc)
  code, `music/<name>.strudel`, in an episode, a channel source or a film
  unit; the studio renders it locally at $0 (ADR-0053).
  - `pva_music_check` evaluates a piece without a sound: its parts, the
    events and notes of each, and what is wrong with it — a sound that does
    not exist, a control the engine ignores, two reverbs asked of one orbit.
  - `pva_music_render` writes a WAV: a stretch of cycles or the whole piece,
    some parts or all, with a tail or as a seamless loop, with stems; brought
    to −18 LUFS with one gain, never compressed. `<file>.music.json` beside
    it holds the measurements the agent mixes by — loudness, the peak and
    when it falls, spectrum by band, stereo image, the level through time,
    and the same for each stem — and what to listen for: a loop whose parts
    do not come round, an ending cut while it sounds.
  - `pva_music` lists a workspace's pieces and their renders.
  - In the web studio a `.strudel` file opens with a player on the same
    engine (`Ctrl+Enter` plays, `Ctrl+.` stops), its events drawn part by
    part, and a form to render it; episodes and film units have a **Music**
    tab.
  - Three skills hold what was tested against the engine: `strudel-music`,
    `strudel-sounds` and `strudel-forms`. `film-sound` now makes a score
    here when none is supplied or licensed.
  - `@av/strudel` is the reusable part: a piece checked and rendered offline
    in a headless Chrome, with `strudel-render` for the shell. It is
    AGPL-3.0-or-later, as Strudel is; the other packages stay Apache-2.0.
  - Rendering needs a Chrome: `npm run doctor` shows which is used, and
    `STRUDEL_CHROME_PATH` names another.
- **A skeleton for a 3D model** (`rig.create`): `pva_rig_model` sends a model
  to a rigging service through fal — Hyper3D for a human, a quadruped, a
  bird, a dragon, a kaiju or a body described in words; Meshy for humanoids
  on a standard skeleton, with a walk and a run — on the episode's budget, at
  $0.20 a rig. Hyper3D is asked for `core` skinning, which tore the surface
  a tenth as often as the service's own default on the figures tried. What
  comes back is examined before the tool answers: vertices no bone moves,
  bones outside the body, a body that stands on nothing, a left with no
  right, clips that move nothing. A rig that fails is kept and not released.
  A model that faces another way is turned to face +z before it is sent. The
  exam also says where the body stands and whether vertices follow more than
  four bones, which some renderers do not read.
- **A rig posed and looked at**: `pva_rig_sheet` puts a rigged model in
  known poses in Blender, at no cost, and renders them on one sheet beside
  the rig — for a two-legged body arms up, arms down, reach, step, wide, head
  turn and bow, each from the front, three-quarter and the side; for any
  other, each of its largest limbs swung, or poses of your own. The clips
  that came with the rig are played over six moments each. For every pose
  it says how much of the surface was strained and how many edges were torn,
  and marks the poses that went further than a sound rig does. For a
  two-legged body it also finds a hand that goes into the head, the body or
  the other hand, or a leg into the other, in each pose and through each
  clip, with how deep and when: a wave made from a sentence put the
  lamplighter's hand 9% of his height into his head. It is the
  step between `pva_rig_model` and a release: the first rigs made all passed
  the exam at rest, and it was the poses that told them apart.
  `@av/blender/rig-sheet` is the reusable part.
- **Motion for a rig**, three ways. Each gives a clip beside the rig,
  `<rig>.clip.<name>.glb`, that `pva_rig_sheet` plays.
  - **Stock clips, asked for with the rig.** `pva_stock_clips` lists what
    Hyper3D has, free: 113 for a human body, and clips for eight kinds of
    animal. Name up to ten by id in `clips` on `pva_rig_model`: they come
    with the rig, filed under their names, at no price beyond the rig's.
  - **A clip carried from another skeleton**: `pva_retarget_clip`, local and
    free. Bones are paired by the part they play and every turn is copied in
    the world from the rest pose, so the two skeletons may name, point and
    size their bones differently and rest in different poses. Two-legged
    bodies by name; any other with a `map`.
  - **A motion from a sentence** (`motion.generate`): `pva_generate_motion`
    asks Hunyuan Motion through fal for a person's motion, $0.08 on the
    episode's budget, keeps it in `assets/motion/` and carries it to the
    rig.
  - `@av/blender/clip-sample` is the reusable part: a clip in a `.glb` or an
    `.fbx` read as turns from the rest pose, in the world.
- **A rigged character, filmed**: `pva_rig_shot` films a rig playing one of
  its clips, locally and at no cost, into `assets/video/<shotId>.mp4` — a
  clip of video like any other, with no sound. The camera is asked for in a
  shot's words: front, three-quarter, side or back; full, medium or close.
  It follows the body as it travels, in the film's own size and frame rate,
  on a colour of your choosing, with or without a floor that takes the
  shadow. It is one character on an empty stage; a set is still a Blender
  scene. With it, a picture becomes a model, a rig, a motion and footage
  without a script written by hand. `@av/blender/rig-shot` is the reusable
  part.
- **A model or a rig released as a character's form in one step**:
  `pva_release_model` takes it from the episode that made it and makes it
  the character's, locally and at no cost.
  - **The figure is stood once, in its file**: facing +z, its feet on y 0,
    its middle over the origin, as tall as `height` says in metres. One node
    above the scene's roots carries the turn, the size and the move, so the
    body, its textures and its clips are the bytes the services returned,
    and no scene turns or lifts it again.
  - It lands in `characters/<id>/forms/<form>/<release>/` with its clips,
    its pose sheets, the picture it was made from, the provenance of the
    model, the rig and each clip, and a `form.json` that names every file's
    source by hash. The form (`rig-3d`, or `model-3d` with no skeleton) is
    given its actions from the clips, and the release is recorded with what
    made it.
  - A rig is refused when its exam fails, and when it was not posed since
    its file last changed. A clip is released as an action only when it was
    played on the rig's sheet; the others are left out and named.
- **Characters in one picture, and in a place**: `pva_stage_shot` films
  several rigged characters on a set or on an empty stage, locally and at
  no cost, into `assets/video/<shotId>.mp4`.
  - Each player is a role of the cast or a rig of the episode. It starts at
    a place, turned as its mark is or towards another player, and does one
    thing after another: a clip, a walk to another place while a clip
    plays, a turn, a wait.
  - **A walk goes at its clip's pace**, read from the foot that carries the
    body: the body is moved as far as its feet step. Given a time of its
    own, a way is taken in that time, and the tool says the feet slide.
  - **A set is a `.blend` of the episode**, in metres, with no character in
    it. An object named `mark.<name>` is a place by that name. The set
    brings its light and its world; its own camera films when asked, or a
    camera is asked for in words about the players it is on.
  - **Between clips a character stands**, arms beside it, instead of going
    back to its rig's A- or T-pose; lower arms would put a hand in its
    body, and the arms stop short of that. One clip gives way to the next,
    or to standing, the short way round: a limb no longer spins on the way.
  - It reports what one frame does not show: the share of the shot each
    player was in the picture, the share the set hid it, pairs that came to
    stand in one place, and a part of a body that went into another of it,
    how many centimetres and when.
  - Nobody touches anything: a hand on a door, an object carried and two
    bodies in contact are still a scene built by hand.
  `@av/blender/stage-shot` is the reusable part.
- **`pva_rig_shot` films a role of the cast.** `role` in place of `rigPath`
  films the release the role pins, after reading its files back against
  their record; the shot's provenance says who played it.
- **A fal call that runs out of time names the request it left.** The job
  may still finish and be charged; the message says which one it was.

### Documentation

- **The README opens with what the studio is for, and what it is not.** The
  architecture follows it. The running guide, the workspace layout and the
  domain language now cover characters and casts, the revision an edit must
  name, and the one render of a film at a time.

## 0.2.0 — 2026-11-17

The first release with a licence, and the first with a number that means
something. `0.1.0` was never tagged: it is whatever `main` was before this.

### Needs action

- **`pva_edit_cut` wants the revision you read.** Pass `expectedRevision`
  (printed as `cut revision N` by `pva_check_cut` and by every edit; 0 for a
  unit with no cut yet), or `latest: true` for an edit that is right on any
  revision. An edit that names neither is refused.
- **A second render of a film is refused, not run beside the first.** From
  any process: the agent's `pva_render_cut`, a stage, the browser. The refusal
  says what is being rendered.

### Added

- **A licence.** `packages/` is Apache-2.0, the studio and everything else is
  AGPL-3.0-only. `LICENSING.md` says what neither covers.
- **Films** (#99): a self-contained work produced at three levels — film,
  scene, shot — each with its own cut, edited by the agent or by a person on a
  timeline and rendered with FFmpeg in the pieces that changed.
- **Speech beyond Apple Silicon** (#95): Qwen3-TTS on CPU, CUDA and ROCm
  beside MLX.
- **Speech through a ComfyUI server** (#98), with voice cloning and
  clean-then-clone.
- **A photo that speaks, and ElevenLabs speech** (#96):
  `pva_generate_avatar_speech` makes a talking clip from a photograph and an
  audio file, only with a consent record the operator wrote for that
  photograph; `pva_synthesize_speech` takes `provider: "elevenlabs"`, and its
  word timings are reused by `pva_align_take` with no second paid call.
- **Characters** (ADR-0052): a character is a record apart from how it
  appears, owned by a channel, a series or a film. It takes any form — a rig,
  sprites, a drawing made by code, a photograph, a dot, a sound, a voice alone
  — released in folders recorded with their hashes, and a series or a film
  casts it in a role, pinned to the release it wears. `pva_characters`,
  `pva_create_character`, `pva_update_character`, `pva_cast`, and the skills
  `character-development` and `character-forms`.
- **A 3D model from one picture** (`model.generate`): `pva_generate_model`
  asks Tripo H3.1 through fal for a textured model, on the episode's budget
  at the price of what is asked, and says what came back — triangles,
  materials, textures, its size and where its origin is, that it has no
  skeleton, and when it is too heavy to rig. Run against the real service on
  2026-11-17: a textured GLB, a quad FBX of 20,000 faces and a bare mesh,
  each recorded on the ledger at its price.
- **Retake** (`bench/retake`): the specification of a benchmark for what
  happens after the first take. No harness and no numbers yet.

### Fixed

- **Two processes writing one cut.** The gateway and the agent could both read
  a revision, both pass the check and both write the next one; the second
  replaced the first unseen. The read, the check and the write are now held
  together by a lock.
- **An edit by the agent now shows in an open editor**, and a stage that moved
  reaches the event stream (#91): the gateway reads both from the files that
  changed, whoever wrote them.
- **A render's sources are told apart by more than size and date.** A file
  replaced by other bytes of the same length, with its date put back, no
  longer counts as unchanged. Renders made before stay current.
- **A render that finishes after its cut was edited and rendered again** no
  longer takes the newer render's place.
- **A render's line in the journal is no longer dropped in silence** when the
  journal cannot be written: it is kept beside the render, written at the next
  one, and reported.
- **What a clip's lock holds when a scene is assembled** is now what the
  skills say: what the clip shows, not its place in time; assembly's notes say
  when a locked clip moved.
