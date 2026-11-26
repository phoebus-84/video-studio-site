> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# studio-graphics-renderer

Deterministic local renderer for text-critical visual assets.

## Owns

Code frames, architecture diagrams, flow diagrams, title frames, callouts, comparison layouts, simple charts, and infographic primitives rendered to SVG and PNG with reproducible typography and safe areas.

## Why separate from image generation

Generated images are useful for illustrations but unreliable for exact code, labels, diagrams, and localized text. This module gives documentation episodes a precise visual path and gives stories deterministic titles and captions.

## Safety

Repository content is treated as passive data: runtime shape validation runs
before hashing, text is escaped, and content/canvas sizes are bounded. The SVG
builder rejects active tags, URL references and arbitrary CSS. Current kinds do
not read files or embed images.

See [Security and resource bounds](./docs/security.md) for limits, diagnostics and
the distinction between cooperative deadlines and host-enforced isolation.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
