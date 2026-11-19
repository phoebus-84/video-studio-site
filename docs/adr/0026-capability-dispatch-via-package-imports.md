> Imported studio reference, based on [9aef661](https://github.com/phoebus-84/video-studio/tree/9aef661ac127f5234a4f4889e3215c0c8b4e1fb2). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Capability dispatch uses in-proc TypeScript package imports; HTTP only for the Python TTS worker

## Status

Accepted, amended. Modules link as Bun workspaces ([ADR-0031](./0031-bun-is-the-javascript-package-manager.md), [ADR-0032](./0032-single-repository-with-reusable-packages.md)), not `file:` dependencies.

## Decision

Pi capability tools and the gateway consume the TypeScript adapters (`fal-media-adapter`, `studio-graphics-renderer`, `ffmpeg-video-composer`) and the `video-pipeline-runtime` as ordinary package dependencies linked with `file:` specifiers during MVP development, never through inline re-implementations, cross-repository `src/` imports, CLI path guessing, or ad-hoc fetch calls. The Python `qwen-tts-worker` remains HTTP because it is a long-lived MLX process. Adapters expose a documented public API from their package root and record provider-jobs, attempts, provenance, and cost per the contracts schemas. During MVP, sibling modules are linked with `file:../<module>` dependencies until versioned releases exist.
