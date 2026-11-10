> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Component reference

- [blender](./blender/readme.md) — Editable 3D scenes, keyframes and Geometry Nodes; background Eevee/Cycles previews and animations. Poly Haven asset acquisition with provenance.
- [voice](./voice/readme.md) — Speech synthesis and voice cloning on MLX. Usable on its own as a voice tool; knows nothing about episodes or pipelines.
- [fal-media](./fal-media/readme.md) — Tracked image and video generation jobs against fal.ai, with provenance and cost. Video is MiniMax H3.
- [codex-image](./codex-image/readme.md) — Image generation and editing through an OpenAI ChatGPT/Codex subscription, or the Images API. A second provider for image.generate, billed against a plan rather than per image.
- [graphics](./graphics/readme.md) — Deterministic SVG/PNG rendering of code frames, diagrams, callouts and titles.
- [terminal-recorder](./terminal-recorder/readme.md) — Records a terminal session to video from a VHS tape. Useful on its own; knows nothing about episodes.
- [infographics](./infographics/readme.md) — Frame-accurate animated infographics rendered through Remotion.
- [video-composer](./video-composer/readme.md) — Compiles a typed edit timeline into an FFmpeg filter graph; probes and QAs the result.
- [remotion-composer](./remotion-composer/readme.md) — Renders a layered, kit-based edit timeline (studio.video/v1alpha2) with Remotion, then normalises loudness with FFmpeg. A second provider for video.compose.
- [contracts](./contracts/readme.md) — Canonical schemas, vocabulary and bindings. Every other studio piece depends on it.
- [series](./series/readme.md) — Series compilers: a pinned episode spec and its measured narration, compiled into an edit timeline.
- [episode](./episode/readme.md) — An episode on disk, produced: its edit timeline built or compiled from its spec, checked against its series' rules, rendered.
- [runtime](./runtime/readme.md) — Deterministic pipeline state: snapshots, leases, staleness, journal, policy.
- [pipelines](./pipelines/readme.md) — Built-in pipeline manifests for the shared narrated-video path.
- [adapters](./adapters/readme.md) — Stage adapters: declarative descriptors pairing a pipeline stage's contracts and capability with the code that performs it. What the gateway dispatches to.
- [agent](./agent/readme.md) — The Pi executive-producer package: tools, commands, stage UX. This is where studio-specific integration with the reusable packages lives.
- [gateway](./gateway/readme.md) — Local backend owning Pi RPC processes and streaming events to the browser.
- [web](./web/readme.md) — Browser studio for reviewing artifacts, attempts and deliverables.
