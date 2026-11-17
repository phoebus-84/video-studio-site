> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Production state is filesystem-first

## Status

Accepted.

## Decision

The workspace filesystem is the canonical production record because both users and Pi must be able to inspect and edit artifacts directly without synchronizing against a hidden database. Runtime changes use atomic writes, revision checks, and an append-only execution journal; the web GUI may use SQLite for indexing and search only when that index is disposable and completely rebuildable from workspace files.
