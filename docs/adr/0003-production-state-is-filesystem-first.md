> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Production state is filesystem-first

## Status

Accepted.

## Decision

The workspace filesystem is the canonical production record because both users and Pi must be able to inspect and edit artifacts directly without synchronizing against a hidden database. Runtime changes use atomic writes, revision checks, and an append-only execution journal; the web GUI may use SQLite for indexing and search only when that index is disposable and completely rebuildable from workspace files.
