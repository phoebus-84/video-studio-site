> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Repository inputs are pinned and untrusted

## Status

Accepted.

## Decision

Repository documentation is generated from a Source Snapshot pinned to an exact commit and accompanied by origin and license metadata. Analysis is read-only and does not execute repository hooks, setup scripts, build commands, examples, or downloaded binaries by default; opt-in execution requires a separately approved sandbox policy, preventing an open-source URL from becoming implicit permission to run untrusted code.
