> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Production state is filesystem-first

## Status

Accepted.

## Decision

The workspace filesystem is the canonical production record because both users and Pi must be able to inspect and edit artifacts directly without synchronizing against a hidden database. Runtime changes use atomic writes, revision checks, and an append-only execution journal; the web GUI may use SQLite for indexing and search only when that index is disposable and completely rebuildable from workspace files.
