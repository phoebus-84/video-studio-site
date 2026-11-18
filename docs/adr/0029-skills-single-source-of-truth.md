> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# video-built-in-pipelines is the single source of truth for production skills

## Status

Accepted, amended. Skills live in `skills/shared/`, `skills/studio/` and `studio/agent/skills/`; `npm run compose` writes `.pi/skills/` and `.claude/skills/` from them ([ADR-0048](./0048-tools-written-once-served-to-any-harness.md)).

## Decision

The canonical copies of all production skills (write-brief, write-script, art-direction, compose-video, safety-review, and the rest) live in `video-built-in-pipelines/skills/`. A sync script installs them into `.pi/skills/` and writes a checksum manifest so drift is detectable; the `.pi/skills/` copies are generated artifacts that must never be edited directly. The `pva-executive-producer` skill remains in `pi-video-agent` because it documents that package's own commands and tools. This eliminates the three divergent copies that previously contradicted each other (including the `final.mp4` versus `output.mp4` naming conflict).
