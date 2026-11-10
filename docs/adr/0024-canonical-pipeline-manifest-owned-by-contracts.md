> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The runtime-parsed pipeline manifest shape is canonical and its schema lives in contracts

The pipeline manifest shape that `video-pipeline-runtime`'s fs-loader actually parses (`pipeline.id`, `pipeline.extends`, stage `inputs`/`outputs` with named contracts, `gates`, per-stage `skills`, `depends_on`) is the canonical format. PIPELINES.md is rewritten to document it. The JSON Schema for this format is owned by `video-workspace-contracts` (which owns all cross-module formats), and both the runtime loader and `video-built-in-pipelines` lint tooling validate against that single schema, eliminating the three divergent manifest descriptions that previously existed across docs, pipelines, and runtime types.
