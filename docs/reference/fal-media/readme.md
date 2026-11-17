> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# fal-media-adapter

Tracked fal.ai production adapter for generated illustrations and image edits.

## Owns

Endpoint invocation, input validation, pricing checks, idempotency, asynchronous request persistence, polling, cancellation, resumption, output download, hashes, provenance, and cost reconciliation.

## MVP boundary

No fal MCP integration and no autonomous model marketplace. Pi records an approved endpoint binding; the adapter executes it reliably. A generic endpoint driver is paired with tested endpoint profiles for the image models selected by the built-in pipelines.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
