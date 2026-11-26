> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Series pipelines use explicit inheritance

## Status

Accepted. `series-production` and the series pipelines that `extends` it are its current use.

## Decision

Series-specific pipelines inherit project-provided pipeline definitions and patch stages by stable identity instead of relying on copied manifests or implicit deep merges. This keeps customization concise while making inserted, replaced, disabled, and reconfigured stages auditable; every episode stores a resolved immutable pipeline snapshot so later definition changes cannot silently alter an existing production.
