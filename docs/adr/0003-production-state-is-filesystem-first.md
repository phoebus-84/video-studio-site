> Imported studio reference, based on [9aef661](https://github.com/phoebus-84/video-studio/tree/9aef661ac127f5234a4f4889e3215c0c8b4e1fb2). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Production state is filesystem-first

## Status

Accepted.

## Decision

The workspace filesystem is the canonical production record because both users and Pi must be able to inspect and edit artifacts directly without synchronizing against a hidden database. Runtime changes use atomic writes, revision checks, and an append-only execution journal; the web GUI may use SQLite for indexing and search only when that index is disposable and completely rebuildable from workspace files.
