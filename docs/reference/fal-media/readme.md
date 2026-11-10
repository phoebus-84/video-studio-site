> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# fal-media-adapter

Tracked fal.ai production adapter for generated illustrations and image edits.

## Owns

Endpoint invocation, input validation, pricing checks, idempotency, asynchronous request persistence, polling, cancellation, resumption, output download, hashes, provenance, and cost reconciliation.

## MVP boundary

No fal MCP integration and no autonomous model marketplace. Pi records an approved endpoint binding; the adapter executes it reliably. A generic endpoint driver is paired with tested endpoint profiles for the image models selected by the built-in pipelines.

## Plan

Run `bd list`, `bd graph`, and `bd show <id>`.
