> Imported studio reference, based on [9fd61f7](https://github.com/phoebus-84/video-studio/tree/9fd61f7611eb4e9557c057547aa7de3c3e71f02e). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Series pipelines use explicit inheritance

## Status

Accepted. `series-production` and the series pipelines that `extends` it are its current use.

## Decision

Series-specific pipelines inherit project-provided pipeline definitions and patch stages by stable identity instead of relying on copied manifests or implicit deep merges. This keeps customization concise while making inserted, replaced, disabled, and reconfigured stages auditable; every episode stores a resolved immutable pipeline snapshot so later definition changes cannot silently alter an existing production.
