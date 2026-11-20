> Imported studio reference, based on [7f73c14](https://github.com/phoebus-84/video-studio/tree/7f73c14cedca6c53bd96e135865f619e70c2af69). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The runtime-parsed pipeline manifest shape is canonical and its schema lives in contracts

## Status

Accepted. The module names are the pre-monorepo ones: today the runtime is `studio/runtime`, the built-in pipelines `studio/pipelines` and the contracts `studio/contracts` ([ADR-0032](./0032-single-repository-with-reusable-packages.md)).

## Decision

The pipeline manifest shape that `video-pipeline-runtime`'s fs-loader actually parses (`pipeline.id`, `pipeline.extends`, stage `inputs`/`outputs` with named contracts, `gates`, per-stage `skills`, `depends_on`) is the canonical format. PIPELINES.md is rewritten to document it. The JSON Schema for this format is owned by `video-workspace-contracts` (which owns all cross-module formats), and both the runtime loader and `video-built-in-pipelines` lint tooling validate against that single schema, eliminating the three divergent manifest descriptions that previously existed across docs, pipelines, and runtime types.
