> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Series pipelines use explicit inheritance

Series-specific pipelines inherit project-provided pipeline definitions and patch stages by stable identity instead of relying on copied manifests or implicit deep merges. This keeps customization concise while making inserted, replaced, disabled, and reconfigured stages auditable; every episode stores a resolved immutable pipeline snapshot so later definition changes cannot silently alter an existing production.
