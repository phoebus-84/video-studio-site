> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The runtime-parsed pipeline manifest shape is canonical and its schema lives in contracts

## Status

Accepted. The module names are the pre-monorepo ones: today the runtime is `studio/runtime`, the built-in pipelines `studio/pipelines` and the contracts `studio/contracts` ([ADR-0032](./0032-single-repository-with-reusable-packages.md)).

## Decision

The pipeline manifest shape that `video-pipeline-runtime`'s fs-loader actually parses (`pipeline.id`, `pipeline.extends`, stage `inputs`/`outputs` with named contracts, `gates`, per-stage `skills`, `depends_on`) is the canonical format. PIPELINES.md is rewritten to document it. The JSON Schema for this format is owned by `video-workspace-contracts` (which owns all cross-module formats), and both the runtime loader and `video-built-in-pipelines` lint tooling validate against that single schema, eliminating the three divergent manifest descriptions that previously existed across docs, pipelines, and runtime types.
