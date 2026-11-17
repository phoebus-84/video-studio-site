> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Modules have independent Git and Beads history

## Status

Superseded by [ADR-0032](./0032-single-repository-with-reusable-packages.md).

## Decision

Each system module is an independent Git repository and Beads workspace with its own release and dependency-aware plan. Integration happens through versioned contracts rather than a shared monorepo build, accepting additional release coordination in exchange for replaceable adapters, independently testable boundaries, and the user's requirement that the studio remain a collection of tools and Pi packages rather than one application.
