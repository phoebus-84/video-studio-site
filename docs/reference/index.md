> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Component reference

- [blender](./blender/readme.md) — Editable 3D scenes, keyframes and Geometry Nodes; background Eevee/Cycles previews and animations. Poly Haven asset acquisition with provenance.
- [voice](./voice/readme.md) — Local Qwen speech synthesis and consented voice cloning with MLX or PyTorch (CPU, CUDA, ROCm). Usable on its own; knows nothing about episodes or pipelines.
- [fal-media](./fal-media/readme.md) — Tracked image, video, 3D model, rigging and motion jobs against fal.ai, with provenance and cost. Video is MiniMax H3; 3D models are Tripo H3.1; rigs are Hyper3D and Meshy; motion from words is Hunyuan Motion.
- [comfyui-speech](./comfyui-speech/readme.md) — Speech from the Qwen3-TTS nodes of a ComfyUI server: preset speakers, cloned and saved voices, and cleaning a reference before cloning it. Optional at run time: without a server address, speech stays with the other providers.
- [codex-image](./codex-image/readme.md) — Image generation and editing through an OpenAI ChatGPT/Codex subscription, or the Images API. A second provider for image.generate, billed against a plan rather than per image.
- [graphics](./graphics/readme.md) — Deterministic SVG/PNG rendering of code frames, diagrams, callouts and titles.
- [terminal-recorder](./terminal-recorder/readme.md) — Records a terminal session to video from a VHS tape. Useful on its own; knows nothing about episodes.
- [infographics](./infographics/readme.md) — Frame-accurate animated infographics rendered through Remotion.
- [video-composer](./video-composer/readme.md) — Compiles a typed edit timeline into an FFmpeg filter graph; probes and QAs the result.
- [remotion-composer](./remotion-composer/readme.md) — Renders a layered, kit-based edit timeline (studio.video/v1alpha2) with Remotion, then normalises loudness with FFmpeg. A second provider for video.compose.
- [render-worker](./render-worker/readme.md) — Renders a remotion-composer edit timeline on other machines over SSH, or shares its one-second segments among several: code by git push, files by content hash, the video back, checked. Optional at run time: without a host, a render stays on this machine.
- [strudel](./strudel/readme.md) — Music written as Strudel code, checked without a sound and rendered offline by the pinned Strudel engine in a headless Chrome: parts, stretches of cycles, tails, seamless loops, stems, and measurements of what was made. Optional at run time: without a Chrome, everything else works. AGPL-3.0-or-later, as Strudel is.
- [contracts](./contracts/readme.md) — Canonical schemas, vocabulary and bindings. Every other studio piece depends on it.
- [series](./series/readme.md) — Series compilers: a pinned episode spec and its measured narration, compiled into an edit timeline.
- [episode](./episode/readme.md) — An episode on disk, produced: its edit timeline built or compiled from its spec, checked against its series' rules, rendered.
- [film](./film/readme.md) — A film on disk, produced: its scenes and shots, its footage, its cut at each level assembled, checked and rendered.
- [cast](./cast/readme.md) — Characters on disk: who they are, the forms they take released and hashed, and a production's cast resolved to what it pins.
- [runtime](./runtime/readme.md) — Deterministic pipeline state: snapshots, leases, staleness, journal, policy.
- [pipelines](./pipelines/readme.md) — Built-in pipeline manifests for the shared narrated-video path.
- [adapters](./adapters/readme.md) — Stage adapters: declarative descriptors pairing a pipeline stage's contracts and capability with the code that performs it. What the gateway dispatches to.
- [agent](./agent/readme.md) — The Pi executive-producer package: tools, commands, stage UX. This is where studio-specific integration with the reusable packages lives.
- [gateway](./gateway/readme.md) — Local backend owning Pi RPC processes and streaming events to the browser.
- [web](./web/readme.md) — Browser studio for reviewing artifacts, attempts and deliverables.
