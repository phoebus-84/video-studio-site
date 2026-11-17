> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Contracts are versioned in a dedicated module

## Status

Accepted, amended by [ADR-0028](./0028-contracts-scope-six-schema-families-with-typescript-bindings.md): bindings are TypeScript only. The module is `studio/contracts` ([ADR-0032](./0032-single-repository-with-reusable-packages.md)).

## Decision

Workspace, pipeline, provider-job, timeline, event, and RPC payload schemas live in a dedicated language-neutral contracts module with semantic versions, compatibility fixtures, and generated TypeScript and Python bindings. This adds release discipline but prevents independently versioned modules from drifting into mutually unreadable files or events.
