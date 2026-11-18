> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# fal-media-adapter

Tracked fal.ai production adapter for generated illustrations and image edits.

## Owns

Endpoint invocation, input validation, pricing checks, idempotency, asynchronous request persistence, polling, cancellation, resumption, output download, hashes, provenance, and cost reconciliation.

## MVP boundary

No fal MCP integration and no autonomous model marketplace. Pi records an approved endpoint binding; the adapter executes it reliably. A generic endpoint driver is paired with tested endpoint profiles for the image models selected by the built-in pipelines.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
