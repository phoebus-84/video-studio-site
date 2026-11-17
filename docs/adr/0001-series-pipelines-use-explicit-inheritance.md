> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Series pipelines use explicit inheritance

## Status

Accepted. `series-production` and the series pipelines that `extends` it are its current use.

## Decision

Series-specific pipelines inherit project-provided pipeline definitions and patch stages by stable identity instead of relying on copied manifests or implicit deep merges. This keeps customization concise while making inserted, replaced, disabled, and reconfigured stages auditable; every episode stores a resolved immutable pipeline snapshot so later definition changes cannot silently alter an existing production.
