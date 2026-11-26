> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Production state is filesystem-first

## Status

Accepted.

## Decision

The workspace filesystem is the canonical production record because both users and Pi must be able to inspect and edit artifacts directly without synchronizing against a hidden database. Runtime changes use atomic writes, revision checks, and an append-only execution journal; the web GUI may use SQLite for indexing and search only when that index is disposable and completely rebuildable from workspace files.
