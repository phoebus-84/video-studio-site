> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Modules have independent Git and Beads history

## Status

Superseded by [ADR-0032](./0032-single-repository-with-reusable-packages.md).

## Decision

Each system module is an independent Git repository and Beads workspace with its own release and dependency-aware plan. Integration happens through versioned contracts rather than a shared monorepo build, accepting additional release coordination in exchange for replaceable adapters, independently testable boundaries, and the user's requirement that the studio remain a collection of tools and Pi packages rather than one application.
