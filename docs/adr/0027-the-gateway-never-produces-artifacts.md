> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The gateway never produces artifacts

The gateway owns Pi RPC processes, workspace APIs, safe edits, review threads, and event streaming. It does not execute pipeline stages or write editorial artifacts. The fabricated stage executor (which wrote hardcoded safety and continuity reports for any episode) is deleted, not moved: artifact fabrication is a correctness and child-safety hazard, not scaffolding. Stage execution requests are routed to Pi via RPC or refused with 501. Fixture data for development is served only behind an explicit `useFixtures` configuration flag, never silently.
