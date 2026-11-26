> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Decision records

Each record keeps the decision as it was taken; its Status says whether it
still holds. Read the Status before the decision: a superseded or amended
record describes code that has since changed.

| ADR | Decision | Status |
|---|---|---|
| [0001](./0001-series-pipelines-use-explicit-inheritance.md) | Series pipelines use explicit inheritance | Accepted. |
| [0002](./0002-pi-directs-a-deterministic-pipeline-runtime.md) | Pi directs a deterministic pipeline runtime | Accepted. |
| [0003](./0003-production-state-is-filesystem-first.md) | Production state is filesystem-first | Accepted. |
| [0004](./0004-channels-and-series-are-distinct.md) | Channels and series are distinct | Accepted. |
| [0005](./0005-artifact-formats-follow-ownership.md) | Artifact formats follow ownership | Accepted, amended. |
| [0006](./0006-autopilot-is-bounded-not-unattended.md) | Autopilot is bounded, not unattended | Accepted. |
| [0007](./0007-fal-uses-a-dedicated-provider-adapter.md) | fal uses a dedicated provider adapter | Accepted. |
| [0008](./0008-qwen-tts-runs-as-a-long-lived-worker.md) | Qwen3-TTS runs as a long-lived worker | Accepted. |
| [0009](./0009-ffmpeg-compiles-a-typed-edit-timeline.md) | FFmpeg compiles a typed edit timeline | Superseded by [ADR-0034](./0034-a-layered-kit-based-edit-timeline.md). |
| [0010](./0010-visual-continuity-is-an-artifact.md) | Visual continuity is an artifact | Accepted, partly implemented. |
| [0011](./0011-multi-video-requests-spawn-independent-episodes.md) | Multi-video requests spawn independent episodes | Accepted, partly implemented. |
| [0012](./0012-feedback-is-anchored-and-revisions-propagate-staleness.md) | Feedback is anchored and revisions propagate staleness | Accepted. |
| [0013](./0013-the-browser-connects-through-an-agent-gateway.md) | The browser connects through an Agent Gateway | Accepted, amended by [ADR-0048](./0048-tools-written-once-served-to-any-harness.md): the gateway runs a Pi process or a Claude Agent SDK session (`AVG_AGENT_BACKEND`). |
| [0014](./0014-repository-inputs-are-pinned-and-untrusted.md) | Repository inputs are pinned and untrusted | Accepted. |
| [0015](./0015-stages-request-capabilities-not-providers.md) | Stages request capabilities, not providers | Accepted. |
| [0016](./0016-youtube-rendering-not-publishing-defines-the-mvp.md) | YouTube rendering, not publishing, defines the MVP | Accepted. |
| [0017](./0017-contracts-are-versioned-in-a-dedicated-module.md) | Contracts are versioned in a dedicated module | Accepted, amended by [ADR-0028](./0028-contracts-scope-six-schema-families-with-typescript-bindings.md): bindings are TypeScript only. |
| [0018](./0018-typescript-is-the-control-plane-python-isolated-to-mlx.md) | TypeScript is the control plane; Python is isolated to MLX | Accepted, amended. |
| [0019](./0019-mvp-captions-use-narration-segment-timing.md) | MVP captions use narration-segment timing | Partly superseded by [ADR-0038](./0038-word-timing-comes-from-forced-alignment.md). |
| [0020](./0020-exact-technical-graphics-are-rendered-locally.md) | Exact technical graphics are rendered locally | Accepted. |
| [0021](./0021-generated-media-is-immutable-and-not-auto-committed.md) | Generated media is immutable and not auto-committed | Accepted. |
| [0022](./0022-modules-have-independent-git-and-beads-history.md) | Modules have independent Git and Beads history | Superseded by [ADR-0032](./0032-single-repository-with-reusable-packages.md). |
| [0023](./0023-flat-workspace-layout-and-legacy-freeze.md) | Workspace layout is flat channel/series/episode nesting; the existing library is frozen as legacy | Superseded. |
| [0024](./0024-canonical-pipeline-manifest-owned-by-contracts.md) | The runtime-parsed pipeline manifest shape is canonical and its schema lives in contracts | Accepted. |
| [0025](./0025-editorial-and-capability-stage-types.md) | Stages are typed editorial or capability; "llm" is not a capability | Accepted for pipeline manifests. |
| [0026](./0026-capability-dispatch-via-package-imports.md) | Capability dispatch uses in-proc TypeScript package imports; HTTP only for the Python TTS worker | Accepted, amended. |
| [0027](./0027-the-gateway-never-produces-artifacts.md) | The gateway never produces artifacts | Accepted. |
| [0028](./0028-contracts-scope-six-schema-families-with-typescript-bindings.md) | Contracts owns six schema families plus capability vocabulary; bindings are TypeScript-only for the MVP | Accepted. |
| [0029](./0029-skills-single-source-of-truth.md) | video-built-in-pipelines is the single source of truth for production skills | Accepted, amended. |
| [0030](./0030-secrets-are-environment-only-and-dev-auth-is-explicit.md) | Secrets live only in the environment; development auth is an explicit opt-in | Accepted. |
| [0031](./0031-bun-is-the-javascript-package-manager.md) | Bun is the package manager for all TypeScript modules | Accepted. |
| [0032](./0032-single-repository-with-reusable-packages.md) | One repository, split into reusable packages and the product | Accepted. |
| [0033](./0033-blender-is-a-reusable-scene-provider.md) | Blender is a reusable scene provider with editable handoffs | Accepted for the initial Pi-directed Blender integration. |
| [0034](./0034-a-layered-kit-based-edit-timeline.md) | A layered, kit-based edit timeline | Accepted. |
| [0035](./0035-shared-material-is-pinned-never-copied.md) | Shared material is pinned, never copied | Accepted. |
| [0036](./0036-the-studio-renders-episodes-through-the-edit-timeline.md) | The studio renders episodes through the edit timeline | Accepted. |
| [0037](./0037-series-templates-pin-editorial-standards.md) | Series templates pin editorial standards | Accepted. |
| [0038](./0038-word-timing-comes-from-forced-alignment.md) | Word timing comes from forced alignment against the text | Accepted (`avg-8hs.2`). |
| [0039](./0039-format-kits-share-frozen-libraries.md) | Format kits share frozen libraries | Accepted (`avg-dcf.3`). |
| [0040](./0040-channel-themes-carry-the-look-as-data.md) | Channel themes carry the look as data | Accepted (`avg-dcf.4.1`). |
| [0041](./0041-a-series-release-carries-its-own-code.md) | A series release carries its own code | Accepted (`avg-d1x`, phase 1). |
| [0042](./0042-kits-a-channel-or-series-carries.md) | Kits a channel or a series carries | Accepted (`avg-d1x`, phase 2). |
| [0043](./0043-the-toolbox-for-library-code.md) | The toolbox for a channel's and a series' code | Accepted (`avg-d1x`, phase 3). |
| [0044](./0044-the-application-ships-no-channel.md) | The application ships no channel's format | Accepted (`avg-d1x`, phase 4). |
| [0045](./0045-a-channel-is-its-own-repository.md) | A channel is its own repository; its media are named by hash | Accepted (`avg-d1x`, phase 5). |
| [0046](./0046-archive-media-carry-licence-and-evidence.md) | Archive media carry their licence and its evidence | Accepted (`avg-fe8.2`). |
| [0047](./0047-audio-edits-are-recipes.md) | Audio edits are recipes: cut on words, mixed, mastered, reproducible | Accepted (`avg-8hs.5`). |
| [0048](./0048-tools-written-once-served-to-any-harness.md) | The agent's tools are written once, for Pi, and served to other harnesses over MCP | Accepted. |
| [0049](./0049-channel-media-use-a-content-addressed-s3-remote.md) | Channel media use a content-addressed S3 remote | Proposed in the implementation of [issue #74](https://github.com/phoebus-84/sergio/issues/74). |
| [0050](./0050-a-film-is-produced-at-three-levels.md) | A film is produced at three levels, each with its own cut and renders | Accepted. |
| [0051](./0051-portable-qwen-inference.md) | Portable Qwen inference preserves the worker boundary | Proposed in [PR #95](https://github.com/phoebus-84/sergio/pull/95). |
| [0052](./0052-a-character-is-a-record-and-takes-any-form.md) | A character is a record, and takes any form | Proposed. |
| [0053](./0053-music-is-code-rendered-offline.md) | Music is Strudel code, rendered offline by the engine the studio plays it with | Accepted; amended by ADR-0055. |
| [0054](./0054-styles-are-optional-parametric-templates.md) | Styles are optional, parametric templates | Accepted. |
| [0055](./0055-comfyui-is-a-generic-local-generation-backend.md) | ComfyUI is a generic local generation backend, and generated music is a source of its own | Proposed. |
| [0056](./0056-machines-are-declared-once.md) | The operator's machines are declared once, and the tools route by them | Accepted. |

_Generated by `tools/gen-docs.mjs` from the records' Status sections. Edit those, not this file._
