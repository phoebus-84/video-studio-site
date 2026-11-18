> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The gateway never produces artifacts

## Status

Accepted. The executor it describes is deleted; the stages the execution service performs itself are `studio/adapters` descriptors.

## Decision

The gateway owns Pi RPC processes, workspace APIs, safe edits, review threads, and event streaming. It does not execute pipeline stages or write editorial artifacts. The fabricated stage executor (which wrote hardcoded safety and continuity reports for any episode) is deleted, not moved: artifact fabrication is a correctness and child-safety hazard, not scaffolding. Stage execution requests are routed to Pi via RPC or refused with 501. Fixture data for development is served only behind an explicit `useFixtures` configuration flag, never silently.
