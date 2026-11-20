> Imported studio reference, based on [7f73c14](https://github.com/phoebus-84/video-studio/tree/7f73c14cedca6c53bd96e135865f619e70c2af69). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Repository inputs are pinned and untrusted

## Status

Accepted.

## Decision

Repository documentation is generated from a Source Snapshot pinned to an exact commit and accompanied by origin and license metadata. Analysis is read-only and does not execute repository hooks, setup scripts, build commands, examples, or downloaded binaries by default; opt-in execution requires a separately approved sandbox policy, preventing an open-source URL from becoming implicit permission to run untrusted code.
