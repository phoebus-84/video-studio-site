> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Contracts owns six schema families plus capability vocabulary; bindings are TypeScript-only for the MVP

## Status

Accepted. The module is `studio/contracts` ([ADR-0032](./0032-single-repository-with-reusable-packages.md)).

## Decision

`video-workspace-contracts` ships JSON Schemas and compatibility fixtures for: pipeline manifest, journal event vocabulary, edit timeline, review thread, provider job, and error envelope, in addition to its existing identity/workspace/editorial/asset schemas. It also owns the canonical capability vocabulary and artifact-kind registry. TypeScript bindings are generated from the schemas and verified in sync by a check script. Python bindings are deferred until the TTS worker or another Python consumer needs them, accepting a single-language binding surface in exchange for not maintaining untested codegen.
