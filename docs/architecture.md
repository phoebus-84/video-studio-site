> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Architecture

This page describes the current responsibilities and boundaries. It is not a
promise of unattended, one-prompt production. See the
[harness review](https://github.com/phoebus-84/video-studio/blob/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc/docs/harness-review.md) for implementation gaps and the
[running guide](./running.md) for prerequisites.

## Product boundary

The studio produces videos from source material, with an agent helping to plan,
make and revise them. It supports one-off work and spec-driven series.

- Output profiles include `youtube-1920x1080` (16:9) and
  `vertical-1080x1920` (9:16), delivered as H.264/AAC MP4.
- Pictures can be generated, licensed archive material, deterministic graphics,
  terminal recordings, Blender shots or existing media.
- Narration can use recorded or synthesised takes. Forced alignment supplies
  word timing; segment timing is available where word alignment is absent.
- **Remotion renders the episode's layered edit timeline. FFmpeg processes
  media, masters audio and performs technical checks.** The separate FFmpeg
  composer remains available for multitrack compositions.
- Rendering does not upload, schedule or publish the result.

The separate product website shows selected productions, not built-in channel
formats. Their scripts, styles and custom composition code belong to the
production library, not to the reusable application.

## Control plane

**The agent** is the executive producer: it interprets intent, works on editorial
material and calls tools. Pi loads the registrations in `studio/agent/src/`
directly; Claude Code accesses those same registrations through the studio's
MCP server. Tools are not implemented separately for each harness
([ADR-0048](./adr/0048-tools-written-once-served-to-any-harness.md)).

**The execution service**, in `studio/runtime`, tracks pipeline snapshots,
leases, attempts, dependencies, staleness, reviews and the spend ledger. The CLI
and gateway use that service. It does not write prose or silently choose a
creative provider.

**The gateway** provides the API and event transport used by agent pipeline tools
and the browser studio. It manages browser-facing agent sessions, with backend
configuration for Pi RPC or the Claude Agent SDK. Production execution is
delegated to the service and stage adapters; it is not a second renderer.

The browser is optional. **The gateway is still required for the agent's
pipeline tools**, including stage claims/completion, approval requests and
budget status. They call its HTTP API even from a terminal session. Standalone
media tools and the first-render demo do not require the browser; each tool
still needs its own software, provider and credential prerequisites.

## Data plane

Capabilities are named independently of providers. The vocabulary lives in
`studio/contracts/src/vocabulary.mjs`; composition wiring lives in
`compose.config.json`. A declared capability is not proof that a machine has
its dependencies or credentials ready.

| Work | Capability / implementation |
|---|---|
| Image generation and editing | `image.generate`, `image.edit`: `@av/fal-media` or `@av/codex-image` |
| Generated clips | `video.generate`: `@av/fal-media` |
| Speech | `speech.synthesize`: local Qwen3-TTS on MLX |
| Word alignment | `speech.align`: local voice worker or the explicitly selected ElevenLabs route |
| Static graphics | `graphics.render`: `@av/graphics` |
| Animated infographics | `graphics.animate`: `@av/infographics` |
| Terminal recording | `terminal.record`: `@av/terminal-recorder`, using VHS |
| Episode rendering | `video.compose`: `@av/remotion-composer` |
| Multitrack composition and probing | `video.compose`, `media.probe`: `@av/video-composer` and FFmpeg tooling |
| Editable 3D | `scene.create`, `scene.render`: `@av/blender` |

Archive acquisition and audio editing also have reusable packages and agent
tools; they are not separate stage-capability names. See the
[package reference](./guide.md#packages) and run `npm run doctor` for this
machine's readiness. Providers must be selected explicitly, not silently
substituted.

## From sources to a candidate

```text
Direction and source material
  -> agent prepares the editorial work
  -> execution service tracks stages and dependencies
  -> tools and adapters produce assets and records
  -> sources build an edit timeline
     (a spec-driven series uses its pinned release's compiler and validator)
  -> layout sheet: inspect representative frames and satisfy its review policy
  -> Remotion renders; FFmpeg masters and audits
  -> candidate is watched, listened to and reviewed by the operator
```

The service can execute stages with a registered adapter. Other stages need
agent work through claim/complete, not an invented automatic handler.
`pva_init_spec`, `pva_build_timeline`, `pva_check_episode`, `pva_layout_sheet`
and `pva_compose_video` already consume the series-release contracts; series
compilation is not a future placeholder.

## What reviews and audits mean

- A human review gate requires an authenticated operator decision. The agent
  requests review; it cannot approve through the agent API.
- A stage gate holds completion/advancement. It is **not a blanket lock on all
  media tools** or on arbitrary shell/API calls.
- Spec-driven renders check the current layout sheet against the timeline and
  its review policy. Source changes can invalidate earlier reviews.
- The render audit checks the file against its expected streams, dimensions,
  duration, decoding and applicable audio/loop requirements. A failed render
  retains a report rather than silently becoming the current deliverable.
- A current-render pointer and a technically passing file do **not** establish
  editorial acceptance, publication permission or quality at every frame.
- Supported paid tools use budget reservations and spend records. Calls outside
  those tools can bypass the ledger. Policy names such as `autopilot` are not
  a universal billing or safety boundary.

Review the actual film and audio. See [revision checks](./running.md#comparing-two-versions)
and the [harness review](https://github.com/phoebus-84/video-studio/blob/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc/docs/harness-review.md) for the limits of sampled evidence,
same-user access and execution guarantees.

## Files, history and collaboration

The library stores channels, series and episodes as files. The application
ships no channel's creative format. Series releases pin their compiler,
validator, theme and kits; generated attempts and earlier deliveries should be
preserved rather than overwritten.

A channel can be its own Git repository. Text files and production records are
versioned there; `media.lock.jsonl` identifies media by path, hash and size (or a
relative symlink target). An optional S3-compatible remote stores media bytes
by content hash. Cloning the repository and restoring verified media is a
handoff, not real-time co-editing or a distributed production lock.

See [channel media transfer](./running.md#channel-media-backup-and-restore) for the actual commands, access controls
and operator-key requirements, and [workspace](./workspace.md) for the file
contracts. Packages never depend on studio concepts; the one-way code boundary
is enforced by `npm run check:boundaries`.

## Source safety and historical decisions

Repository inputs should be pinned and treated as untrusted material. Research
is not permission to run source hooks, installation scripts or examples; any
execution needs an explicit, appropriate trust policy.

Decision records preserve why the design changed. Older records may describe
YAML timelines, a flat workspace or FFmpeg as the episode renderer; they are
not all current contracts. Follow later decisions and check their status where
provided. Current schemas, registrations and implementation take precedence
over an old plan or an illustrative library project.
