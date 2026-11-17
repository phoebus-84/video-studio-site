---
name: pva-executive-producer
description: Operate the Agentic Video Studio as executive producer. Use for channel, series, episode, film, scene, shot, run, resume, review, and rerun commands. This skill coordinates video production pipelines through the pva_* tools, under Pi or Claude Code.
---

> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).


# PVA Executive Producer

This skill makes the agent — Pi, or Claude Code through the studio's MCP server — the
executive producer for the Agentic Video Studio. It coordinates the full production
lifecycle: channels, series and episodes; films, scenes and shots; pipeline runs,
reviews, and reruns.

## Setup

Under Pi, the package must be installed as a Pi package (or loaded with
`pi -e studio/agent/extensions/index.ts`):

```bash
pi install ./path/to/pi-video-agent
```

Runtime dependencies are installed automatically during package installation.

Under Claude Code, start `claude` from the repository root: its `.mcp.json` starts the
`pva` MCP server, which serves the same tools as `mcp__pva__pva_*`. The slash commands
are its prompts (`/mcp__pva__video`, `/mcp__pva__render`, …).

## Usage

Once installed, the executive producer extension loads at session start. Tools and
commands become available through the agent.

### Core Concepts

- **Channel**: Top-level organization unit for a video series or brand.
- **Series**: A collection of episodes within a channel.
- **Episode**: A single video production unit with its own pipeline state.
- **Film**: A self-contained work, short or feature length, beside the channels. It is
  produced at three levels — the film, its scenes, their shots — each with its own
  pipeline, cut and renders. **For a film, load the `film-producer` skill first.**
- **Workspace authoring**: Idempotent creation of channel, series, and episode directories; existing metadata is never overwritten.
- **Run**: One execution of a pipeline against an episode.
- **Resume**: Continue a previous run from its last checkpoint.
- **Review**: Evaluate pipeline output and collect human feedback.
- **Rerun**: Re-execute a pipeline from a specific stage.

### Available Tools

- `pva_version` — Report package version and load-time health.
- `pva_diagnostics` — Return detailed diagnostics including any errors.
- `pva_create_channel` — Create channel metadata and an optional pipeline profile.
- `pva_create_series` — Create a series and its local skill directory.
- `pva_create_episode` — Create the canonical episode workspace layout.
- `pva_render_vector_animation` — Validate or render a declarative rigged SVG animation.
- `pva_synthesize_nonverbal_audio` — Generate deterministic speech-free character cues.
- `pva_compose_multitrack_video` — Mix an animated clip with frame-addressed local audio cues into an immutable render.
- `pva_generate_images` — Several images in **one** call, drawn concurrently (four take about as long as
  one). Use it whenever more than one image is due: Claude Code runs the tool calls of one message one
  after another, so four `pva_generate_image` calls side by side take four times as long.
- `pva_generate_wan_video` — Animate one episode image with Wan 2.2 A14B turbo on fal ($0.10/clip at 720p,
  $0.05 at 480p; on the spend ledger). `loop: true` ends on the same image: a closed loop. Prefer it to
  `pva_generate_minimax_h3_video` (~$0.48/clip) for loops and small moving details; keep H3 for
  performances, references and long shots.

- `pva_synthesize_speech` — Local Qwen by default (MLX or Torch). Only when the
  operator asks for ComfyUI, use `provider: "comfyui-qwen"` (free;
  `pva_capability_status` says whether it answers): `voice` is a speaker or
  `saved:<name>`, or `referenceAudioPath` (+ `referenceText`, the exact words)
  clones a recording of the workspace; `cleanReference: true` first cuts it
  and separates the voice from music and noise. Clone only a voice whose owner
  consented: cloned/saved voices require `voiceConsentPath`, an operator-created
  consent record bound to the reference hash or saved name. Never create or confirm
  that consent on the operator's behalf. Both Qwen paths need `pva_register_take`, then `pva_align_take`
  with an aligner: they return no word timings. Never switch provider on failure.
- `pva_clean_voice` — Clean only, on the same ComfyUI server: separate a recording's voice
  from music and noise (optional `start`/`duration` cut) into a new `assets/…wav`, with a
  `.clean.json` record. Nothing is cloned.

### Films

A request for a film, a short, a trailer, a music video, a documentary — one work,
not an episode of a series — is a **film**, made with the film tools:

- `pva_create_film`, `pva_create_scene`, `pva_create_shot` — the film and its units.
- `pva_film` — the film in running order, where every unit stands, and what stands
  between it and its final render. Read it before deciding what to do next.
- `pva_update_unit` — a unit's manifest, and the order of what is under it.
- `pva_ingest_footage`, `pva_footage`, `pva_inspect_media` — real footage, location
  sound, stock and music brought in, logged and looked at.
- `pva_assemble_cut`, `pva_edit_cut`, `pva_check_cut`, `pva_cut_frame`,
  `pva_cut_effects`, `pva_render_cut` — a unit's cut made, edited, checked, looked at
  and rendered; a render cascades to whatever under it is out of date.

A **character** — a host, a puppet, a pixel figure, a voice, a dot — belongs to a
channel, a series or a film, not to an episode, and is the same next week:

- `pva_characters` — who a channel, a series or a film has, and one in full: who it
  is, its voice, its forms, what each form can do.
- `pva_create_character`, `pva_update_character` — a character made on paper, given
  a form in any medium, and a form's files recorded as a release that is never edited.
- `pva_cast` — who plays what in a series or a film, pinned to the release each wears;
  with `asks`, a script checked against what the cast can do.

Read the cast before writing a script. Load `character-development` to define a
character and `character-forms` to give it a body.

Every other tool takes a film's unit as `channel` / `series` / `episode` with `_` for
the level itself: a shot is `(film, scene, shot)`, a scene `(film, scene, _)`, the film
`(film, _, _)`. Pipelines, budget, approvals, generation, voice and archive tools all
work on a film's units that way.

How much a person decides is declared per level in `pipeline.yaml` (`pipeline:`,
`scenes:`, `shots:`): from every step (`film-shot-directed`) to only the final review
(`film-project-auto` with `film-scene-auto` and `film-shot-auto`). The skills are
`film-producer` (start here), `film-development`, `film-breakdown`, `footage-ingest`,
`shot-production`, `film-sound` and `film-editing`.

Create parents in order: channel, series, then episode. Creation is intentionally
non-destructive: revise existing metadata with reviewed file edits rather than
using the create tools as overwrite operations.

The list above is not the whole set. Every tool the studio registers is listed, with
what it does, in `docs/running.md` ("Tools the agent can call"); the tool's own
description is the authority on its parameters.

**What a channel or a series wants lives in its library, not here.** Before working
on an episode, read the channel's and the series' own skills (`library/<channel>/skills/`,
`library/<channel>/series/<series>/skills/`, found with `pva_list_skills`): a
channel's preferred tools, voices, music rules and procedures are written there.

## Reference

See `studio/agent/CONTRIBUTING.md` for development setup and `studio/agent/SECURITY.md`
for the full-system-access implications of this package.
